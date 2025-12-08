/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input } from '@angular/core';
import { SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';
import { FormazioneProfessionalePiemontese } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-formazione-professionale',
  templateUrl: './formazione-professionale.component.html',
  styleUrls: ['./formazione-professionale.component.scss']
})
export class FormazioneProfessionaleComponent implements OnInit {
  @Input() fascicolo:SchedaAnagraficaProfessionale;

  formazioneProfessionaleList: Array<FormazioneProfessionalePiemontese>;
  formazioneProfessionale: FormazioneProfessionalePiemontese;
  showDettaglio = false;

  constructor() { }

  ngOnInit(): void {
    this.formazioneProfessionaleList = this.fascicolo.informazioniCurriculari.percorsoFormativo.formazioneProfessionale.formazioneProfessionalePiemontese
  }

  onClickAnnullaVisualizza(){
    this.showDettaglio=false;
  }

  viewFormazione(formazioneProfessionale:FormazioneProfessionalePiemontese){
    this.showDettaglio = true;
    this.formazioneProfessionale = formazioneProfessionale;
  }

}
