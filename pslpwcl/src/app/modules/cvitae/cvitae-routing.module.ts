/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainCvComponent } from './components/main-cv/main-cv.component';
import { GestioneCvComponent } from './components/gestione-cv/gestione-cv.component';
import { RiepilogoCvComponent } from './components/riepilogo-cv/riepilogo-cv.component';
import { IncontroDomandaOffertaComponent } from './components/incontro-domanda-offerta/incontro-domanda-offerta.component';

const routes: Routes = [{
  path: 'cvitae',
  component: MainCvComponent,
  children: [
    {path: 'private/riepilogo-cv', component: RiepilogoCvComponent},
    {path: 'private/gestione-cv', component: GestioneCvComponent},
    {path: 'incontro-domanda-offerta', component: IncontroDomandaOffertaComponent},
    { path: '**', redirectTo:'incontro-domanda-offerta'}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CvitaeRoutingModule { }
