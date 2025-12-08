/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatureComponent } from './candidature/candidature.component';
import { IncontroDomandaOffertaComponent } from '../cvitae/components/incontro-domanda-offerta/incontro-domanda-offerta.component';
import { MainCandidatureComponent } from './main-candidature/main-candidature.component';
import { RiepilogoCandidatureComponent } from './riepilogo-candidature/riepilogo-candidature.component';

const routes: Routes = [
  {
    path: 'candidature',
    component: MainCandidatureComponent,
    children: [
      { path: 'riepilogo-candidature', component: RiepilogoCandidatureComponent },
      { path: 'incontro-domanda-offerta', component: IncontroDomandaOffertaComponent },
      { path: '**', redirectTo: 'incontro-domanda-offerta' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatureRoutingModule { }
