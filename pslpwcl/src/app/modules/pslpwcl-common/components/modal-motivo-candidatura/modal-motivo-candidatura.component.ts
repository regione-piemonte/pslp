/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Decodifica, DecodificaBlpService } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-modal-motivo-candidatura',
  templateUrl: './modal-motivo-candidatura.component.html',
  styleUrls: ['./modal-motivo-candidatura.component.scss']
})
export class ModalMotivoCandidaturaComponent implements OnInit {
  @Input() title: string = 'Motivazione rifiuto';
  selectedValue: any;
  motivi: Decodifica[] = []

  constructor(
    public modal: NgbActiveModal,
    private decodificaBlpService: DecodificaBlpService
  ) { }

  ngOnInit(): void {
    this.loadDecodifiche();
  }

  loadDecodifiche() {
    this.decodificaBlpService.findDecodificaBlpByTipo('MOTIVO_VACANCY_CANDID',).subscribe({
      next: (r) => {
        if (r.esitoPositivo) {
          this.motivi = r.list.filter(item => item.special === '12');
        }
      },
      error: err => { },
      complete: () => { }
    })
  }

  conferma() {
    this.modal.close(this.selectedValue);
  }

  annulla() {
    this.modal.dismiss('no');
  }

}
