/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFascicoloComponent } from './components/main-fascicolo/main-fascicolo.component';
import { DatiAnagraficiComponent } from './components/tabs-stepper/dati-anagrafici/dati-anagrafici.component';
import { DatiAmministrativiComponent } from './components/tabs-stepper/dati-amministrativi/dati-amministrativi.component';
import { EsperienzaLavoroComponent } from './components/tabs-stepper/esperienza-lavoro/esperienza-lavoro.component';
import { DatiCurriculariComponent } from './components/tabs-stepper/dati-curriculari/dati-curriculari.component';
import { StepperFascicoloComponent } from './components/stepper-fascicolo/stepper-fascicolo.component';
import { RiepilogoFascicoloComponent } from './components/riepilogo-fascicolo/riepilogo-fascicolo.component';
import { FasciocoloRoutingModule } from './fascicolo-routing.module';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { InserisciEsperienzaLavoroComponent } from './components/tabs-stepper/inserisci-esperienza-lavoro/inserisci-esperienza-lavoro.component';
import { TitoloStudioComponent } from './components/tabs-stepper/dati-curriculari/titolo-studio/titolo-studio.component';
import { LingueStraniereConosciuteComponent } from './components/tabs-stepper/dati-curriculari/lingue-straniere-conosciute/lingue-straniere-conosciute.component';
import { PatentiComponent } from './components/tabs-stepper/dati-curriculari/patenti/patenti.component';
import { PatentiniComponent } from './components/tabs-stepper/dati-curriculari/patentini/patentini.component';
import { AltreInformazioniComponent } from './components/tabs-stepper/dati-curriculari/altre-informazioni/altre-informazioni.component';
import { FormazioneProfessionaleComponent } from './components/tabs-stepper/dati-curriculari/formazione-professionale/formazione-professionale.component';
import { AltriCorsiComponent } from './components/tabs-stepper/dati-curriculari/altri-corsi/altri-corsi.component';
import { CompetenzeInformaticheComponent } from './components/tabs-stepper/dati-curriculari/competenze-informatiche/competenze-informatiche.component';



@NgModule({
  declarations: [
    MainFascicoloComponent,
    DatiAnagraficiComponent,
    DatiAmministrativiComponent,
    EsperienzaLavoroComponent,
    DatiCurriculariComponent,
    StepperFascicoloComponent,
    RiepilogoFascicoloComponent,
    InserisciEsperienzaLavoroComponent,
    TitoloStudioComponent,
    LingueStraniereConosciuteComponent,
    PatentiComponent,
    PatentiniComponent,
    AltreInformazioniComponent,
    FormazioneProfessionaleComponent,
    AltriCorsiComponent,
    CompetenzeInformaticheComponent

  ],
  imports: [
    CommonModule,
    FasciocoloRoutingModule,
    PslpwclCommonModule
  ],
  exports:[
    InserisciEsperienzaLavoroComponent
  ]
})
export class FascicoloModule { }
