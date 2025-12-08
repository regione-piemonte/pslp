/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnunciRoutingModule } from './annunci-routing.module';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { MainAnnunciComponent } from './main-annunci/main-annunci.component';
import { ConsultaAnnunciComponent } from './consulta-annunci/consulta-annunci.component';
import { VisualizzaAnnunciComponent } from './visualizza-annunci/visualizza-annunci.component';
import { ConsultaProfiliRicercatiComponent } from './consulta-profili-ricercati/consulta-profili-ricercati.component';
import { ConsultaAnnunciEURESComponent } from './consulta-annunci-eures/consulta-annunci-eures.component';
import { VisualizzaAnnunciProfiliRicercatiComponent } from './visualizza-annunci-profili-ricercati/visualizza-annunci-profili-ricercati.component';


@NgModule({
  declarations: [
    MainAnnunciComponent,
    ConsultaAnnunciComponent,
    VisualizzaAnnunciComponent,
    ConsultaProfiliRicercatiComponent,
    ConsultaAnnunciEURESComponent,
    VisualizzaAnnunciProfiliRicercatiComponent
  ],
  imports: [
    CommonModule,
    AnnunciRoutingModule,
    PslpwclCommonModule
  ]
})
export class AnnunciModule { }
