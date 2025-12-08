/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { DecodificaPublicPslpService, MessaggioService, Privacy, PslpMessaggio } from '../../pslpapi';

@Component({
  selector: 'pslpwcl-main-annunci',
  templateUrl: './main-annunci.component.html',
  styleUrls: ['./main-annunci.component.scss']
})
export class MainAnnunciComponent implements OnInit {

  sezione = "Annunci";
  loaded = false;
  messaggioIntestazione: PslpMessaggio;
  elencoPrivacyUtente: Privacy[];

  constructor(
        private messagioService: MessaggioService, 
        private decodificaPublicService: DecodificaPublicPslpService
  ) { }

  ngOnInit(): void {
    this.decodificaPublicService.findByCodPublic("I55").subscribe({
      next: (res: any) => {
        this.messaggioIntestazione = res.msg;
  
      }
    });
  }

}
