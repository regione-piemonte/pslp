/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { DocumentiService, DocumeRichiesti, FormRicercaRichiesteDocumenti, RicercaRichiesteDocumentiResponse } from '../../pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { CustomDocumentiService } from '../services/custom-documenti.service';

@Component({
  selector: 'pslpwcl-riepilogo-documenti',
  templateUrl: './riepilogo-documenti.component.html',
  styleUrls: ['./riepilogo-documenti.component.scss']
})
export class RiepilogoDocumentiComponent implements OnInit {

  richiestaDocumenti: DocumeRichiesti
  richiestaDocumentiList: RicercaRichiesteDocumentiResponse;
  nonDomiciliatoPiemonte = true;
  nessunRisultato : boolean = false;

  constructor(
    private documentiService: DocumentiService,
    private customDocumentiService:CustomDocumentiService,
    private readonly appUserService: AppUserService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private utilitiesService: UtilitiesService
  ) { }

  ngOnInit(): void {
    this.elencoRichiesteDocumenti()
  }

  elencoRichiesteDocumenti() {
    if(this.utente.idSilLavAnagrafica){
      let elencoRichiesteRequest: FormRicercaRichiesteDocumenti = {
        idSilLavAnagrafica: this.utente?.idSilLavAnagrafica
      };
  
      this.documentiService.ricercaRichiesteDocumenti(0, elencoRichiesteRequest).subscribe({
        next: res => {
          if (res.esitoPositivo && res.list) {
            const listaFiltrata = res.list.filter(doc => doc.silwebTStatoDocume.idSilwebTStatoDocume !== 5);
            this.richiestaDocumentiList = { ...res, list: listaFiltrata };
            if(res.list.length === 0){
              this.nessunRisultato = true;
            }
          }
        },
        error: err => {
          console.error("Errore nel caricamento delle richieste documenti:", err);
        }
      });
    }
  }

  gotoInserisciRichiesta() {
    this.router.navigate(
      ["inserire-documenti"],
      {
        relativeTo: this.route.parent,
      });
  }

  gotoVisualizzaRichiesta(idSilwebTDocumeRichiesti: number) {
    this.router.navigate(
      ["visualizza-documenti"],
      {
        relativeTo: this.route.parent,
        state: {
          idSilwebTDocumeRichiesti: idSilwebTDocumeRichiesti
        }
      }
    );
  }


  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
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

}
