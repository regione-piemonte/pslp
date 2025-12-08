/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiepilogoPrivacyComponent } from './components/privacy/riepilogo-privacy/riepilogo-privacy.component';
import { MainPrivacyComponent } from './components/main-privacy/main-privacy.component';
import { PrivacyRoutingModule } from './privacy-routing.module';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SchedaPrivacyComponent } from './components/privacy/scheda-privacy/scheda-privacy.component';
import { PresentazionePrivacyComponent } from './components/privacy/presentazione-privacy/presentazione-privacy.component';
import { PrivacyTemplateComponent } from './components/privacy/privacy-template/privacy-template.component';
import { RiepilogoDelegheComponent } from './components/delega/riepilogo-deleghe/riepilogo-deleghe.component';
import { PresentazioneDelegheComponent } from './components/delega/presentazione-deleghe/presentazione-deleghe.component';
import { AggiungiDelegaComponent } from './components/delega/aggiungi-delega/aggiungi-delega.component';



@NgModule({
  declarations: [
    RiepilogoPrivacyComponent,
    MainPrivacyComponent,
    SchedaPrivacyComponent,
    PresentazionePrivacyComponent,
    PrivacyTemplateComponent,
    RiepilogoDelegheComponent,
    PresentazioneDelegheComponent,
    AggiungiDelegaComponent
  ],
  imports: [
    CommonModule,
    PrivacyRoutingModule,
    PslpwclCommonModule,
  ]
})
export class PrivacyModule { }
