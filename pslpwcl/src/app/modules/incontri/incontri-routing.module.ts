/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiepilogoIncontriComponent } from './components/riepilogo-incontri/riepilogo-incontri.component';
import { MainIncontriComponent } from './components/main-incontri/main-incontri.component';
import { InserireIncontriComponent } from './components/inserire-incontri/inserire-incontri.component';
import { VisualizzaIncontriComponent } from './components/visualizza-incontri/visualizza-incontri.component';

const routes: Routes = [
      {
        path: 'incontri',
        component: MainIncontriComponent,
        // canActivate: [UtenteGuard],
        children: [
          { path: 'inserire-incontri', component: InserireIncontriComponent},
          { path: 'riepilogo-incontri', component: RiepilogoIncontriComponent },
          { path: 'visualizza-incontri', component: VisualizzaIncontriComponent},
          { path: '**', redirectTo:'riepilogo-incontri'}
        ]
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncontriRoutingModule { }
