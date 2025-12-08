/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_PATH, CollegamentoAnnuncioCandidaturaListRequest, Configuration } from '../../pslpapi';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomHttpUrlEncodingCodec } from '../../pslpapi/encoder';

@Injectable({
  providedIn: 'root'
})
export class CustomCandidatureService {

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
 * Restituisce la stampa dell&#x27;elenco collegamento annuncio candidature
 * 
 * @param body 
 * @param format 
 * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
 * @param reportProgress flag to report request and response progress.
 */
  public stampaElencoVacancyCandid(body?: CollegamentoAnnuncioCandidaturaListRequest, format?: string, observe?: 'body', reportProgress?: boolean): Observable<Blob>;
  public stampaElencoVacancyCandid(body?: CollegamentoAnnuncioCandidaturaListRequest, format?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Blob>>;
  public stampaElencoVacancyCandid(body?: CollegamentoAnnuncioCandidaturaListRequest, format?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Blob>>;
  public stampaElencoVacancyCandid(body?: CollegamentoAnnuncioCandidaturaListRequest, format?: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {



    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (format !== undefined && format !== null) {
      queryParameters = queryParameters.set('format', <any>format);
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
      'application/json'
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.post(`${this.basePath}/api/v1/annunci/stampa-elenco-collegamento-annuncio-candidatura`,
      body,
      {
        responseType: "blob",
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
