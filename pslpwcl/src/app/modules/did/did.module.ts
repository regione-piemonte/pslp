/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainDidComponent } from './components/main-did/main-did.component';
import { DidRoutingModule } from './did-routing.module';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { InserireDidComponent } from './components/inserire-did/inserire-did.component';



@NgModule({
  declarations: [
    MainDidComponent,
    InserireDidComponent
  ],
  imports: [
    CommonModule,
    DidRoutingModule,
    PslpwclCommonModule
  ]
})
export class DidModule { }
