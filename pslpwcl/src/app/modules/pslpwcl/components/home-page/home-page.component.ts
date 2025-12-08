/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Inject, Input, OnInit, Optional} from '@angular/core';
import { Router } from '@angular/router';
import { TypeLinkCard } from 'src/app/modules/pslpwcl-common/models/type-link-card';
import { BaseCard } from 'src/app/modules/pslpwcl-common/models/base-card';
import { LogService } from 'src/app/services/log.service';
import { DecodificaResponse, Funzione, Messaggio, RuoloFunzione, Utente, UtenteService } from 'src/app/modules/pslpapi';
import { DecodificaPublicPslpService } from 'src/app/modules/pslpapi';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { SessionStorageService } from 'src/app/services/storage/session-storage.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { UserInfo } from 'src/app/modules/pslpwcl-common/models/userInfo';
import { LavoratorePslpService } from 'src/app/modules/pslpapi';
import { TYPE_ALERT } from 'src/app/constants';

@Component({
  selector: 'pslpwcl-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  @Input() subheaderContent = 'I servizi per il cittadino';

  elencoCard: Array<BaseCard>=[];
  flgAccesso: boolean;
  msgAccesso: string;
  hasUtente: boolean;
  escapeHtml: string = "";
  decoficaServiceResponse: Messaggio;
  isLoadingUser: boolean = false; // Flag per prevenire click multipli
  private spinnerTimeout: any; // Timeout di sicurezza per lo spinner



  constructor(
    private readonly router: Router,
    private spinner: NgxSpinnerService,
    private logService: LogService,
    private decodificaService: DecodificaPublicPslpService,
    private utenteService: UtenteService,
    private readonly spidUserService: SpidUserService,
    private promptModalService:PromptModalService,
    private sessionStorage: SessionStorageService,
    private readonly appUserService:AppUserService,
    private lavoratoreService: LavoratorePslpService,
  ) {
      if(this.router.url != "/pslphome/home-page"){
        this.decoficaServiceResponse = {};
        this.spidUserService.userUpdate.subscribe(
          r=>{
            if(r){
              this.hasUtente=true;
              this.showSpinnerWithTimeout();

              this.utenteService.self().subscribe({
                next: (res: any) =>{
                  this.logService.info(this.constructor.name,'risposta positiva');
                  this.logService.info(this.constructor.name,res);
                  if(res.esitoPositivo){
                    let utente:Utente = res.utente;
                  }
                },
                error: (err) =>{
                  this.logService.error(this.constructor.name,`findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`);
                  this.hideSpinnerSafe();
                },
                complete: () =>{
                  this.hideSpinnerSafe();
                }
              })
            }else{
              if(!sessionStorage.getItem("utentelogato")){
                this.hasUtente=false;
                sessionStorage.setItem("utentelogato","true");
                window.location.reload();
              }else{
                this.showSpinnerWithTimeout();

                this.utenteService.self().subscribe({
                  next: (res: any) => {
                    if (res.esitoPositivo) {
                      if (res.utente.ruoli.length > 1 && !this.ruoloUtente) {
                        // Mantieni lo spinner attivo durante la navigazione
                        this.logService.info(this.constructor.name, 'Navigazione verso scelta-ruolo in corso...');
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
                          },
                          error: (err) => {
                            this.logService.error(this.constructor.name, `findSuntoLavoratore error: ${JSON.stringify(err)}`);
                          },
                          complete: () => {
                            // Nascondi spinner solo se non stiamo navigando verso scelta-ruolo
                            if (!(res.utente.ruoli.length > 1 && !this.ruoloUtente)) {
                              this.hideSpinnerSafe();
                            }
                          }
                        })
                      } else {
                        // Nascondi spinner solo se non stiamo navigando verso scelta-ruolo
                        if (!(res.utente.ruoli.length > 1 && !this.ruoloUtente)) {
                          this.hideSpinnerSafe();
                        }
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
                      this.hideSpinnerSafe();
                    }
                  },
                  error: (err) => {
                    this.logService.error(
                      this.constructor.name,
                      `fake login: ${this.constructor.name}: ${JSON.stringify(err)}`
                    );
                    this.hideSpinnerSafe();
                  },
                  complete: () => {
                    // Lo spinner viene nascosto nei vari casi sopra
                  },
                });
              }
            }
          }
        );
      }
  }

  ngOnInit(): void {
    this.showSpinnerWithTimeout();
    this.flgAccesso = true;

    // Contatore per gestire lo spinner quando ci sono chiamate multiple
    let pendingCalls = 0;

    const hideSpinnerIfDone = () => {
      pendingCalls--;
      if (pendingCalls <= 0) {
        this.hideSpinnerSafe();
      }
    };

    //this.hasUtente = !!this.spidUserService.getUser();
    this.spidUserService.userUpdate.subscribe(
      r=>{
        if(r){
          this.hasUtente=true;
          pendingCalls++;
          this.utenteService.self().subscribe({
            next: (res: any) =>{
              this.logService.info(this.constructor.name,'risposta positiva');
              this.logService.info(this.constructor.name,res);
              if(res.esitoPositivo){
                let utente:Utente = res.utente;
              }
              this.logService.info("prova", res.esitoPositivo,this.elencoCard)
            },
            error: (err) =>{
              this.logService.error(this.constructor.name,`findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`);
              hideSpinnerIfDone();
            },
            complete: () =>{
              hideSpinnerIfDone();
            }
          })
        }else{
          this.hasUtente=false
        }
      }
    )

    if(this.ruoloUtente){
      pendingCalls++;
      this.decodificaService.findFunzioneByIdruolo(this.ruoloUtente?.idRuolo).subscribe({
        next: (res: any) =>{
          this.logService.info(this.constructor.name,'risposta positiva');
          if(res.esitoPositivo){
            this.elencoCard = res.list.map(((elemento:Funzione) => ({id: elemento.idFunzione, titolo: elemento.titoloFunzione, icon: elemento.iconaFunzione, testoCard: elemento.sottotitoloFunzione, flgAccessoAutenticato:elemento.idFunzione!=4})))
              //this.elencoCard = res.list;
          }
          this.logService.info("prova", res.esitoPositivo,this.elencoCard)
        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`);
          hideSpinnerIfDone();
        },
        complete: () =>{
          hideSpinnerIfDone();
        }
      })
    }else{
      pendingCalls++;
      this.decodificaService.findFunzione().subscribe({
        next: (res: any) =>{
          this.logService.info(this.constructor.name,'risposta positiva');
          if(res.esitoPositivo){
            this.elencoCard = res.list.map(((elemento:Funzione) => ({id: elemento.idFunzione, titolo: elemento.titoloFunzione, icon: elemento.iconaFunzione, testoCard: elemento.sottotitoloFunzione, flgAccessoAutenticato:elemento.idFunzione!=4})))
              //this.elencoCard = res.list;
          }
          this.logService.info("prova", res.esitoPositivo,this.elencoCard)
        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`);
          hideSpinnerIfDone();
        },
        complete: () =>{
          hideSpinnerIfDone();
        }
      })
    }



  }

  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

  /**
   * Mostra lo spinner con timeout di sicurezza
   */
  private showSpinnerWithTimeout(): void {
    this.spinner.show();
    this.isLoadingUser = true;

    // Timeout di sicurezza: forza la chiusura dello spinner dopo 30 secondi
    if (this.spinnerTimeout) {
      clearTimeout(this.spinnerTimeout);
    }

    this.spinnerTimeout = setTimeout(() => {
      this.logService.error(this.constructor.name, 'Timeout spinner - forzatura chiusura dopo 30 secondi');
      this.hideSpinnerSafe();
    }, 30000);
  }

  /**
   * Nasconde lo spinner in modo sicuro
   */
  private hideSpinnerSafe(): void {
    if (this.spinnerTimeout) {
      clearTimeout(this.spinnerTimeout);
      this.spinnerTimeout = null;
    }

    try {
      this.spinner.hide();
    } catch (e) {
      this.logService.error(this.constructor.name, 'Errore durante la chiusura dello spinner: ' + e);
    }

    this.isLoadingUser = false;
  }



  onGotoLink(el: BaseCard) {
    // Previeni click multipli se sta già caricando
    if(this.isLoadingUser) {
      this.logService.info(this.constructor.name, 'Caricamento in corso, attendere...');
      return;
    }

    if(el.flgAccessoAutenticato && !this.hasUtente){
      // Mostra spinner durante il redirect alla pagina di login
      this.showSpinnerWithTimeout();
      this.logService.info(this.constructor.name, 'Redirect a pagina di login...');
      this.router.navigateByUrl("pslpfcweb/private/home-page");
      return;
    }

    this.logService.log("HomePageComponent", "onGotoLink", el);

    // Mostra spinner durante la navigazione
    this.showSpinnerWithTimeout();

    // da gestire l'applicazione qui dentro.
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    const idNumerico = typeof el.id === 'string' ? parseInt(el.id) : el.id;

    switch(idNumerico){
      case 1:
        this.router.navigateByUrl("pslpfcweb/private/privacy/riepilogo-privacy");
        break;
      case 2:
        this.router.navigateByUrl("pslpfcweb/private/fascicolo/riepilogo-fascicolo");
        break;
      case 3:
        this.router.navigateByUrl("pslpfcweb/private/did/riepilogo-did");
        break;
      case 4:
        this.router.navigateByUrl("pslpfcweb/cvitae/incontro-domanda-oferta");
        break;
      case 5:
        this.router.navigateByUrl("pslpfcweb/private/documenti/riepilogo-documenti");
        break;
      case 6:
        this.router.navigateByUrl("pslpfcweb/private/incontri/riepilogo-incontri");
        break;
    }
  }

}
