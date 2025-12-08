/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SceltaRuoloComponent } from './components/scelta-ruolo/scelta-ruolo.component';
import { RicercaNotificheComponent } from './components/ricerca-notifiche/ricerca-notifiche.component';

const routes: Routes = [
  { path: 'home-page', component: HomePageComponent },
  { path: 'ricerca-notifiche', component: RicercaNotificheComponent },
  { path: 'scelta-ruolo', component: SceltaRuoloComponent },
  { path: '', redirectTo: 'home-page', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PslpwclRoutingModule { }
