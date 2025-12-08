/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { CommonService } from 'src/app/services/common.service';
import { filter } from 'rxjs/operators';
import { LavTitoloStudioAltro, PslpMessaggio } from 'src/app/modules/pslpapi';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Decodifica, DecodificaResponse, DecodificaPslpService, SchedaAnagraficaProfessionale, Studio, TitoloDiStudio, TitoloStudioRequest } from 'src/app/modules/pslpapi';
import { FascicoloPslpService } from 'src/app/modules/pslpapi';
import { LogService } from 'src/app/services/log.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Utils } from 'src/app/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';

@Component({
  selector: 'pslpwcl-titolo-studio',
  templateUrl: './titolo-studio.component.html',
  styleUrls: ['./titolo-studio.component.scss']
})
export class TitoloStudioComponent implements OnInit,OnChanges {
  @Input() fascicolo:SchedaAnagraficaProfessionale;

  toponimos: Decodifica[] = [];
  comuniIst: Decodifica[] = [];
  comuniAz: Decodifica[] = [];
  province:Decodifica[]=[];
  nazioniEstere: Decodifica[] = [];
  tipoApprendistati: Decodifica[] = [];
  tipoDurata: Decodifica[] = [];
  statiTitoloStudio: Decodifica[] = [];
  titoliStudios: Decodifica[] = [];
  titoloStudioSelected: Studio;

  sysDate = new Date();
  numCivicoRegex: RegExp = /^\d+[A-Za-z\d/]*$/;
  VotoValoreRequired: boolean = false;

  durataStageIsRequired: boolean = false;
  wrapperSelectedTitoloStudio:any;
  formMode = 'ins';
  showForm = false;

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;


