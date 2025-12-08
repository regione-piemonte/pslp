/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { FascicoloPslpService, MessaggioService, Privacy, PrivacyService, PslpMessaggio } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-main-incontri',
  templateUrl: './main-incontri.component.html',
  styleUrls: ['./main-incontri.component.scss']
})
export class MainIncontriComponent implements OnInit {

  sezione = "Appuntamenti";
  loaded = false;
  messaggioIntestazione: PslpMessaggio;
  elencoPrivacyUtente: Privacy[];
  messaggio: PslpMessaggio;
  erroreE37: PslpMessaggio;

  constructor(
    private router: Router,
    private readonly appUserService: AppUserService,
    private commonService: CommonService,
    private privacyService: PrivacyService,
    private promptModalService: PromptModalService,
    private spinner: NgxSpinnerService,
    private fascicoloService: FascicoloPslpService,
    private messagioService: MessaggioService,
  ) {
    const ruolo = this.appUserService.getRuoloSelezionato();
    if (ruolo.idRuolo !== 7 && this.utente) {
      this.messagioService.findByCod("E37").subscribe({
        next: (res: any) => {
          this.erroreE37 = res.msg;
          this.controlloFascicolo();
        }
      });
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
                titolo: "Gestione Documentazione",
                tipo: TypeDialogMessage.YesOrNo,
                messaggio: "PRIVACY DA CONFERMARE PER DOCUMENTAZIONE</br></br> Scegliendo SI, " +
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

  controlloFascicolo() {
    if (this.utente.idSilLavAnagrafica) {
      if (!this.commonService.fascicoloActual) {
        this.fascicoloService.getDettaglioFascicolo(this.utente.idSilLavAnagrafica).subscribe({
          next: async res => {

            if (res.esitoPositivo && res.fascicolo) {
              this.commonService.fascicoloActual = res.fascicolo
            } else {
              const data: DialogModaleMessage = {
                titolo: this.erroreE37?.descrMessaggio,
                tipo: TypeDialogMessage.Back,
                messaggio: this.erroreE37?.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.WARNING
              };
              const result = await this.promptModalService.openModaleConfirm(data);
              if (result) {
                this.router.navigateByUrl("/pslphome/home-page")
              }
            }
          }
        })
      }
    } else {
      const data: DialogModaleMessage = {
        titolo: this.erroreE37?.descrMessaggio,
        tipo: TypeDialogMessage.Back,
        messaggio: this.erroreE37?.testo,
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
      };
      const result = this.promptModalService.openModaleConfirm(data);
      if (result) {
        this.router.navigateByUrl("/pslphome/home-page")
      }
    }
  }

  ngOnInit(): void {
    this.commonService.getMessaggioByCode("I45").then(messaggio => {
      this.messaggioIntestazione = messaggio;
    });
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
    return "Incontri";
  }

}
