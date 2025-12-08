/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PslpwclRoutingModule } from './pslpwcl-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { SceltaRuoloComponent } from './components/scelta-ruolo/scelta-ruolo.component';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { RicercaNotificheComponent } from './components/ricerca-notifiche/ricerca-notifiche.component';


@NgModule({
  declarations: [
    HomePageComponent,
    LoginComponent,
    SceltaRuoloComponent,
    RicercaNotificheComponent
  ],
  imports: [
    CommonModule,
    PslpwclRoutingModule,
    PslpwclCommonModule
  ]
})
export class PslpwclModule { }
