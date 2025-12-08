/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
// import { UtenteACarico } from '@pslwcl/pslapi';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Privacy, PrivacyService, Utente, UtentePrivacy, UtentePrivacyListResponse } from 'src/app/modules/pslpapi';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'pslpwcl-scheda-privacy',
  templateUrl: './scheda-privacy.component.html',
  styleUrls: ['./scheda-privacy.component.scss']
})
export class SchedaPrivacyComponent implements OnInit {
  @Input() utente: Utente;
  @Input() pulsantiAbilitati: boolean = true;
  @Input() idTutore: number = null;
  @Input() utenteACarico: any = null //UtenteACarico = null;
  @Output() readonly loadedData: EventEmitter<void> = new EventEmitter();

  elencoPrivacyUtente: Array<UtentePrivacy> = [];
  elencoPrivacyMinore: any[]

  constructor(
    private privacyService:PrivacyService,
    private logService: LogService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {

    this.privacyService.privacyUtenteCollegato(this.utente.idUtente).subscribe(
      {
        next: (res: any) =>{
          if(res.esitoPositivo)
            this.elencoPrivacyUtente = res.utentePrivacy;
        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`fake login: ${this.constructor.name}: ${JSON.stringify(err)}`)
        },
        complete: () =>{
          //  this.spinner.hide();
        }
      }
    )
  }

  async onVedi(
        privacy: UtentePrivacy,
        // dettaglioTestoPrivacy: Array<string>,
        // isConfermato: boolean,
        // idUtenteMinorePrivacy?: number,
        // etaDelMinore?: number
        ) {
          // TOSEE
    // if (etaDelMinore != null && etaDelMinore >= 18) {
    //     const msg = await this.utilitiesService.getMessage('ME021');
    //     return this.utilitiesService.showToastrErrorMessage(msg);
    // } else {
      // this.setDataFascicolo();
      // this.commonPslpService.setDataPrivacy(ambitoPrivacy, dettaglioTestoPrivacy, idUtenteMinorePrivacy, this.utenteACarico);

      //TODO:
      //Caricare la privacy da qualche parte ..
    this.commonService.privacyActual = privacy;
    let isConfermato = !!privacy.pslpTUtente1 || !!privacy.pslpTUtente2 ? true: false
    if (isConfermato) {
      // lettura della privacy
      this.router.navigateByUrl('/pslpfcweb/private/privacy/dettaglio-privacy');
    } else {
      // presa visione della privacy
      this.router.navigateByUrl('/pslpfcweb/private/privacy/presentazione-privacy');
    }
    // }
  }

}
