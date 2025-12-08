/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_PATH, Configuration } from '../../pslpapi';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomDocumentiService {

  protected basePath = '/';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
     * Stampa documento richiesto
     * 
     * @param idRichiestaDocumento 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
  public stampaDocumentoRichiesto(idRichiestaDocumento: number, observe?: 'body', reportProgress?: boolean): Observable<Blob>;
  public stampaDocumentoRichiesto(idRichiestaDocumento: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Blob>>;
  public stampaDocumentoRichiesto(idRichiestaDocumento: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Blob>>;
  public stampaDocumentoRichiesto(idRichiestaDocumento: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (idRichiestaDocumento === null || idRichiestaDocumento === undefined) {
      throw new Error('Required parameter idRichiestaDocumento was null or undefined when calling stampaDocumentoRichiesto.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/pdf'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.get(`${this.basePath}/api/v1/documenti/stampa-documento-richiesto/${encodeURIComponent(String(idRichiestaDocumento))}`,
      {
        responseType: "blob",
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
