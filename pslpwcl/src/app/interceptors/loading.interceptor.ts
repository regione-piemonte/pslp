/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerManagerService } from '../services/spinner-manager.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private spinnerManager: SpinnerManagerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Escludi le chiamate che non devono mostrare lo spinner
    if((request.url.includes("get-dettaglio")
      || request.url.includes("find")
      || request.url.includes("fill")
      || request.url.includes("decodifica-blp")
      || request.url.includes("pullNotify")
    )){
      return next.handle(request)
    }

    //  CORREZIONE: Usa il servizio centralizzato per gestire lo spinner
    const requestId = this.spinnerManager.generateRequestId();
    this.spinnerManager.show(requestId);

    return next.handle(request).pipe(
      finalize(() => {
        //  CORREZIONE: Nascondi lo spinner solo per questa richiesta specifica
        this.spinnerManager.hide(requestId);
      })
    );
  }
}
