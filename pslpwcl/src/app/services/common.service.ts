/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { SessionStorageService } from './storage/session-storage.service';
import { Injectable } from '@angular/core';
import { Delega, FascicoloPslpService, MessaggioService, Privacy, PslpMessaggio, SchedaAnagraficaProfessionale, UtentePrivacy } from '../modules/pslpapi';
import { AppUserService } from './app-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from './log.service';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  privacyActual:UtentePrivacy
  delegaActual:Delega;
  private messaggiCaricati: PslpMessaggio[]=[];
  private messaggioSubject = new BehaviorSubject<PslpMessaggio | null>(null);
  messaggio$: Observable<PslpMessaggio | null> = this.messaggioSubject.asObservable();


  fascicolo:SchedaAnagraficaProfessionale;

  // isDelegaForMinore = false;

  constructor(
    private spinner: NgxSpinnerService,
    private fascicoloService:FascicoloPslpService,
    private logService:LogService,
    private readonly appUserService:AppUserService,
    private sessionStorageService:SessionStorageService,
    private messaggioService: MessaggioService,
  ) { }

  async getMessaggioByCode(code: string) : Promise<PslpMessaggio | null>{
    console.log(this.messaggiCaricati)
    if(this.messaggiCaricati && this.messaggiCaricati.length>0){
      const messaggio: PslpMessaggio = this.messaggiCaricati.find(mc=>mc.codMessaggio == code);
      if(messaggio){
          return messaggio;
      }
    }

    return this.messaggioService.findByCod(code)
      .pipe(
        map((res:any) => {
          if(res.esitoPositivo){
            if(res.msg){
              this.messaggiCaricati.push(res.msg);
            }
            return res.msg;
          }
          return null;
        }),
        catchError(() => of(null))
      ).toPromise();


  }

  set isDelegaForMinore(isDelegaForMinore:boolean){
    this.sessionStorageService.setItem("isDelegaForMinore",isDelegaForMinore)
  }
  get isDelegaForMinore(){
    return this.sessionStorageService.getItem("isDelegaForMinore") ? true:false;
  }

  set fascicoloActual(fascicolo:SchedaAnagraficaProfessionale){
    this.fascicolo = fascicolo;
    this.sessionStorageService.setItem("fascicolo",fascicolo);
  }
  get fascicoloActual(){
    if(this.fascicolo != undefined)
      return this.fascicolo;

    return this.fascicolo = JSON.parse(sessionStorage.getItem("fascicolo"));
  }

  clearFascicolo(){
    this.fascicolo = undefined;
    this.sessionStorageService.clearItems("fascicolo");
  }

  refreshFascicolo(){

    this.fascicoloService.getDettaglioFascicolo(this.utente.idSilLavAnagrafica).subscribe({
      next: (r:any)=>{
        if(r.esitoPositivo)
          this.fascicoloActual = r.fascicolo;
      },
      error: (err) =>{
        this.logService.error(this.constructor.name,`fake login: ${this.constructor.name}: ${JSON.stringify(err)}`)
      },
      complete: () =>{
         this.spinner.hide();
      }
    })
  }
  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }


}
