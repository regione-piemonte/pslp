/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { FascicoloPslpService } from 'src/app/modules/pslpapi';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { TYPE_ALERT } from 'src/app/constants';
import { ControlliFascicoloRequest, Utente } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { SpinnerManagerService } from 'src/app/services/spinner-manager.service';
import { DatiAnagraficiComponent } from '../tabs-stepper/dati-anagrafici/dati-anagrafici.component';
import { registerLocaleData } from '@angular/common';
import { MessaggioService } from 'src/app/modules/pslpapi';
import { PslpMessaggio } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-stepper-fascicolo',
  templateUrl: './stepper-fascicolo.component.html',
  styleUrls: ['./stepper-fascicolo.component.scss'],
  //changeDetection:ChangeDetectionStrategy.OnPush
})
export class StepperFascicoloComponent implements OnInit, AfterViewInit {

  active: number = 0;

  messagioErrore: string = null;
  activeIndex: number = 0;
  isSaving: boolean = false; //  Aggiunta variabile per prevenire doppi click

  stepTemplates: TemplateRef<any>[] = [];
  @ViewChildren('stepDatiAnagrafici, stepDatiAmministrativi, \
                stepEsperienzeLavorative, stepDatiCurriculari') allSteps: QueryList<TemplateRef<any>>;

  @ViewChild("DATI_ANAGRAFICI") steps_content:any;
  currentStep: any;


  items: MenuItem[] = [{label: 'Dati anagrafici'},
                      {label: 'Dati amministrativi'},
                      {label: 'Esperienze di lavoro'},
                      {label: 'Dati curriculari'}];


  erroreE21: PslpMessaggio;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;

  constructor(
    private logService:LogService,
    private commonService:CommonService,
    private fascicoloService:FascicoloPslpService,
    private readonly appUserService:AppUserService,
    private spinner:NgxSpinnerService,
    private spinnerManager: SpinnerManagerService,
    private promptModalService:PromptModalService,
    private messagioService: MessaggioService

  ) { }

