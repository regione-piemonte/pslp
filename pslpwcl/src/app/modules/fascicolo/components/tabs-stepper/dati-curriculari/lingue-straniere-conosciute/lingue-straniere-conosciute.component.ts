/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchedaAnagraficaProfessionale, Decodifica, PslpMessaggio } from 'src/app/modules/pslpapi';
import { LinguaStraniera, LinguaRequest, LinguaResponse, LavLingua, Lingua, ModApprLin, GradoConLin, LavAnagrafica } from 'src/app/modules/pslpapi';
import { FascicoloPslpService, DecodificaPslpService } from 'src/app/modules/pslpapi';
import { forkJoin } from 'rxjs';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';
import { CommonService } from 'src/app/services/common.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';


@Component({
  selector: 'pslpwcl-lingue-straniere-conosciute',
  templateUrl: './lingue-straniere-conosciute.component.html',
  styleUrls: ['./lingue-straniere-conosciute.component.scss']
})
export class LingueStraniereConosciuteComponent implements OnInit,OnChanges {
  @Input() fascicolo:SchedaAnagraficaProfessionale;

  linguaStranieraList: Array<LinguaStraniera>;
  linguaStraniera: LinguaStraniera;

  linguaDecodifiche: Decodifica[];
  linguaDecodificheFiltrate:Decodifica[];
  gradoConoscenzaLingua: Decodifica[];
  modalitaAprrendimentoLinguaDecodifica: Decodifica[];

  showForm = false;
  form: FormGroup;

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;
  messagioConfermaInserimento: PslpMessaggio;
  messagioConfermaEliminazione: PslpMessaggio;

  constructor(
    private decodificaService: DecodificaPslpService,
    private fascicoloService: FascicoloPslpService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private fb:FormBuilder,
    private promptModalService: PromptModalService,
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
    
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });
    
    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    if(this.fascicolo?.informazioniCurriculari){
      this.linguaStranieraList = Utils.clone(this.fascicolo?.informazioniCurriculari?.lingueStraniere);
    }
    this.loadDecodifiche();
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['fascicolo'] && this.fascicolo?.informazioniCurriculari){
      this.linguaStranieraList = Utils.clone(this.fascicolo?.informazioniCurriculari?.lingueStraniere);
    }
  }

  toggleForm(){
     this.showForm= this.showForm ? false: true;
    this.initForm();
    if(this.linguaStranieraList){
      let lingueDecodificheConosciute:Decodifica[]=this.linguaStranieraList.map(lingua=>{
        return{
          id:lingua.lingua.id
        }
      })
      this.linguaDecodificheFiltrate=this.linguaDecodifiche.filter((lingua)=>{
        return !lingueDecodificheConosciute.find(ling=>ling.id==lingua.id)
      })
    }else{
      this.linguaDecodificheFiltrate=this.linguaDecodifiche;
    }


  }

  private initForm() {
    this.form = new FormGroup({
      idSilLavLingua: new FormControl(),
      certificato: new FormControl(),
      letto: new FormGroup({
        id: new FormControl(null,Validators.required)
      }),
      lingua: new FormGroup({
        id: new FormControl(null,Validators.required)
      }),
      modalitaApprendimento: new FormGroup({
        id: new FormControl(null,Validators.required)
      }),
      parlato: new FormGroup({
        id: new FormControl(null,Validators.required)
      }),
      scritto: new FormGroup({
        id: new FormControl(null,Validators.required)
      })
    });
  }

  private loadDecodifiche() {
    const requests$ = [
      this.decodificaService.findDecodificaByTipo('lingua'),
      this.decodificaService.findDecodificaByTipo('grado-conoscenza-lingua'),
      this.decodificaService.findDecodificaByTipo('modalita-apprendimento-lingua')
    ];

    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo)
          this.linguaDecodifiche = multiResponse[0].list;
        if (multiResponse[1].esitoPositivo) {
          multiResponse[1].list.forEach((el: Decodifica) => {
            el.descr = `${el.codice} - ${el.descr}`;
          });
          this.gradoConoscenzaLingua = multiResponse[1].list;
        }
        if (multiResponse[2].esitoPositivo){
          this.modalitaAprrendimentoLinguaDecodifica = multiResponse[2].list;
        }
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      }
    });
  }

  async onConferma(){
    const msg = this.messagioConfermaInserimento.testo;
    const data: DialogModaleMessage = {
      titolo: "Inserimento lingua straniera conosciuta",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.confermaEsperienza();
    }

  }

  private confermaEsperienza() {
    //this.spinner.show();

    let lingua = this.form.getRawValue() as LinguaStraniera;
    let lavLingua: LavLingua = {
      idSilLavLingua: lingua.idSilLavLingua,
      flgCertificato: lingua.certificato ? 'S' : 'N',
      silTModApprLin: lingua.modalitaApprendimento as ModApprLin,
      silTGradoConLinP: lingua.parlato as GradoConLin,
      gradoConLinL: lingua.letto as GradoConLin,
      silTLingua: lingua.lingua as Lingua,
      silTGradoConLinS: lingua.scritto as GradoConLin,
      silLavAnagrafica: {
        idSilLavAnagrafica: this.fascicolo.idSilLavAnagrafica,
      }
    }

    let linguaRequest: LinguaRequest = {
      lavLingua: lavLingua
    }

    this.fascicoloService.insertOrUpdateLingua(linguaRequest).subscribe({
      next: (res: any) => {
        if (res?.esitoPositivo) {
          this.toggleForm();
          this.commonService.refreshFascicolo();
          this.linguaStranieraList.push(lingua);
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }
        else{
         // this.spinner.hide();
        }
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrUpdateLingua ${JSON.stringify(err)}`);
       // this.spinner.hide();

      },
      complete: () => {
      }
    })
  }

  async onClickEliminaLingua(linguaStraniera:LinguaStraniera){
    const data: DialogModaleMessage = {
      titolo: "Eliminazione lingua",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: this.messagioConfermaEliminazione.testo,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      // this.alertMessageService.emptyMessages();
      this.eliminaLingua(linguaStraniera);
    } 
  }

  eliminaLingua(linguaStraniera:LinguaStraniera){
    let linguaRequest: LinguaRequest = {
      lavLingua: {
        ...linguaStraniera,
        silLavAnagrafica: {
          idSilLavAnagrafica: this.fascicolo.idSilLavAnagrafica,
        },
        silTLingua:{id:linguaStraniera.lingua.codice}
      },

    }
    this.fascicoloService.deleteLingua(linguaRequest).subscribe({
      next: (res: any) => {
        if (res?.esitoPositivo) {
          // this.toggleForm();
          this.showForm = false;
          
          this.commonService.refreshFascicolo();
          this.linguaStranieraList.splice(this.linguaStranieraList.findIndex(li=>li.lingua.id==linguaStraniera.lingua.id),1)
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }
        else{
          //this.spinner.hide();
        }
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrUpdateLingua ${JSON.stringify(err)}`);
        //this.spinner.hide();

      },
    })
  }

}
