/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerManagerService {
  private activeRequests = new Set<string>();
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinnerState$: Observable<boolean> = this.spinnerSubject.asObservable();

  constructor(private ngxSpinner: NgxSpinnerService) {}

  /**
   * Mostra lo spinner per una richiesta specifica
   * @param requestId Identificatore univoco della richiesta
   */
  show(requestId: string = 'default'): void {
    this.activeRequests.add(requestId);
    this.updateSpinnerState();
  }

  /**
   * Nasconde lo spinner per una richiesta specifica
   * @param requestId Identificatore univoco della richiesta
   */
  hide(requestId: string = 'default'): void {
    this.activeRequests.delete(requestId);
    this.updateSpinnerState();
  }

  /**
   * Nasconde tutti gli spinner attivi
   */
  hideAll(): void {
    this.activeRequests.clear();
    this.updateSpinnerState();
  }

  /**
   * Verifica se ci sono richieste attive
   */
  hasActiveRequests(): boolean {
    return this.activeRequests.size > 0;
  }

  /**
   * Aggiorna lo stato dello spinner basato sulle richieste attive
   */
  private updateSpinnerState(): void {
    const shouldShow = this.activeRequests.size > 0;
    const currentState = this.spinnerSubject.value;

    if (shouldShow && !currentState) {
      this.ngxSpinner.show();
      this.spinnerSubject.next(true);
    } else if (!shouldShow && currentState) {
      this.ngxSpinner.hide();
      this.spinnerSubject.next(false);
    }
  }

  /**
   * Genera un ID univoco per le richieste
   */
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
