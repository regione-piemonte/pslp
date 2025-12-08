/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SortableDirective } from './directives/sortable.directive';
import { PaginationHeadDirective } from './directives/pagination-head.directive';
import { PaginationBodyDirective } from './directives/pagination-body.directive';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { OnlyStringsDirective } from './directives/only-strings.directive';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigurationService } from '../../services/configuration.service';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { DialogModaleComponent } from './components/dialog-modale/dialog-modale.component';
import { EscapeHtmlPipe } from './pipe/escape-html.pipe';


//-- PrimeNG
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { ModalRicercaAziendaComponent } from './components/modal-ricerca-azienda/modal-ricerca-azienda.component';
import { ModalPatenteComponent } from './components/modal-patente/modal-patente.component';
import { ModalTitoloStudioComponent } from './components/modal-titolo-studio/modal-titolo-studio.component';
import { ModalCodiceOtpComponent } from './components/modal-codice-otp/modal-codice-otp.component';
import { ControlMessagesComponent } from './components/_validation/validation';
import { ModalSelezionareCittadinoComponent } from './components/modal-selezionare-cittadino/modal-selezionare-cittadino.component';
import { CardInfoUtenteComponent } from './components/card-info-utente/card-info-utente.component';
import { FormStradarioComponent } from './components/form-stradario/form-stradario.component';
import { OnlyDateDirective } from './directives/only-date.directive';
import { StradarioComponent } from './components/stradario/stradario.component';
import { CampanellaNotificheComponent } from './components/campanella-notifiche/campanella-notifiche.component';
import { ModalConfermaMailComponent } from './components/modal-conferma-mail/modal-conferma-mail.component';
import { ModalMotivoCandidaturaComponent } from './components/modal-motivo-candidatura/modal-motivo-candidatura.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import localeIt from '@angular/common/locales/it';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';



// import { NgSelectModule } from '@ng-select/ng-select';
registerLocaleData(localeIt);


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,ConfigurationService.getBaseHref()+"/assets/i18n/");
}

const pipes = [
  EscapeHtmlPipe

]

const modulesPrimeNG = [
  SidebarModule,
  DialogModule,
  DynamicDialogModule,
  AccordionModule,
  ButtonModule,
  CardModule,
  TableModule,
  ToggleButtonModule,
  ConfirmDialogModule,
  MessagesModule,
  MessageModule,
  ToastModule,
  InputTextModule,
  DropdownModule,
  StepsModule,
  RadioButtonModule,
  CalendarModule

  // NgSelectModule
]
const servicePrimeNG = [
  DialogService,
  ConfirmationService,
  MessageService
]

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ErrorPageComponent,
    SidebarLeftComponent,
    DialogModaleComponent,

    ModalConfirmComponent,
    ModalRicercaAziendaComponent,

    SortableDirective,
    PaginationHeadDirective,
    PaginationBodyDirective,
    OnlyNumberDirective,
    OnlyStringsDirective,
    ControlMessagesComponent,
    StradarioComponent,
    pipes,
        ModalPatenteComponent,
        ModalTitoloStudioComponent,
        ModalCodiceOtpComponent,
        ModalSelezionareCittadinoComponent,
        CardInfoUtenteComponent,
        FormStradarioComponent,
        OnlyDateDirective,
        CampanellaNotificheComponent,
        ModalConfermaMailComponent,
        ModalMotivoCandidaturaComponent,
        AlertMessageComponent,
        CalendarioComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    ReactiveFormsModule,

    FormsModule,
    ReactiveFormsModule,

    NgbModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    modulesPrimeNG,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true
    }),
    
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NgxSpinnerModule,
    TranslateModule,
    NgbModule,
    CardInfoUtenteComponent,
    FormsModule,
    ReactiveFormsModule,
    FormStradarioComponent,
    PaginationBodyDirective,
    PaginationHeadDirective,
    SortableDirective,
    OnlyNumberDirective,
    OnlyStringsDirective,
    ControlMessagesComponent,
    ErrorPageComponent,
    StradarioComponent,
    AlertMessageComponent,
    CalendarioComponent,
    pipes,

    modulesPrimeNG
  ],
  providers:[
    servicePrimeNG,{ provide: LOCALE_ID, useValue: 'it' },
  ]
})
export class PslpwclCommonModule { }
