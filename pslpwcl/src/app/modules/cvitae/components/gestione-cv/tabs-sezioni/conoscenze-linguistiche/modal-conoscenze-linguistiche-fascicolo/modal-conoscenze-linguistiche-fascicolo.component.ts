/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { Decodifica, DecodificaPslpService, LinguaStraniera } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-modal-conoscenze-linguistiche-fascicolo',
  templateUrl: './modal-conoscenze-linguistiche-fascicolo.component.html',
  styleUrls: ['./modal-conoscenze-linguistiche-fascicolo.component.scss']
})
export class ModalConoscenzeLinguisticheFascicoloComponent implements OnInit {
  @Input() linguaStraniera: LinguaStraniera;
  linguaDecodifiche: Decodifica[];
  linguaDecodificheFiltrate:Decodifica[];
  gradoConoscenzaLingua: Decodifica[];
  modalitaAprrendimentoLinguaDecodifica: Decodifica[];


  form = new FormGroup({
    idSilLavLingua: new FormControl(),
    certificato: new FormControl(),
    letto: new FormGroup({
      id: new FormControl(null)
    }),
    lingua: new FormGroup({
      id: new FormControl(null)
    }),
    modalitaApprendimento: new FormGroup({
      id: new FormControl(null)
    }),
    parlato: new FormGroup({
      id: new FormControl(null)
    }),
    scritto: new FormGroup({
      id: new FormControl(null)
    })
  });

  constructor(
    public activeModal: NgbActiveModal,
    private decodificaService: DecodificaPslpService
  ) { }

  ngOnInit(): void {
    this.caricaDecodifiche();
    this.patchValueInform(this.linguaStraniera);
    this.form.disable();

  }

  private caricaDecodifiche() {
    const requests$ = [
      this.decodificaService.findDecodificaByTipo('lingua'),
      this.decodificaService.findDecodificaByTipo('grado-conoscenza-lingua'),
      this.decodificaService.findDecodificaByTipo('modalita-apprendimento-lingua')
    ];

    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo)
          this.linguaDecodifiche = multiResponse[0].list;
        if (multiResponse[1].esitoPositivo) {
          multiResponse[1].list.forEach((el: Decodifica) => {
            el.descr = `${el.codice} - ${el.descr}`;
          });
          this.gradoConoscenzaLingua = multiResponse[1].list;
        }
        if (multiResponse[2].esitoPositivo){
          this.modalitaAprrendimentoLinguaDecodifica = multiResponse[2].list;
        }
      },
      error: (err) => {
        // this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      }
    });
  }


  private patchValueInform(lingua: LinguaStraniera){
    console.log(lingua)
    this.form.patchValue(lingua);
    console.log(lingua.lingua.codice);
    this.form.get("lingua.id").patchValue(lingua.lingua.id)
  }

}
