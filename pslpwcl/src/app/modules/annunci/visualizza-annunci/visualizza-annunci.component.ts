/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from 'src/app/services/log.service';
import { AnnunciPublicPslpService, AnnunciService, Candidatura, CollegamentoAnnuncioCandidaturaRequest, CvService, DecodificaPublicPslpService, ElencoCVRequest, LavoratorePslpService, MessaggioService, Privacy, PrivacyService, PslpMessaggio, Vacancy } from '../../pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { DialogModaleMessage } from '../../pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from '../../pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { PromptModalService } from '../../pslpwcl-common/services/prompt-modal.service';

@Component({
  selector: 'pslpwcl-visualizza-annunci',
  templateUrl: './visualizza-annunci.component.html',
  styleUrls: ['./visualizza-annunci.component.scss']
})
export class VisualizzaAnnunciComponent implements OnInit {

  idAnnuncio: number;
  annuncio: Vacancy
  titolo: string;
  cvList: Candidatura[] = [];
  idCandidatura: number;
  elencoPrivacyUtente: Privacy[];
  erroreE46: PslpMessaggio;
  constructor(
    private router: Router,
    private annunciService: AnnunciService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private readonly appUserService: AppUserService,
    private cvService: CvService,
    private promptModalService: PromptModalService,
    private lavoratorePslpService: LavoratorePslpService,
    private privacyService: PrivacyService,
    private messagioService: MessaggioService,
    private annunciServicePublic: AnnunciPublicPslpService,
    private decodificaPublicService: DecodificaPublicPslpService,
    private route: ActivatedRoute,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.idAnnuncio = state['idAnnuncio'];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.idAnnuncio = idParam;
        this.showPage();
      }
      else {
        this.showPage();
      }
    });
  }

  showPage(): void {
    this.getDettaglioAnnuncio(this.idAnnuncio);
    if (this.isAutenticato) {
      this.messagioService.findByCod("E46").subscribe({
        next: (res: any) => {
          this.erroreE46 = res.msg;
        }
      });
    } else {
      this.decodificaPublicService.findByCodPublic("E46").subscribe(
        (r: any) => this.erroreE46 = r.msg
      );
    }
  }

  tornaAiRisultati(): void {
    this.router.navigate(['/pslpfcweb/consulta-annunci/EURES']);
  }

  getDettaglioAnnuncio(id: number): void {
    if (this.isAutenticato) {
      this.spinner.show();
      this.annunciService.getDettaglioAnnuncio(id).subscribe({
        next: (res) => {
          if (res.esitoPositivo) {
            this.annuncio = res?.annuncio;
          }
        },
        error: (error) => {
          this.logService.error(this.constructor.name, `errore: ${error}`);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.annunciServicePublic.getDettaglioAnnuncio1(id).subscribe({
        next: (res) => {
          if (res.esitoPositivo) {
            this.annuncio = res?.annuncio;
          }
        },
        error: (error) => {
          this.logService.error(this.constructor.name, `errore: ${error}`);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }


  public getPubblicatoDa() {
    if (!this.annuncio?.idIntermediario && !this.annuncio?.idIntermediario?.idCpi) {
      return this.annuncio?.idAziAnagrafica?.denominazione
    } else if (this.annuncio?.idIntermediario && this.annuncio?.idIntermediario?.idCpi && !this.annuncio?.idServizioSpecialistico?.idServizioSpecialistico) {
      return  'CPI DI ' + this.annuncio?.idIntermediario?.dsIntermediario
    } else if (this.annuncio?.idIntermediario && this.annuncio?.idIntermediario?.idCpi && this.annuncio?.idServizioSpecialistico?.idServizioSpecialistico) {
      return this.annuncio?.idServizioSpecialistico?.descrServizioSpecialistico
    } else if (this.annuncio?.idIntermediario && !this.annuncio?.idIntermediario?.idCpi) {
      return 'CPI DI ' + this.annuncio?.idIntermediario?.dsIntermediario
    }
    return ''
  }

  async onClickInserisci() {
    if (this.isAutenticato) {
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
                titolo: "Gestione Annunci",
                tipo: TypeDialogMessage.YesOrNo,
                messaggio: "PRIVACY DA CONFERMARE PER ANNUNCI</br></br> Scegliendo SI, " +
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
            } else {
              const msg = 'Si vuole procedere con l\'invio della candidatura?';
              const data: DialogModaleMessage = {
                titolo: "Inserisci e conferma candidatura",
                tipo: TypeDialogMessage.YesOrNo,
                messaggio: msg,
                messaggioAggiuntivo: "",
                size: "lg",
                tipoTesto: TYPE_ALERT.WARNING
              };

              const result = await this.promptModalService.openModaleConfirm(data);
              if (result === 'SI') {
                this.ricercaLavoratore();
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
    } else {
      const data: DialogModaleMessage = {
        titolo: this.erroreE46.descrMessaggio,
        tipo: TypeDialogMessage.Confirm,
        messaggio: this.erroreE46.testo,
        messaggioAggiuntivo: "",
        size: "lg",
        tipoTesto: TYPE_ALERT.ERROR
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result) {
        this.router.navigateByUrl('/pslpfcweb/private/home-page');
      }
    }
  }

  ricercaLavoratore() {
    this.lavoratorePslpService.findLavoratore(this.utente.idSilLavAnagrafica).subscribe(
      {
        next: async ris => {
          if (ris.esitoPositivo) {
            const numTelefonoLavoratore = ris.lavoratore.dsTelefonoCell;
            this.elencoCV(numTelefonoLavoratore);
          } else {
            const data: DialogModaleMessage = {
              titolo: "Lavoratore non presente",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "Lavoratore non presente nella banca dati",
              messaggioAggiuntivo: "",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            const result = await this.promptModalService.openModaleConfirm(data);
            if (result) {
              return;
            }
          }
        }
      }
    );
  }

  elencoCV(numtelefono: string) {
    let elencoCvRequest: ElencoCVRequest = {
      codiceFiscale: this.utente.cfUtente,
      callInfo: undefined,
      statoCv: 'V'
    }

    this.cvService.getElencoCvForLavAnagrafica(elencoCvRequest).subscribe(
      {
        next: async ris => {
          if (ris.esitoPositivo && ris.blpDCandidature.length > 0) {
            this.cvList = ris.blpDCandidature;
            this.inserisciCandidatura(ris.blpDCandidature[0].id);
          } else {
            const data: DialogModaleMessage = {
              titolo: "Generare CV automatico",
              tipo: TypeDialogMessage.YesOrNo,
              messaggio: "Non è stato trovato un cv valido. Procedere alla creazione del cv automatico?",
              messaggioAggiuntivo: "",
              size: "lg",
              tipoTesto: TYPE_ALERT.WARNING
            };
            const result = await this.promptModalService.openModaleConfirm(data);
            if (result === 'SI' && numtelefono) {
              this.creaCvAutomatico();
            } else {
              const data: DialogModaleMessage = {
                titolo: "Numero di telefono non presente",
                tipo: TypeDialogMessage.Confirm,
                messaggio: "Numero di telefono non presente. Non è possibile procedere con la generazione del cv automatico",
                messaggioAggiuntivo: "",
                size: "lg",
                tipoTesto: TYPE_ALERT.ERROR
              };
              const result = await this.promptModalService.openModaleConfirm(data);
              if (result) {
                return;
              }
            }
          }
        }
      }
    );
  }

  creaCvAutomatico() {
    let request: any = {
      idSilLavAnagrafica: this.utente.idSilLavAnagrafica
    }
    this.cvService.generaCvAutomatico(request).subscribe({
      next: async res => {
        if (res.esitoPositivo) {
          const data: DialogModaleMessage = {
            titolo: "Generazione CV",
            tipo: TypeDialogMessage.YesOrNo,
            messaggio: "CV generato con successo. Procedere con l'invio della candidatura?",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.WARNING
          };
          const result = await this.promptModalService.openModaleConfirm(data);
          if (result === 'SI') {
            this.inserisciCandidatura(res.blpDCandidatura.id);
          }
        } else {
          const data: DialogModaleMessage = {
            titolo: "Generazione CV",
            tipo: TypeDialogMessage.Continue,
            messaggio: "Errore durante la generazione del CV",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.ERROR
          };
          this.promptModalService.openModaleConfirm(data);
          return;
        }
      }
    })
  }

  inserisciCandidatura(idCandidatura: number) {
    const request: CollegamentoAnnuncioCandidaturaRequest = {
      vacancyCandid: {
        d_vacancy_candidatura: new Date(),
        id_vacancy: this.annuncio.id,
        id_candidatura: idCandidatura,
        dInserim: undefined,
        idVacancyCandid: null
      },
      callInfo: undefined
    }

    this.annunciService.insertCollegamentoAnnuncioCandidatura(request).subscribe(
      {
        next: res => {
          if (res.esitoPositivo) {
            const data: DialogModaleMessage = {
              titolo: "Inserimento candidatura",
              tipo: TypeDialogMessage.Continue,
              messaggio: "Candidatura inserita con successo",
              messaggioAggiuntivo: "",
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data);
            this.router.navigate(['/pslpfcweb/consulta-annunci/EURES']);
          } else {
            const data: DialogModaleMessage = {
              titolo: res?.apiMessages[0]?.title,
              tipo: TypeDialogMessage.Continue,
              messaggio: res?.apiMessages[0]?.message,
              messaggioAggiuntivo: "",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data)
          }
        }
      }
    );
  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

}