  ngOnInit(): void {
    // pslp_d_messaggio Errore generico
    this.commonService.getMessaggioByCode("E21").then(messaggio => {
      this.erroreE21 =  messaggio;
    });

    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });

    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });
  }
  ngAfterViewInit(): void {
    //this.logService.info(this.constructor.name, 'ngAfterViewInit');
    // Accedi agli elementi dell'array allTabs solo dopo che la vista è stata completamente inizializzata
    this.allSteps.changes.subscribe(() => {
      console.log('All Tabs:', this.allSteps.toArray());
    });
    this.stepTemplates = this.allSteps.toArray();
  }
  async next() {

    if(this.activeIndex == 0){
      if(this.steps_content.form.untouched){
        this.activeIndex++
        return
      }

      //  CORREZIONE: Prevenire doppi click durante il salvataggio
      if(this.isSaving) {
        return;
      }

      this.isSaving = true;
      const saveRequestId = this.spinnerManager.generateRequestId();
      this.spinnerManager.show(saveRequestId);

      //  DEBUG: Decommentare per tracciare il salvataggio
      // console.log('🔍 DEBUG SALVATAGGIO - Inizio');
      // console.log('- Fascicolo corrente:', this.fascicolo);
      // console.log('- steps_content:', this.steps_content);

      if(!this.steps_content.getFascicolo()){
        console.error('❌ ERROR: getFascicolo() ha restituito null/undefined');
        this.spinnerManager.hide(saveRequestId);
        this.isSaving = false;
        return;
      }

      const fascicoloModificato = this.steps_content.getFascicolo();
      // console.log('- Fascicolo modificato:', fascicoloModificato);

      this.messagioErrore = null;

      try {
        let controlliFascicoloRequest:ControlliFascicoloRequest = {
          coordTabAttivo: '1.1',
          coordTabDestino: '1.2',
          flgFattaDomandaSalva: true,
          idSilLavAnagrafica: this.fascicolo ? this.fascicolo.idSilLavAnagrafica.toString():"",
          schedaModificata: fascicoloModificato,
          schedaOriginale: this.fascicolo,
          tipoOperazione: this.fascicolo?.idSilLavAnagrafica ? 'edit' : 'ins'
        }

        // console.log('- Tipo operazione:', controlliFascicoloRequest.tipoOperazione);

        // Modifica per evitare di appesantire il salvataggio - gestione sicura
        if(controlliFascicoloRequest.schedaOriginale) {
          controlliFascicoloRequest.schedaOriginale.esperienzeLavorative = null;
        }
        if(controlliFascicoloRequest.schedaModificata) {
          controlliFascicoloRequest.schedaModificata.esperienzeLavorative = null;
        }

        // console.log(' Request preparata, invio chiamata API...');
        // console.log('- Request completa:', controlliFascicoloRequest);
        // console.log('- schedaModificata:', JSON.parse(JSON.stringify(controlliFascicoloRequest.schedaModificata)));
        // console.log('- schedaModificata.datiAnagrafici:', controlliFascicoloRequest.schedaModificata?.datiAnagrafici);
        // console.log('- schedaOriginale:', controlliFascicoloRequest.schedaOriginale);

        this.fascicoloService.controllaProseguiSalva(controlliFascicoloRequest).subscribe({
          next: (r:any) => {
            // console.log('📥 Risposta prima chiamata controllaProseguiSalva:', r);
            if(r.esitoPositivo){
              // console.log(' Prima chiamata OK, procedo con la seconda...');

              //this.commonService.fascicoloActual = newFascicolo;
              let controlliFascicoloRequest2:ControlliFascicoloRequest = {
                coordTabAttivo: '1.2',
                coordTabDestino: '1.3',

                flgFattaDomandaSalva: true,

                idSilLavAnagrafica: this.fascicolo ? this.fascicolo.idSilLavAnagrafica.toString():"",//this.appUserService.getUtente().idSilLavAnagrafica.toString(),
                schedaModificata: this.steps_content.getFascicolo(),
                schedaOriginale: this.fascicolo,

                // sezioniSapModificate?: Array<string>;
                tipoOperazione:this.fascicolo?.idSilLavAnagrafica? 'edit':'ins'

              }
              // Modifica per evitare di appesantire il salvataggio - gestione sicura
              if(controlliFascicoloRequest2.schedaOriginale) {
                controlliFascicoloRequest2.schedaOriginale.esperienzeLavorative = null;
              }
              if(controlliFascicoloRequest2.schedaModificata) {
                controlliFascicoloRequest2.schedaModificata.esperienzeLavorative = null;
              }

              // console.log('📤 Invio seconda chiamata controllaProseguiSalva...');
              this.fascicoloService.controllaProseguiSalva(controlliFascicoloRequest2).subscribe({
                next: (r) => {
                  // console.log('📥 Risposta seconda chiamata:', r);
                  if(r.esitoPositivo){
                    // console.log(' Seconda chiamata OK - Salvataggio completato!');
                    let utenteTmp:Utente={
                      ...this.utente,
                      idSilLavAnagrafica: Number(r.fascicolo.idSilLavAnagrafica)
                    }
                    this.appUserService.getUtenteOperateFor()?this.appUserService.setUtenteOperateFor(utenteTmp)
                      :this.appUserService.setUtente(utenteTmp)
                    this.commonService.refreshFascicolo()
                    let msg=!this.fascicolo?.idSilLavAnagrafica? this.messagioInserimento : this.messagioAggiornamento
                    const data: DialogModaleMessage = {
                      titolo: "Gestione Fascicolo",
                      tipo: TypeDialogMessage.Confirm,
                      messaggio: msg.testo,
                      size: "lg",
                      tipoTesto: TYPE_ALERT.SUCCESS
                    };
                    this.promptModalService.openModaleConfirm(data)
                    this.activeIndex++;

                  }else{
                    // console.error('❌ Seconda chiamata: esitoPositivo = false');
                    let msg="Errore nell'inserimento dei dati"
                    const data: DialogModaleMessage = {
                      titolo: "Gestione Fascicolo",
                      tipo: TypeDialogMessage.Back,
                      messaggio:msg,
                      size: "lg",
                      tipoTesto: TYPE_ALERT.WARNING
                    };
                    this.promptModalService.openModaleConfirm(data)
                  }

                  //  CORREZIONE: Nascondi lo spinner e riabilita il salvataggio solo dopo che tutto è completato
                  // console.log('🔄 Nascondo spinner dopo seconda chiamata');
                  this.spinnerManager.hide(saveRequestId);
                  this.isSaving = false;
                },
                error: (err) => {
                  //  CORREZIONE: Nascondi lo spinner e riabilita il salvataggio anche in caso di errore
                  console.error('❌ Errore seconda chiamata:', err);
                  this.spinnerManager.hide(saveRequestId);
                  this.isSaving = false;
                  this.logService.error(this.constructor.name, err);
                }
              })



          }else{
            //  CORREZIONE: Nascondi lo spinner e riabilita il salvataggio se la prima chiamata fallisce
            console.error('❌ Prima chiamata: esitoPositivo = false');
            console.error('- Messaggi API:', r.apiMessages);
            console.error('- Messaggio errore:', r.apiMessages[0]?.message);

            this.spinnerManager.hide(saveRequestId);
            this.isSaving = false;

            // Mostra il messaggio di errore all'utente
            this.messagioErrore = r.apiMessages[0].message;

            // Mostra anche un modal con l'errore
            const data: DialogModaleMessage = {
              titolo: "Errore Salvataggio",
              tipo: TypeDialogMessage.Back,
              messaggio: r.apiMessages[0].message || "Errore durante il salvataggio dei dati",
              messaggioAggiuntivo: r.apiMessages[0]?.code ? `Codice: ${r.apiMessages[0].code}` : "",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data);
          }
        },
        error: err => {
          //  CORREZIONE: Nascondi lo spinner e riabilita il salvataggio anche in caso di errore nella prima chiamata
          console.error('❌ Errore prima chiamata:', err);
          this.spinnerManager.hide(saveRequestId);
          this.isSaving = false;
          this.logService.error(this.constructor.name ,err)
        },
      })

      } catch (error: any) {
        //  GESTIONE ERRORI SINCRONI: Catch per errori che si verificano prima della chiamata HTTP
        console.error('❌ ERRORE SINCRONO durante la preparazione della request:', error);
        this.spinnerManager.hide(saveRequestId);
        this.isSaving = false;
        this.messagioErrore = 'Errore durante la preparazione dei dati: ' + (error?.message || JSON.stringify(error));
      }


     /* this.fascicoloService.inserisciModificaFascicoloCittadino(controlliFascicoloRequest).subscribe({
        next:r=>{
          if(r.esitoPositivo){
            let utenteTmp:Utente={
              ...this.utente,
              idSilLavAnagrafica: Number(r.fascicolo.idSilLavAnagrafica)
            }
            this.appUserService.getUtenteOperateFor()?this.appUserService.setUtenteOperateFor(utenteTmp)
              :this.appUserService.setUtente(utenteTmp)
            this.commonService.refreshFascicolo()
            let msg="Dati "+(!this.fascicolo?.idSilLavAnagrafica?"inseriti": "aggiornati")+ " correttamente"
            const data: DialogModaleMessage = {
              titolo: "Gestione Fascicolo",
              tipo: TypeDialogMessage.Confirm,
              messaggio: msg,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.activeIndex++;

          }else{
            let msg= this.erroreE21.testo;
            const data: DialogModaleMessage = {
              titolo: "Gestione Fascicolo",
              tipo: TypeDialogMessage.Back,
              messaggio:msg,
              size: "lg",
              tipoTesto: TYPE_ALERT.WARNING
            };
            this.promptModalService.openModaleConfirm(data)
          }
        },
        error:err=>{console.log(err)}
      })*/
      //this.spinner.hide()

    }else{
      this.messagioErrore = null;
      this.activeIndex++;
    }



  }

  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }


  onClickNavChange($event: any) {

    this.currentStep = this.allSteps.find((tab: any) => {
      return tab.activeId === $event.activeId;
    });
    this.messagioErrore=null
  }



  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  get fascicolo(){
    return this.commonService.fascicoloActual;
  }

  get nextStepLabel(){

    return (this.allSteps && this.activeIndex<this.allSteps.length-1 )? this.items[this.activeIndex+1].label:" "
  }

  get prevStepLabel(){
    return (this.allSteps && this.activeIndex>0 )? this.items[this.activeIndex-1].label:" "
  }

  get isCurrentlySaving(){
    return this.isSaving;
  }
}
