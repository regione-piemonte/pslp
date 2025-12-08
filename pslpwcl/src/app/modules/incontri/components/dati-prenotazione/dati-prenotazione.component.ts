/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { AppuntamentiRidotta, IncServizi } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-dati-prenotazione',
  templateUrl: './dati-prenotazione.component.html',
  styleUrls: ['./dati-prenotazione.component.scss']
})
export class DatiPrenotazioneComponent implements OnInit {

  @Input() incontro: AppuntamentiRidotta;
  @Input() servizio: IncServizi;

  constructor() { }

  ngOnInit(): void {
  }

  getIndirizzo(): string {
    const { desToponimoSedeIncontro, indirizzoSedeIncontro, numCivicoSedeIncontro } = this.incontro || {};

    return [desToponimoSedeIncontro, indirizzoSedeIncontro, numCivicoSedeIncontro]
      .filter(value => !!value)
      .join(' ');
  }

}
