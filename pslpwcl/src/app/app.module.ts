/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PslpwclCommonModule } from './modules/pslpwcl-common/pslpwcl-common.module';
import { PslpwclModule } from './modules/pslpwcl/pslpwcl.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF, CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { BASE_PATH } from './modules/pslpapi';
import { ConfigurationService } from './services/configuration.service';
import { ErrorHandlerInterceptor } from './services/error-handler.interceptor';
import { LANG } from './constants';
import { ModalConfirmComponent } from './modules/pslpwcl-common/components/modal-confirm/modal-confirm.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { CallInfoInterceptor } from './interceptors/call-info.interceptor';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    PslpwclCommonModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: ConfigurationService.getBaseHref()},
    { provide: BASE_PATH, useFactory: ConfigurationService.getBERootUrl },
    { provide: LOCALE_ID, useValue: LANG.IT },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: CallInfoInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true},

    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, da verificare una volta chiariti utenti e ruoli
    // { provide: HTTP_INTERCEPTORS, useClass: UtenteInterceptor, multi: true}, da verificare una volta chiariti utenti e ruoli

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    registerLocaleData(localeIt, LANG.IT);
  }
 }
