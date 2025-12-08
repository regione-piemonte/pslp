/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidatureRoutingModule } from './candidature-routing.module';
import { CandidatureComponent } from './candidature/candidature.component';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { MainCandidatureComponent } from './main-candidature/main-candidature.component';
import { RiepilogoCandidatureComponent } from './riepilogo-candidature/riepilogo-candidature.component';


@NgModule({
  declarations: [
    CandidatureComponent,
    MainCandidatureComponent,
    RiepilogoCandidatureComponent
  ],
  imports: [
    CommonModule,
    CandidatureRoutingModule,
    PslpwclCommonModule
  ]
})
export class CandidatureModule { }
