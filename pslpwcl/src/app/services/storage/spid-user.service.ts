/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable, Inject, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Utente } from 'src/app/modules/pslpapi';  // NOSONAR evita falso positivo rule typescript:S4328
import { LogService } from '../log.service';

import { SessionStorageService } from './session-storage.service';
import { DOCUMENT } from '@angular/common';
import { Util } from 'src/app/modules/pslpwcl-common/models/util';
import { environment } from 'src/environments/environment';
import { UserInfo } from 'src/app/modules/pslpwcl-common/models/userInfo';


@Injectable({
  providedIn: 'root'
})
export class SpidUserService {
  static readonly USER_SESSION_KEY = 'SpidUserService.user';
  static id = 0;

  private _userUpdate = new BehaviorSubject<Utente|null>(null);
  userUpdate=this._userUpdate.asObservable()
  private user: Utente;

  constructor(
    private readonly logService: LogService,
    private readonly storageService: SessionStorageService,
    @Inject(DOCUMENT) private document: Document
  ) { this.getUser()}

  getUser(): Utente |UserInfo {
    if (Util.isNullOrUndefined(this.user) && (environment.ambiente === 'dev' || environment.ambiente === 'test' || environment.ambiente === 'local')  ) {
      const user = this.storageService.getItem(SpidUserService.USER_SESSION_KEY, true);
      this.user = user;
      this._userUpdate.next(this.user);
    }
    return this.user;
  }

  setUser(value: Utente) {
    this.user = value;
   // this.logService.log('spid.user setUser Utente loggato :', value.cfUtente);
    this._userUpdate.next(this.user);
    this.persistUser();
  }

  private persistUser() {
    if (environment.ambiente === 'dev' || environment.ambiente === 'test' || environment.ambiente === 'coll' || environment.ambiente === 'local') {
      this.storageService.setItem(SpidUserService.USER_SESSION_KEY, this.user);
    }
  }

  nullifyUser() {
    this.storageService.setItem(SpidUserService.USER_SESSION_KEY, null);
    this._userUpdate.next(null);
    this.user=null
  }

  hydrateData() {
    if (this.document.location.search) {
      const urlSP = new URLSearchParams(this.document.location.search.substring(1));
      if (urlSP.get('user')) {
        try {
          this.setUser(JSON.parse(atob(urlSP.get('user'))));
          return () => Promise.resolve(null);
        } catch (error) {
          // ignorata eccezione
        }
      }
    }
    if (environment.ambiente !== 'dev') {
      return () => Promise.resolve(null);
    }
    const user = this.storageService.getItem(SpidUserService.USER_SESSION_KEY, true);
    if (!user) {
      return () => Promise.resolve(null);
    }
    this.setUser(user);
    return null;
  }

  getName(): string {
    this.logService.log('Utente loggato :', this.user.cfUtente);
    if (this.user) {
      let cognome = this.user.cognome;
      if (!Util.isNullOrUndefined(cognome) && cognome.length > 1 ) {
        cognome = cognome?.charAt(0).toUpperCase() + cognome.slice(1).toLowerCase();
      }
      let nome = this.user.nome;
      if (!Util.isNullOrUndefined(nome) && nome.length > 1 ) {
        nome = nome?.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
      }
      return cognome + ' ' + nome;
    } else {
      return 'non definito';
    }
  }
}
