/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { AppUserService } from 'src/app/services/app-user.service';
import { AnnunciService, CollegamentoAnnuncioCandidaturaListRequest, CollegamentoAnnuncioCandidaturaListResponse, CvService, StampaCvRequest } from '../../pslpapi';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomCandidatureService } from '../../candidature/services/custom-candidature.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'pslpwcl-visualizza-candidati-assistenza',
  templateUrl: './visualizza-candidati-assistenza.component.html',
  styleUrls: ['./visualizza-candidati-assistenza.component.scss']
})
export class VisualizzaCandidatiAssistenzaComponent implements OnInit {

  sezione = "Candidati assistenza";
  candidatureList: any;
  nessunRisultato: boolean = false;
  idAnnuncio: number;
  idVacancyCandidList: number[] = [];


  constructor(
    private readonly appUserService: AppUserService,
    private annunciService: AnnunciService,
    private router: Router,
    private cvService: CvService,
    private utilitiesService: UtilitiesService,
    private spinner: NgxSpinnerService,
    private customCandidatureService: CustomCandidatureService,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.idAnnuncio = state['idAnnuncio'];
    }
  }

  ngOnInit(): void {
    this.elencoCandidature();
  }

  onClickAnnulla() {
    this.router.navigate(['/pslpfcweb/private/assistenza-familiare/riepilogo-assistenza-familiare']);
  }

  elencoCandidature() {
    let elencoCandidatureRequest: CollegamentoAnnuncioCandidaturaListRequest = {
      idVacancy: this.idAnnuncio,
      callInfo: undefined
    };

    this.annunciService.elencoCollegamentoAnnuncioCandidatura(elencoCandidatureRequest).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo && res.vacancyCandidList) {
          this.candidatureList = res.vacancyCandidList.filter((candidatura: any) => {
            const statoCorrente = candidatura.vacancyCandidStatoList.find(
              (stato: any) => stato.flgStatoCorrente === 'S'
            );
            return statoCorrente?.idStatoVacancyCandid?.idStatoVacancyCandid === 4;
          });

          this.idVacancyCandidList = this.candidatureList.map((candidatura: { idVacancyCandid: any; }) => candidatura.idVacancyCandid);

          this.nessunRisultato = this.candidatureList.length === 0;

        } else {
          this.candidatureList = [];
          this.nessunRisultato = true;
        }
      },
      error: err => {
        this.candidatureList = [];
        this.nessunRisultato = true;
        console.error("Errore nel caricamento delle candidature", err);
      }
    });
  }

  async stampaCv(el: any) {
    const stampaRequest: StampaCvRequest = {
      idCandidatura: el.id_candidatura,
      callInfo: undefined
    };

    this.cvService.stampaCv(stampaRequest).subscribe({
      next: (ris: any) => {

        if (ris.esitoPositivo) {
          const byteArray = new Uint8Array(atob(ris.bytes).split('').map(char => char.charCodeAt(0)))
          this.utilitiesService.downloadFileDaStampa(byteArray, 'application/pdf', `stampa-cv.pdf`)
        } else {
          console.log("non va")
        }
      }, error: err => console.log(err)
    });
  }

  onClickEsportaFile(format: 'pdf' | 'xls') {
    this.spinner.show();
    const request: CollegamentoAnnuncioCandidaturaListRequest = {
      idVacancyCandid: this.idVacancyCandidList,
      callInfo: undefined
    };
    this.annunciService.stampaElencoVacancyCandid(request, format).subscribe({
      next: (res: any) => {
        const byteArray = new Uint8Array(atob(res.bytes).split('').map(char => char.charCodeAt(0)));

        let mimeType: string;
        let fileName: string;

        if (format === 'xls') {
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileName = 'stampa-elenco-candidature.xlsx';
        } else {
          mimeType = 'application/pdf';
          fileName = 'stampa-elenco-candidature.pdf';
        }
        this.utilitiesService.downloadFileDaStampa(byteArray, mimeType, fileName);

        this.spinner.hide();
      },
      error: (error: any) => {
        console.error(this.constructor.name, `errore onClickEsportaFile: ${JSON.stringify(error)}`);
        this.spinner.hide();
      }
    });
  }


  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

}
