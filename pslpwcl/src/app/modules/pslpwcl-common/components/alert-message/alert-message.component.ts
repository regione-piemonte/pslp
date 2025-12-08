/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TYPE_ALERT } from 'src/app/constants';
import { ApiMessage } from 'src/app/modules/pslpapi';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'pslpwcl-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {

  messages$: Observable<ApiMessage[]>;

  constructor(
    private alertMessageService: AlertMessageService
  ) {
    this.messages$ = this.alertMessageService.apiMessages$;
  }

  ngOnInit(): void {
  }

  closeAlert(): void {
    this.alertMessageService.emptyMessages();
  }

  // Funzione helper per assegnare la classe CSS corretta in base al tipo di alert
  getAlertClass(message: ApiMessage): string {
    switch (message.tipo) {
      case TYPE_ALERT.SUCCESS:
        return 'alert-success';
      case TYPE_ALERT.WARNING:
        return 'alert-warning';
      case TYPE_ALERT.INFO:
        return 'alert-info';
      case TYPE_ALERT.ERROR:
      default:
        return 'alert-danger';
    }
  }

}
