/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  debug(className: string, methodName: string, ...payload: any[]) {
    // tslint:disable-next-line: no-console
    //console.log.call(console, this.formatMessage(className, methodName), ...payload);
  }

  info(className: string, methodName: string, ...payload: any[]) {
    // tslint:disable-next-line: no-console
   // console.info.call(console, this.formatMessage(className, methodName), ...payload);
  }

  error(className: string, methodName: string, ...payload: any[]) {
    // tslint:disable-next-line: no-console
   // console.error.call(console, this.formatMessage(className, methodName), ...payload);
  }

  log(className: string, methodName: string, ...payload: any[]) {
    // tslint:disable-next-line: no-console
    //console.log.call(console, this.formatMessage(className, methodName), ...payload);
  }

  private formatMessage(className: string, methodName: string): string {
    return `[${className}::${methodName}]`;
  }

}
