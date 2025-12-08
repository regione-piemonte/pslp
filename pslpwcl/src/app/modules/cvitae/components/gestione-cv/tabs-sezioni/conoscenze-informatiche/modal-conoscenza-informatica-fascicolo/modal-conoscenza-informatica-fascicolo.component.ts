/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ConoscenzaInformatica, Decodifica, DecodificaPslpService } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-modal-conoscenza-informatica-fascicolo',
  templateUrl: './modal-conoscenza-informatica-fascicolo.component.html',
  styleUrls: ['./modal-conoscenza-informatica-fascicolo.component.scss']
})
export class ModalConoscenzaInformaticaFascicoloComponent implements OnInit {
  @Input() conoscenzeInformatica: ConoscenzaInformatica;
   //nel form richiamato Categoria arriva della decodifica informatica
   informaticas: Decodifica[];
  
   conoscenzaSpecificas: Decodifica[];
   modalitaApprendimentos: Decodifica[];
   gradoConoscenzas: Decodifica[];
   categoria: string;
 
   //nel form richiamato Conoscenza Informatica arriva della decodifica informatica-dett come ricerca
   informaticaDett: Decodifica[] = [];

   form = this.fb.group({
    flgCertificato: [null],
    idSilLavInformatica: [null],
    silLavAnagrafica: this.fb.group({
      idSilLavAnagrafica: [null]
    }),
    silTGradoConInf: this.fb.group({
      id: [null]
    }),
    silTModApprInf: this.fb.group({
      id: [null]
    }),
    dsNote: [null],
    silTInformaticaDett: this.fb.group({
      id: [null],
      informatica: this.fb.group({
        descr: [null]
      })
    })
  });


  constructor(
    public activeModal: NgbActiveModal,
    public decodificaService: DecodificaPslpService,
    private fb:FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.conoscenzeInformatica)
    this.caricaDecodifiche();
    this.form.disable();
    this.patchValueInform();
  }

  private caricaDecodifiche() {
    const requests$ = [
      this.decodificaService.findDecodificaByTipo('informatica'),
      this.decodificaService.findDecodificaByTipo('modalita-apprendimento-informatica'),
      this.decodificaService.findDecodificaByTipo('grado-conoscenza-informatica')
    ];
    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo){

          //necessario a causa delle decodifiche generiche con id di tipo any
          this.informaticas = multiResponse[0].list.map(function(decodifica:any) {
              decodifica.id = parseInt(decodifica.id, 10);
            return decodifica;
          });
        }
        if (multiResponse[1].esitoPositivo)
          this.modalitaApprendimentos = multiResponse[1].list;
        if (multiResponse[2].esitoPositivo)
          this.gradoConoscenzas = multiResponse[2].list;
      },
      error: (err) => {
        // this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      
      }
    });
  }

  private patchValueInform() {
    this.form.patchValue(this.conoscenzeInformatica.lavInformatica);
    this.informaticaDett = [];
    this.informaticaDett.push(this.conoscenzeInformatica.lavInformatica.silTInformaticaDett as Decodifica);
    this.form.get("silTInformaticaDett").patchValue(this.informaticaDett);
    this.form.get("silTInformaticaDett.informatica.descr").setValue(this.conoscenzeInformatica.lavInformatica.silTInformaticaDett.informatica.descr)
    
  }
}
