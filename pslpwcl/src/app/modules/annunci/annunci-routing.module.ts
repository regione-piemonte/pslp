/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaAnnunciEURESComponent } from './consulta-annunci-eures/consulta-annunci-eures.component';
import { ConsultaAnnunciComponent } from './consulta-annunci/consulta-annunci.component';
import { ConsultaProfiliRicercatiComponent } from './consulta-profili-ricercati/consulta-profili-ricercati.component';
import { VisualizzaAnnunciComponent } from './visualizza-annunci/visualizza-annunci.component';
import { VisualizzaAnnunciProfiliRicercatiComponent } from './visualizza-annunci-profili-ricercati/visualizza-annunci-profili-ricercati.component';

const routes: Routes = [
  { path: 'consulta-annunci', component: ConsultaAnnunciComponent },
  { path: 'consulta-annunci/EURES', component: ConsultaAnnunciEURESComponent },
  { path: 'consulta-annunci/profili-ricercati', component: ConsultaProfiliRicercatiComponent },
  { path: 'consulta-annunci/visualizza-annuncio', component: VisualizzaAnnunciComponent },
  { path: 'consulta-annunci/visualizza-annuncio-profili-ric', component: VisualizzaAnnunciProfiliRicercatiComponent },
  { path: '**', redirectTo: 'consulta-annunci' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnunciRoutingModule { }
