/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { FormConfermaPrivacy, PrivacyService } from 'src/app/modules/pslpapi';
import { LogService } from 'src/app/services/log.service';
import { CommonService } from '../../../../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'pslpwcl-presentazione-privacy',
  templateUrl: './presentazione-privacy.component.html',
  styleUrls: ['./presentazione-privacy.component.scss']
})
export class PresentazionePrivacyComponent implements OnInit {

  private loadedFlag = [false, false];
  checkInformativaPrivacy = false;
  isDettaglio = false;

  constructor(
    private spinner: NgxSpinnerService,
    private router:Router,
    private commonService:CommonService,
    private appUserService:AppUserService,
    private logService:LogService,
    private privacyService:PrivacyService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    if ( this.router.url.endsWith("dettaglio-privacy")) {
      this.checkInformativaPrivacy = true;
      this.isDettaglio = true;
    }
    if (this.router.url.endsWith("presentazione-privacy")) {
      this.checkInformativaPrivacy = false;
    }

    this.checkDataLoaded(0);
  }
  checkDataLoaded(id: number) {
    this.loadedFlag[id] = true;
    if (this.loadedFlag.every(Boolean)) {
      this.spinner.hide();
    }
  }

  indietro() {
    this.router.navigateByUrl('pslpfcweb/private/privacy/riepilogo-privacy');
  }


  get privacy(){
    return this.commonService.privacyActual.pslpDPrivacy;
  }

  async comincia() {
    this.spinner.show();
    const utente = this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();

    // if (!Util.isNullOrUndefined(this.commonPslpService.getIdUtenteMinorePrivacy())) {
    //   // utente minore
    //   await this.setPrivacyUtenteMinore(utente);
    // } else {
      // utente non minore

    let formConfermaPrivacy:FormConfermaPrivacy = {
      idPrivacy: this.privacy.idPrivacy,
      idUtente: utente.idUtente
    }
    this.privacyService.confermaPrivacy(formConfermaPrivacy).subscribe({
        next:(res:any)=>{
          if(res.esitoPositivo)
            this.indietro();
        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`pingService: ${this.constructor.name}: ${JSON.stringify(err)}`)
        },
        complete: () =>{
          this.spinner.hide();
          // this.indietro();
        }
      });
  }

}
