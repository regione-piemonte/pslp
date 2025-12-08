/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentiRoutingModule } from './documenti-routing.module';
import { MainDocumentiComponent } from './main-documenti/main-documenti.component';
import { InserireDocumentiComponent } from './inserire-documenti/inserire-documenti.component';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { RiepilogoDocumentiComponent } from './riepilogo-documenti/riepilogo-documenti.component';
import { VisualizzaDocumentiComponent } from './visualizza-documenti/visualizza-documenti.component';


@NgModule({
  declarations: [
    MainDocumentiComponent,
    InserireDocumentiComponent,
    RiepilogoDocumentiComponent,
    VisualizzaDocumentiComponent
  ],
  imports: [
    CommonModule,
    DocumentiRoutingModule,
    PslpwclCommonModule
  ]
})
export class DocumentiModule { }
