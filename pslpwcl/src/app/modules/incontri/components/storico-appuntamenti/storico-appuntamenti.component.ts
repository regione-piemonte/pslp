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
  selector: 'pslpwcl-storico-appuntamenti',
  templateUrl: './storico-appuntamenti.component.html',
  styleUrls: ['./storico-appuntamenti.component.scss']
})
export class StoricoAppuntamentiComponent implements OnInit {

  @Input() listaSpostamentiPrec: AppuntamentiRidotta[];
  @Input() servizio: IncServizi;
  spostamentoSelected: AppuntamentiRidotta;

  constructor() { }

  ngOnInit(): void {
  }


}
