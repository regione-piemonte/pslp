/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DialogModaleMessage } from '../models/dialog-modale-message';
import { ModalConfirmComponent } from '../components/modal-confirm/modal-confirm.component';
import { ModalRicercaAziendaComponent } from '../components/modal-ricerca-azienda/modal-ricerca-azienda.component';
import { ModalPatenteComponent } from '../components/modal-patente/modal-patente.component';
import { ModalSelezionareCittadinoComponent } from '../components/modal-selezionare-cittadino/modal-selezionare-cittadino.component';
import { ModalTitoloStudioComponent } from '../components/modal-titolo-studio/modal-titolo-studio.component';
import { ModalCodiceOtpComponent } from '../components/modal-codice-otp/modal-codice-otp.component';
import { AltroCorso, ConoscenzaInformatica, EsperienzaProfessionale, FormazioneProfessionalePiemontese, LavAnagrafica, LavTitoloStudioAltro, LinguaStraniera, SuntoLavoratore, TitoloDiStudio } from '../../pslpapi';
import { ModalStampaCvComponent } from '../../cvitae/components/modal-stampa-cv/modal-stampa-cv.component';
import { ModalEsperienzaLavoroFascicoloComponent } from '../../cvitae/components/gestione-cv/tabs-sezioni/esperienze-lavoro/modal-esperienza-lavoro-fascicolo/modal-esperienza-lavoro-fascicolo.component';
import { ModalTitoliStudioComponent } from '../../cvitae/components/gestione-cv/tabs-sezioni/istruzione/modal-titoli-studio/modal-titoli-studio.component';
import { ModalFormazioneProfessionaleFascicoloComponent } from '../../cvitae/components/gestione-cv/tabs-sezioni/formazione-professionale/modal-formazione-professionale-fascicolo/modal-formazione-professionale-fascicolo.component';
import { ModalConoscenzeLinguisticheFascicoloComponent } from '../../cvitae/components/gestione-cv/tabs-sezioni/conoscenze-linguistiche/modal-conoscenze-linguistiche-fascicolo/modal-conoscenze-linguistiche-fascicolo.component';
import { ModalConoscenzaInformaticaFascicoloComponent } from '../../cvitae/components/gestione-cv/tabs-sezioni/conoscenze-informatiche/modal-conoscenza-informatica-fascicolo/modal-conoscenza-informatica-fascicolo.component';
import { ModalConfermaMailComponent } from '../components/modal-conferma-mail/modal-conferma-mail.component';
import { ModalMotivoCandidaturaComponent } from '../components/modal-motivo-candidatura/modal-motivo-candidatura.component';

@Injectable({
  providedIn: 'root'
})
export class PromptModalService {

  constructor(private modalService: NgbModal) { }



  openModaleConfirm(fromParent: DialogModaleMessage, flgAzioeneX?: boolean) {
    let laSize = 'lg';
    if (fromParent.size) {
      laSize = fromParent.size;
    }
    const modalRef = this.modalService.open(ModalConfirmComponent, { size: laSize, scrollable: true, backdrop: 'static', centered: true });
    modalRef.componentInstance.fromParent = fromParent;
    modalRef.componentInstance.flgAzioeneX = flgAzioeneX;
    modalRef.componentInstance.callback = this.callbackConfirm;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }
  openRicercaAzienda(pTitle: string) {
    const modalRef = this.modalService.open(ModalRicercaAziendaComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  callbackConfirm(modal: NgbModalRef, val?: string) {
    modal.close(val);
  }
  callbackObj(modal: NgbModalRef, val?: any) {
    modal.close(val);
  }

  openTitoloStudio(pTitle: string, sunto: SuntoLavoratore) {
    const modalRef = this.modalService.open(ModalTitoloStudioComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.sunto = sunto;
    return modalRef.result;
  }


  openPatente(pTitle: string, flgPatente: string, flgDid: boolean = false) {
    const modalRef = this.modalService.open(ModalPatenteComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.flgPatente = flgPatente;
    modalRef.componentInstance.flgDid = flgDid;
    return modalRef.result;
  }

  openCodiceOtp(pTitle: string, cf: string) {
    const modalRef = this.modalService.open(ModalCodiceOtpComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.cf = cf;
    return modalRef.result;
  }

  openConfermaMail(pTitle: string, utente: LavAnagrafica) {
    const modalRef = this.modalService.open(ModalConfermaMailComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.utente = utente;
    return modalRef.result;
  }

  openSelezionareCittadino(pTitle: string) {
    const modalRef = this.modalService.open(ModalSelezionareCittadinoComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  openModaleSelezionaColoreCv() {
    const modalRef = this.modalService.open(ModalStampaCvComponent, { size: 'lg', scrollable: true });
    //modalRef.componentInstance.title = pTitle;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  /*####################################################################
  INIZIO
  Modali per visualizzare dati del fascicolo dentro CV

  */


  // Esperienza Professionale Modal

  openVisualizzaEsperienzaLavoroFascicolo(idSilLavAnagrafica: number, esperienzaSelected: EsperienzaProfessionale, mod: string = 'view') {
    const modalRef = this.modalService.open(ModalEsperienzaLavoroFascicoloComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.idSilLavAnagrafica = idSilLavAnagrafica;
    modalRef.componentInstance.esperienzaSelected = esperienzaSelected;
    modalRef.componentInstance.mod = mod;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  // Titolo Studio Modal
  openVisualizzaTitoloStudioFascicolo(titoloDiStudio: TitoloDiStudio, titoloDiStudioAltro: LavTitoloStudioAltro) {
    const modalRef = this.modalService.open(ModalTitoliStudioComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.titoloDiStudio = titoloDiStudio;
    modalRef.componentInstance.lavTitoloStudioAltro = titoloDiStudioAltro;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  // Altri Formazione professionale / corso Modal
  openVisualizzaFormazioneProfessionaleFascicolo(formazione: FormazioneProfessionalePiemontese | AltroCorso, isAltroCorso = false) {
    const modalRef = this.modalService.open(ModalFormazioneProfessionaleFascicoloComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.formazione = formazione;
    modalRef.componentInstance.isAltroCorso = isAltroCorso;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  // Conoscenza Linguestica Modal
  openVisualizzaConoscenzaLinguistica(linguaStraniera: LinguaStraniera) {
    const modalRef = this.modalService.open(ModalConoscenzeLinguisticheFascicoloComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.linguaStraniera = linguaStraniera;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }

  // Conoscenza informatica Modal
  openVisualizzaConoscenzaInformatica(conoscenzeInformatica: ConoscenzaInformatica) {
    const modalRef = this.modalService.open(ModalConoscenzaInformaticaFascicoloComponent, { size: 'xl', scrollable: true });
    modalRef.componentInstance.conoscenzeInformatica = conoscenzeInformatica;
    modalRef.componentInstance.callback = this.callbackObj;
    modalRef.componentInstance.modal = modalRef;
    return modalRef.result;
  }



  /*####################################################################
  FINE
  Modali per visualizzare dati del fascicolo dentro CV

  */


  /*MODALE PER SCELTA MOTIVO LE MIE CANDIDATURE */

  openModaleMotivoCandidatura(title : string) {
    const modalRef = this.modalService.open(ModalMotivoCandidaturaComponent, { size: 'md' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.callback = this.callbackObj;
    return modalRef.result;
    // modalRef.result.then(
    //   result => {
    //     console.log('Valore selezionato:', result);
    //     // gestisci il valore qui
    //   },
    //   reason => {
    //     console.log('Selezione annullata');
    //   }
    // );
  }

}
