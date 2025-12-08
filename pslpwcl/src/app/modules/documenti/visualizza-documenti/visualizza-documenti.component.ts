/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentiService, DocumentoRichiestoResponse } from '../../pslpapi';
import { LogService } from 'src/app/services/log.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { CustomDocumentiService } from '../services/custom-documenti.service';

@Component({
  selector: 'pslpwcl-visualizza-documenti',
  templateUrl: './visualizza-documenti.component.html',
  styleUrls: ['./visualizza-documenti.component.scss']
})
export class VisualizzaDocumentiComponent implements OnInit {

  idSilwebTDocumeRichiesti: number;
  richiestaDocumenti: DocumentoRichiestoResponse

  constructor(
    private router: Router,
    private documentiService: DocumentiService,
    private customDocumentiService: CustomDocumentiService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private utilitiesService: UtilitiesService
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      this.idSilwebTDocumeRichiesti = state['idSilwebTDocumeRichiesti']
    }
  }

  ngOnInit(): void {
    this.caricaRichiesta()
  }

  private caricaRichiesta() {
    this.documentiService.visualizzaRichiestaDocumento(this.idSilwebTDocumeRichiesti).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          this.richiestaDocumenti = res;
        }
      },
      error: (err) => {
        this.logService.log(this.constructor.name, "Errore visualizzaRichiesta");
      }
    });
  }

  onClickStampaRichiesta(idSilwebTDocumeRichiesti: number) {
    this.spinner.show();
    this.customDocumentiService.stampaDocumentoRichiesto(idSilwebTDocumeRichiesti, 'response').subscribe({
      next: (res: any) => {
        this.utilitiesService.downloadBlobFile(`stampa-richiesta`, res.body);
        this.spinner.hide();
      },
      error: (error) => {
        console.log(this.constructor.name, `errore onClickStampaRichiesta: ${JSON.stringify(error)}`);
        this.spinner.hide();
      }
    });

  }

  onClickIndietro() {
    this.router.navigateByUrl('pslpfcweb/private/documenti/riepilogo-documenti');
  }




}