  titoloDiStudioList?: Array<TitoloDiStudio>;
  showDettaglio = false;
  titoloDiStudio?: TitoloDiStudio;
  lavTitoloStudioAltro?: LavTitoloStudioAltro;
  dataNascita: number = 1900;
  formLuogoIstituto:FormGroup=this.fb.group({
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

  formLuogoAziStage:FormGroup=this.fb.group({
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
    lavTitoloStudio: this.fb.group({
      idSilLavStudio: [null],
      flgPubblicazione: [null],
      silTStudio: this.fb.group({
        id: [null,Validators.required]
      }),
      silLavAnagrafica: this.fb.group({
        idSilLavAnagrafica: [null]
      }),
      dsTitoloStudioSap: [null],
      flgCompletato: [null],
      dsAnnoCompletato: [null,Validators.max(this.sysDate.getFullYear())],
      dataInizio:[null,[Validators.required]],
      dataFine:[null],
      dsVoto: [null],
      valoreMassimo: [null],
      flgCumLaude: [null],
      idSilTTStatoTitoloStudio: [null],
      ultimaClasseFrequentata: [null],
      numAnniFrequentati: [null],
      flgRiconosciutoItalia: [null],
      numEsamiSostenuti: [null],
      annoDiFrequenza: [null,Validators.max(this.sysDate.getFullYear())],
      silTTipoApprendistato: this.fb.group({
        idSilTTipoApprendistato: [null]
      })
    }),

    lavTitoloStudioAltro: this.fb.group({
      idSilLavStudio: [null],
      dsDenominazioneIst: [null],
      flgLuogoIst: [null],
      silTComuneIst: this.fb.group({
        id: [null]
      }),
      silTNazioneIst: this.fb.group({
        idSilTNazione: [null]
      }),
      silTToponimoIst: this.fb.group({
        idSilTToponimo: [null]
      }),
      dsIndirizzoIst: [null],
      dsTitoloTesi: [null],
      dsRelatore: [null],
      flgStageFinale: [null],
      dsNote: [null],
      dsDenominazioneAziStage: [null],
      durataStage: [null],
      codTipologiaDurataStage: [null],
      silTToponimoAziStage: this.fb.group({
        idSilTToponimo: [null]
      }),
      dsIndirizzoAziStage: [null],
      flgLuogoAziStage: [null],
      dsNumCivicoAziStage: [null],
      silTComuneAziStage: this.fb.group({
        id: [null]
      }),
      silTNazioneAziStage: this.fb.group({
        idSilTNazione: [null]
      }),
      dsNumCivicoIst: [null],
    })
  });
  constructor(
    private spinner:NgxSpinnerService,
     private fascicoloService: FascicoloPslpService,
     private logService:LogService,
     private fb:FormBuilder,
     private decodificaService:DecodificaPslpService,
     private promptModalService:PromptModalService,
     private commonService:CommonService
  ) { }

  ngOnInit(): void {
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });

    // pslp_d_messaggio modifica generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });

    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    this.form.get('lavTitoloStudio.dataInizio').addValidators([this.dataRangeValidator]);
    this.form.get('lavTitoloStudio.dataFine').addValidators([this.dataRangeValidator]);
    if(this.fascicolo){

      this.dataNascita = ( new Date(this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.dataDiNascita)).getFullYear();
      this.titoloDiStudioList = this.fascicolo?.informazioniCurriculari?.percorsoFormativo?.titoliDiStudio
      this.loadDecodifiche();
    }else{
      this.form.disable()
    }

  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['fascicolo'] && this.fascicolo){
      this.titoloDiStudioList = [...this.fascicolo.informazioniCurriculari.percorsoFormativo.titoliDiStudio]
    }
  }
  loadDecodifiche(){

    this.decodificaService.findDecodificaByTipo('TOPONIMO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.toponimos = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('NAZIONE').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.nazioniEstere = r.list;
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
    this.decodificaService.findDecodificaByTipo('TIPO-APPRENDISTATO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoApprendistati = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('TIPOLOGIA-DURATA').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoDurata = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('STATO-TITOLO-STUDIO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.statiTitoloStudio = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    })

  }

  onFilter(event:any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("titolo-Studio",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.titoliStudios = [...r.list];
          this.titoliStudios.forEach(t=> t.descr = t.descr + " - " + t.special)
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }
  formChange(){
    console.log(this.form)
  }

  private dataRangeValidator: ValidatorFn = (): {[key: string]: any;} | null =>{
    let invalidDataRange= false;

    const dataInizio = this.form.get('lavTitoloStudio.dataInizio').value;
    const dataFine = this.form.get('lavTitoloStudio.dataFine').value;

    if (!dataInizio || !dataFine) {
      return null;
    }

    if (dataFine) {
      const dtInizio: Date = new Date(dataInizio);
      const dtFine: Date = new Date(dataFine);
      dtInizio.setHours(0, 0, 0, 0);
      dtFine.setHours(0, 0, 0, 0);
      invalidDataRange = dtInizio.valueOf() > dtFine.valueOf();

    }
    if(invalidDataRange){
      this.form.get('lavTitoloStudio.dataInizio').setErrors({invalidDataRange})
      this.form.get('lavTitoloStudio.dataFine').setErrors({invalidDataRange})

    }else{
      this.form.get('lavTitoloStudio.dataInizio').setErrors(null)
      this.form.get('lavTitoloStudio.dataFine').setErrors(null)
    }
    return invalidDataRange? { invalidDataRange} : null;
}


  viewTitolo(titolo:TitoloDiStudio){
    this.showDettaglio = true;
    this.showForm = false;
    this.titoloDiStudio = titolo;
    this.fascicoloService.getDettaglioTitoloDiStudio(titolo.lavTitoloStudio.idSilLavStudio).subscribe(
      {
        next: (res: any) => {
          if( res.esitoPositivo){
            this.lavTitoloStudioAltro = res.lavTitoloStudioAltro;

          }

        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`titolo studio : ${this.constructor.name}: ${JSON.stringify(err)}`)
        },
        complete: () =>{

        }
      }
    );
  }





  toggleFormTitoloStudio(mod:string = 'ins',el?: TitoloDiStudio) {
    //this.spinner.show();
    this.wrapperSelectedTitoloStudio = null;
    this.form.reset();
    this.formLuogoAziStage.reset()
    this.formLuogoIstituto.reset()
    this.formMode = mod;
    this.showDettaglio = false;

    if (this.formMode != 'ins' && el) {
      this.decodificaService.findDecodificaByTipoEdId("titolo-studio",el.lavTitoloStudio.silTStudio.id).subscribe({
        next: (res:DecodificaResponse) => {

          if(res.esitoPositivo){
            this.titoliStudios.push(res.decodifica);
          }
        },
        error: (error) => {
          this.logService.error(this.constructor.name, `getDettaglioTitoloDiStudio error: ${JSON.stringify(error)}`);
          //this.spinner.hide();
        },
        complete: () => {
          //this.spinner.hide();
        },
      })

      this.loadTitoloStudio(el);
    }else{

      this.titoloStudioSelected = null;
      this.setDispositions();
      this.showForm = true;
    }

    if (this.formMode == 'ins'){
      this.form.get("lavTitoloStudio.flgRiconosciutoItalia").setValue("S");
    }



  }
  private loadTitoloStudio(el: TitoloDiStudio) {
    this.fascicoloService.getDettaglioTitoloDiStudio(el.lavTitoloStudio.idSilLavStudio).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          this.wrapperSelectedTitoloStudio = {
            lavTitoloStudio: res.lavTitoloStudio,
            lavTitoloStudioAltro: res.lavTitoloStudioAltro
          }
          this.patchValueInform();

          this.showForm=true
          this.setDispositions();
        }
      },
      error: (error) => {
        this.logService.error(this.constructor.name, `getDettaglioTitoloDiStudio error: ${JSON.stringify(error)}`);
        this.spinner.hide();
      }
    });
  }
  private patchValueInform() {

    if (this.wrapperSelectedTitoloStudio) {
      let votoValoreMassimo: string[];
      if (this.wrapperSelectedTitoloStudio.lavTitoloStudio.dsVoto) {
        votoValoreMassimo = this.wrapperSelectedTitoloStudio.lavTitoloStudio.dsVoto.split('/');
      }
      if (votoValoreMassimo && votoValoreMassimo.length > 1) {
        this.wrapperSelectedTitoloStudio.lavTitoloStudio.dsVoto = votoValoreMassimo[0];
        this.wrapperSelectedTitoloStudio.lavTitoloStudio.valoreMassimo = votoValoreMassimo[1];
      }
      if (this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro && this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro.silTComuneIst)
        this.comuniIst.push(this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro.silTComuneIst as Decodifica)
      if (this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro && this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro.silTComuneAziStage)
        this.comuniAz.push(this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro.silTComuneAziStage as Decodifica)

      const titoloStudioAltro:LavTitoloStudioAltro=this.wrapperSelectedTitoloStudio.lavTitoloStudioAltro
      this.form.patchValue(this.wrapperSelectedTitoloStudio);

      this.formLuogoIstituto.get('indirizzo.luogo.flgLuogoItalia').patchValue(titoloStudioAltro?.flgLuogoIst);
      this.formLuogoIstituto.get('indirizzo.luogo.stato.idSilTNazione').patchValue(titoloStudioAltro?.silTNazioneIst?.idSilTNazione);
      this.formLuogoIstituto.get('indirizzo.luogo.comune.id').patchValue(titoloStudioAltro?.silTComuneIst?.id);
      this.formLuogoIstituto.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(titoloStudioAltro?.silTComuneIst?.silTProvincia?.idSilTProvincia)
      this.formLuogoIstituto.get('indirizzo.toponimo.id').patchValue(titoloStudioAltro?.silTToponimoIst?.idSilTToponimo);
      this.formLuogoIstituto.get('indirizzo.indirizzo').patchValue(titoloStudioAltro?.dsIndirizzoIst)
      this.formLuogoIstituto.get('indirizzo.numeroCivico').patchValue(titoloStudioAltro?.dsNumCivicoIst)


      this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').patchValue(titoloStudioAltro?.flgLuogoAziStage);
      this.formLuogoAziStage.get('indirizzo.luogo.stato.idSilTNazione').patchValue(titoloStudioAltro?.silTNazioneAziStage?.idSilTNazione);
      this.formLuogoAziStage.get('indirizzo.luogo.comune.id').patchValue(titoloStudioAltro?.silTComuneAziStage?.id);
      this.formLuogoAziStage.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(titoloStudioAltro?.silTComuneAziStage?.silTProvincia?.idSilTProvincia)
      this.formLuogoAziStage.get('indirizzo.toponimo.id').patchValue(titoloStudioAltro?.silTToponimoAziStage?.idSilTToponimo);
      this.formLuogoAziStage.get('indirizzo.indirizzo').patchValue(titoloStudioAltro?.dsIndirizzoAziStage)
      this.formLuogoAziStage.get('indirizzo.numeroCivico').patchValue(titoloStudioAltro?.dsNumCivicoAziStage)


      this.titoloStudioSelected = this.wrapperSelectedTitoloStudio.lavTitoloStudio.silTStudio;
    }

    this.showForm=true

  }


  private votoValoreValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {

    let invalid = false;
    const valore = this.form.controls['lavTitoloStudio'].get('valoreMassimo').value;
    const voto = this.form.controls['lavTitoloStudio'].get('dsVoto').value;
    if(!valore && !voto) return null;
    if ((!Utils.isNullOrUndefinedOrEmptyField(voto) && !isNaN(voto)) && (!Utils.isNullOrUndefinedOrEmptyField(valore) && !isNaN(valore)))
      invalid = Number(valore) < Number(voto);
    return invalid ? { valoreMax: { invalid } } : null;
  };

  private setDispositions() {

    if(this.formMode != "edit"){
      this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').setValue('I');
      this.formLuogoIstituto.get('indirizzo.luogo.flgLuogoItalia').patchValue('I');
      this.form.get('lavTitoloStudio.flgCompletato').patchValue('S');
    }
    this.form.enable();
    this.form.get('lavTitoloStudio.valoreMassimo').setValidators(this.votoValoreValidator);
    this.form.get('lavTitoloStudio.dsVoto').setValidators(this.votoValoreValidator);
    this.setDynamicControlStates();

    this.showForm = true;
    this.spinner.hide();
  }
  private setDynamicControlStates() {
    this.setCompletatoControlStates();
    if(this.formMode === "edit")
      this.form.get('lavTitoloStudio.silTStudio.id').disable();
  }

  onChangeLuogoIstituto(){
    this.setControlStatesIstituto();
  }
  private setControlStatesIstituto() {
    const flgLuogo = this.formLuogoIstituto.get('indirizzo.luogo.flgLuogoItalia').value;

    if (flgLuogo === 'I') {
      this.formLuogoIstituto.get('indirizzo.luogo.stato').reset();
      this.formLuogoIstituto.get('indirizzo.luogo.stato').disable();
      this.formLuogoIstituto.get('indirizzo.luogo.comune').enable();
      this.formLuogoIstituto.get('indirizzo.toponimo').enable();
      this.formLuogoIstituto.get('indirizzo.indirizzo').enable();
      this.formLuogoIstituto.get('indirizzo.numeroCivico').enable();
    } else if(flgLuogo === 'E') {
      this.formLuogoIstituto.get('indirizzo.luogo.comune').reset();
      this.formLuogoIstituto.get('indirizzo.toponimo').reset();
      this.formLuogoIstituto.get('indirizzo.indirizzo').reset();
      this.formLuogoIstituto.get('indirizzo.numeroCivico').reset();
      this.formLuogoIstituto.get('indirizzo.luogo.stato').enable();
      this.formLuogoIstituto.get('indirizzo.luogo.comune').disable();
      this.formLuogoIstituto.get('indirizzo.toponimo').disable();
      this.formLuogoIstituto.get('indirizzo.indirizzo').disable();
      this.formLuogoIstituto.get('indirizzo.numeroCivico').disable();
    }
  }


  onChangeFlgCompletato(){
    this.setCompletatoControlStates();
  }
  private setCompletatoControlStates() {
    const flgCompletato: string = this.form.get('lavTitoloStudio.flgCompletato').value;

    //CAMPI ABILITATI SE flgCompletato = S
    const controlVoto = this.form.get('lavTitoloStudio.dsVoto');
    const controlAnnoCompletato = this.form.get('lavTitoloStudio.dsAnnoCompletato');
    const controlFlgCumLaude = this.form.get('lavTitoloStudio.flgCumLaude');

    //CAMPI ABILITATI SE flgCompletato = N
    const controlNumAnniFrequentati = this.form.get('lavTitoloStudio.numAnniFrequentati');
    const controlAnnoDiFrequenza = this.form.get('lavTitoloStudio.annoDiFrequenza');
    const controlUltimaClasseFrequentata = this.form.get('lavTitoloStudio.ultimaClasseFrequentata');
    const controlNumEsamiSostenuti = this.form.get('lavTitoloStudio.numEsamiSostenuti');
    const controlStatoTitoliSTudio = this.form.get('lavTitoloStudio.idSilTTStatoTitoloStudio');

    if (flgCompletato === 'S') {
      controlVoto.enable();
      controlAnnoCompletato.enable();
      controlFlgCumLaude.enable();
      controlNumAnniFrequentati.reset();
      controlAnnoDiFrequenza.reset();
      controlUltimaClasseFrequentata.reset();
      controlNumEsamiSostenuti.reset();
      controlStatoTitoliSTudio.reset();
      controlNumAnniFrequentati.disable();
      controlAnnoDiFrequenza.disable();
      controlUltimaClasseFrequentata.disable();
      controlNumEsamiSostenuti.disable();
      controlStatoTitoliSTudio.disable();
    } else {
      controlNumAnniFrequentati.enable();
      controlAnnoDiFrequenza.enable();
      controlUltimaClasseFrequentata.enable();
      controlNumEsamiSostenuti.enable();
      controlStatoTitoliSTudio.enable();
      controlVoto.reset();
      controlAnnoCompletato.reset();
      controlFlgCumLaude.reset();
      controlVoto.disable();
      controlAnnoCompletato.disable();
      controlFlgCumLaude.disable();
    }
    this.votoValoreRequired();
  }

  onChangeDurataStage(){
    this.setDurataStageRequired();
  }
  private setDurataStageRequired() {
    const durataStage = this.form.get('lavTitoloStudioAltro.durataStage').value;
    const codTipologiaDurata = this.form.get('lavTitoloStudioAltro.codTipologiaDurataStage').value;

    this.form.get('lavTitoloStudioAltro.durataStage').removeValidators(Validators.required);
    this.form.get('lavTitoloStudioAltro.codTipologiaDurataStage').removeValidators(Validators.required);

    this.durataStageIsRequired = !(Utils.isNullOrUndefinedOrEmptyField(durataStage) && Utils.isNullOrUndefinedOrEmptyField(codTipologiaDurata));
    if (this.durataStageIsRequired) {
      this.form.get('lavTitoloStudioAltro.durataStage').setValidators(Validators.required);
      this.form.get('lavTitoloStudioAltro.codTipologiaDurataStage').setValidators(Validators.required);
    }
    this.form.get('lavTitoloStudioAltro.durataStage').updateValueAndValidity();
    this.form.get('lavTitoloStudioAltro.codTipologiaDurataStage').updateValueAndValidity();
  }

  onChangeLuogoAziStage(){
    this.setControlStatesAziStage();
  }
  private setControlStatesAziStage() {
    const flgLuogo = this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').value;

    if (flgLuogo === 'I') {
      this.formLuogoAziStage.get('indirizzo.luogo.stato').reset();
      this.formLuogoAziStage.get('indirizzo.luogo.stato').disable();
      this.formLuogoAziStage.get('indirizzo.luogo.comune').enable();
      this.formLuogoAziStage.get('indirizzo.toponimo').enable();
      this.formLuogoAziStage.get('indirizzo.indirizzo').enable();
      this.formLuogoAziStage.get('indirizzo.numeroCivico').enable();
    } else if(flgLuogo === 'E') {
      this.formLuogoAziStage.get('indirizzo.luogo.comune').reset();
      this.formLuogoAziStage.get('indirizzo.toponimo').reset();
      this.formLuogoAziStage.get('indirizzo.indirizzo').reset();
      this.formLuogoAziStage.get('indirizzo.numeroCivico').reset();
      this.formLuogoAziStage.get('indirizzo.luogo.stato').enable();
      this.formLuogoAziStage.get('indirizzo.luogo.comune').disable();
      this.formLuogoAziStage.get('indirizzo.toponimo').disable();
      this.formLuogoAziStage.get('indirizzo.indirizzo').disable();
      this.formLuogoAziStage.get('indirizzo.numeroCivico').disable();
    }
  }

  async onClickAnnulla(){
    const data: DialogModaleMessage = {
      titolo: this.formMode === 'ins' ? 'Inserimento titolo di studio' : 'Modifica titolo di studio',
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler annullare l'operazione? Gli eventuali dati non salvati andranno persi.",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.showForm=false;
      return true;
    } else {
      return false;
    }
  }

  onClickAnnullaVisualizza(){
    this.showDettaglio=false;
  }

  votoValoreRequired() {
    const votoControl = this.form.controls['lavTitoloStudio'].get('dsVoto');
    const valoreControl = this.form.controls['lavTitoloStudio'].get('valoreMassimo');
    votoControl.removeValidators([Validators.required]);
    valoreControl.removeValidators([Validators.required]);
    const flgCompletato: string = this.form.get('lavTitoloStudio.flgCompletato').value;
    this.VotoValoreRequired = false;
    if (flgCompletato === 'S' &&
         ((!Utils.isNullOrUndefinedOrEmptyField(votoControl.value)
            && !isNaN(votoControl.value))
            || (!Utils.isNullOrUndefinedOrEmptyField(valoreControl.value)
            && !isNaN(valoreControl.value)))) {
      this.VotoValoreRequired = true;
      valoreControl.enable();
      votoControl.addValidators([Validators.required]);
      valoreControl.addValidators([Validators.required]);
    } else {
      valoreControl.reset();
      if (Utils.isNullOrUndefinedOrEmptyField(votoControl.value) && flgCompletato === 'S')
        valoreControl.enable();
      else
        valoreControl.disable();
    }
    votoControl.updateValueAndValidity();
    valoreControl.updateValueAndValidity();

  }

  onChangeTitoloStudio(event: any){
    let  titoloSelec: Decodifica= this.titoliStudios.find(t => t.id == event.value);
    this.decodificaService.findTitoloStudioById(titoloSelec.id).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          this.titoloStudioSelected = res.titoloStudio;
        }
      },
      error: (error) => {
        this.logService.error(this.constructor.name, `getDettaglioTitoloDiStudio error: ${JSON.stringify(error)}`);
        this.spinner.hide();
      }
    });

  }

  async onSubmit() {
    const msg = `Si conferma il salvataggio dei dati del titolo di studio?`;
    const data: DialogModaleMessage = {
      titolo: this.formMode === 'ins' ? "Inserimento titolo di studio" : "Modifica titolo di studio",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.conferma();
    }
  }
  private conferma() {
    this.spinner.show();
    const objectForm = this.form.getRawValue();
    if (!Utils.isNullOrUndefinedOrEmptyField(objectForm.lavTitoloStudio.dsVoto)
      && !Utils.isNullOrUndefinedOrEmptyField(objectForm.lavTitoloStudio.valoreMassimo))
      objectForm.lavTitoloStudio.dsVoto = objectForm.lavTitoloStudio.dsVoto + "/" + objectForm.lavTitoloStudio.valoreMassimo;
    let titoloStudioAltro:LavTitoloStudioAltro=objectForm.lavTitoloStudioAltro

    titoloStudioAltro.dsIndirizzoIst=this.formLuogoIstituto.get('indirizzo.indirizzo').value
    titoloStudioAltro.dsNumCivicoIst=this.formLuogoIstituto.get('indirizzo.numeroCivico').value
    titoloStudioAltro.flgLuogoIst=this.formLuogoIstituto.get('indirizzo.luogo.flgLuogoItalia').value
    titoloStudioAltro.silTComuneIst=this.formLuogoIstituto.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoIstituto.get('indirizzo.luogo.comune.id').value}:null
    titoloStudioAltro.silTNazioneIst=this.formLuogoIstituto.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoIstituto.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    titoloStudioAltro.silTToponimoIst=this.formLuogoIstituto.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoIstituto.get('indirizzo.toponimo.id').value}:null

    titoloStudioAltro.dsIndirizzoAziStage=this.formLuogoAziStage.get('indirizzo.indirizzo').value
    titoloStudioAltro.dsNumCivicoAziStage=this.formLuogoAziStage.get('indirizzo.numeroCivico').value
    titoloStudioAltro.flgLuogoAziStage=this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').value
    titoloStudioAltro.silTComuneAziStage=this.formLuogoAziStage.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoAziStage.get('indirizzo.luogo.comune.id').value}:null
    titoloStudioAltro.silTNazioneAziStage=this.formLuogoAziStage.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoAziStage.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    titoloStudioAltro.silTToponimoAziStage=this.formLuogoAziStage.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoAziStage.get('indirizzo.toponimo.id').value}:null


    const titoloStudioRequest: TitoloStudioRequest = {
      lavTitoloStudio: Utils.cleanObject(objectForm.lavTitoloStudio),
      lavTitoloStudioAltro: Utils.cleanObject(titoloStudioAltro)
    };
    titoloStudioRequest.lavTitoloStudio.silLavAnagrafica = {
      idSilLavAnagrafica: this.fascicolo.idSilLavAnagrafica
    };
    this.fascicoloService.insertOrUpdateTitoloStudio(titoloStudioRequest).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          this.commonService.refreshFascicolo();
          let msg=this.formMode === 'ins'? this.messagioInserimento : this.messagioAggiornamento
          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: msg.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)

          this.showForm = false;
        }
      },
      error: (err) => {
        this.logService.log(this.constructor.name, "Errore insertOrUpdateTitoloStudio");
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  async onClickEliminaTitolo(titoloDiStudio:TitoloDiStudio) {
    const data: DialogModaleMessage = {
      titolo: "Eliminare titolo di studio",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: `Si conferma l'eliminazione del titolo di studio?`,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.eliminaTitoloStudio(titoloDiStudio);
    }
  }
  private eliminaTitoloStudio(el: TitoloDiStudio) {
    this.spinner.show();
    let titoloStudioRequest: TitoloStudioRequest;

    this.fascicoloService.getDettaglioTitoloDiStudio(el.lavTitoloStudio.idSilLavStudio).subscribe({
      next: (res: any) => {
        if(res.esitoPositivo){
          titoloStudioRequest = {
            lavTitoloStudio: res.lavTitoloStudio,
            lavTitoloStudioAltro: res.lavTitoloStudioAltro
          }
          this.sendRequestDeleteTitoloDiStudio(titoloStudioRequest);
        }
      },
      error: (error) => {
        this.logService.error(this.constructor.name, `getDettaglioTitoloDiStudio error: ${JSON.stringify(error)}`);
        this.spinner.hide();
      }
    });
  }

  sendRequestDeleteTitoloDiStudio(el: TitoloDiStudio){
    this.fascicoloService.deleteTitoloStudio(el).subscribe({
      next: (res: any) => {
        if(res.esitoPositivo){
          this.showForm = false;
          this.commonService.refreshFascicolo();
          this.spinner.hide();

          const data: DialogModaleMessage = {
            titolo: "Gestione Fascicolo",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }else{
          this.spinner.hide();
        }
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `deleteLingua ${JSON.stringify(err)}`);
        this.spinner.hide();
      }
    });
  }

  onChangeForm(){
    console.log(this.form);
  }

}
