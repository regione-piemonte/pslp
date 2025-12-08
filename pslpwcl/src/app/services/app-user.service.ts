/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

import { AmbitoEnum } from '../modules/pslpwcl-common/models/ambito-enum';
import { Util } from '../modules/pslpwcl-common/models/util';
import { Lavoratore, Ruolo, SuntoLavoratore, SuntoLavoratoreResponse, Utente } from '../modules/pslpapi';

import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ENV_AMBIENTE } from './lib/injection-token/env-ambiente.injection-token';
import { LogService } from './log.service';
import { SessionStorageService } from './storage/session-storage.service';
import { SpidUserService } from './storage/spid-user.service';

/* NOTA:
  > UPDATE idSilp sulla getUtenteByCf
  > UPDATE idSAP  sulla getSAP
  > UPDATE Mail   sulle getSAP e saveSAP* e saveUtente*

  * valore impostato sulla chiamata
*/

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  static readonly USER_KEY = 'AppUserService.utente';
  static readonly USERFOR_KEY = 'AppUserService.utentefor';
  static readonly ROLE_KEY = 'AppUserService.ruoloSelezionato';
  static readonly SUNTO_KEY='AppUserService.sunto';

  private utente: Utente;
  private utenteOperateFor: Utente;
  private ruoloSelezionato:Ruolo
  private suntoLavoratore:SuntoLavoratore

  idSilLavAnagraficaSubject = new BehaviorSubject<number | null>(null);
  constructor(
    private readonly spidUserService: SpidUserService,
    private readonly logService: LogService,
    private readonly sessionStorage: SessionStorageService,
  ) { }

  getUtente(): Utente {
    this.hydrateData();
    return this.utente;
  }
  getUtenteOperateFor(): Utente {
    this.hydrateData();
    return this.utenteOperateFor;
  }

  getRuoloSelezionato(){
    this.hydrateData();
    return this.ruoloSelezionato;
  }
  getIdUtente(): number {
    this.hydrateData();
    let id: number;
    if (!Util.isNullOrUndefined(this.utente)) {
       id = this.utente.idUtente;
    }
    return id;
  }

  getSuntoLavoratore(){
    this.hydrateData();
    return this.suntoLavoratore
  }
  setSuntoLavoratore(value:SuntoLavoratore){
    this.suntoLavoratore=value
    this.persistDataUtente()
  }
  setUtente(value: Utente) {
    this.utente = value;
    //this.logService.log('Utente' ,'Utente applicativo :', value);
    this.persistDataUtente();
  }
  setUtenteOperateFor(value: Utente) {
    this.utenteOperateFor = value;
    //this.logService.log('utenteOperateFor' ,'utenteOperateFor applicativo :', value);
    this.persistDataUtente();
  }

  setRuolo(value: Ruolo){
    this.ruoloSelezionato=value
    this.persistDataUtente()
  }
  private persistDataUtente() {
    this.sessionStorage.setItem(AppUserService.USER_KEY, this.utente);
    this.sessionStorage.setItem(AppUserService.USERFOR_KEY, this.utenteOperateFor);
    this.sessionStorage.setItem(AppUserService.ROLE_KEY, this.ruoloSelezionato);
    this.sessionStorage.setItem(AppUserService.SUNTO_KEY, this.suntoLavoratore);

    this.updatIdSilLavAnagrafica();
  }


  private updatIdSilLavAnagrafica() {
    const utente = this.getUtenteOperateFor() || this.getUtente();
    const id = utente?.idSilLavAnagrafica || null;
    this.idSilLavAnagraficaSubject.next(id);
  }

  hydrateData() {
    this.utente = this.sessionStorage.getItem(AppUserService.USER_KEY, true);
    this.utenteOperateFor = this.sessionStorage.getItem(AppUserService.USERFOR_KEY, true);
    this.ruoloSelezionato=this.sessionStorage.getItem(AppUserService.ROLE_KEY, true);
    this.suntoLavoratore=this.sessionStorage.getItem(AppUserService.SUNTO_KEY, true);
  }

}
