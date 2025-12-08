/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AltreNotizie, ListaSpeciale, Posizione, SchedaAnagraficaProfessionale, IscrizioneComi } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-dati-amministrativi',
  templateUrl: './dati-amministrativi.component.html',
  styleUrls: ['./dati-amministrativi.component.scss']
})
export class DatiAmministrativiComponent implements OnInit {

  @Input() fascicolo:SchedaAnagraficaProfessionale;

  altreNotizie: AltreNotizie;
  listeSpeciali: Array<ListaSpeciale>;
  disabileList: Array<IscrizioneComi>;
  protettaList: Array<IscrizioneComi>;
  disabile: IscrizioneComi;
  protetta: IscrizioneComi;
  posizione: Posizione;

  dataDid: string ;
  statoOccupazione: string;
  condizioneOccupazionale: string ;
  activeIds = ["posizione", "ultimaIscrizioneDisagile", "ultimaIscrizioneCatProtetta"];

  constructor() { }

  ngOnInit(): void {
    this.posizione = this.fascicolo?.datiAmministrativi?.posizione
    this.listeSpeciali = this.fascicolo?.datiAmministrativi?.listeSpeciali
    this.altreNotizie = this.fascicolo?.datiAmministrativi?.altreNotizie
    this.protettaList = this.fascicolo?.datiAmministrativi?.listaIscrizioniComi.filter(
      iscri=> iscri.tipo.startsWith("Altr")
    );
    this.disabileList = this.fascicolo?.datiAmministrativi?.listaIscrizioniComi.filter(
      iscri=> iscri.tipo.match("Disabili")
    );
    if(this.disabileList){
      this.disabile = this.disabileList[0];
      this.protetta = this.protettaList[0];
    }


    // this.disabile.dataIscrizione
  }

  getFascicolo(){
    return {};
  }

}
