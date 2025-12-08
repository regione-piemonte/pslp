/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AgendaService } from './api/agenda.service';
import { AnnunciService } from './api/annunci.service';
import { AnnunciPublicPslpService } from './api/annunciPublicPslp.service';
import { CvService } from './api/cv.service';
import { DecodificaBlpService } from './api/decodificaBlp.service';
import { DecodificaPslpService } from './api/decodificaPslp.service';
import { DecodificaPublicPslpService } from './api/decodificaPublicPslp.service';
import { DefaultService } from './api/default.service';
import { DelegaService } from './api/delega.service';
import { DidPslpService } from './api/didPslp.service';
import { DocumentiService } from './api/documenti.service';
import { FascicoloPslpService } from './api/fascicoloPslp.service';
import { LavoratorePslpService } from './api/lavoratorePslp.service';
import { MappingService } from './api/mapping.service';
import { MessaggioService } from './api/messaggio.service';
import { NotifichePslpService } from './api/notifichePslp.service';
import { ParametroBlpService } from './api/parametroBlp.service';
import { PingService } from './api/ping.service';
import { PrivacyService } from './api/privacy.service';
import { StradarioService } from './api/stradario.service';
import { UtenteService } from './api/utente.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AgendaService,
    AnnunciService,
    AnnunciPublicPslpService,
    CvService,
    DecodificaBlpService,
    DecodificaPslpService,
    DecodificaPublicPslpService,
    DefaultService,
    DelegaService,
    DidPslpService,
    DocumentiService,
    FascicoloPslpService,
    LavoratorePslpService,
    MappingService,
    MessaggioService,
    NotifichePslpService,
    ParametroBlpService,
    PingService,
    PrivacyService,
    StradarioService,
    UtenteService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
