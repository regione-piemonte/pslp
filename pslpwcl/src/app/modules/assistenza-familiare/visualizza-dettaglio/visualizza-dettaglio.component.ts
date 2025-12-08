/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { AnnunciService, Vacancy } from '../../pslpapi';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppUserService } from 'src/app/services/app-user.service';
import { SpinnerManagerService } from 'src/app/services/spinner-manager.service';

@Component({
  selector: 'pslpwcl-visualizza-dettaglio',
  templateUrl: './visualizza-dettaglio.component.html',
  styleUrls: ['./visualizza-dettaglio.component.scss']
})
export class VisualizzaDettaglioComponent implements OnInit {

  idAnnuncio: number;
  annuncio: Vacancy
  titolo: string;
  idCandidatura: number;

  constructor(
    private router: Router,
    private annunciService: AnnunciService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private spinnerManager: SpinnerManagerService,
    private readonly appUserService: AppUserService,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state) {
      this.idAnnuncio = state['idAnnuncio'];
    }
  }

  ngOnInit(): void {
    this.getDettaglioAnnuncio(this.idAnnuncio);
  }

  tornaAiRisultati(): void {
    this.router.navigate(['/pslpfcweb/private/assistenza-familiare/riepilogo-assistenza-familiare']);
  }

  getDettaglioAnnuncio(id: number): void {
    const requestId = this.spinnerManager.generateRequestId();
    this.spinnerManager.show(requestId);
    this.annunciService.getDettaglioAnnuncio(id).subscribe({
      next: (res) => {
        if (res.esitoPositivo) {
          this.annuncio = res?.annuncio;
        }
      },
      error: (error) => {
        this.spinnerManager.hide(requestId);
        this.logService.error(this.constructor.name, `errore: ${error}`);
      },
      complete: () => {
        this.spinnerManager.hide(requestId);
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
