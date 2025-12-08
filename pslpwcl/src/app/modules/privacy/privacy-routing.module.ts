/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPrivacyComponent } from './components/main-privacy/main-privacy.component';
import { RiepilogoPrivacyComponent } from './components/privacy/riepilogo-privacy/riepilogo-privacy.component';
import { PresentazionePrivacyComponent } from './components/privacy/presentazione-privacy/presentazione-privacy.component';
import { RiepilogoDelegheComponent } from './components/delega/riepilogo-deleghe/riepilogo-deleghe.component';
import { PresentazioneDelegheComponent } from './components/delega/presentazione-deleghe/presentazione-deleghe.component';
import { AggiungiDelegaComponent } from './components/delega/aggiungi-delega/aggiungi-delega.component';

const routes: Routes = [
  {
    path: 'privacy',
    component: MainPrivacyComponent,
    // canActivate: [UtenteGuard],
    children: [
      { path: 'dettaglio-privacy', component: PresentazionePrivacyComponent },//DettaglioPrivacyComponent },
      { path: 'presentazione-privacy', component: PresentazionePrivacyComponent },
      { path: 'riepilogo-privacy', component: RiepilogoPrivacyComponent },
      { path: '**', redirectTo:'riepilogo-privacy'}
    ]
  },
  {
    path: 'deleghe',
    component: MainPrivacyComponent,
    // canActivate: [UtenteGuard],
    children: [
      { path: 'aggiungi-delega', component: AggiungiDelegaComponent },//DettaglioPrivacyComponent },
      { path: 'presentazione-deleghe', component: PresentazioneDelegheComponent },
      { path: 'riepilogo-deleghe', component: RiepilogoDelegheComponent },
      { path: '**', redirectTo:'riepilogo-deleghe'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyRoutingModule { }
