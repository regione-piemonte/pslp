/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input } from '@angular/core';
import { Decodifica, DecodificaPslpService, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-dati-curriculari',
  templateUrl: './dati-curriculari.component.html',
  styleUrls: ['./dati-curriculari.component.scss']
})
export class DatiCurriculariComponent implements OnInit {
  @Input() fascicolo:SchedaAnagraficaProfessionale;


  albi: Decodifica[];
  patenti: Decodifica[];
  constructor(
    private decodificaService:DecodificaPslpService,

  ) { }

  ngOnInit(): void {
    this.configDecodifiche();
  }

  configDecodifiche(){
    this.decodificaService.findDecodificaByTipo('albi').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.albi = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('TIPO-PATENTE').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.patenti = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }

  get idSilLavAnagrafica(){
    return this.fascicolo?.idSilLavAnagrafica;
  }
  get altreInformazioni(){
    return this.fascicolo?.informazioniCurriculari?.altreInformazioni;
  }
  get patentiPossedute(){
    return this.fascicolo?.informazioniCurriculari?.patenti;
  }
  get conoscenzeInformatiche(){
    return this.fascicolo?.informazioniCurriculari?.conoscenzeInformatiche;
  }


}
