/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './modules/pslpwcl-common/components/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'pslphome',
    loadChildren: () =>
      import('./modules/pslpwcl/pslpwcl.module')
        .then(m => m.PslpwclModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/pslpwcl/pslpwcl.module')
        .then(m => m.PslpwclModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/privacy/privacy.module')
        .then(m => m.PrivacyModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/fascicolo/fascicolo.module')
        .then(m => m.FascicoloModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/did/did.module')
        .then(m => m.DidModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/documenti/documenti.module')
        .then(m => m.DocumentiModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/candidature/candidature.module')
        .then(m => m.CandidatureModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/assistenza-familiare/assistenza-familiare.module')
        .then(m => m.AssistenzaFamiliareModule)
  },
  {
    path: 'pslpfcweb/private',
    loadChildren: () =>
      import('./modules/incontri/incontri.module')
        .then(m => m.IncontriModule)
  },
  {
    path: 'pslpfcweb',
    loadChildren: () =>
      import('./modules/cvitae/cvitae.module')
        .then(m => m.CvitaeModule)
  },
  {
    path: 'pslpfcweb',
    loadChildren: () =>
      import('./modules/annunci/annunci.module')
        .then(m => m.AnnunciModule)
  },
  
  { path: 'error', component: ErrorPageComponent },
  //{ path: 'pslpfcweb/private', redirectTo: '/pslphome/home-page', pathMatch: 'full'},
  { path: '**', redirectTo: '/pslphome/home-page', pathMatch: 'full' },
  { path: '', redirectTo: '/pslphome/home-page', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
