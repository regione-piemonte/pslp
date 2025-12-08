/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDocumentiComponent } from './main-documenti/main-documenti.component';
import { InserireDocumentiComponent } from './inserire-documenti/inserire-documenti.component';
import { RiepilogoDocumentiComponent } from './riepilogo-documenti/riepilogo-documenti.component';
import { VisualizzaDocumentiComponent } from './visualizza-documenti/visualizza-documenti.component';

const routes: Routes = [
    {
      path: 'documenti',
      component: MainDocumentiComponent,
      // canActivate: [UtenteGuard],
      children: [
        { path: 'inserire-documenti', component: InserireDocumentiComponent },
        { path: 'riepilogo-documenti', component: RiepilogoDocumentiComponent },
        { path: 'visualizza-documenti', component: VisualizzaDocumentiComponent },
        { path: '**', redirectTo:'riepilogo-documenti'}
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentiRoutingModule { }
