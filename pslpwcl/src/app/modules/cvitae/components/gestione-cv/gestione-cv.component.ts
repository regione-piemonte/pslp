/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { AppUserService } from 'src/app/services/app-user.service';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CvitaeService } from '../../services/cvitae.service';
import { MenuItem } from 'primeng/api';
import { DatiAnagraficiComponent } from './tabs-sezioni/dati-anagrafici/dati-anagrafici.component';
import { BlpLavAnagrafica, Candidatura, GeneraCvRequest, InserisciAggiornaCandidaturaRequest, PslpMessaggio } from 'src/app/modules/pslpapi';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { Utils } from 'src/app/utils';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'pslpwcl-gestione-cv',
  templateUrl: './gestione-cv.component.html',
  styleUrls: ['./gestione-cv.component.scss']
})
export class GestioneCvComponent implements OnInit, AfterViewInit {
  azione:String;
  idBlpAnagrafica:number
  blpLavAnagrafica:BlpLavAnagrafica
  items: MenuItem[] = [
    {label: 'Dati generali'},
    {label: 'Dati anagrafici'},
    {label: 'Esperienze di lavoro'},
    {label: 'Istruzione'},
    {label: 'Formazione professionale'},
    {label: 'Conoscenze linguistiche'},
    {label: 'Conoscenze informatiche'},
    {label: 'Abilitazioni e Patenti'},
    {label: 'Ulteriori informazioni'},
    {label: 'Professione desiderata'},
    {label: 'Riepilogo'}];
  stepTemplates: TemplateRef<any>[] = [];
  activeIndex: number = 0;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;

  @ViewChildren('stepDatiGenerali, stepDatiAnagrafici, stepEsperienzeLavoro, stepIstruzione, \
                stepFormazioneProfessionale, stepConoscenzeLinguistiche, stepConoscenzeInformatiche, \
                stepAbilitazionePatenti, stepUlterioreInformazioni, stepProfessioneDesiderata, \
                stepRiepilogo') allSteps: QueryList<TemplateRef<any>>;

  @ViewChild("DATI_ANAGRAFICI") steps_dati_anag_content:DatiAnagraficiComponent;

  constructor(
    private appUserService: AppUserService,
    private cvitaeService: CvitaeService,
    private cvService:CvService,
    private mappingSerice:MappingService,
    private promptModalService:PromptModalService,
    private commonService: CommonService
  ) {
    this.activeIndex = 0;
   }

