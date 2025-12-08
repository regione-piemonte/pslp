/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { RippleModule } from 'primeng/ripple';
import { CarouselModule } from 'primeng/carousel';

import { CvitaeRoutingModule } from './cvitae-routing.module';
import { MainCvComponent } from './components/main-cv/main-cv.component';
import { GestioneCvComponent } from './components/gestione-cv/gestione-cv.component';
import { RiepilogoCvComponent } from './components/riepilogo-cv/riepilogo-cv.component';
import { PslpwclCommonModule } from '../pslpwcl-common/pslpwcl-common.module';
import { DatiGeneraliComponent } from './components/gestione-cv/tabs-sezioni/dati-generali/dati-generali.component';
import { DatiAnagraficiComponent } from './components/gestione-cv/tabs-sezioni/dati-anagrafici/dati-anagrafici.component';
import { EsperienzeLavoroComponent } from './components/gestione-cv/tabs-sezioni/esperienze-lavoro/esperienze-lavoro.component';
import { IstruzioneComponent } from './components/gestione-cv/tabs-sezioni/istruzione/istruzione.component';
import { FormazioneProfessionaleComponent } from './components/gestione-cv/tabs-sezioni/formazione-professionale/formazione-professionale.component';
import { ConoscenzeLinguisticheComponent } from './components/gestione-cv/tabs-sezioni/conoscenze-linguistiche/conoscenze-linguistiche.component';
import { ConoscenzeInformaticheComponent } from './components/gestione-cv/tabs-sezioni/conoscenze-informatiche/conoscenze-informatiche.component';
import { AbilitazionePatentiComponent } from './components/gestione-cv/tabs-sezioni/abilitazione-patenti/abilitazione-patenti.component';
import { UlterioreInformazioniComponent } from './components/gestione-cv/tabs-sezioni/ulteriore-informazioni/ulteriore-informazioni.component';
import { ProfessioneDesiderataComponent } from './components/gestione-cv/tabs-sezioni/professione-desiderata/professione-desiderata.component';
import { RiepilogoComponent } from './components/gestione-cv/tabs-sezioni/riepilogo/riepilogo.component';
import { FascicoloModule } from '../fascicolo/fascicolo.module';
import { IncontroDomandaOffertaComponent } from './components/incontro-domanda-offerta/incontro-domanda-offerta.component';
import { InserisciEsperienzaProfessionaleCvComponent } from './components/gestione-cv/tabs-sezioni/inserisci-esperienza-professionale-cv/inserisci-esperienza-professionale-cv.component';
import { ModalStampaCvComponent } from './components/modal-stampa-cv/modal-stampa-cv.component';
import { ModalEsperienzaLavoroFascicoloComponent } from './components/gestione-cv/tabs-sezioni/esperienze-lavoro/modal-esperienza-lavoro-fascicolo/modal-esperienza-lavoro-fascicolo.component';
import { ModalTitoliStudioComponent } from './components/gestione-cv/tabs-sezioni/istruzione/modal-titoli-studio/modal-titoli-studio.component';
import { ModalFormazioneProfessionaleFascicoloComponent } from './components/gestione-cv/tabs-sezioni/formazione-professionale/modal-formazione-professionale-fascicolo/modal-formazione-professionale-fascicolo.component';
import { ModalConoscenzeLinguisticheFascicoloComponent } from './components/gestione-cv/tabs-sezioni/conoscenze-linguistiche/modal-conoscenze-linguistiche-fascicolo/modal-conoscenze-linguistiche-fascicolo.component';
import { ModalConoscenzaInformaticaFascicoloComponent } from './components/gestione-cv/tabs-sezioni/conoscenze-informatiche/modal-conoscenza-informatica-fascicolo/modal-conoscenza-informatica-fascicolo.component';


@NgModule({
  declarations: [
    MainCvComponent,
    GestioneCvComponent,
    RiepilogoCvComponent,
    DatiGeneraliComponent,
    DatiAnagraficiComponent,
    EsperienzeLavoroComponent,
    IstruzioneComponent,
    FormazioneProfessionaleComponent,
    ConoscenzeLinguisticheComponent,
    ConoscenzeInformaticheComponent,
    AbilitazionePatentiComponent,
    UlterioreInformazioniComponent,
    ProfessioneDesiderataComponent,
    RiepilogoComponent,
    IncontroDomandaOffertaComponent,
    InserisciEsperienzaProfessionaleCvComponent,
    ModalStampaCvComponent,
    ModalEsperienzaLavoroFascicoloComponent,
    ModalTitoliStudioComponent,
    ModalFormazioneProfessionaleFascicoloComponent,
    ModalConoscenzeLinguisticheFascicoloComponent,
    ModalConoscenzaInformaticaFascicoloComponent
  ],
  imports: [
    CommonModule,
    CvitaeRoutingModule,
    PslpwclCommonModule,
    TabMenuModule,
    RippleModule,
    CarouselModule,
    FascicoloModule
  ],
  exports:[
    InserisciEsperienzaProfessionaleCvComponent
  ]
})
export class CvitaeModule { }
