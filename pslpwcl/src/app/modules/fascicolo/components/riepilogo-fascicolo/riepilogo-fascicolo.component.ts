/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { LogService } from './../../../../services/log.service';
import { FascicoloPslpService } from 'src/app/modules/pslpapi';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { SpinnerManagerService } from 'src/app/services/spinner-manager.service';

@Component({
  selector: 'pslpwcl-riepilogo-fascicolo',
  templateUrl: './riepilogo-fascicolo.component.html',
  styleUrls: ['./riepilogo-fascicolo.component.scss']
})
export class RiepilogoFascicoloComponent implements OnInit {

  fascicoloSelected?:any
  caricamentoCompletato=false
  constructor(
    private readonly appUserService:AppUserService,
    private router:Router,
    private fascicoloService:FascicoloPslpService,
    private logService:LogService,
    private commonService:CommonService,
    private spinner: NgxSpinnerService,
    private spinnerManager: SpinnerManagerService,
  ) {
    const loadRequestId = this.spinnerManager.generateRequestId();
    this.spinnerManager.show(loadRequestId);
    this.commonService.clearFascicolo();
    if(this.utente.idSilLavAnagrafica){
      this.fascicoloService.getDettaglioFascicolo(this.utente.idSilLavAnagrafica).subscribe({
        next: (r:any)=>{
          if(r.esitoPositivo){
            this.commonService.fascicoloActual = r.fascicolo;
            this.fascicoloSelected=r.fascicolo
            this.caricamentoCompletato=true
            this.spinnerManager.hide(loadRequestId);
          }
        },
        error: (err) => {
          this.spinnerManager.hide(loadRequestId);
          this.logService.error(this.constructor.name, err);
        }
      })
    }else{
      this.commonService.fascicoloActual = undefined;
      this.fascicoloSelected=undefined
      this.caricamentoCompletato=true
      this.spinnerManager.hide(loadRequestId);
    }

  }

  ngOnInit(): void {

  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  navigateToFascicolo(){
    this.router.navigateByUrl('pslpfcweb/private/fascicolo/dettaglio-fascicolo');
  }

  get fascicolo(){
    return this.commonService.fascicoloActual;
  }
}
