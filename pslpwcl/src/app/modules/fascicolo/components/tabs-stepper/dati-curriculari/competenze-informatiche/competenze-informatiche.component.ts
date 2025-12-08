/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { TYPE_ALERT } from 'src/app/constants';
import { ApiMessage, ConoscenzaInformatica, Decodifica, DecodificaPslpService, FascicoloPslpService, InformaticaDett, LavInformatica, PslpMessaggio } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-competenze-informatiche',
  templateUrl: './competenze-informatiche.component.html',
  styleUrls: ['./competenze-informatiche.component.scss']
})
export class CompetenzeInformaticheComponent implements OnInit,OnChanges {

  @Input() conoscenzeInformatiche: ConoscenzaInformatica[];
  @Input() idSilLavAnagrafica: number;
  conoscenzeInformaticheCopy: ConoscenzaInformatica[];

  @Output() emitUpdateList: EventEmitter<any> = new EventEmitter();


  //nel form richiamato Categoria arriva della decodifica informatica
  informaticas: Decodifica[];

  conoscenzaSpecificas: Decodifica[];
  modalitaApprendimentos: Decodifica[];
  gradoConoscenzas: Decodifica[];

  //nel form richiamato Conoscenza Informatica arriva della decodifica informatica-dett come ricerca
  informaticaDett: Decodifica[] = [];
  categoria: string;
  form: FormGroup;
  showForm: boolean = false;
  formMode: string;

  conoscenzaInformaticaSelected: ConoscenzaInformatica;

  messaggioErrore: ApiMessage;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;
  messagioConfermaInserimento: PslpMessaggio;
  messagioConfermaEliminazione: PslpMessaggio;

  constructor(
    private decodificaService: DecodificaPslpService,
    private spinner: NgxSpinnerService,
    private logService: LogService,
    private fascicoloService: FascicoloPslpService,
    private promptModalService: PromptModalService,
    private message: MessageService,
    private fb:FormBuilder,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {
    // pslp_d_messaggio Conferma Eliminazione generico
    this.commonService.getMessaggioByCode("C7").then(messaggio => {
      this.messagioConfermaEliminazione =  messaggio;
    });
    // pslp_d_messaggio Conferma Inserimento generico
    this.commonService.getMessaggioByCode("C6").then(messaggio => {
      this.messagioConfermaInserimento =  messaggio;
    });
    
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });

