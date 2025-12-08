/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { AnnunciService, CollegamentoAnnuncioCandidaturaListRequest, CollegamentoAnnuncioCandidaturaListResponse, CollegamentoAnnuncioCandidaturaRequest, VacancyCandid } from '../../pslpapi';
import { DialogModaleMessage } from '../../pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from '../../pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from '../../pslpwcl-common/services/prompt-modal.service';
import { CustomCandidatureService } from '../services/custom-candidature.service';

@Component({
  selector: 'pslpwcl-riepilogo-candidature',
  templateUrl: './riepilogo-candidature.component.html',
  styleUrls: ['./riepilogo-candidature.component.scss']
})
export class RiepilogoCandidatureComponent implements OnInit {

  candidatureList: any[] = [];
  nonDomiciliatoPiemonte = true;
  nessunRisultato: boolean = false;

  constructor(
    private annunciService: AnnunciService,
    private readonly appUserService: AppUserService,
    private spinner: NgxSpinnerService,
    private logService: LogService,
    private promptModalService: PromptModalService,
    private customCandidatureService: CustomCandidatureService,
    private utilitiesService: UtilitiesService,
  ) { }

  ngOnInit(): void {
    this.elencoCandidature();
  }

  elencoCandidature() {
    if (this.utente?.idSilLavAnagrafica) {

      this.spinner.show();

      let elencoCandidatureRequest: CollegamentoAnnuncioCandidaturaListRequest = {
        idSilLavAnagrafica: this.utente.idSilLavAnagrafica,
        callInfo: undefined
      };

      this.annunciService.elencoCollegamentoAnnuncioCandidatura(elencoCandidatureRequest).subscribe({
        next: (res: any) => {
          if (res.esitoPositivo && res.vacancyCandidList) {
            this.candidatureList = res.vacancyCandidList;
          } else {
            this.candidatureList = [];
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 0);

        },
        error: err => {
          this.candidatureList = [];
          console.error("Errore nel caricamento delle candidature", err);
          this.spinner.hide();
        }
      });
    }
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

  async onClickAccetta(el: VacancyCandid) {
    // const msg = this.messageService.getKeyValueByCod("CAND08", MSG.KEY.DESC);
    const data: DialogModaleMessage = {
      titolo: "Accetta candidatura",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: 'Sei sicuro di accettare la candidatura?',
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      const request: CollegamentoAnnuncioCandidaturaRequest = {
        idStatoVacancyCandidDaImpostare: 3,
        vacancyCandid: {
          idVacancyCandid: el.vacancyCandidStatoList[0].idVacancyCandid,
          codUserAggiorn: '',
          codUserInserim: '',
          dAggiorn: undefined,
          dInserim: undefined,
          d_vacancy_candidatura: undefined,
          id_vacancy: 0
        },
        callInfo: undefined
      };
      this.annunciService.aggiornaStatoCollegamentoAnnuncioCandidatura(request).subscribe({
        next: (res: any) => {
          if (res.esitoPositivo) {
            this.elencoCandidature();
            const data: DialogModaleMessage = {
              titolo: "Stato aggiornato con successo",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "La candidatura è stata accettata",
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.spinner.show();

          } else {
            const data: DialogModaleMessage = {
              titolo: "Operazione fallita",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "Operazione fallita",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data)
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.logService.error(this.constructor.name, `onClickAccetta error: ${JSON.stringify(error)}`);
          this.spinner.hide();
        }
      });
    }

  }

  async onClickRitira(el: VacancyCandid) {
    // const msg = this.messageService.getMessage("CAND07");
    // const msg = this.messageService.getKeyValueByCod("CAND07", MSG.KEY.DESC);
    const data: DialogModaleMessage = {
      titolo: "Ritirare candidatura",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler ritirare la candidatura?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      const request: CollegamentoAnnuncioCandidaturaRequest = {
        idStatoVacancyCandidDaImpostare: 6,
        vacancyCandid: {
          idVacancyCandid: el.vacancyCandidStatoList[0].idVacancyCandid,
          codUserAggiorn: '',
          codUserInserim: '',
          dAggiorn: undefined,
          dInserim: undefined,
          d_vacancy_candidatura: undefined,
          id_vacancy: 0
        },
        callInfo: undefined
      };
      this.annunciService.aggiornaStatoCollegamentoAnnuncioCandidatura(request).subscribe({
        next: (res: any) => {
          if (res.esitoPositivo) {
            const data: DialogModaleMessage = {
              titolo: "Stato aggiornato con successo",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "La candidatura è stata ritirata",
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.spinner.show();
            this.elencoCandidature();


          } else {
            const data: DialogModaleMessage = {
              titolo: "Operazione fallita",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "Operazione fallita",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data)
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.logService.error(this.constructor.name, `onClickRitira error: ${JSON.stringify(error)}`);
          this.spinner.hide();
        }
      });
    }
  }

  async onClickRifiuta(el: VacancyCandid) {
    // const msg = this.messageService.getMessage("CAND07");
    // const msg = this.messageService.getKeyValueByCod("CAND07", MSG.KEY.DESC);
    const title = 'Seleziona una motivazione per il rifiuto'
    const result = await this.promptModalService.openModaleMotivoCandidatura(title);
    console.log(result);

    if (result) {
      const request: CollegamentoAnnuncioCandidaturaRequest = {
        idStatoVacancyCandidDaImpostare: 5,
        vacancyCandid: {
          idVacancyCandid: el.vacancyCandidStatoList[0].idVacancyCandid,
          codUserAggiorn: '',
          codUserInserim: '',
          dAggiorn: undefined,
          dInserim: undefined,
          d_vacancy_candidatura: undefined,
          id_vacancy: 0
        },
        idMotivoVacancyCandid: Number(result),
        callInfo: undefined
      };
      this.annunciService.aggiornaStatoCollegamentoAnnuncioCandidatura(request).subscribe({
        next: (res: any) => {
          if (res.esitoPositivo) {
            const data: DialogModaleMessage = {
              titolo: "Stato aggiornato con successo",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "La candidatura è stata rifiutata",
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.spinner.show();
            this.elencoCandidature();


          } else {
            const data: DialogModaleMessage = {
              titolo: "Operazione fallita",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "Operazione fallita",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data)
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.logService.error(this.constructor.name, `onClickRifiuta error: ${JSON.stringify(error)}`);
          this.spinner.hide();
        }
      });
    }
  }


  getDataStatoCorrente(el: any) {
    const statoCorrente = el?.vacancyCandidStatoList?.find(
      (stato: any) => stato?.flgStatoCorrente === 'S'
    );
    return statoCorrente?.dStato || '';
  }

  getStatoAnnuncio(el: any) {
    if (el.datiAnnuncio.statoAnnuncio !== 'Chiuso' || el.datiAnnuncio.statoAnnuncio !== 'Eliminato') {
      return 'Attivo'
    } else {
      return 'Chiuso'
    }
  }

  getStatoCandidatura(el: any) {
    const statoCorrente = el?.vacancyCandidStatoList?.find(
      (stato: any) => stato?.flgStatoCorrente === 'S'
    );
    if (statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 10 && statoCorrente.idMotivoVacancyCandid.idMotivoVacancyCandid === 3) {
      return 'idoneo'
    } else if ((statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 10 && statoCorrente.idMotivoVacancyCandid.idMotivoVacancyCandid !== 3) || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 7 || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 12 || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 13 || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 8 || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 9) {
      return 'Non selezionato per l\' assunzione'
    } else if (statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 2 || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 3 || statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 4) {
      return 'In corso'
    } else if (statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 5) {
      return 'Rifiutata'
    } else if (statoCorrente.idStatoVacancyCandid.idStatoVacancyCandid === 6) {
      return 'Ritirata'
    } else {
      return 'Chiuso'
    }
  }

  showRifiutareAccettare(el: any): boolean {
    return el.vacancyCandidStatoList?.some(
      (stato: { idStatoVacancyCandid: { idStatoVacancyCandid: number; }; flgStatoCorrente: string; }) =>
        stato.idStatoVacancyCandid?.idStatoVacancyCandid === 2 &&
        stato.flgStatoCorrente === 'S'
    );
  }


  showRitirare(el: any) {
    return el.vacancyCandidStatoList?.some(
      (stato: { idStatoVacancyCandid: { idStatoVacancyCandid: number; }; flgStatoCorrente: string; }) =>
        stato.idStatoVacancyCandid?.idStatoVacancyCandid === 3 &&
        stato.flgStatoCorrente === 'S'
    );
  }

  onClickEsportaFile(format: 'pdf' | 'xls') {
    this.spinner.show();
    const request: CollegamentoAnnuncioCandidaturaListRequest = {
      idSilLavAnagrafica: this.utente?.idSilLavAnagrafica,
      callInfo: undefined
    };

    // Chiama il servizio passando il FORMATO, ma SENZA 'observe: response'.
    // In questo modo 'res' sarà l'oggetto JSON { bytes: "..." }.
    this.annunciService.stampaElencoVacancyCandid(request, format).subscribe({
      next: (res: any) => {
        // Qui usi la TUA logica di decodifica che funziona con il tuo utility service
        const byteArray = new Uint8Array(atob(res.bytes).split('').map(char => char.charCodeAt(0)));

        let mimeType: string;
        let fileName: string;

        // Imposta MimeType e FileName in base al formato richiesto
        if (format === 'xls') {
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileName = 'stampa-elenco-candidature.xlsx';
        } else {
          mimeType = 'application/pdf';
          fileName = 'stampa-elenco-candidature.pdf';
        }

        // Ora chiama la TUA funzione di utility per il download
        this.utilitiesService.downloadFileDaStampa(byteArray, mimeType, fileName);

        this.spinner.hide();
      },
      error: (error: any) => {
        console.error(this.constructor.name, `errore onClickEsportaFile: ${JSON.stringify(error)}`);
        this.spinner.hide();
      }
    });
  }



}
