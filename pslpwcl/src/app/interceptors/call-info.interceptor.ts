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
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUserService } from '../services/app-user.service';

@Injectable()
export class CallInfoInterceptor implements HttpInterceptor {

  constructor(private readonly appUserService:AppUserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(request.url.includes("cv")|| request.url.includes("map-silp-to-blp") || request.url.includes("blp")){
      let callInfo={
        codFiscale: this.appUserService?.getUtente()?.cfUtente ? this.appUserService?.getUtente()?.cfUtente : null,
        idAppChiamante: "PSLP"
      }

      let body=undefined;
      if(request.body){
        body=request.body
        body.callInfo=callInfo
      }else if(request.method!='GET'){
        body={callInfo:callInfo}
      }
      let req=new HttpRequest(request.method as any,request.url,body,{
        headers:request.headers,
        params:request.params,
        responseType:request.responseType,
        withCredentials:request.withCredentials,
        context:request.context,
        reportProgress:request.reportProgress
      })

      return next.handle(req)

    }
    if(request.url.includes("stampa-attestato-disoccupazione") && !request.url.includes("controlli")){
      let headers = request.headers
      headers = headers.set('Accept', 'application/pdf');
      let req=new HttpRequest(request.method as any,request.url,request.body,{
        headers:headers,
        params:request.params,
        responseType:'blob',
        withCredentials:request.withCredentials,
        context:request.context,
        reportProgress:request.reportProgress
      })

      return next.handle(req)
    }
    return next.handle(request);
  }
}
