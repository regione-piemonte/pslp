/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Decodifica, EsperienzaProfessionale, ModalitaLavoro, RapportoDiLavoro, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';

import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'pslpwcl-modal-esperienza-lavoro-fascicolo',
  templateUrl: './modal-esperienza-lavoro-fascicolo.component.html',
  styleUrls: ['./modal-esperienza-lavoro-fascicolo.component.scss']
})
export class ModalEsperienzaLavoroFascicoloComponent implements OnInit {

  minDate:Date = new Date(1900,1,1);
  sysDate: Date = new Date();

  @Input() idSilLavAnagrafica?: number;
  @Input() esperienzaSelected?: EsperienzaProfessionale;
  @Input() mod: string = 'ins';

  @Output() annulla = new EventEmitter()
  @Output() updateList= new EventEmitter<EsperienzaProfessionale>();

  @ViewChild('nav') nav: NgbNav;


  esperienzaProfessionale?: EsperienzaProfessionale;
  modalitaLavSelected: ModalitaLavoro;
  formaDisabled=false;

  dAssunzioneFormat:string=""
  dCessazioneFOrmat:string=""
  dFinePeriodoFormativoFormat:string=""
  fascicolo?:SchedaAnagraficaProfessionale;

  formaOptions = [
    { descr: 'Determinato', id: 'D' },
    { descr: 'Indeterminato', id: 'I' }
  ];


  form = this.fb.group({
    //primo tab - primo oggetto
    tipoEsperienza: this.fb.group({ //tipo
      descr: [null, [Validators.required]]
    }),
    flgForma: this.fb.group({ //tipo
      descr: [null, [Validators.required]]
    }),
    lavEsperienzaLavoro: this.fb.group({
      idSilLavEsperienzaLavoro:[null],

      dataInizio: [null, [Validators.required]],
      dataFine: [null],
      numGgDurata: [null],

      silTTipoLavoro: this.fb.group({ //tipo
        dsSilTTipoLavoro: [null]
      }),
      flgForma: [null, [Validators.required]],//forma

      dsDenominazioneRp: [null],
      dsSoggettoPromotore: [null],

      silTTipoApprendistato: this.fb.group({//Tipo Apprendistato
        dsSilTTipoApprendistato: [{value:null,disabled:true}]
      }),
      dataFinePeriodoFormativo: [null,],

      tipoParttime: this.fb.group({
        dsSilTTipoParttime: [null]
      }),
      numOreParttime: [null],
      flgStagionale: [null],

      silTQualifica: this.fb.group({
        dsSilTQualifica: [null]
      }),
      silTGrado: this.fb.group({
        dsSilTGrado: [null]
      }),

      silTCcnl: this.fb.group({
        descr: [null]
      }),
      silTLivelloRetribuzione: this.fb.group({
        descr: [null]
      }),
      silTModalitaLavoro:this.fb.group({
        descrModalitaLavoro: [{value:null,disabled:true}]
      }),
      retribuzione: [null],

      dsMansione: [null],

      flgCv: [null],
      flgAssunzioneL68: [null],
      flgResponPers: [null],
      flgLavInMobilita: [null],
      flgLavoroAgricoltura: [null],
      //fine primo tab


      //inizio secondo tab
      //datore-azienda
      dsDenominazioneDl: [null],
      codFiscaleDl: [null,Validators.minLength(11)],

      silTAteco02: this.fb.group({
        descrSilTAteco02: [null]
      }),

      flgLuogoDl: ['I',null],
      silTComuneDl: this.fb.group({
        descr: [null]
      }),
      silTNazioneDl: this.fb.group({
        dsSilTNazione: [null]
      }),

      silTToponimoDl: this.fb.group({
        dsSilTToponimo: [null]
      }),
      dsIndirizzoDl: [null],
      dsNumCivicoDl: [null],

      //luogo-lavoro
      flgLuogoLavoroItalia: ['I',null],
      silTComuneLuogoLav: this.fb.group({
        descr: [null]
      }),
      silTNazioneLuogoLav: this.fb.group({
        dsSilTNazione: [null]
      }),

      silTToponimoLuogoLav: this.fb.group({
        dsSilTToponimo: [null]
      }),
      dsIndirizzoLuogoLav: [null],
      dsNumCivicoLuogoLav: [null],


      //azienda-utilizzatrice
      dsDenominazioneAu: [null],
      codFiscaleAu: [null,Validators.minLength(11)],
      silTAtecoAu: this.fb.group({
        descrSilTAteco02: [null]
      }),

      flgLuogoAu: ['I',null],
      silTComuneAu: this.fb.group({
        descr: [null]
      }),
      silTNazioneAu: this.fb.group({
        dsSilTNazione: [null]
      }),
      silTToponimoAu: this.fb.group({
        dsSilTToponimo: [null]
      }),

      dsIndirizzoAu: [null],
      dsNumCivicoAu: [null]
      //fine secondo tab
    })
  });
  dsIndirizzoDl:string="";
  dsIndirizzoLuogoLav:string="";
  dsIndirizzoAu:string="";


