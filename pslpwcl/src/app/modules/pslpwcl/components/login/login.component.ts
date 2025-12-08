/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { Util } from 'src/app/modules/pslpwcl-common/models/util';
import { TypeApplicationCard } from 'src/app/modules/pslpwcl-common/models/type-application-card';


/**
 * Component gestione  pagina login virtuale
 *   per simulazione accesso SPID
 *   in ambiente di sviluppo/test
 */

@Component({
  selector: 'pslpwcl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm', { static: true }) loginForm: NgForm;
  dateObj: Date;
  meseAnnoRevisioneIC = "04/2024";
  provaHtml: string;
  subheaderNews: string;

  constructor(
    private readonly router: Router,
    private readonly logService: LogService,
    private readonly spidUserService: SpidUserService,
    private readonly utilitiesService: UtilitiesService,
    private readonly appUserService: AppUserService,
    // private readonly securityService: SecurityPslpService,
  ) { }

  ngOnInit(): void {
    if (!ConfigurationService.useAutenticationPage()) {
      const msg: Params = { message: 'Non è possibile usare la pagina di login per effettuare l\'autenticazione!' };
      this.router.navigate(['/error-page'], { queryParams: msg });
    }
    this.provaHtml = "questo &egrave; un problema di <b>html</b> credo!";
    this.subheaderNews = "questo &egrave; un problema di <b>html</b> credo!";
  }

  onSubmit() {

  }

}
