/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { BaseStorageService } from './base-storage';
import { LogService } from '../log.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends BaseStorageService{

  constructor(
    logService: LogService
  ) { 
    super(logService, sessionStorage);
  }
}
