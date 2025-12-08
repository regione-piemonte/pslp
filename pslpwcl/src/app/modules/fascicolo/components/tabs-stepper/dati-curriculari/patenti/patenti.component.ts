/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { CommonService } from 'src/app/services/common.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { OPERAZIONE_DA_EFFETTUARE, TYPE_ALERT } from 'src/app/constants';
import { ApiMessage, Decodifica, DecodificaPslpService, FascicoloPslpService, LavAnagSilTTipoP, PatenteRequest, PslpMessaggio } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-patenti',
  templateUrl: './patenti.component.html',
  styleUrls: ['./patenti.component.scss']
})
export class PatentiComponent implements OnInit {

  @Input() idSilLavAnagrafica: number;
  patenti: Decodifica[];
  @Input() patentiPossedute: Decodifica[];
  patentiPosseduteCopy: Decodifica[] = [];
  patentiFIltrate: Decodifica[] = [];

  form: FormGroup;
  showForm: boolean;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  constructor(
    private fascicoloService: FascicoloPslpService,
    private spinner: NgxSpinnerService,
    private logService: LogService,
    // private alertMessageService: AlertMessageService,
    private promptModalService: PromptModalService,
    private message: MessageService,
    private fb:FormBuilder,
    private decodificaService:DecodificaPslpService,
    private commonService:CommonService,

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

    if(this.patentiPossedute){
      this.patentiPosseduteCopy = Utils.clone(this.patentiPossedute).filter(patente => patente.special == "P");


    }
    this.initForm();
    // TIPO-PATENTE-A e TIPO-PATENTE-P
    this.spinner.show()
    this.decodificaService.findDecodificaByTipo('TIPO-PATENTE-P').subscribe({
      next: (res:any) =>{
        if(res?.esitoPositivo){
          this.patenti = res.list.map((dato: any) => {
            dato.descr = dato.descr.toUpperCase();
            return dato;
          });
          this.patentiFIltrate=this.patenti.filter(p=>{return !this.patentiPosseduteCopy.find(pp=>pp.codice==p.codice)})
        }
      },
      error: (err:any) =>{
        this.logService.error(this.constructor.name,`${JSON.stringify(err)}`)
      },
      complete: ()=>{ this.spinner.hide()}
    })
  }


  private initForm() {
    this.form = this.fb.group({
      lavAnagSilTTipoP: this.fb.group({
        id: this.fb.group({
          idSilLavAnagrafica: [this.idSilLavAnagrafica],
          silTTipoPatente: this.fb.group({
            id: [null,Validators.required]
          })
        })
      }),
      operazioneDaEffettuare: [OPERAZIONE_DA_EFFETTUARE.INSERT]
    });
  }


  async onClickConferma(){
    const msg = `Si conferma il salvataggio della patente selezionata?`;
    const data: DialogModaleMessage = {
      titolo: "Inserimento patente",
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

  private conferma() {
    this.spinner.show();
    // this.alertMessageService.emptyMessages();
    const patenteRequest = this.form.getRawValue() as PatenteRequest;

    this.fascicoloService.insertOrDeletePatente(patenteRequest).subscribe({
      next: (res: any) => {
        if (res?.esitoPositivo) {
          this.updateList(res.lavAnagSilTTipoP);
          this.commonService.refreshFascicolo();
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        } else
          // this.alertMessageService.setApiMessages(res.apiMessages);
        this.spinner.hide();
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrDeletePatente ${JSON.stringify(err)}`);
        this.spinner.hide();
      }
    });
  }

  private updateList(lavAnagSilTTipoP: LavAnagSilTTipoP) {
    if (Utils.isNullOrUndefined(this.patentiPosseduteCopy))
      this.patentiPosseduteCopy = [];

    this.patentiPosseduteCopy.push({
      id: lavAnagSilTTipoP.id.silTTipoPatente.id,
      descr: lavAnagSilTTipoP.id.silTTipoPatente.descr,
      special:"P",
      codice:lavAnagSilTTipoP.id.silTTipoPatente.codMinistero
    });
    this.patentiFIltrate=this.patenti.filter(p=>{return !this.patentiPosseduteCopy.find(pp=>pp.codice==p.codice)})
    const apiMessage = {
      code: '002',
      error: false,
      message: '',//msg,
      tipo: TYPE_ALERT.SUCCESS,
      titolo: ''
    }
    const apiMessages: ApiMessage[] = [apiMessage];
    // this.alertMessageService.setApiMessages(apiMessages);
    this.showForm = false;
    this.form.controls['lavAnagSilTTipoP'].get('id.silTTipoPatente.id').reset();
  }


  async onClickEliminaPatente(index: number) {
    const data: DialogModaleMessage = {
      titolo: "Eliminazione patente",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare la patente selezionata?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {

      this.eliminaPatente(index);
    } else {

    }
  }



  eliminaPatente(index: number) {
    this.spinner.show();
    const patenteRequest: PatenteRequest = {
      lavAnagSilTTipoP: {
        id: {
          idSilLavAnagrafica: this.idSilLavAnagrafica,
          silTTipoPatente: {
            id: this.patentiPosseduteCopy[index].id
          }
        }
      },
      operazioneDaEffettuare: OPERAZIONE_DA_EFFETTUARE.DELETE
    }
    this.fascicoloService.insertOrDeletePatente(patenteRequest).subscribe({
      next: (res: any) => {
        if (res?.esitoPositivo) {
          this.patentiPosseduteCopy.splice(index, 1);
          this.patentiFIltrate=this.patenti.filter(p=>{return !this.patentiPosseduteCopy.find(pp=>pp.codice==p.codice)})
          this.commonService.refreshFascicolo();
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        } else
          // this.alertMessageService.setApiMessages(res.apiMessages);
        this.spinner.hide();
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrDeletePatente ${JSON.stringify(err)}`);
        this.spinner.hide();
      },
      complete: () => {
          this.spinner.hide()
      },
    });
  }


  async onClickAnnulla(){
    const data: DialogModaleMessage = {
      titolo: 'Inserimento patente',
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler annullare l'operazione? Gli eventuali dati non salvati andranno persi.",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      // this.alertMessageService.emptyMessages();
      this.form.controls['lavAnagSilTTipoP'].get('id.silTTipoPatente.id').reset();
      this.showForm=false;
      return true;
    } else {
      return false;
    }
  }

}
