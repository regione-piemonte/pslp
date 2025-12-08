/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { LogService } from './../../../../../services/log.service';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { TYPE_ALERT } from 'src/app/constants';
import { AziSede, Decodifica, FascicoloPslpService, DecodificaPslpService, EsperienzaProfessionale, ModalitaLavoro, MsgResponse, PslpMessaggio } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { Utils } from 'src/app/utils';
import { TipoLavoroResponse } from 'src/app/modules/pslpapi';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-inserisci-esperienza-lavoro',
  templateUrl: './inserisci-esperienza-lavoro.component.html',
  styleUrls: ['./inserisci-esperienza-lavoro.component.scss']
})
export class InserisciEsperienzaLavoroComponent implements OnInit {


  minDate:Date = new Date(1900,1,1);
  sysDate: Date = new Date();

  @Input() idSilLavAnagrafica?: number;
  @Input() esperienzaSelected?: EsperienzaProfessionale;
  private _mod: string = 'ins';
  @Input() 
  set mod(value: string){
    this._mod = value;
    this.nav?.select(0);
    if(value == 'ins'){
      this.form.reset();
      this.formLuogoDl.reset();
      this.formLuogoLav.reset();
      this.formLuogoAu.reset();
    }
  }

  get mod(){
    return this._mod;
  }

  @Output() annulla = new EventEmitter()
  @Output() updateList= new EventEmitter<EsperienzaProfessionale>();

  @ViewChild('nav') nav: NgbNav;


  tipoLavori: Decodifica[] = [];
  tipoApprendistati: Decodifica[] = [];
  modalitaLavori: Decodifica[] = [];
  tipoPartTime: Decodifica[] = [{
    id:null,
    descr:"--"
  }];
  qualifiche: Decodifica[] = [];
  gradi: Decodifica[] = [];
  ccnl: Decodifica[] = [];
  livelli: Decodifica[] = [];
  attivita: Decodifica[] = [];
  //comuni: Decodifica[] = [];
  stati: Decodifica[] = [];
  toponimi: Decodifica[] = [];
  correspondingLivelli: Decodifica[] = [];
  province:Decodifica[] = [];
  comuniDl:Decodifica[] = [];
  comuniAu:Decodifica[] = [];
  comuniLuogoLav:Decodifica[] = [];
  modalitaLavSelected: ModalitaLavoro;
  numCivicoRegex: RegExp = /^\d+[A-Za-z\d/]*$/;
  formaDisabled=false;

  modalitaLavoroSelected: Decodifica;



  formaOptions = [
    { descr: 'Determinato', id: 'D' },
    { descr: 'Indeterminato', id: 'I' }
  ];

  esperienza:EsperienzaProfessionale;
  formLuogoDl:FormGroup=this.fb.group({
    indirizzo: this.fb.group({
      luogo: this.fb.group({
        flgLuogoItalia: [null],

        comune: this.fb.group({
          id: [null],
          descr: [null],
          silTProvincia:
            this.fb.group({
              idSilTProvincia: [null],
              descr: [null]
            }),
        }),
        stato: this.fb.group({
          idSilTNazione: [null],
          dsSilTNazione: [null]
        }),
      }),

      toponimo: this.fb.group({
        id: [null],
        descr: [null]
      }),
      numeroCivico: [null],
      cap: [null],
      indirizzo: [null],
      localita: [null]
    })
  });
  formLuogoLav:FormGroup=this.fb.group({
    indirizzo: this.fb.group({
      luogo: this.fb.group({
        flgLuogoItalia: [null],

        comune: this.fb.group({
          id: [null],
          descr: [null],
          silTProvincia:
            this.fb.group({
              idSilTProvincia: [null],
              descr: [null]
            }),
        }),
        stato: this.fb.group({
          idSilTNazione: [null],
          dsSilTNazione: [null]
        }),
      }),

      toponimo: this.fb.group({
        id: [null],
        descr: [null]
      }),
      numeroCivico: [null],
      cap: [null],
      indirizzo: [null],
      localita: [null]
    })
  });
  formLuogoAu:FormGroup=this.fb.group({
    indirizzo: this.fb.group({
      luogo: this.fb.group({
        flgLuogoItalia: [null],

        comune: this.fb.group({
          id: [null],
          descr: [null],
          silTProvincia:
            this.fb.group({
              idSilTProvincia: [null],
              descr: [null]
            }),
        }),
        stato: this.fb.group({
          idSilTNazione: [null],
          dsSilTNazione: [null]
        }),
      }),

      toponimo: this.fb.group({
        id: [null],
        descr: [null]
      }),
      numeroCivico: [null],
      cap: [null],
      indirizzo: [null],
      localita: [null]
    })
  });
  form = this.fb.group({
    //primo tab - primo oggetto
    lavEsperienzaLavoro: this.fb.group({
      idSilLavEsperienzaLavoro:[null],

      dataInizio: [null, [Validators.required]],
      dataFine: [null],
      numGgDurata: [null],

      silTTipoLavoro: this.fb.group({ //tipo
        idSilTTipoLavoro: [null, [Validators.required]]
      }),
      flgForma: [null, [Validators.required]],//forma

      dsDenominazioneRp: [null],
      dsSoggettoPromotore: [null],

      silTTipoApprendistato: this.fb.group({//Tipo Apprendistato
        idSilTTipoApprendistato: [{value:null,disabled:true}]
      }),
      dataFinePeriodoFormativo: [null,],

      tipoParttime: this.fb.group({
        idSilTTipoParttime: [null]
      }),
      numOreParttime: [null],
      flgStagionale: [null],

      silTQualifica: this.fb.group({
        idSilTQualifica: [null]
      }),
      silTGrado: this.fb.group({
        idSilTGrado: [null]
      }),

      silTCcnl: this.fb.group({
        id: [null]
      }),
      silTLivelloRetribuzione: this.fb.group({
        id: [null]
      }),
      silTModalitaLavoro:this.fb.group({
        idSilTModalitaLavoro: [{value:null,disabled:true}]
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
        idSilTAteco02: [null]
      }),
      /*luogoDl:this.formLuogoDl,
      luogoLav:this.formLuogoLav,
      luogoAu:this.formLuogoAu,*/
    /*  flgLuogoDl: ['I',null],
      silTComuneDl: this.fb.group({
        id: [null]
      }),
      silTNazioneDl: this.fb.group({
        idSilTNazione: [null]
      }),

      silTToponimoDl: this.fb.group({
        idSilTToponimo: [null]
      }),
      dsIndirizzoDl: [null],
      dsNumCivicoDl: [null],*/

      //luogo-lavoro
      /*flgLuogoLavoroItalia: ['I',null],
      silTComuneLuogoLav: this.fb.group({
        id: [null]
      }),
      silTNazioneLuogoLav: this.fb.group({
        idSilTNazione: [null]
      }),

      silTToponimoLuogoLav: this.fb.group({
        idSilTToponimo: [null]
      }),
      dsIndirizzoLuogoLav: [null],
      dsNumCivicoLuogoLav: [null],*/


      //azienda-utilizzatrice
      dsDenominazioneAu: [null],
      codFiscaleAu: [null,Validators.minLength(11)],
      silTAtecoAu: this.fb.group({
        idSilTAteco02: [null]
      }),

      /*flgLuogoAu: ['I',null],
      silTComuneAu: this.fb.group({
        id: [null]
      }),
      silTNazioneAu: this.fb.group({
        idSilTNazione: [null]
      }),
      silTToponimoAu: this.fb.group({
        idSilTToponimo: [null]
      }),

      dsIndirizzoAu: [null],
      dsNumCivicoAu: [null]*/
      //fine secondo tab
    })
  });

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;