  ngOnInit(): void {
    this.azione = this.cvitaeService.getAzioneActual();
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });

    // pslp_d_messaggio modifica generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });
    /*let request:any={
      idSilLavAnagrafica:this.utente.idSilLavAnagrafica
    }

      this.mappingSerice.getAnagraficaByIdSilpAnag(request).subscribe({
        next:ris=>{
          if(ris.esitoPositivo){
            this.idBlpAnagrafica=ris.blpLavAnagrafica.id
            this.cvitaeService.setIdAnagraficaBlp(this.idBlpAnagrafica)
            this.blpLavAnagrafica=ris.blpLavAnagrafica;
          }
        }
      });*/

  }
  ngAfterViewInit(): void {
    this.stepTemplates = this.allSteps.toArray();
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  next() {
    if(this.activeIndex==1){
      this.steps_dati_anag_content.formAltreInfo.markAllAsTouched()
      if(!this.steps_dati_anag_content.form.valid){
        if(this.steps_dati_anag_content.form.disabled){
          this.activeIndex++;
        }
        return;
      }else{
        if(!this.cvitaeService.cvitaeActual){
        //  CORREZIONE: Crea il CV senza cleanObject per preservare idLavAnagrafica
        const nuovoCv = this.creaCv();

        //  DEBUG: Decommentare per tracciare la creazione del CV
        // console.log('🔍 DEBUG creaCv:');
        // console.log('- CV prima di cleanObject:', nuovoCv);
        // console.log('- idLavAnagrafica prima:', nuovoCv.idLavAnagrafica);

        //  Non usare cleanObject sull'intero oggetto perché rimuove idLavAnagrafica
        // Invece, usa cleanObject solo sui campi nested specifici se necessario
        let request:any={
          candidatura: nuovoCv
        }

        // console.log('- Request da inviare:', request);

        this.cvService.inserisciCv(request).subscribe(
          {
            next:ris=>{
              if(ris.esitoPositivo){
                this.cvitaeService.cvitaeActual=ris.blpDCandidatura
                this.cvitaeService.updateSelectedCv(ris.blpDCandidatura)
                const data: DialogModaleMessage = {
                  titolo: "Gestione CV",
                  tipo: TypeDialogMessage.Confirm,
                  messaggio: this.messagioInserimento.testo,
                  size: "lg",
                  tipoTesto: TYPE_ALERT.SUCCESS
                };
                this.promptModalService.openModaleConfirm(data)
                this.attivaSteper();
              }

            }
          }
        )
      }else{
          let cv=this.cvitaeService.cvitaeActual;
          let titoloCvAttual = cv.titoloCv;
          cv.idLavAnagrafica.numTelefono=this.steps_dati_anag_content.formRecapito.get("cellulare2").value;
          cv.titoloCv=this.steps_dati_anag_content.formAltreInfo.get("titoloCv").value;
          cv.flgL68=this.steps_dati_anag_content.formAltreInfo.get("flgL68").value=='S'?'S':null
          cv.flgStampaL68=this.steps_dati_anag_content.formAltreInfo.get("flgStampaL68").value=='S'?'S':null
          if(titoloCvAttual == cv.titoloCv
            && this.cvitaeService.cvitaeActual.flgL68==cv.flgL68
              && this.cvitaeService.cvitaeActual.flgStampaL68==cv.flgStampaL68)  {
            this.activeIndex++;
            return;
          }

          let request:any={
            candidatura:cv
          }
          console.log(request);

          this.cvService.aggiornaCv(request).subscribe(
            {
              next:ris=>{
                if(ris.esitoPositivo){
                  this.cvitaeService.cvitaeActual=ris.blpDCandidatura
                  this.cvitaeService.updateSelectedCv(ris.blpDCandidatura)
                  const data: DialogModaleMessage = {
                    titolo: "Gestione CV",
                    tipo: TypeDialogMessage.Confirm,
                    messaggio: this.messagioAggiornamento.testo,
                    size: "lg",
                    tipoTesto: TYPE_ALERT.SUCCESS
                  };
                  this.promptModalService.openModaleConfirm(data)
                }
              }
            }
          )
        }
      }
    }
    this.activeIndex++;
    this.items[this.activeIndex].disabled = false;
  }

  attivaSteper(){
    this.items.map(it=>(it.disabled=false));
  }

  creaCv():Candidatura{
    return {
      codCandidatura:"",
      codStatoCandidatura:{
        codStatoCandidatura:"B",
        descrStatoCandidatura:"",
        dInizio:new Date()
      },
      idAmbitoDiffusione:{
        codAmbitoDiffusioneMin:"02",
        descrAmbitoDiffusione:"",
        dInizio:new Date()
      },
      flgGeneratoDaSistema:"N",
      idLavAnagrafica:{
        idSilLavAnagrafica: this.utente.idSilLavAnagrafica,
        codiceFiscale: '',
        dNascita: undefined,
        dsCognome: '',
        dsNome: '',
        eMail: '',
        genere: '',
        idComuneDomicilio: undefined
      },
      dInvio:new Date(),
      idFonteCandidatura:{descrFonte:"",id:3},
      idTipoComunicazione:{dInizio:new Date(),codTipoComunicazioneMin:"01",id:1,descrTipoComunicazione:"Invio candidatura / offerta"},
      titoloCv:this.steps_dati_anag_content.formAltreInfo.get("titoloCv").value,
      flgL68:this.steps_dati_anag_content.formAltreInfo.get("flgL68").value=='S'?'S':null,
      flgStampaL68:this.steps_dati_anag_content.formAltreInfo.get("flgStampaL68").value=='S'?'S':null,
      codUserAggiorn:"",
      codUserInserim:"",
      dAggiorn:new Date(),
      dInserim:new Date(),

    }
  }
  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  get nextStepLabel(){

    return (this.allSteps && this.activeIndex<this.allSteps.length-1 )? this.items[this.activeIndex+1].label:" "
  }

  get prevStepLabel(){
    return (this.allSteps && this.activeIndex>0 )? this.items[this.activeIndex-1].label:" "
  }

  get cvAttuale(){
   return this.cvitaeService.cvitaeActual;
  }


}
