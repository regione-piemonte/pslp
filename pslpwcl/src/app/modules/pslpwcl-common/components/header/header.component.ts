/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseCard } from '../../models/base-card';
import { TypeApplicationCard } from '../../models/type-application-card';
import {
  Funzione,
  LavoratorePslpService,
  PrivacyService,
  RuoloFunzione,
  Utente,
  UtenteService,
} from 'src/app/modules/pslpapi';
import { DecodificaPublicPslpService } from 'src/app/modules/pslpapi';
import { LogService } from 'src/app/services/log.service';
import {  Router } from '@angular/router';

import { UserInfo } from '../../models/userInfo';
import { AppUserService } from 'src/app/services/app-user.service';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from '../../models/dialog-modale-message';
import { TypeDialogMessage } from '../../models/type-dialog-message';
import { PromptModalService } from '../../services/prompt-modal.service';
import { PlspshareService } from '../../services/plspshare.service';
import { environment } from 'src/environments/environment';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'pslpwcl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {


  @Input() subheaderContent = 'I servizi per il cittadino';
  urlUscita: string;

  burger = false;
  displayHelp = false;
  elencoCard: BaseCard[];
  typeApplication = TypeApplicationCard.Home;
  testoHelp: string = '';
  hasUtente: boolean;

  unreadCount: number = 1;

  constructor(
    private translateService: TranslateService,
    private logService: LogService,
    private decodificaService: DecodificaPublicPslpService,
    //private securityService: SecurityPslpService,
    private readonly router: Router,
    private spidUserService: SpidUserService,
    private utenteService: UtenteService,
    private appUserService: AppUserService,
    private privacyService:PrivacyService,
    private promptModalService:PromptModalService,
    private lavoratoreService:LavoratorePslpService,
    private cvBagService:CvitaeService,
    private commonService:CommonService,
    private readonly pslpshareService: PlspshareService,
  ) {
    //TODO: quando saranno le notifiche anche su TU cancellara il controllo
    // Controlliamo l'URL per determinare se mostrare le notifiche
    // const currentUrl = window.location.href;
    // this.showNotifiche = !currentUrl.includes('tu-pslp.regione.piemonte.it');
  }

  /*get hasUtente(): boolean{
    return !!this.spidUserService.getUser();
  }*/
  get descrizioneUtente() {
    return this.hasUtente
      ? (this.spidUserService.getUser() as UserInfo).codFisc
      : 'Descrizione utente';
  }

  get nomeUtente() {
    return this.hasUtente
      ? `${this.spidUserService.getUser().nome} - ${
          this.spidUserService.getUser().cognome
        }`
      : 'Nome utente';
  }

  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  onRuoloChange(){
    this.decodificaService.findFunzioneByIdruolo(this.ruoloUtente?.idRuolo).subscribe({
      next: (res: any) => {
        this.elencoCard = res.list.map((elemento: Funzione) => ({
          id: elemento.idFunzione,
          titolo: elemento.titoloFunzione,
          icon: elemento.iconaFunzione,
          testoCard: elemento.sottotitoloFunzione,
          flgAccessoAutenticato: elemento.idFunzione!=4,
        }));
      }
    });
  }


  ngOnInit(): void {

    console.log("header",this.ruoloUtente);
    this.translateService.setDefaultLang('it');
    this.translateService.use('it');
    this.spidUserService.userUpdate.subscribe((r) => {
      if (r) this.hasUtente = true;
      else this.hasUtente = false;
    });
    //this.onAccediLink();
    if(this.ruoloUtente){
    this.decodificaService.findFunzioneByIdruolo(this.ruoloUtente.idRuolo).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          this.elencoCard = res.list.map((elemento: Funzione) => ({
            id: elemento.idFunzione,
            titolo: elemento.titoloFunzione,
            icon: elemento.iconaFunzione,
            testoCard: elemento.sottotitoloFunzione,
            flgAccessoAutenticato: elemento.idFunzione!=4,
          }));
          //this.elencoCard = res.list;
        }else{

        }
        //this.logService.info("prova", res.esitoPositivo,this.elencoCard)
      },
      error: (err) => {
        this.logService.error(
          this.constructor.name,
          `findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`
        );

      },
      complete: () => {
        //  this.spinner.hide();
      },
    });
    }else{
      this.decodificaService.findFunzione().subscribe({
        next: (res: any) => {
          if (res.esitoPositivo) {
            this.elencoCard = res.list.map((elemento: Funzione) => ({
              id: elemento.idFunzione,
              titolo: elemento.titoloFunzione,
              icon: elemento.iconaFunzione,
              testoCard: elemento.sottotitoloFunzione,
              flgAccessoAutenticato: elemento.idFunzione!=4,
            }));
            //this.elencoCard = res.list;
          }else{

          }
          //this.logService.info("prova", res.esitoPositivo,this.elencoCard)
        },
        error: (err) => {
          this.logService.error(
            this.constructor.name,
            `findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`
          );

        },
        complete: () => {
          //  this.spinner.hide();
        },
      });
    }
  }

  onHome() {
    const thisPath = window.location.href;
    this.urlUscita = '/pslphome/home-page';
    if (
      //thisPath.indexOf('/riepilogo') < 0 &&
      thisPath.indexOf('/home-page') < 0 &&
      //thisPath.indexOf('/mappa') < 0 &&
      thisPath.indexOf('/login') < 0 &&
      thisPath.indexOf('/assistenza') < 0 &&
      //thisPath.indexOf('/iscrizione-garanzia') < 0 &&
      thisPath.indexOf('/page-not-found') < 0 &&
      thisPath.indexOf('/error-page') < 0
    ) {
      this.openModalHome();
    } else {
      this.goHome();
    }
  }
  async openModalHome() {
    const data: DialogModaleMessage = {
      titolo : 'Torna alla Home Page',
      messaggio: 'Sei sicuro di voler tornare alla home page?',
      tipo:  TypeDialogMessage.YesOrNo,
      messaggioAggiuntivo: 'Eventuali dati non confermati e salvati saranno perduti.'
    };
    const result = await this.pslpshareService.openModal(data);
    if (result === 'SI') {
      this.goHome();
    }
  }
  goHome() {

    this.router.navigateByUrl(this.urlUscita);
  }

  async openModalExit() {
    const data: DialogModaleMessage = {
      titolo : 'Logout',
      messaggio: 'Sei sicuro di voler uscire dal servizio?',
      tipo:  TypeDialogMessage.YesOrNo,
      messaggioAggiuntivo: 'Eventuali dati non confermati e salvati saranno perduti.'
    };
    const result = await this.pslpshareService.openModal(data);
    if (result === 'SI') {
      this.onExit();
    }
  }

  onExit() {
    //this.openModalExit();
    sessionStorage.clear();
    this.spidUserService.nullifyUser();
    window.location.href = environment.shibbolethSSOLogoutURL;
    //this.router.navigateByUrl('');
    // return false;
  }
  async openModalCambiaCittadino() {

    const res = await this.promptModalService.openSelezionareCittadino("Selezionare cittadino");
    console.log(res)
    if(res){
      sessionStorage.removeItem("cvitae")
      this.cvBagService.updateSelectedCv(null)
      this.cvBagService.cvitaeActual=null
      this.cvBagService.setAzioneActual(null)
      this.commonService.clearFascicolo()
      sessionStorage.removeItem("azionecv")
      sessionStorage.removeItem("idBlpAnagrafica")
    }
    this.router.navigateByUrl("");

}
  onAccediLink() {

    if(this.hasUtente){
      this.utenteService.self().subscribe({
        next: (res: any) => {
          if (res.esitoPositivo) {
            if (res.utente.ruoli.length > 1 && !this.ruoloUtente) {

              this.router.navigateByUrl('/pslphome/scelta-ruolo');
            } else if(res.utente.ruoli.length == 1 && res.utente.ruoli[0].nomeRuolo=="Cittadino"){
              this.appUserService.setRuolo(res.utente.ruoli[0])
            }
            let utente: Utente = res.utente;
            this.appUserService.setUtente(utente);

            let userInfo: UserInfo = {
              nome: utente.nome,
              cognome: utente.cognome,
              codFisc: utente.cfUtente,
              ente: utente.cfUtente,
              livAuth: 1,
              community: '',
            };

            this.spidUserService.setUser(userInfo);
            if(utente.idSilLavAnagrafica){
              this.lavoratoreService.findSuntoLavoratore(utente.idSilLavAnagrafica).subscribe({
                next:ris=>{
                  if(ris.esitoPositivo){
                      this.appUserService.setSuntoLavoratore(ris.suntoEsteso.sunto)
                    }
                }
              })
            }
          }else{
            const data: DialogModaleMessage = {
              titolo: "Altre informazioni",
              tipo: TypeDialogMessage.Back,
              messaggio: res.apiMessages[0].message,
              messaggioAggiuntivo: " ",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data);
          }
          //this.logService.info("prova", res.esitoPositivo,this.elencoCard)
        },
        error: (err) => {
          this.logService.error(
            this.constructor.name,
            `fake login: ${this.constructor.name}: ${JSON.stringify(err)}`
          );
        },
        complete: () => {
          //  this.spinner.hide();
        },
      });
    }else{
      this.router.navigateByUrl("pslpfcweb/private/home-page");

      return;
    }
    // this.securityService.jumpToURL('/accesso-spid-landing', TypeApplicationCard.Fascicolo);
  }

  onCambiaRuolo() {
    //this.appUserService.setRuolo(undefined);
    this.router.navigateByUrl('pslphome/scelta-ruolo');
  }
  get isPslpHome() {
    return this.router.url.includes('pslphome');
  }

  get titolo() {
    if (this.router.url.includes('/privacy/'))
      return 'Gestione Privacy e Deleghe';
    if (this.router.url.includes('/fascicolo/'))
      return 'Gestione Fascicolo del cittadino';
    if (this.router.url.includes('/deleghe/')) return 'Gestione Deleghe';
    if (this.router.url.includes('/did/'))
      return "Gestione Dichiarazione Immediata Disponibilita' (DID)";
    if (this.router.url.includes('/incontro-domanda-offerta'))
        return "Gestione Incontro Domanda Offerta";
    if (this.router.url.includes('/cvitae'))
      return "Gestione Curriculum Vitae";
    if (this.router.url.includes('/error'))
      return "Errore";
    return 'I servizi per il cittadino';
  }
  rilasciaDelega() {
      sessionStorage.removeItem("fascicolo")
      sessionStorage.removeItem("cvitae")
      sessionStorage.removeItem("azionecv")
      sessionStorage.removeItem("idBlpAnagrafica")
      sessionStorage.removeItem("AppUserService.utentefor")
      this.router.navigateByUrl("pslpfcweb/private/home-page");
  }
  get canChangeRuolo(){
    return this.appUserService.getUtente()?.ruoli.length>1
  }

  get isOperatore(){
    return this.appUserService.getRuoloSelezionato()?.idRuolo>0
  }

  get delegaPresente(){
    return this.appUserService.getUtenteOperateFor()
  }
}
