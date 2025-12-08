/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFascicoloComponent } from './components/main-fascicolo/main-fascicolo.component';
import { DatiAnagraficiComponent } from './components/tabs-stepper/dati-anagrafici/dati-anagrafici.component';
import { DatiAmministrativiComponent } from './components/tabs-stepper/dati-amministrativi/dati-amministrativi.component';
import { EsperienzaLavoroComponent } from './components/tabs-stepper/esperienza-lavoro/esperienza-lavoro.component';
import { DatiCurriculariComponent } from './components/tabs-stepper/dati-curriculari/dati-curriculari.component';
import { RiepilogoFascicoloComponent } from './components/riepilogo-fascicolo/riepilogo-fascicolo.component';
import { StepperFascicoloComponent } from './components/stepper-fascicolo/stepper-fascicolo.component';

const routes: Routes = [
  {
    path: 'fascicolo',
    component: MainFascicoloComponent,
    // canActivate: [UtenteGuard],
    children: [
      { path: 'dettaglio-fascicolo', component: StepperFascicoloComponent },//DettaglioPrivacyComponent },
      // { path: 'presentazione-privacy', component: PresentazionePrivacyComponent },
      { path: 'riepilogo-fascicolo', component: RiepilogoFascicoloComponent },
      { path: 'dati-amministrativi', component: DatiAmministrativiComponent},
      { path: 'dati-curriculari', component: DatiCurriculariComponent},
      { path: '**', redirectTo:'riepilogo-fascicolo'}
    ]
  },
  // {
  //   path: 'deleghe',
  //   component: MainPrivacyComponent,
  //   // canActivate: [UtenteGuard],
  //   children: [
  //     { path: 'aggiungi-delega', component: AggiungiDelegaComponent },//DettaglioPrivacyComponent },
  //     { path: 'presentazione-deleghe', component: PresentazioneDelegheComponent },
  //     { path: 'riepilogo-deleghe', component: RiepilogoDelegheComponent },
  //     { path: '**', redirectTo:'riepilogo-deleghe'}
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FasciocoloRoutingModule { }
