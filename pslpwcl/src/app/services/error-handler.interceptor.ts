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
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { LogService } from './log.service';
import { Router } from '@angular/router';
import { Utils } from '../utils';
import { HTTP_RESPONSE, TYPE_ALERT } from '../constants';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private logService: LogService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.logService.debug(this.constructor.name,`intercept`,request);
    return next.handle(request).pipe(
      catchError((err: any) => this.handleError(this,request,err)),
      /*tap(r=>{if(r instanceof HttpResponse && r.status==200 && !r.body){
            this.handleError(this,request)
         }
      })*/
    );
  }


  private handleError(interceptor: ErrorHandlerInterceptor, req: HttpRequest<any>, err?: any): Observable<any>{
    this.logService.debug(this.constructor.name,`handleError`,err);
    if(!Utils.isNullOrUndefined(err) && !err.ok){
      // da gestire gli eventuali stati
      if(err.status === HTTP_RESPONSE.SATUS.UNKNOW_ERROR){

      }else if(err.status === HTTP_RESPONSE.SATUS.INTERNAL_SERVER_ERROR){

      }else if(err.status === HTTP_RESPONSE.SATUS.NOT_FOUND){

      }

      //da verifcare
      const error = {
        code: err.status,
        error: true,
        message: err.message,
        tipo: TYPE_ALERT.ERROR
      }

      interceptor.router.navigate(['/error'], {state: {error: error}});
    }else{


      const error = {
        code:500,
        error: true,
        message:  "<p>Si sono verificati dei problemi che non permettono di proseguire con l'operativita'.</p>"+
                  "<p>Per poter operare con la funzionalita', e' necessario contattare il Centro per l'Impiego di competenza.</p>",
        tipo: TYPE_ALERT.ERROR
      }
      interceptor.router.navigate(['/error'], {state: {error: error}});
    }
    return ErrorObservable.create(err);
  }
}
