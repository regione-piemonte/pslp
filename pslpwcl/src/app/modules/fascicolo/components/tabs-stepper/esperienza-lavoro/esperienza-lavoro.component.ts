/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { CommonService } from 'src/app/services/common.service';
import { FascicoloPslpService, PslpMessaggio } from 'src/app/modules/pslpapi';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { EsperienzaProfessionale, RapportoDiLavoro, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';
import { InserisciEsperienzaLavoroComponent } from '../inserisci-esperienza-lavoro/inserisci-esperienza-lavoro.component';

@Component({
  selector: 'pslpwcl-esperienza-lavoro',
  templateUrl: './esperienza-lavoro.component.html',
  styleUrls: ['./esperienza-lavoro.component.scss']
})
export class EsperienzaLavoroComponent implements OnInit,OnChanges {

  @Input() fascicolo:SchedaAnagraficaProfessionale;

  @ViewChild('espLav') espLav?:InserisciEsperienzaLavoroComponent;

  mod = 'ins';
  esperienzaSelected?:EsperienzaProfessionale;

  showEsperienzeProfessionali = false;

  rapportoList?: Array<RapportoDiLavoro>;
  esperienzeProfessionali?: Array<EsperienzaProfessionale>;


  //messaggio eliminazione
  messagioEliminazione: PslpMessaggio;

  constructor(
    private spinner: NgxSpinnerService,
    private promptModalService: PromptModalService,
    private fascicoloService:FascicoloPslpService,
    private logService:LogService,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {

    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    this.rapportoList = this.fascicolo?.esperienzeLavorative?.rapporto;
    this.esperienzeProfessionali = this.fascicolo?.esperienzeLavorative?.esperienzeProfessionali;
  }

  get idSilLavAnagrafica(){
    return this.fascicolo?.idSilLavAnagrafica;
  }

  hideEsperienzeProfessionali(){
    this.showEsperienzeProfessionali = false;
  }
  async openEsperienza(){
    if (!await this.getFormFlow('ins'))
      return;

    this.mod = "ins";
    this.esperienzaSelected = undefined;
    this.showEsperienzeProfessionali = true;
    this.espLav.mod = 'ins'
    this.espLav.esperienzaSelected = undefined
    this.espLav.setForm();
  }

  async getFormFlow(mode: string, el?: EsperienzaProfessionale): Promise<boolean> {
    if (!this.showEsperienzeProfessionali || this.mod === 'view')
      return true;
    if (this.esperienzaSelected !== el || (this.esperienzaSelected === el && this.espLav.form.dirty)) {
      const data: DialogModaleMessage = {
        titolo: this.mod === 'ins' ? "Inserimento esperienza professionale" : "Modifica esperienza professionale",
        tipo: TypeDialogMessage.YesOrNo,
        messaggio: "Sei sicuro di voler continuare? Gli eventuali dati non salvati andranno persi.",
        messaggioAggiuntivo: "",
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result === 'SI') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }


 updateList(experienza:EsperienzaProfessionale){
     this.esperienzeProfessionali.push(...[experienza]);
   this.commonService.refreshFascicolo();

  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['fascicolo'] && this.fascicolo){
      this.rapportoList = [...this.fascicolo?.esperienzeLavorative?.rapporto];
      this.esperienzeProfessionali = [...this.fascicolo?.esperienzeLavorative?.esperienzeProfessionali];
    }
  }


  async toggleDettaglioEsperienzeProfessionali(mode:string, esperienza?: EsperienzaProfessionale) {
    if (!await this.getFormFlow(mode, esperienza))
      return;
    this.mod = mode;
    this.esperienzaSelected = esperienza;
    this.showEsperienzeProfessionali = true;

    this.espLav.mod = mode
    this.espLav.esperienzaSelected = esperienza

    this.espLav.setForm();
    if (this.esperienzaSelected && this.esperienzaSelected.lavEsperienzaLavoro) {
      this.espLav.patchValueInform();
    }
  }
  async onClickEliminaEsperienzeProfessionale(esperienzaProfessionale: EsperienzaProfessionale) {
    const data: DialogModaleMessage = {
      titolo: "Eliminazione esperienza lavorativa",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare l'esperienza lavorativa selezionata?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      // this.alertMessageService.emptyMessages();
      this.eliminaEsperienzaLav(esperienzaProfessionale);
    }
  }


  eliminaEsperienzaLav(esperienzaProfessionale: EsperienzaProfessionale) {


    this.fascicoloService.deleteEsperienzaProfessionale(esperienzaProfessionale.lavEsperienzaLavoro.idSilLavEsperienzaLavoro).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          // this.alertMessageService.setApiMessages(res.apiMessages);
          const index = this.esperienzeProfessionali.findIndex((el: EsperienzaProfessionale) => el.idEsperienzaProfessionale == esperienzaProfessionale.idEsperienzaProfessionale);
          this.esperienzeProfessionali.splice(index, 1);

          this.esperienzeProfessionali = [...this.esperienzeProfessionali]
          this.commonService.refreshFascicolo();
          if (esperienzaProfessionale === this.esperienzaSelected)
            this.showEsperienzeProfessionali = false;

        } else {
          // this.alertMessageService.setApiMessages(res.apiMessages);
        }
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `deleteEsperienzaLavoro ${JSON.stringify(err)}`);
      },
      complete: () => {

      }
    });
  }
}
