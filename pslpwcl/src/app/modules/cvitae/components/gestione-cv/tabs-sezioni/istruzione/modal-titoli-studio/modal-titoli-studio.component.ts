/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LavTitoloStudioAltro, TitoloDiStudio } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-modal-titoli-studio',
  templateUrl: './modal-titoli-studio.component.html',
  styleUrls: ['./modal-titoli-studio.component.scss']
})
export class ModalTitoliStudioComponent implements OnInit {
  @Input() titoloDiStudio: TitoloDiStudio;
  @Input() lavTitoloStudioAltro?: LavTitoloStudioAltro;
  titoloStudioModal: TitoloDiStudio;

  indirizzoInst: string;
  indirizzoAz: string;


  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.indirizzoInst = this.lavTitoloStudioAltro.silTToponimoIst?.dsSilTToponimo + " " + this.lavTitoloStudioAltro?.dsIndirizzoIst + " " + this.lavTitoloStudioAltro?.dsNumCivicoIst;

    if( this.lavTitoloStudioAltro.dsIndirizzoAziStage){
      this.indirizzoAz = this.lavTitoloStudioAltro.silTToponimoAziStage?.dsSilTToponimo + " " + this.lavTitoloStudioAltro?.dsIndirizzoAziStage + " " + this.lavTitoloStudioAltro?.dsNumCivicoAziStage;
;
    }else{

    }
  }

}