  constructor(
    private decodificaService:DecodificaPslpService,
    private fb:FormBuilder,
    private spinner: NgxSpinnerService,
    private fascicoloService:FascicoloPslpService,
    private logService:LogService,
    private promptModalService:PromptModalService,
    private commonService: CommonService,
    private msgService:MessageService
  ) { }



  ngOnInit(): void {
    this.configDecodifiche();
    this.nav?.select(0);
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });
    
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });

    this.form.get('lavEsperienzaLavoro.silTTipoLavoro.idSilTTipoLavoro').valueChanges.subscribe(valore => {
      if(valore == "AP"){
        this.form.get('lavEsperienzaLavoro.silTTipoApprendistato.idSilTTipoApprendistato').addValidators(Validators.required);
      }else{
        this.form.get('lavEsperienzaLavoro.silTTipoApprendistato.idSilTTipoApprendistato').clearValidators();
      }
      this.form.get('lavEsperienzaLavoro.silTTipoApprendistato.idSilTTipoApprendistato').updateValueAndValidity();
    })

    this.setForm();
  }


  filtraAttivita(event:any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<3){return;}
    this.decodificaService.fillDecodificaByTipo("ateco02",txt).subscribe({
      next:ris=>{
        if(ris.esitoPositivo)
          this.attivita=ris.list
      }
    })
  }

  configDecodifiche(){
    this.decodificaService.findDecodificaByTipo('LIVELLO-RETRIBUZIONE').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.livelli = r.list;
          this.correspondingLivelli = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('PROVINCIA').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.province = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('GRADO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.gradi = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('TIPO-PART-TIME').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoPartTime = this.tipoPartTime.concat(r.list);
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('TIPO-APPRENDISTATO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoApprendistati = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('TIPO-LAVORO-FORMA').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoLavori = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('MODALITA-LAVORO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.modalitaLavori = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('CCNL').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.ccnl = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })

    this.decodificaService.findDecodificaByTipo('NAZIONE').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.stati = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('TOPONIMO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.toponimi = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }

  onFilterQualifica(event: any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("QUALIFICA",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.qualifiche = [...r.list];
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }


  isRequired(): boolean {
    return this.form.get('lavEsperienzaLavoro.silTTipoLavoro.idSilTTipoLavoro').value == 'AP';
  }


  enableOrDisableFormControls(idTipo: any) {

    let tipoLavoro = this.tipoLavori.find(t=> t.id == idTipo)

    const soggettoPromotore = this.form.get('lavEsperienzaLavoro.dsSoggettoPromotore');
    const denominazione = this.form.get('lavEsperienzaLavoro.dsDenominazioneRp');
    const tipoApprendistato = this.form.get('lavEsperienzaLavoro.silTTipoApprendistato');
    const forma = this.form.get('lavEsperienzaLavoro.flgForma');
    const flgStagionale = this.form.get('lavEsperienzaLavoro.flgStagionale');
    const dataFinePeriodoFormativo = this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo');

    if(tipoLavoro?.special == "D" || tipoLavoro?.special =="I"){
      this.formaDisabled = true;
      forma.setValue(tipoLavoro?.special);
    }

    if(tipoLavoro?.special == "E"){
      this.formaDisabled = false;
      this.decodificaService.findTipoLavoro(tipoLavoro?.codice).subscribe({
        next: (res:TipoLavoroResponse) => {
          if (res?.esitoPositivo) {
            forma.setValue(res.tipoLavoro.flgFormaDefault);
          }
        }
      });

    }

    if (tipoLavoro && tipoLavoro.codice == 'AP') {
      tipoApprendistato.reset();
      dataFinePeriodoFormativo.reset();
      tipoApprendistato.enable();
      dataFinePeriodoFormativo.enable();
      tipoApprendistato.setValidators([Validators.required]);
      tipoApprendistato.updateValueAndValidity();
    } else {
      tipoApprendistato.disable();
      dataFinePeriodoFormativo.disable();
      tipoApprendistato.reset();
      dataFinePeriodoFormativo.reset();
      tipoApprendistato.clearValidators();
      tipoApprendistato.updateValueAndValidity();
    }

    if (tipoLavoro && (tipoLavoro.codice == 'TR' || tipoLavoro.codice == 'RP3')) {
      denominazione.reset();
      denominazione.enable();
    } else {
      denominazione.disable();
      denominazione.reset();
    }
    if (tipoLavoro && (tipoLavoro.codice == 'TR' || tipoLavoro.codice == 'RP3' || tipoLavoro.codice == 'RP4')) {
      soggettoPromotore.reset();
      soggettoPromotore.enable();
    } else {
      soggettoPromotore.disable();
      soggettoPromotore.reset();
    }

    if(this.mod=="view"){
      this.form.disable()
    }
  }
  private dataRangeValidator:
  ValidatorFn = (): {[key: string]: any;} | null =>
    {
    let invalidDataRangeCessaz = false;
    let invalidDataRangePeriodo = false;



    const dataAssunzione = this.form.get('lavEsperienzaLavoro.dataInizio').value;
    const dataCessazione = this.form.get('lavEsperienzaLavoro.dataFine').value;
    const dataFinePeriodoFormativo = this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo').value;
    const dataFinePeriodoFormativoIsDisabled = this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo').disabled;
    if (!dataAssunzione || !dataCessazione) {
      return null;
    }

    if (dataCessazione) {
      const dtInizio: Date = new Date(dataAssunzione);
      const dtFine: Date = new Date(dataCessazione);
      dtInizio.setHours(0, 0, 0, 0);
      dtFine.setHours(0, 0, 0, 0);
      invalidDataRangeCessaz = dtInizio.valueOf() > dtFine.valueOf();
    }

    if (dataFinePeriodoFormativo && !dataFinePeriodoFormativoIsDisabled) {
      const dtInizio: Date = new Date(dataAssunzione);
      const dtFinePeriodo: Date = new Date(dataFinePeriodoFormativo);
      dtInizio.setHours(0, 0, 0, 0);
      dtFinePeriodo.setHours(0, 0, 0, 0);
      invalidDataRangePeriodo = dtInizio.valueOf() > dtFinePeriodo.valueOf();
    }

    if(!invalidDataRangePeriodo){
      this.form.get('lavEsperienzaLavoro.dataInizio').setErrors(null)
      this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo').setErrors(null)
    }else{
      this.form.get('lavEsperienzaLavoro.dataInizio').setErrors({invalidDataRangePeriodo:true})
      this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo').setErrors({invalidDataRangePeriodo:true})
      return {invalidDataRangePeriodo}
    }

    if(!invalidDataRangeCessaz){
      this.form.get('lavEsperienzaLavoro.dataFine').setErrors(null)
      this.form.get('lavEsperienzaLavoro.dataInizio').setErrors(null)
    }else{
      this.form.get('lavEsperienzaLavoro.dataFine').setErrors({invalidDataRangeCessaz:true})
      this.form.get('lavEsperienzaLavoro.dataInizio').setErrors({invalidDataRangeCessaz:true})
      return {invalidDataRangeCessaz}
    }

    return (invalidDataRangeCessaz || invalidDataRangePeriodo) ? { invalidDataRangeCessaz, invalidDataRangePeriodo } : null;
  }


  setForm(){

    this.form.reset();
    this.formLuogoDl.get('indirizzo.luogo.flgLuogoItalia').setValue('I')
    this.formLuogoLav.get('indirizzo.luogo.flgLuogoItalia').setValue('I')
    this.formLuogoAu.get('indirizzo.luogo.flgLuogoItalia').setValue('I')


    this.form.get('lavEsperienzaLavoro.silTModalitaLavoro.idSilTModalitaLavoro').disable()

    this.form.get('lavEsperienzaLavoro.dataInizio').addValidators([this.dataRangeValidator]);
    this.form.get('lavEsperienzaLavoro.dataInizio').updateValueAndValidity();
    this.form.get('lavEsperienzaLavoro.dataFine').addValidators([this.dataRangeValidator]);
    this.form.get('lavEsperienzaLavoro.dataFine').updateValueAndValidity();
    this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo').addValidators([this.dataRangeValidator]);
    this.form.get('lavEsperienzaLavoro.dataFinePeriodoFormativo').updateValueAndValidity();
    if(this.mod == "view"){
      this.form.disable();
      return;
    }else{
      this.form.enable();
      this.setFormControls();
      this.setLuogoDlSedeControl();
      this.setLuogoLavSedeControl();
      this.setLuogoAuSedeControl();
    }



    //this.form.get('lavEsperienzaLavoro.silTTipoLavoro.idSilTTipoLavoro').setValue('CD');
    this.form.markAsUntouched()

  }

  setFormControls() {
    const lavEsperienzaLavoro = this.form.get('lavEsperienzaLavoro');
    const forma = lavEsperienzaLavoro.get('flgForma');
    const denominazione = lavEsperienzaLavoro.get('dsDenominazioneRp');
    const soggettoPromotore = lavEsperienzaLavoro.get('dsSoggettoPromotore');
    const tipoApprendistato = lavEsperienzaLavoro.get('silTTipoApprendistato');
    const numOreParttime = lavEsperienzaLavoro.get('numOreParttime');
    const dataFinePeriodoFormativo = lavEsperienzaLavoro.get('dataFinePeriodoFormativo');
    const flgStagionale = lavEsperienzaLavoro.get('flgStagionale');
    const livello = lavEsperienzaLavoro.get('silTLivelloRetribuzione');
    const tipoParttime=  lavEsperienzaLavoro.get('tipoParttime');

    denominazione.disable();
    soggettoPromotore.disable();
   // tipoApprendistato.disable();
    numOreParttime.disable();
    dataFinePeriodoFormativo.disable();
    flgStagionale.enable();
    livello.disable();
    //tipoParttime.disable();
  }

  setLuogoDlSedeControl() {
    const flgLuogoDl = this.formLuogoDl.get('indirizzo.luogo.flgLuogoItalia').value;

    if (flgLuogoDl == 'I') {
      this.formLuogoDl.get('indirizzo.luogo.stato').reset();
      this.formLuogoDl.get('indirizzo.luogo.stato').disable();
      this.formLuogoDl.get('indirizzo.luogo.comune').enable();
      this.formLuogoDl.get('indirizzo.toponimo').enable();
      this.formLuogoDl.get('indirizzo.indirizzo').enable();
      this.formLuogoDl.get('indirizzo.numeroCivico').enable();
    } else {
      this.formLuogoDl.get('indirizzo.luogo.comune').reset();
      this.formLuogoDl.get('indirizzo.toponimo').reset();
      this.formLuogoDl.get('indirizzo.indirizzo').reset();
      this.formLuogoDl.get('indirizzo.numeroCivico').reset();
      this.formLuogoDl.get('indirizzo.luogo.flgLuogoItalia').patchValue('E');
      this.formLuogoDl.get('indirizzo.luogo.stato').enable();
      this.formLuogoDl.get('indirizzo.luogo.comune').disable();
      this.formLuogoDl.get('indirizzo.toponimo').disable();
      this.formLuogoDl.get('indirizzo.indirizzo').disable();
      this.formLuogoDl.get('indirizzo.numeroCivico').disable();
    }
  }
  setLuogoLavSedeControl() {
    const flgLuogoLavoroItalia = this.formLuogoLav.get('indirizzo.luogo.flgLuogoItalia').value;

    if (flgLuogoLavoroItalia == 'I') {
      this.formLuogoLav.get('indirizzo.luogo.stato').reset();
      this.formLuogoLav.get('indirizzo.luogo.stato').disable();
      this.formLuogoLav.get('indirizzo.luogo.comune').enable();
      this.formLuogoLav.get('indirizzo.toponimo').enable();
      this.formLuogoLav.get('indirizzo.indirizzo').enable();
      this.formLuogoLav.get('indirizzo.numeroCivico').enable();
    } else {
      this.formLuogoLav.get('indirizzo.luogo.comune').reset();
      this.formLuogoLav.get('indirizzo.toponimo').reset();
      this.formLuogoLav.get('indirizzo.indirizzo').reset();
      this.formLuogoLav.get('indirizzo.numeroCivico').reset();
      this.formLuogoLav.get('indirizzo.luogo.flgLuogoItalia').patchValue('E');
      this.formLuogoLav.get('indirizzo.luogo.stato').enable();
      this.formLuogoLav.get('indirizzo.luogo.comune').disable();
      this.formLuogoLav.get('indirizzo.toponimo').disable();
      this.formLuogoLav.get('indirizzo.indirizzo').disable();
      this.formLuogoLav.get('indirizzo.numeroCivico').disable();
    }
  }

  setLuogoAuSedeControl() {
    const flgLuogoAu = this.formLuogoAu.get('indirizzo.luogo.flgLuogoItalia').value;

    if (flgLuogoAu == 'I') {
      this.formLuogoAu.get('indirizzo.luogo.stato').reset();
      this.formLuogoAu.get('indirizzo.luogo.stato').disable();
      this.formLuogoAu.get('indirizzo.luogo.comune').enable();
      this.formLuogoAu.get('indirizzo.toponimo').enable();
      this.formLuogoAu.get('indirizzo.indirizzo').enable();
      this.formLuogoAu.get('indirizzo.numeroCivico').enable();
    } else {
      this.formLuogoAu.get('indirizzo.luogo.comune').reset();
      this.formLuogoAu.get('indirizzo.toponimo').reset();
      this.formLuogoAu.get('indirizzo.indirizzo').reset();
      this.formLuogoAu.get('indirizzo.numeroCivico').reset();
      this.formLuogoAu.get('indirizzo.luogo.flgLuogoItalia').patchValue('E');
      this.formLuogoAu.get('indirizzo.luogo.stato').enable();
      this.formLuogoAu.get('indirizzo.luogo.comune').disable();
      this.formLuogoAu.get('indirizzo.toponimo').disable();
      this.formLuogoAu.get('indirizzo.indirizzo').disable();
      this.formLuogoAu.get('indirizzo.numeroCivico').disable();
    }
  }
  setModalitaLavoro(event:any) {
    this.modalitaLavoroSelected = null;
    const lavEsperienzaLavoro = this.form.controls['lavEsperienzaLavoro'];
    if(event){
        lavEsperienzaLavoro.get('numOreParttime').reset()
        lavEsperienzaLavoro.get('numOreParttime').enable()
        if(this.tipoPartTime.find(tp=>tp.id==event)?.special){
          lavEsperienzaLavoro.get('silTModalitaLavoro.idSilTModalitaLavoro')
          .setValue(this.tipoPartTime.find(tp=>tp.id==event)?.special);
          this.modalitaLavoroSelected = this.modalitaLavori.filter(mod=>mod.id==this.tipoPartTime.find(tp=>tp.id==event)?.special)[0]
        }else{
          lavEsperienzaLavoro.get('silTModalitaLavoro.idSilTModalitaLavoro')
          .setValue(this.esperienzaSelected.lavEsperienzaLavoro.tipoParttime.idSilTModalitaLavoro);
          this.modalitaLavoroSelected = this.modalitaLavori.filter(mod=>mod.id==event)[0]
        }
    }else{
        lavEsperienzaLavoro.get('numOreParttime').reset()
        lavEsperienzaLavoro.get('numOreParttime').disable()
    }
  }

  async onClickAnnulla() {
      if(this.mod!=='view'){
      const data: DialogModaleMessage = {
        titolo: this.mod === 'ins' ? 'Inserimento esperienza professionale' : 'Modifica esperienza professionale',
        tipo: TypeDialogMessage.YesOrNo,
        messaggio: "Sei sicuro di voler annullare l'operazione? Gli eventuali dati non salvati andranno persi.",
        messaggioAggiuntivo: "",
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result === 'SI') {
        // this.alertMessageService.emptyMessages();
        this.annulla.emit();
        return true;
      } else {
        return false;
      }
    }
    this.annulla.emit();
    return true;
  }
  async onClickOpenaModalRicercaAzienda(who: string) {
    const res = await this.promptModalService.openRicercaAzienda("Ricerca azienda");
    if (res) {
      this.patchAziendaSelected(res.azienda, who)
    }
    this.spinner.hide();
  }
  private patchAziendaSelected(azienda: AziSede, who: string) {


    if (who == 'datoreLavoro') {
      if (azienda && azienda.aziAnagrafica && azienda.aziAnagrafica.codFiscale) {
        this.form.get('lavEsperienzaLavoro.codFiscaleDl').patchValue(azienda.aziAnagrafica.codFiscale);
      }
      if (azienda && azienda.silTAteco02) {
        const listTmp = Utils.clone(this.attivita);
        this.attivita = listTmp;
        this.attivita.push({
          id: azienda.silTAteco02.idSilTAteco02,
          descr: azienda.silTAteco02.descrSilTAteco02
        });
        this.form.get('lavEsperienzaLavoro.silTAteco02.idSilTAteco02').patchValue(azienda.silTAteco02.idSilTAteco02)
      }
      if (azienda && azienda.comune) {
       // const listTmp = Utils.clone(this.comuniDl);
        this.comuniDl = []
        this.comuniDl.push({
          id: azienda.comune.id,
          descr: azienda.comune.descr
        });
        this.formLuogoDl.get('indirizzo.luogo.comune.id').patchValue(azienda.comune.id);
        this.formLuogoDl.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(azienda.comune.silTProvincia.idSilTProvincia);

      }
      if (azienda && azienda.nazione) {
        this.formLuogoDl.get('indirizzo.luogo.stato.idSilTNazione').patchValue(azienda.nazione.idSilTNazione);
      }
      if (azienda && azienda.toponimo) {
        this.formLuogoDl.get('indirizzo.toponimo.id').patchValue(azienda.toponimo.idSilTToponimo);
      }
      this.formLuogoDl.get('indirizzo.luogo.flgLuogoItalia').patchValue(azienda.flgLuogo);
      this.form.get('lavEsperienzaLavoro.dsDenominazioneDl').patchValue(azienda.descrDenominazione);
      this.formLuogoDl.get('indirizzo.indirizzo').patchValue(azienda.descrIndirizzo);
      this.formLuogoDl.get('indirizzo.numeroCivico').patchValue(azienda.descrNumCivico);

    } else if (who === 'aziendaUt') {
      if (azienda && azienda.aziAnagrafica && azienda.aziAnagrafica.codFiscale) {
        this.form.get('lavEsperienzaLavoro.codFiscaleAu').patchValue(azienda.aziAnagrafica.codFiscale);
      }
      if (azienda && azienda.silTAteco02) {
        const listTmp = Utils.clone(this.attivita);
        this.attivita = listTmp;
        this.attivita.push({
          id: azienda.silTAteco02.idSilTAteco02,
          descr: azienda.silTAteco02.descrSilTAteco02
        });
        this.form.get('lavEsperienzaLavoro.silTAtecoAu.idSilTAteco02').patchValue(azienda.silTAteco02.idSilTAteco02);
      }
      if (azienda && azienda.comune) {
        //let listTmp = Utils.clone(this.comuniAu);
        this.comuniAu = []
        this.comuniAu.push({
          id: azienda.comune.id,
          descr: azienda.comune.descr
        });
        this.formLuogoAu.get('indirizzo.luogo.comune.id').patchValue(azienda.comune.id);
        this.formLuogoAu.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(azienda.comune.silTProvincia.idSilTProvincia);
      }
      if (azienda && azienda.nazione) {
        this.formLuogoAu.get('indirizzo.luogo.stato.idSilTNazione').patchValue(azienda.nazione.idSilTNazione);
      }
      if (azienda && azienda.toponimo) {
        this.formLuogoAu.get('indirizzo.toponimo.id').patchValue(azienda.toponimo.idSilTToponimo);
      }
      this.formLuogoAu.get('indirizzo.luogo.flgLuogoItalia').patchValue(azienda.flgLuogo);
      this.form.get('lavEsperienzaLavoro.dsDenominazioneAu').patchValue(azienda.descrDenominazione);
      this.formLuogoAu.get('indirizzo.indirizzo').patchValue(azienda.descrIndirizzo);
      this.formLuogoAu.get('indirizzo.numeroCivico').patchValue(azienda.descrNumCivico);
    }
  }


  onConferma(){

    if (this.nav.activeId === 0) {
      //console.log(this.form)
      this.nav?.select(1);
      //console.log(this.form)
    } else if (this.nav.activeId === 1) {

    this.confermaEsperienza();
    }

  }

  private confermaEsperienza() {
   // this.spinner.show();
    // this.alertMessageService.emptyMessages();
    this.form.markAllAsTouched()
    console.log(this.form)
    if(!this.form.valid){
      return;
    }
    const lavEsperienzaLavoro = this.form.controls['lavEsperienzaLavoro'];
    const idModalitaLavoro=lavEsperienzaLavoro.get('silTModalitaLavoro.idSilTModalitaLavoro').value;
    let esperienzaProfessionale = this.form.getRawValue() as EsperienzaProfessionale;
    this.modalitaLavSelected=this.modalitaLavori.filter(mod=>mod.id==idModalitaLavoro).map(dec=>{
      return {
        codModalitaLavoroMin:dec.codice,
        descrModalitaLavoro:dec.descr,
        idSilTModalitaLavoro:Number(dec.id)
      }
    })[0]

    if(this.form.untouched){
      this.annulla.emit()
      return
    }

    esperienzaProfessionale.lavEsperienzaLavoro.idSilLavAnagrafica = this.idSilLavAnagrafica;
    esperienzaProfessionale.lavEsperienzaLavoro.silTModalitaLavoro = this.modalitaLavSelected??{idSilTModalitaLavoro:1};

    esperienzaProfessionale.dataAssunzione = esperienzaProfessionale.lavEsperienzaLavoro.dataInizio
    esperienzaProfessionale.dataCessazione = esperienzaProfessionale.lavEsperienzaLavoro.dataFine


    esperienzaProfessionale.lavEsperienzaLavoro.flgStagionale = this.form.get('lavEsperienzaLavoro.flgStagionale').value === 'S' ? 'S' : 'N';
    esperienzaProfessionale.lavEsperienzaLavoro.flgCv = this.form.get('lavEsperienzaLavoro.flgCv').value === 'S' ? 'S' : 'N';
    esperienzaProfessionale.lavEsperienzaLavoro.flgAssunzioneL68 = this.form.get('lavEsperienzaLavoro.flgAssunzioneL68').value === 'S' ? 'S' : 'N';
    esperienzaProfessionale.lavEsperienzaLavoro.flgResponPers = this.form.get('lavEsperienzaLavoro.flgResponPers').value === 'S' ? 'S' : 'N';
    esperienzaProfessionale.lavEsperienzaLavoro.flgLavInMobilita = this.form.get('lavEsperienzaLavoro.flgLavInMobilita').value === 'S' ? 'S' : 'N';
    esperienzaProfessionale.lavEsperienzaLavoro.flgLavoroAgricoltura = this.form.get('lavEsperienzaLavoro.flgLavoroAgricoltura').value === 'S' ? 'S' : 'N';


    esperienzaProfessionale.lavEsperienzaLavoro.dsIndirizzoDl=this.formLuogoDl.get('indirizzo.indirizzo').value
    esperienzaProfessionale.lavEsperienzaLavoro.dsNumCivicoDl=this.formLuogoDl.get('indirizzo.numeroCivico').value
    esperienzaProfessionale.lavEsperienzaLavoro.silTComuneDl=this.formLuogoDl.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoDl.get('indirizzo.luogo.comune.id').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.silTNazioneDl=this.formLuogoDl.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoDl.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.silTToponimoDl=this.formLuogoDl.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoDl.get('indirizzo.toponimo.id').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.flgLuogoDl=this.formLuogoDl.get('indirizzo.luogo.flgLuogoItalia').value

    esperienzaProfessionale.lavEsperienzaLavoro.dsIndirizzoAu=this.formLuogoAu.get('indirizzo.indirizzo').value
    esperienzaProfessionale.lavEsperienzaLavoro.dsNumCivicoAu=this.formLuogoAu.get('indirizzo.numeroCivico').value
    esperienzaProfessionale.lavEsperienzaLavoro.silTComuneAu=this.formLuogoAu.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoAu.get('indirizzo.luogo.comune.id').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.silTNazioneAu=this.formLuogoAu.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoAu.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.silTToponimoAu=this.formLuogoAu.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoAu.get('indirizzo.toponimo.id').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.flgLuogoAu=this.formLuogoAu.get('indirizzo.luogo.flgLuogoItalia').value

    esperienzaProfessionale.lavEsperienzaLavoro.dsIndirizzoLuogoLav=this.formLuogoLav.get('indirizzo.indirizzo').value
    esperienzaProfessionale.lavEsperienzaLavoro.dsNumCivicoLuogoLav=this.formLuogoLav.get('indirizzo.numeroCivico').value
    esperienzaProfessionale.lavEsperienzaLavoro.silTComuneLuogoLav=this.formLuogoLav.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoLav.get('indirizzo.luogo.comune.id').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.silTNazioneLuogoLav=this.formLuogoLav.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoLav.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    esperienzaProfessionale.lavEsperienzaLavoro.silTToponimoLuogoLav=this.formLuogoLav.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoLav.get('indirizzo.toponimo.id').value}:null


    esperienzaProfessionale = Utils.cleanObject(esperienzaProfessionale)


    this.fascicoloService.insertOrUpdateEsperienzaLavoro(esperienzaProfessionale).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          let esperienzaProfessionale: EsperienzaProfessionale = {
            idEsperienzaProfessionale: res.lavEsperienzaLavoro.idSilLavEsperienzaLavoro,
            lavEsperienzaLavoro: res.lavEsperienzaLavoro,
          }
          const data: DialogModaleMessage = {
            titolo: 'Esperienza professionale',
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.mod === 'ins' ? this.messagioInserimento.testo : this.messagioAggiornamento.testo,
            messaggioAggiuntivo: " ",
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data);
          this.form.get('lavEsperienzaLavoro.idSilLavEsperienzaLavoro').patchValue(esperienzaProfessionale.lavEsperienzaLavoro.idSilLavEsperienzaLavoro);
          this.updateList.emit(esperienzaProfessionale)
          this.annulla.emit()
        } else if(!res){
          const data: DialogModaleMessage = {
            titolo: this.mod === 'ins' ? 'Inserimento esperienza professionale' : 'Modifica esperienza professionale',
            tipo: TypeDialogMessage.Back,
            messaggio: "Errore interno del server",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.ERROR
          };
          this.promptModalService.openModaleConfirm(data);
         // this.spinner.hide();
        }else{
          let msg=res.apiMessages[0].message
          const data: DialogModaleMessage = {
            titolo: this.mod === 'ins' ? 'Inserimento esperienza professionale' : 'Modifica esperienza professionale',
            tipo: TypeDialogMessage.Back,
            messaggio: msg,
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.ERROR
          };
          this.promptModalService.openModaleConfirm(data);
        }
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `insertOrUpdateEsperienzaLavoro ${JSON.stringify(err)}`);
       // this.spinner.hide();

      },

    })
  }

  patchValueInform() {
    if (this.esperienzaSelected && this.esperienzaSelected.lavEsperienzaLavoro) {


      if (this.esperienzaSelected.lavEsperienzaLavoro.dataInizio && !(this.esperienzaSelected.lavEsperienzaLavoro.dataInizio instanceof Date)) {
        const dateTmp = new Date(this.esperienzaSelected.lavEsperienzaLavoro.dataInizio);
        if (!isNaN(dateTmp.getTime()))
          this.esperienzaSelected.lavEsperienzaLavoro.dataInizio = dateTmp;
      }


      if (!(this.esperienzaSelected.lavEsperienzaLavoro.dataFine instanceof Date) && this.esperienzaSelected.lavEsperienzaLavoro.dataFine) {
        const dateTmp = new Date(this.esperienzaSelected.lavEsperienzaLavoro.dataFine);
        if (!isNaN(dateTmp.getTime()))
          this.esperienzaSelected.lavEsperienzaLavoro.dataFine = dateTmp;
      }


      if (!(this.esperienzaSelected.lavEsperienzaLavoro.dataFinePeriodoFormativo instanceof Date) && this.esperienzaSelected.lavEsperienzaLavoro.dataFinePeriodoFormativo) {
        const dateTmp = new Date(this.esperienzaSelected.lavEsperienzaLavoro.dataFinePeriodoFormativo);
        if (!isNaN(dateTmp.getTime()))
          this.esperienzaSelected.lavEsperienzaLavoro.dataFinePeriodoFormativo = dateTmp;
      }


      this.modalitaLavSelected = this.esperienzaSelected.lavEsperienzaLavoro.silTModalitaLavoro;
      this.popolaDropDown(this.esperienzaSelected);
      this.comuniAu = []
      this.comuniDl = []
      if(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneDl?.id){
        this.comuniDl.push({
          id:this.esperienzaSelected.lavEsperienzaLavoro.silTComuneDl?.id,
          descr: this.esperienzaSelected.lavEsperienzaLavoro.silTComuneDl?.descr,
          special:this.esperienzaSelected.lavEsperienzaLavoro.silTComuneDl?.silTRegione.descr
        });
      }
      if(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneAu?.id){
        this.comuniAu.push({
          id:this.esperienzaSelected.lavEsperienzaLavoro.silTComuneAu?.id,
          descr: this.esperienzaSelected.lavEsperienzaLavoro.silTComuneAu?.descr,
          special:this.esperienzaSelected.lavEsperienzaLavoro.silTComuneAu?.silTRegione.descr
        });
      }
      this.form.patchValue(this.esperienzaSelected);
      console.log(this.esperienzaSelected)
      this.formLuogoDl.get('indirizzo.luogo.flgLuogoItalia').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTNazioneDl?"E":"I");
      this.formLuogoDl.get('indirizzo.luogo.comune.id').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneDl?.id);
      this.formLuogoDl.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneDl?.silTProvincia?.idSilTProvincia);
      this.formLuogoDl.get('indirizzo.indirizzo').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoDl);
      this.formLuogoDl.get('indirizzo.numeroCivico').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.dsNumCivicoDl);
      this.formLuogoDl.get('indirizzo.toponimo.id').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTToponimoDl?.idSilTToponimo);
      this.formLuogoDl.get('indirizzo.luogo.stato.idSilTNazione').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTNazioneDl?.idSilTNazione);

      this.formLuogoLav.get('indirizzo.luogo.flgLuogoItalia').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTNazioneLuogoLav?.idSilTNazione?'E':'I');
      this.formLuogoLav.get('indirizzo.luogo.comune.id').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneLuogoLav?.id);
      this.formLuogoLav.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneLuogoLav?.silTProvincia?.idSilTProvincia);
      this.formLuogoLav.get('indirizzo.indirizzo').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoLuogoLav);
      this.formLuogoLav.get('indirizzo.numeroCivico').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.dsNumCivicoLuogoLav);
      this.formLuogoLav.get('indirizzo.toponimo.id').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTToponimoLuogoLav?.idSilTToponimo);
      this.formLuogoLav.get('indirizzo.luogo.stato.idSilTNazione').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTNazioneLuogoLav?.idSilTNazione);


      this.formLuogoAu.get('indirizzo.luogo.flgLuogoItalia').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTNazioneAu?.idSilTNazione?"E":"I");
      this.formLuogoAu.get('indirizzo.luogo.comune.id').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneAu?.id);
      this.formLuogoAu.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTComuneAu?.silTProvincia?.idSilTProvincia);
      this.formLuogoAu.get('indirizzo.indirizzo').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.dsIndirizzoAu);
      this.formLuogoAu.get('indirizzo.numeroCivico').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.dsNumCivicoAu);
      this.formLuogoAu.get('indirizzo.toponimo.id').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTToponimoAu?.idSilTToponimo);
      this.formLuogoAu.get('indirizzo.luogo.stato.idSilTNazione').patchValue(this.esperienzaSelected.lavEsperienzaLavoro.silTNazioneAu?.idSilTNazione);
    }
  }

  private popolaDropDown(el: EsperienzaProfessionale) {
    //primo tab - primo oggetto
    if (el.lavEsperienzaLavoro.silTTipoLavoro) {
      this.tipoLavori.push({
        id: el.lavEsperienzaLavoro.silTTipoLavoro.idSilTTipoLavoro,
        descr: el.lavEsperienzaLavoro.silTTipoLavoro.dsSilTTipoLavoro
      });
    }
    if (el.lavEsperienzaLavoro.silTTipoApprendistato) {
      this.tipoApprendistati.push({
        id: el.lavEsperienzaLavoro.silTTipoApprendistato.idSilTTipoApprendistato,
        descr: el.lavEsperienzaLavoro.silTTipoApprendistato.dsSilTTipoApprendistato
      });
    }
    if (el.lavEsperienzaLavoro.silTModalitaLavoro) {
      this.modalitaLavori.push({
        id: el.lavEsperienzaLavoro.silTModalitaLavoro.idSilTModalitaLavoro.toString(),
        descr: el.lavEsperienzaLavoro.silTModalitaLavoro.descrModalitaLavoro
      });
    }
    if (el.lavEsperienzaLavoro.tipoParttime) {
      this.tipoPartTime.push({
        id: el.lavEsperienzaLavoro.tipoParttime.idSilTTipoParttime,
        descr: el.lavEsperienzaLavoro.tipoParttime.dsSilTTipoParttime
      });
    }
    if (el.lavEsperienzaLavoro.silTQualifica) {
      this.qualifiche.push({
        id: el.lavEsperienzaLavoro.silTQualifica.idSilTQualifica,
        descr: el.lavEsperienzaLavoro.silTQualifica.dsSilTQualifica
      });
    }
    if (el.lavEsperienzaLavoro.silTGrado) {
      this.gradi.push({
        id: el.lavEsperienzaLavoro.silTGrado.idSilTGrado,
        descr: el.lavEsperienzaLavoro.silTGrado.dsSilTGrado
      });
    }
    if (el.lavEsperienzaLavoro.silTCcnl) {
      this.ccnl.push({
        id: el.lavEsperienzaLavoro.silTCcnl.id,
        descr: el.lavEsperienzaLavoro.silTCcnl.descr
      });
    }
    if (el.lavEsperienzaLavoro.silTLivelloRetribuzione) {
      this.correspondingLivelli.push({
        id: el.lavEsperienzaLavoro.silTLivelloRetribuzione.id.toString(),
        descr: el.lavEsperienzaLavoro.silTLivelloRetribuzione.descr
      });
    }

    //datore-azienda
    if (el.lavEsperienzaLavoro.silTAteco02) {
      this.attivita.push({
        id: el.lavEsperienzaLavoro.silTAteco02.idSilTAteco02,
        descr: el.lavEsperienzaLavoro.silTAteco02.descrSilTAteco02
      });
    }
    if (el.lavEsperienzaLavoro.silTComuneDl) {
      this.comuniDl.push({
        id: el.lavEsperienzaLavoro.silTComuneDl.id,
        descr: el.lavEsperienzaLavoro.silTComuneDl.descr
      });
    }
    if (el.lavEsperienzaLavoro.silTNazioneDl) {
      this.stati.push({
        id: el.lavEsperienzaLavoro.silTNazioneDl.idSilTNazione,
        descr: el.lavEsperienzaLavoro.silTNazioneDl.dsSilTNazione
      });
    }
    if (el.lavEsperienzaLavoro.silTToponimoDl) {
      this.toponimi.push({
        id: el.lavEsperienzaLavoro.silTToponimoDl.idSilTToponimo,
        descr: el.lavEsperienzaLavoro.silTToponimoDl.dsSilTToponimo
      });
    }

    //luogo-lavoro
    if (el.lavEsperienzaLavoro.silTComuneLuogoLav) {
      this.comuniLuogoLav.push({
        id: el.lavEsperienzaLavoro.silTComuneLuogoLav.id,
        descr: el.lavEsperienzaLavoro.silTComuneLuogoLav.descr
      });
    }
    if (el.lavEsperienzaLavoro.silTNazioneLuogoLav) {
      this.stati.push({
        id: el.lavEsperienzaLavoro.silTNazioneLuogoLav.idSilTNazione,
        descr: el.lavEsperienzaLavoro.silTNazioneLuogoLav.dsSilTNazione
      });
    }
    if (el.lavEsperienzaLavoro.silTToponimoLuogoLav) {
      this.toponimi.push({
        id: el.lavEsperienzaLavoro.silTToponimoLuogoLav.idSilTToponimo,
        descr: el.lavEsperienzaLavoro.silTToponimoLuogoLav.dsSilTToponimo
      });
    }

    //Aazienda-utilizzatrice
    if (el.lavEsperienzaLavoro.silTAtecoAu) {
      this.attivita.push({
        id: el.lavEsperienzaLavoro.silTAtecoAu.idSilTAteco02,
        descr: el.lavEsperienzaLavoro.silTAtecoAu.descrSilTAteco02
      });
    }
    if (el.lavEsperienzaLavoro.silTComuneAu) {
      this.comuniAu.push({
        id: el.lavEsperienzaLavoro.silTComuneAu.id,
        descr: el.lavEsperienzaLavoro.silTComuneAu.descr
      });
    }
    if (el.lavEsperienzaLavoro.silTNazioneAu) {
      this.stati.push({
        id: el.lavEsperienzaLavoro.silTNazioneAu.idSilTNazione,
        descr: el.lavEsperienzaLavoro.silTNazioneAu.dsSilTNazione
      });
    }
    if (el.lavEsperienzaLavoro.silTToponimoAu) {
      this.toponimi.push({
        id: el.lavEsperienzaLavoro.silTToponimoAu.idSilTToponimo,
        descr: el.lavEsperienzaLavoro.silTToponimoAu.dsSilTToponimo
      });
    }
  }


  onFilterComuneDl(event:any, isAzienda:boolean = false){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("COMUNE",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.comuniDl=[...r.list];

        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }
  onFilterComuneAu(event:any, isAzienda:boolean = false){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("COMUNE",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){

          this.comuniAu = [...r.list];
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }

  onFilterComuneLuogoLavoro(event:any, isAzienda:boolean = false){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("COMUNE",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){

         this.comuniLuogoLav = [...r.list]
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }

}