  constructor(
    private commonService:CommonService,
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
  ) { }
  ngOnInit(): void {
    this.esperienzaProfessionale = {...this.esperienzaSelected};
    //this.esperienzaProfessionale.dataAssunzione =

    this.dAssunzioneFormat=new Date(this.esperienzaProfessionale.dataAssunzione).toLocaleDateString([], {year:'numeric', month:'2-digit', day:'2-digit'})
    this.dCessazioneFOrmat=this.esperienzaProfessionale.dataCessazione?new Date(this.esperienzaProfessionale.dataCessazione).toLocaleDateString([], {year:'numeric', month:'2-digit', day:'2-digit'}):""
    this.dFinePeriodoFormativoFormat =this.esperienzaSelected.lavEsperienzaLavoro.dataFinePeriodoFormativo? new Date(this.esperienzaSelected.lavEsperienzaLavoro.dataFinePeriodoFormativo).toLocaleDateString([], {year:'numeric', month:'2-digit', day:'2-digit'}):"";
    this.esperienzaProfessionale.lavEsperienzaLavoro.flgForma = this.formaOptions.find(f=>f.id==this.esperienzaProfessionale.lavEsperienzaLavoro.flgForma)?.descr;

    this.esperienzaProfessionale.lavEsperienzaLavoro.flgStagionale = this.esperienzaSelected.lavEsperienzaLavoro.flgStagionale?(this.esperienzaSelected.lavEsperienzaLavoro.flgStagionale=="S" ? "SI": "NO"):null;
    this.esperienzaProfessionale.lavEsperienzaLavoro.flgCv = this.esperienzaSelected.lavEsperienzaLavoro.flgCv?(this.esperienzaSelected.lavEsperienzaLavoro.flgCv=="S" ? "SI": "NO"):null;
    this.esperienzaProfessionale.lavEsperienzaLavoro.flgAssunzioneL68 = this.esperienzaSelected.lavEsperienzaLavoro.flgAssunzioneL68?(this.esperienzaSelected.lavEsperienzaLavoro.flgAssunzioneL68=="S" ? "SI": "NO"):null;
    this.esperienzaProfessionale.lavEsperienzaLavoro.flgResponPers = this.esperienzaSelected.lavEsperienzaLavoro.flgResponPers?(this.esperienzaSelected.lavEsperienzaLavoro.flgResponPers=="S" ? "SI": "NO"):null;
    this.esperienzaProfessionale.lavEsperienzaLavoro.flgLavInMobilita = this.esperienzaSelected.lavEsperienzaLavoro.flgLavInMobilita?(this.esperienzaSelected.lavEsperienzaLavoro.flgLavInMobilita=="S" ? "SI": "NO"):null;
    this.esperienzaProfessionale.lavEsperienzaLavoro.flgLavoroAgricoltura = this.esperienzaSelected.lavEsperienzaLavoro.flgLavoroAgricoltura?(this.esperienzaSelected.lavEsperienzaLavoro.flgLavoroAgricoltura=="S" ? "SI": "NO"):null;

    //Indirizzi -

    if(this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoDl){
      const toponimo = this.esperienzaSelected.lavEsperienzaLavoro.silTToponimoDl?.dsSilTToponimo || '';
      const indirizzo = this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoDl || '';
      const civico = this.esperienzaSelected.lavEsperienzaLavoro.dsNumCivicoDl || '';

      this.dsIndirizzoDl = [toponimo, indirizzo, civico]
        .filter(part => part && part.trim()) // Rimuove parti vuote
        .join(' ') // Unisce con spazio
        .trim(); // Rimuove spazi extra
    }

    if(this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoLuogoLav){
      const toponimo = this.esperienzaSelected.lavEsperienzaLavoro.silTToponimoLuogoLav?.dsSilTToponimo || '';
      const indirizzo = this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoLuogoLav || '';
      const civico = this.esperienzaSelected.lavEsperienzaLavoro.dsNumCivicoLuogoLav || '';

      this.dsIndirizzoLuogoLav = [toponimo, indirizzo, civico]
        .filter(part => part && part.trim())
        .join(' ')
        .trim();
    }

    if(this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoAu){
      const toponimo = this.esperienzaSelected.lavEsperienzaLavoro.silTToponimoAu?.dsSilTToponimo || '';
      const indirizzo = this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoAu || '';
      const civico = this.esperienzaSelected.lavEsperienzaLavoro.dsNumCivicoAu || '';

      this.dsIndirizzoAu = [toponimo, indirizzo, civico]
        .filter(part => part && part.trim())
        .join(' ')
        .trim();
    }

    this.form.reset();
    this.form.disable();
    this.form.patchValue(this.esperienzaProfessionale);

    this.form.get("lavEsperienzaLavoro.dataInizio").patchValue(this.dAssunzioneFormat);
    this.form.get("lavEsperienzaLavoro.dataFine").patchValue(this.dCessazioneFOrmat);
    this.form.get("lavEsperienzaLavoro.dsIndirizzoDl").patchValue(this.dsIndirizzoDl);
    this.form.get("lavEsperienzaLavoro.dsIndirizzoLuogoLav").patchValue(this.dsIndirizzoLuogoLav);
    this.form.get("lavEsperienzaLavoro.dsIndirizzoAu").patchValue(this.dsIndirizzoAu);

    this.form.get("lavEsperienzaLavoro.dataFinePeriodoFormativo").patchValue(this.dFinePeriodoFormativoFormat);
  }

  formatData(data: Date){
    if (!(data instanceof Date)){
      const dateTmp = new Date(data);
      if(!isNaN(dateTmp.getTime()))
        data = dateTmp.toLocaleDateString([], {year:'numeric', month:'2-digit', day:'2-digit'}) as any;
    }

    return data;
  }

}
