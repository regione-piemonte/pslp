/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { Candidatura } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-dati-generali',
  templateUrl: './dati-generali.component.html',
  styleUrls: ['./dati-generali.component.scss']
})
export class DatiGeneraliComponent implements OnInit {
  isValidato?: boolean;
  isBozza?: boolean;
  isAutomatico?: boolean;
  
  sysDate: Date = new Date();

  cv?: Candidatura;

  constructor(
    private cvitaeService: CvitaeService
  ) { }

  ngOnInit(): void {

    this.cvitaeService.selectedCv.subscribe(
      ris=>{
        this.cv=ris

        this.isValidato = this.cv?.codStatoCandidatura?.codStatoCandidatura=="V";
        this.isBozza = this.cv?.codStatoCandidatura?.codStatoCandidatura=="B";
        this.isAutomatico = this.cv?.flgGeneratoDaSistema=="S";
      }
    )

  }

}
