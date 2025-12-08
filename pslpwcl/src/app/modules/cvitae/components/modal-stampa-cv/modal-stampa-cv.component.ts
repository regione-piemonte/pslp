/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiepilogoComponent } from '../gestione-cv/tabs-sezioni/riepilogo/riepilogo.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'pslpwcl-modal-stampa-cv',
  templateUrl: './modal-stampa-cv.component.html',
  styleUrls: ['./modal-stampa-cv.component.scss']
})
export class ModalStampaCvComponent implements OnInit {


@ViewChild("riepilogo") riepilogo:RiepilogoComponent
  imageUrl:any=""
  datiFoto:any
  tipoFoto:any

  fotoVisibile:boolean=true


  form=this.fb.group({
    colore:[null,Validators.required],
    stampaFoto:[{value:"S",disabled:true}]
  })

  colorSelected="#E7E6E6"
  colori=[
    {
      descr:"Bianco",
      exaDecimal:"#FFFFFF"
    },
    {
      descr:"Grigio chiaro",
      exaDecimal:"#E7E6E6"
    },
    {
      descr:"Grigio scuro",
      exaDecimal:"#CECCCC"
    },
    {
      descr:"Azzurro",
      exaDecimal:"#99CCFF"
    },
    {
      descr:"Rosso",
      exaDecimal:"#FF0000"
    },
    {
      descr:"Verde",
      exaDecimal:"#6FDB6F"
    }
  ]
  constructor(
    private fb:FormBuilder,
    public activeModal: NgbActiveModal,
    private commonService:CommonService,
    private domSanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {

    if(this.commonService.fascicolo.datiAnagrafici.datiGenerali.foto){
      this.form.controls['stampaFoto'].enable()
      this.tipoFoto=this.commonService.fascicolo.datiAnagrafici.datiGenerali.foto.nomeFile.split(".")[1];
      this.datiFoto=this.commonService.fascicolo.datiAnagrafici.datiGenerali.foto.bFoto;
      this.imageUrl=this.domSanitizer.bypassSecurityTrustUrl(`data:${this.tipoFoto};base64,${this.datiFoto}`);
    }else{
      this.form.controls['stampaFoto'].disable()
    }

  }


  onSelectStampaFoto() {
    this.fotoVisibile=this.form.controls['stampaFoto'].value=="S"
  }
}
