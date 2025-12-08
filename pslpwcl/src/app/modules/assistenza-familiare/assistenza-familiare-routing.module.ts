/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAssistenzaFamiliareComponent } from './main-assistenza-familiare/main-assistenza-familiare.component';
import { RiepilogoAssistenzaFamiliareComponent } from './riepilogo-assistenza-familiare/riepilogo-assistenza-familiare.component';
import { VisualizzaCandidatiAssistenzaComponent } from './visualizza-candidati-assistenza/visualizza-candidati-assistenza.component';
import { VisualizzaDettaglioComponent } from './visualizza-dettaglio/visualizza-dettaglio.component';

const routes: Routes = [
  {
    path: 'assistenza-familiare',
    component: MainAssistenzaFamiliareComponent,
    children: [
      { path: 'riepilogo-assistenza-familiare', component: RiepilogoAssistenzaFamiliareComponent },
      { path: 'visualizza-candidati', component: VisualizzaCandidatiAssistenzaComponent },
      { path: 'visualizza-dettaglio', component: VisualizzaDettaglioComponent },
      { path: '**', redirectTo: 'incontro-domanda-offerta' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistenzaFamiliareRoutingModule { }
