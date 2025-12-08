/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistenzaFamiliareRoutingModule } from './assistenza-familiare-routing.module';
import { MainAssistenzaFamiliareComponent } from './main-assistenza-familiare/main-assistenza-familiare.component';
import { RiepilogoAssistenzaFamiliareComponent } from './riepilogo-assistenza-familiare/riepilogo-assistenza-familiare.component';
import { PslpwclCommonModule } from "../pslpwcl-common/pslpwcl-common.module";
import { VisualizzaCandidatiAssistenzaComponent } from './visualizza-candidati-assistenza/visualizza-candidati-assistenza.component';
import { VisualizzaDettaglioComponent } from './visualizza-dettaglio/visualizza-dettaglio.component';


@NgModule({
  declarations: [
    MainAssistenzaFamiliareComponent,
    RiepilogoAssistenzaFamiliareComponent,
    VisualizzaCandidatiAssistenzaComponent,
    VisualizzaDettaglioComponent
  ],
  imports: [
    CommonModule,
    AssistenzaFamiliareRoutingModule,
    PslpwclCommonModule
]
})
export class AssistenzaFamiliareModule { }
