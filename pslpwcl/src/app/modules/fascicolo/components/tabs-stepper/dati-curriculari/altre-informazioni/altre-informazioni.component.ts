/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { OPERAZIONE_DA_EFFETTUARE, TYPE_ALERT } from 'src/app/constants';
import { Albi, AlboRequest, AltreInformazioni, ApiMessage, Decodifica, FascicoloPslpService, LavAnagraficaAlbi, PslpMessaggio } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-altre-informazioni',
  templateUrl: './altre-informazioni.component.html',
  styleUrls: ['./altre-informazioni.component.scss']
})
export class AltreInformazioniComponent implements OnInit {

  @Input() idSilLavAnagrafica: number;
  @Input() altreInformazioni: AltreInformazioni;
  altreInformazioniCopy: AltreInformazioni;
  @Input() albi: Decodifica[];
  albiList:LavAnagraficaAlbi[]=[]
  albiFiltrati:Decodifica[]=[]
  form: FormGroup;
  showForm: boolean;

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  constructor(
    private fascicoloService: FascicoloPslpService,
    private spinner: NgxSpinnerService,
    private logService: LogService,
    private promptModalService: PromptModalService,
    private fb:FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });
    
    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    this.albiList= (this.altreInformazioni?this.altreInformazioni.albi:[] )

    if(this.altreInformazioni)
      this.altreInformazioniCopy = Utils.clone(this.altreInformazioni);

    this.albiFiltrati=this.albi.filter(al=>{return !this.altreInformazioniCopy?.albi.find(alb=>al.codice==alb.id.silTAlbi.codMinisteriale)})
    this.initForm();
    this.patchValueInform();
  }

  private patchValueInform() {
    this.form.controls['dsAbilitazione'].patchValue(this.altreInformazioniCopy?.dsAbilitazione);
    this.form.controls['dsAltraInformazione'].patchValue(this.altreInformazioniCopy?.dsAltraInformazione);
    this.form.controls['dsCompetenza'].patchValue(this.altreInformazioniCopy?.dsCompetenza);
  }

  private initForm() {
    this.form = this.fb.group({
      dsAbilitazione: [null],
      dsAltraInformazione: [null],
      dsCompetenza: [null],
      lavAnagraficaAlbi: this.fb.group({
        id: this.fb.group({
          idSilLavAnagrafica: [this.idSilLavAnagrafica],
          silTAlbi: this.fb.group({
            id: [null,Validators.required]
          })
        })
      }),
      operazioneDaEffettuare: [null]
    });
  }

  async onClickConferma(){
    const msg = `Si conferma il salvataggio dei dati inseriti?`;
    const data: DialogModaleMessage = {
      titolo: "Altre informazioni",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.conferma();
    }
  }

  private conferma(){

    let  alboRequest: AlboRequest = this.form.getRawValue() as AlboRequest;
    //alboRequest.lavAnagraficaAlbi.id.silTAlbi.codMinisteriale
    alboRequest = Utils.cleanObject(alboRequest);
    alboRequest.operazioneDaEffettuare = alboRequest.lavAnagraficaAlbi.id.silTAlbi ? OPERAZIONE_DA_EFFETTUARE.INSERT : OPERAZIONE_DA_EFFETTUARE.MODIFY;
    this.fascicoloService.insertOrDeleteAlbo(alboRequest).subscribe({
      next: (res: any) => {
        if(res.esitoPositivo){
          alboRequest.lavAnagraficaAlbi.id.silTAlbi.descr=this.albi.find(a=>a.id==this.form.get("lavAnagraficaAlbi.id.silTAlbi.id").value).descr
          this.altreInformazioniCopy.albi.push(alboRequest.lavAnagraficaAlbi)
          this.albiFiltrati=this.albi.filter(al=>{return !this.altreInformazioniCopy.albi.find(alb=>Number(al.id)==alb.id.silTAlbi.id)})
          this.commonService.refreshFascicolo();
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.onClickAnnulla();
        }

        this.spinner.hide();
        


      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrDeleteAlbo ${JSON.stringify(err)}`);

      }
    });
  }



  async onClickElimina(index: number){
    const data: DialogModaleMessage = {
      titolo: "Eliminazione albo",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare l'albo selezionato?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      // this.alertMessageService.emptyMessages();
      this.eliminaAlbo(index);
    }
  }

  eliminaAlbo(index: number){
   //return;
    this.spinner.show();
    const alboRequest: AlboRequest = {
      lavAnagraficaAlbi: {
        id: {
          idSilLavAnagrafica: this.idSilLavAnagrafica,
          silTAlbi: {
            id: this.altreInformazioniCopy.albi[index].id.silTAlbi.id
          }

        }
      },

      operazioneDaEffettuare: OPERAZIONE_DA_EFFETTUARE.DELETE
    }
    this.fascicoloService.insertOrDeleteAlbo(alboRequest).subscribe({
      next: (res: any) => {
        if(res.esitoPositivo){
          this.altreInformazioniCopy.albi.splice(index,1);
          this.albiFiltrati=this.albi.filter(al=>{return !this.altreInformazioniCopy.albi.find(alb=>al.codice==alb.id.silTAlbi.codMinisteriale)})
          this.commonService.refreshFascicolo();
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data);
          this.onClickAnnulla();
        }else
          this.spinner.hide();
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrDeletePatente ${JSON.stringify(err)}`);
        this.spinner.hide();
      }
    });
  }

  onClickAnnulla(){
    this.showForm = false;
    this.patchValueInform();
    this.form.controls['lavAnagraficaAlbi'].get('id.silTAlbi.id').reset();
  }

}
