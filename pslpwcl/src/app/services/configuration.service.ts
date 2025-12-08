/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {


  private static readonly SHIBBOLETH_COOKIE_REGEX = /_shibsession_(.*?)=/;
  private static readonly SHIBBOLETH_SUBSTITUTION_REGEX = /%%SHIB%%/;

  constructor() { }

  /**
   * Prefisso per i servizi di back end
   */
  static getBERootUrl(): string {
    return environment.beServerPrefix + environment.beService;
  }


  /**
   * base href per l'index.html
   */
  static getBaseHref(): string {
    return environment.appBaseHref;
  }

  /**
   * profilo ambiente
   */
  static getAmbiente(): string {
    return environment.ambiente;
  }

  /**
   * Url di logout da SSO
   */
  static getSSOLogoutURL(): string {
    const shibCookie = ConfigurationService.SHIBBOLETH_COOKIE_REGEX.exec(document.cookie);
    return environment.shibbolethSSOLogoutURL.replace(ConfigurationService.SHIBBOLETH_SUBSTITUTION_REGEX, shibCookie && shibCookie[1] || '');
  }


  static useAutenticationPage(): boolean {
    return environment.shibbolethAuthentication;
  }

  // static getFascicoloBaseURL(): string {
  //   return environment.appFascicoloURL;
  // }
  // static getCittadinoBaseURL(): string {
  //   return environment.appCittadinoURL;
  // }
  static getBackOfficeBaseURL(): string {
    return "";//environment.appBackOfficeURL;
  }
  // static getHomeBaseURL(): string {
  //   return environment.appHomeURL;
  // }
}
