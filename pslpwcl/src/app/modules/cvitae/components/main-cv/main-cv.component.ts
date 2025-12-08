/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Privacy, MessaggioService, PrivacyService, PslpMessaggio, FascicoloPslpService } from 'src/app/modules/pslpapi';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { DecodificaPublicPslpService } from 'src/app/modules/pslpapi';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';

@Component({
  selector: 'pslpwcl-main-cv',
  templateUrl: './main-cv.component.html',
  styleUrls: ['./main-cv.component.scss']
})
export class MainCvComponent implements OnInit {
  sezione = "IDO";
  loaded = false;
  elencoPrivacyUtente: Privacy[];
  messaggio: PslpMessaggio;
  isIncontroDomandaOferta: boolean = false;
  constructor(
    private readonly utilitiesService: UtilitiesService,
    private router: Router,
    private readonly appUserService: AppUserService,
    private fascicoloService: FascicoloPslpService,
    private promptModalService: PromptModalService,
    private commonService: CommonService,
    private messaggioService: MessaggioService,
    private decodificaPublicService: DecodificaPublicPslpService,
    private privacyService: PrivacyService
  ) {
    //if(!appUserService.getUtenteOperateFor() && this.utente){
    if (this.utente) {
      this.privacyService.privacyUtenteCollegato(this.utente.idUtente).subscribe(
        {
          next: async (res: any) => {
            if (res.esitoPositivo)
              this.elencoPrivacyUtente = res.utentePrivacy;
            let chkPrivacy = false
            res.utentePrivacy.forEach((privacy: any) => {
              if (((!!privacy?.pslpTUtente1 || !!privacy?.pslpTUtente2) && (privacy.pslpDPrivacy && privacy.pslpDPrivacy.codPrivacy == "PRV"))) {
                chkPrivacy = true
              }
            })
            if (!chkPrivacy) {
              const data: DialogModaleMessage = {
                titolo: "Gestione Fascicolo",
                tipo: TypeDialogMessage.YesOrNo,
                messaggio: "PRIVACY DA CONFERMARE PER FASCICOLO</br></br> Scegliendo SI, " +
                  "il sistema reindirizzerà automaticamente alla GESTIONE PRIVACY, " +
                  "dove sarà possibile prendere visione e accettare l'informativa sulla Privacy.</br></br>" +
                  "Successivamente, sarà possibile operare con la funzionalita selezionata.</br>",
                messaggioAggiuntivo: "Scegliendo NO, il sistema non permetterà di proseguire. ",
                size: "lg",
                tipoTesto: TYPE_ALERT.WARNING
              };
              const result = await this.promptModalService.openModaleConfirm(data);
              if (result == "SI") {
                this.router.navigateByUrl("/pslpfcweb/private/privacy/riepilogo-privacy")

              } else {
                this.router.navigateByUrl("/pslphome/home-page")
                return
              }
            }

          },
          error: (err) => {

          },
          complete: () => {
            //  this.spinner.hide();
          }
        }
      )
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("utentelogato")) {
      if (!this.commonService.fascicoloActual) {
        this.commonService.clearFascicolo()
        if (this.utente?.idSilLavAnagrafica) {
          this.fascicoloService.getDettaglioFascicolo(this.utente?.idSilLavAnagrafica).subscribe({
            next: (r: any) => {
              if (r.esitoPositivo) {
                this.commonService.fascicoloActual = r.fascicolo;
              }
            }
          })
        }
      }

      if (this.router.url.includes('incontro-domanda-offerta')) {
        this.decodificaPublicService.findByCodPublic("I6").subscribe(
          (r: any) => this.messaggio = r.msg
        );
        this.isIncontroDomandaOferta = true;
      } else {
        this.decodificaPublicService.findByCodPublic("I5").subscribe(
          (r: any) => this.messaggio = r.msg
        );
        this.isIncontroDomandaOferta = false;
      }
    } else {
      if (this.router.url.includes('incontro-domanda-offerta')) {
        this.decodificaPublicService.findByCodPublic("I6").subscribe(
          (r: any) => this.messaggio = r.msg
        );
        this.isIncontroDomandaOferta = true;
      }
    }



    /* this.messaggio = {
       intestazione: "Da recuperare da DB",
       testo: "Da recuperare da DB"
     }*/

  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }




  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  navigateTo(url: string) {
    this.router.navigateByUrl("/pslpfcweb/private/" + url);
  }
  get miniTitolo() {
    return "CV";
  }

  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

}
