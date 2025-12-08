/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { MessaggioService } from './../../../pslpapi/api/messaggio.service';
import { UtilitiesService } from './../../../../services/utilities.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PslpMessaggio, Privacy, PrivacyService, UtentePrivacy } from 'src/app/modules/pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'pslpwcl-main-privacy',
  templateUrl: './main-privacy.component.html',
  styleUrls: ['./main-privacy.component.scss']
})
export class MainPrivacyComponent implements OnInit ,OnDestroy{

  sezione = "Privacy";
  loaded = false;
  elencoPrivacyUtente: UtentePrivacy[];
  chkPrivacyFascicolo=false

  private readonly subscriptions = [] as Array<Subscription>;



  constructor(
    private readonly utilitiesService:UtilitiesService,
    private router: Router,
    private readonly appUserService:AppUserService,
    private messaggioService:MessaggioService,
    private logService: LogService,
    private privacyService: PrivacyService

  ) { }

  messaggio: PslpMessaggio

  ngOnInit(): void {
    this.sezione  = this.router.url.includes("privacy") ? "Privacy":"Deleghe";
    this.utilitiesService.showSpinner();
    this.privacyService.privacyUtenteCollegato(this.utente.idUtente).subscribe(
      {
        next: (res: any) =>{
          if(res.esitoPositivo)
            this.elencoPrivacyUtente = res.utentePrivacy;
            res.utentePrivacy.forEach((privacy:any)=>{
              if((!!privacy?.pslpTUtente1 || !!privacy?.pslpTUtente2) && (privacy.pslpDPrivacy && privacy.pslpDPrivacy.codPrivacy=="PRV")){
                this.chkPrivacyFascicolo=true
              }
            })
        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`fake login: ${this.constructor.name}: ${JSON.stringify(err)}`)
        },
        complete: () =>{
          //  this.spinner.hide();
        }
      }
    )
    this.messaggioService.findByCod(this.sezione=="Privacy"? "I11": "I12").subscribe({
      next: (res:any) => {
        if(res.esitoPositivo){
          this.messaggio = res.msg;
        }

      },
      error: (err) =>{
       this.logService.error(this.constructor.name,`pingService: ${this.constructor.name}: ${JSON.stringify(err)}`)
      },
      complete: () =>{
      //  this.spinner.hide();
      }

    })
  }

  /**
   * on destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get notDettaglio(){
    return !this.router.url.includes("dettaglio");
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  navigateTo(url:string){
    if(url=='fascicolo'){

    }
    this.router.navigateByUrl("/pslpfcweb/private/"+url);
  }
  get miniTitolo(){
    return this.router.url.includes("privacy") ? "Privacy":"Deleghe";
  }
}
