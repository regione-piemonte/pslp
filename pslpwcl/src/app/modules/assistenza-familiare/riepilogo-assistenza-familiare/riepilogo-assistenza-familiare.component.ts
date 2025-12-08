/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnnunciService, FormRicercaAnnunci, OrderField, PslpMessaggio, RicercaAnnunciRequest, RicercaAnnunciResponse } from '../../pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'pslpwcl-riepilogo-assistenza-familiare',
  templateUrl: './riepilogo-assistenza-familiare.component.html',
  styleUrls: ['./riepilogo-assistenza-familiare.component.scss']
})
export class RiepilogoAssistenzaFamiliareComponent implements OnInit {

  messaggio: PslpMessaggio;
  annunciResponseList: any;

  constructor(
    private annunciService: AnnunciService,
    private readonly appUserService: AppUserService,
    private logService: LogService,
    private readonly route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ricerca();
  }

  onClickAnnulla() {
    this.router.navigate(['pslpfcweb/cvitae/incontro-domanda-offerta']);
  }

  onGoToAnnuncio(idAnnuncio: number) {
    this.router.navigate(['/pslpfcweb/private/assistenza-familiare/visualizza-dettaglio'],
      {
        relativeTo: this.route.parent,
        state: { idAnnuncio: idAnnuncio }
      })
  }

  onGoToCandidati(idAnnuncio: number) {
    this.router.navigate(['/pslpfcweb/private/assistenza-familiare/visualizza-candidati'],
      {
        relativeTo: this.route.parent,
        state: { idAnnuncio: idAnnuncio }
      })
  }

  getStatoAnnuncio(el: any) {
    if (el.stato === 'Preso in carico' || el.stato === 'Condiviso') {
      return 'Attivo'
    } else {
      return 'Chiuso'
    }
  }

  ricerca() {
    const form: FormRicercaAnnunci = {
      cfAzienda: this.utente.cfUtente,
      ordinamento: [{ columnNumber: 4, order: 1 }]
    };
    const request: any = {
      formRicerca: form
    };

    this.annunciService.ricercaAnnunci(0, request, 20).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo && res.list) {
          this.annunciResponseList = res.list.filter(
            (annuncio: any) => annuncio.stato === 'Preso in carico' || annuncio.stato === 'Condiviso' || annuncio.stato === 'Chiuso'
          );
        } else {
          this.annunciResponseList = [];
        }
      },
      error: (err) => {
        this.annunciResponseList = [];
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, caricaDati`);
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
