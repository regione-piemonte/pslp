/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { IncontriRoutingModule } from './incontri-routing.module';
import { RiepilogoIncontriComponent } from './components/riepilogo-incontri/riepilogo-incontri.component';
import { MainIncontriComponent } from './components/main-incontri/main-incontri.component';
import { InserireIncontriComponent } from './components/inserire-incontri/inserire-incontri.component';
import { VisualizzaIncontriComponent } from './components/visualizza-incontri/visualizza-incontri.component';
import { PslpwclCommonModule } from "../pslpwcl-common/pslpwcl-common.module";
import { ServizioComponent } from './components/inserire-incontri/tabs-sezioni/servizio/servizio.component';
import { AppuntamentoComponent } from './components/inserire-incontri/tabs-sezioni/appuntamento/appuntamento.component';
import { RiepilogoComponent } from './components/inserire-incontri/tabs-sezioni/riepilogo/riepilogo.component';
import { DatiPrenotazioneComponent } from './components/dati-prenotazione/dati-prenotazione.component';
import { StoricoAppuntamentiComponent } from './components/storico-appuntamenti/storico-appuntamenti.component';
import { CollocamentoMiratoUeComponent } from './components/collocamento-mirato-ue/collocamento-mirato-ue.component';
import { CollocamentoMiratoExtraUeComponent } from './components/collocamento-mirato-extra-ue/collocamento-mirato-extra-ue.component';


@NgModule({
  declarations: [
    RiepilogoIncontriComponent,
    MainIncontriComponent,
    InserireIncontriComponent,
    VisualizzaIncontriComponent,
    ServizioComponent,
    AppuntamentoComponent,
    RiepilogoComponent,
    DatiPrenotazioneComponent,
    StoricoAppuntamentiComponent,
    CollocamentoMiratoUeComponent,
    CollocamentoMiratoExtraUeComponent
  ],
  imports: [
    CommonModule,
    IncontriRoutingModule,
    PslpwclCommonModule
],
providers: [DatePipe]
})
export class IncontriModule { }
