/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { ENV_AMBIENTE } from './lib/injection-token/env-ambiente.injection-token';
import { LogService } from './log.service';
import { SpidUserService } from './storage/spid-user.service';
import { Util } from '../modules/pslpwcl-common/models/util';
import { TypeApplicationCard } from '../modules/pslpwcl-common/models/type-application-card';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityPslpService {


  constructor(
    private readonly router: Router,
    private readonly logService: LogService,
    private readonly spidUserService: SpidUserService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(ENV_AMBIENTE) @Optional() private ambiente: string
  ) { }

  /**
   *
   * @param url permette di saltare ad un url esterno
   */
  public jumpToURL(url: string, applicazione: TypeApplicationCard) {
    let urlBase: string;
    urlBase = ConfigurationService.getBackOfficeBaseURL();
    // switch (applicazione) {
    //   case TypeApplicationCard.Fascicolo:
    //     urlBase = ConfigurationService.getFascicoloBaseURL();
    //     break;
    //   case TypeApplicationCard.Cittadino:
    //     urlBase = ConfigurationService.getCittadinoBaseURL();
    //     break;
    //   case TypeApplicationCard.BackOffice:
    //       urlBase = ConfigurationService.getBackOfficeBaseURL();
    //       break;
    //   default:
    //     urlBase = ConfigurationService.getHomeBaseURL();
    // }
    //this.logService.info(this.constructor.name,'redirecting to ' + urlBase + url + '...');
    let queryParam = "";
      const loUser = this.spidUserService.getUser();
      if (!Util.isNullOrUndefined(loUser)) {
        if (url.includes('?')) {
          queryParam = "&user=" + btoa(JSON.stringify(loUser));
        } else {
          queryParam = "?user=" + btoa(JSON.stringify(loUser));
        }
      }

    this.document.location.href = urlBase + url + queryParam;
  }

  /**
   * permette di visualizzare una pagina di cortesia
   */
  public jumpToCourtesyPage() {
    //this.logService.log('redirecting to courtesy page...');
    this.router.navigate(['/courtesypage']);
  }

}