    // pslp_d_messaggio modifica generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });

    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    this.loadDecodifiche();
    if(this.conoscenzeInformatiche)
      this.conoscenzeInformaticheCopy = Utils.clone(this.conoscenzeInformatiche);
    this.initForm();
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['conoscenzeInformatiche'] && this.conoscenzeInformatiche){
      this.conoscenzeInformaticheCopy = Utils.clone(this.conoscenzeInformatiche);
    }
  }

  private loadDecodifiche() {
    const requests$ = [
      this.decodificaService.findDecodificaByTipo('informatica'),
      this.decodificaService.findDecodificaByTipo('modalita-apprendimento-informatica'),
      this.decodificaService.findDecodificaByTipo('grado-conoscenza-informatica')
    ];
    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo){

          //necessario a causa delle decodifiche generiche con id di tipo any
          this.informaticas = multiResponse[0].list.map(function(decodifica:any) {
              decodifica.id = parseInt(decodifica.id, 10);
            return decodifica;
          });
        }
        if (multiResponse[1].esitoPositivo)
          this.modalitaApprendimentos = multiResponse[1].list;
        if (multiResponse[2].esitoPositivo)
          this.gradoConoscenzas = multiResponse[2].list;
        this.spinner.hide();
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
        this.spinner.hide();
      }
    });
  }

  onChangeForm(){
    console.log(this.form);
  }

  private initForm() {
    this.form = this.fb.group({
      flgCertificato: [null],
      idSilLavInformatica: [null],
      silLavAnagrafica: this.fb.group({
        idSilLavAnagrafica: [null]
      }),
      silTGradoConInf: this.fb.group({
        id: [null]
      }),
      silTModApprInf: this.fb.group({
        id: [null]
      }),
      dsNote: [null],
      silTInformaticaDett: this.fb.group({
        id: [null,Validators.required],
        informatica: this.fb.group({
          descr: [null]
        })
      })
    });
  }

  async toggleFormConoscenzeInformatiche(mode:string, conoscenzaInformatica?: ConoscenzaInformatica){
    this.messaggioErrore=null;
    if(!await this.getFormFlow(mode,conoscenzaInformatica))
      return;
    this.formMode = mode;
    this.conoscenzaInformaticaSelected = conoscenzaInformatica;
    this.setDispositions();
    this.showForm = true;
  }

  onFilterInformaticaDett(event:any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("INFORMATICA-DETT",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.informaticaDett = [...r.list];
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }

  onChangeInformaticaDett(event:any){

    this.categoria  = this.informaticaDett.find(i=>i.id==event.value).special;
  }

  private async getFormFlow(mode: string, el: ConoscenzaInformatica): Promise<boolean> {

    if (mode === 'view'){
      this.form.disable()
      return true;
    }else{
      this.form.enable()
    }

    if ((this.showForm || (this.conoscenzaInformaticaSelected === el && this.form.dirty)) && this.formMode != 'view') {
      const data: DialogModaleMessage = {
        titolo: this.formMode === 'ins' ? 'Inserimento conoscenza informatica' : 'Modifica conoscenza informatica',
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

  private setDispositions() {
    this.form.reset();
    this.form.get("silTInformaticaDett.informatica.descr").disable()
    if (this.conoscenzaInformaticaSelected)
      this.patchValueInform();

  }


  private patchValueInform() {
    this.form.patchValue(this.conoscenzaInformaticaSelected.lavInformatica);
    this.informaticaDett = [];
    this.informaticaDett.push(this.conoscenzaInformaticaSelected.lavInformatica.silTInformaticaDett as Decodifica);
    this.form.get("silTInformaticaDett").patchValue(this.informaticaDett);
    this.form.get("silTInformaticaDett.informatica.descr").setValue(this.conoscenzaInformaticaSelected.lavInformatica.silTInformaticaDett.informatica.descr)
    if(this.conoscenzaInformaticaSelected.lavInformatica.flgCertificato)
      this.form.get("flgCertificato").setValue(this.conoscenzaInformaticaSelected.lavInformatica.flgCertificato=='S'?"S":"N")
    else
      this.form.get("flgCertificato").reset()
  }

  async onClickConferma(){
    const msg = this.messagioConfermaInserimento.testo;
    const data: DialogModaleMessage = {
      titolo: this.formMode === 'ins' ? "Inserimento competenza informatica" : "Modifica competenza informatica",
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

    this.spinner.show();
    // this.alertMessageService.emptyMessages();
    let lavInformatica = this.form.getRawValue() as LavInformatica;
    lavInformatica.silLavAnagrafica.idSilLavAnagrafica = this.idSilLavAnagrafica;

     const lavInformaticaRequest = {
      lavInformatica: Utils.cleanObject(lavInformatica)
     }
     this.fascicoloService.insertOrUpdateInformatica(lavInformaticaRequest).subscribe({
       next: (res: any) => {
         if(res?.esitoPositivo){
          this.updateList(res.lavInformatica)
           this.commonService.refreshFascicolo();
           this.form.reset();
           this.showForm = false;
           let msg=this.formMode === 'ins'? this.messagioInserimento : this.messagioAggiornamento
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: msg.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data);
          }else{
            this.messaggioErrore = res.apiMessages[0];
          }
          //  this.alertMessageService.setApiMessages(res.apiMessages);
           this.spinner.hide();
       },
       error: (err) => {
         this.logService.error(this.constructor.name, `insertOrUpdateInformatica ${JSON.stringify(err)}`);
         this.spinner.hide();
       }
     });
  }

  updateList(lavInformatica: LavInformatica) {
    if(Utils.isNullOrUndefined(this.conoscenzeInformaticheCopy))
      this.conoscenzeInformaticheCopy = [];
    let index: number = this.conoscenzeInformaticheCopy.findIndex((el: ConoscenzaInformatica) => {return el.lavInformatica.idSilLavInformatica === lavInformatica.idSilLavInformatica});
    if(index < 0)
     index = this.conoscenzeInformaticheCopy.unshift({
      lavInformatica: lavInformatica
     });
    else
      this.conoscenzeInformaticheCopy[index].lavInformatica = lavInformatica;
    this.emitUpdateList.emit({
      conoscenzeInformatiche: this.conoscenzeInformaticheCopy
     });

    //  const msg = this.message.getKeyValueByCod('002', MSG.KEY.DESC);
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
    this.spinner.hide();
  }

  async onClickElimina(el: ConoscenzaInformatica){
    const data: DialogModaleMessage = {
      titolo: "Eliminazione competenza informatica",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: this.messagioConfermaEliminazione.testo,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      // this.alertMessageService.emptyMessages();
      this.elimina(el);
    }
  }

  private elimina(el: ConoscenzaInformatica) {
    this.spinner.show();

    const InformaticaRequest = {
      lavInformatica: el.lavInformatica
    }
    this.fascicoloService.deleteInformatica(InformaticaRequest).subscribe({
      next: (res: any) => {
        if(res?.esitoPositivo){
          const index = this.informaticaDett.findIndex((el: Decodifica) => {return el.id === InformaticaRequest.lavInformatica.idSilLavInformatica});
          this.informaticaDett.splice(index,1);
          if(this.conoscenzaInformaticaSelected === el)
            this.showForm = false;
          this.commonService.refreshFascicolo();
          this.spinner.hide();
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }else
          this.spinner.hide();
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `deleteInformatica ${JSON.stringify(err)}`);
        this.spinner.hide();
      }
    });
  }

  async onClickAnnulla(){
    if(this.formMode === 'view'){
      this.showForm=false;
      this.conoscenzaInformaticaSelected = undefined;
      return true;
    }
    const data: DialogModaleMessage = {
      titolo: this.formMode === 'ins' ? 'Inserimento competenza informatica' : 'Modifica competenza informatica',
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler annullare l'operazione? Gli eventuali dati non salvati andranno persi.",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      // this.alertMessageService.emptyMessages();
      this.showForm=false;
      this.conoscenzaInformaticaSelected = undefined;
      return true;
    } else {
      return false;
    }
  }

}
