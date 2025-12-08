/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input } from '@angular/core';
import { PslpMessaggio, SchedaAnagraficaProfessionale, Toponimo } from 'src/app/modules/pslpapi';
import { AltroCorso } from 'src/app/modules/pslpapi';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { DecodificaPslpService } from 'src/app/modules/pslpapi';
import { Decodifica } from 'src/app/modules/pslpapi';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { FascicoloPslpService } from 'src/app/modules/pslpapi';
import { CorsoFormazioneRequest } from 'src/app/modules/pslpapi';
import { Utils } from 'src/app/utils';
import { MOD } from 'src/app/constants';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'pslpwcl-altri-corsi',
  templateUrl: './altri-corsi.component.html',
  styleUrls: ['./altri-corsi.component.scss']
})
export class AltriCorsiComponent implements OnInit {
  @Input() fascicolo:SchedaAnagraficaProfessionale;
  idSilLavAnagrafica: number;

  altriCorsoList: Array<AltroCorso>;
  altriCorso: AltroCorso;
  altriCorsiCopy: AltroCorso[];
  altroCorsoSelected: AltroCorso;
  mode: string;
  get VIEW_MODE() {
    return this.mode == "ins";
  }

  showDettaglio = false;
  showForm: boolean;
  form: FormGroup;
  lavCorsoFormAltro: FormGroup;


  toponimos: Decodifica[] = [];
  comuniIst: Decodifica[] = [];
  comuniAz: Decodifica[] = [];
  nazioniEstere: Decodifica[] = [];
  nazioniEstereAzi: Decodifica[] = [];
  province:Decodifica[]=[]

  comuni: Decodifica[] = [];
  formMode: string;
  durataCorsoIsRequired: boolean;
  durataStageIsRequired: boolean;
  sysDate: Date = new Date();
  numCivicoRegex: RegExp = /^\d+[A-Za-z\d/]*$/;
  minDate:Date = new Date(1900,1,1);
  tipoDurata: Decodifica[] = [];
  tipoApprendistati: Decodifica[] = [];


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

  formLuogoEnteErog:FormGroup=this.fb.group({
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

  

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  constructor(
    private readonly decodificaService: DecodificaPslpService,
    private promptModalService: PromptModalService,
    private readonly fascicoloService:FascicoloPslpService,
    private readonly commonService:CommonService,
    private fb:FormBuilder
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

    this.idSilLavAnagrafica = this.fascicolo.idSilLavAnagrafica;
    this.decodificaService.findDecodificaByTipo('TOPONIMO').subscribe({
      next: (res:any) => {
        if(res.esitoPositivo){
          console.log(res)
          this.toponimos = res.list;

        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('PROVINCIA').subscribe({
      next: (res:any) => {
        if(res.esitoPositivo){
          this.province = res.list;

        }
      },
      error: err => {},
      complete: ()=>{}
    })
    this.decodificaService.findDecodificaByTipo('NAZIONE').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.nazioniEstere = r.list;
          this.nazioniEstereAzi = r.list;
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
    });
    this.decodificaService.findDecodificaByTipo('TIPO-APPRENDISTATO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoApprendistati = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    });

    this.initForm();
    this.altriCorsoList= this.fascicolo.informazioniCurriculari.percorsoFormativo.formazioneProfessionale.altriCorsi;


  }
  onChangeForm(){
    console.log(this.form);
  }

  private initForm() {
    const currentYear = this.sysDate.getFullYear();
    this.form = new FormGroup({
      denominazioneCorso: new FormControl(null, Validators.required),
      annoGestione: new FormControl(null, [Validators.required,Validators.max(currentYear)]),
      lavCorsoForm: new FormGroup({
        idSilLavCorsoForm: new FormControl(),
        idSilLavAnagrafica: new FormControl(this.idSilLavAnagrafica),
        dInizioCorso: new FormControl(),
        flgPubblicazione: new FormControl(),
        dFineCorso: new FormControl(),
        numEsitoFinale: new FormControl(),
        silTTipoApprendistato: new FormGroup({
          idSilTTipoApprendistato: new FormControl()
        })
      }),
      lavCorsoFormAltro: new FormGroup({
        codTipologiaDurataCorso: new FormControl(),
        codTipologiaDurata: new FormControl(),
        idSilLavCorsoForm: new FormControl(),
        durataCorso: new FormControl(),
        flgStageFinale: new FormControl(),
        dsDenominazioneEnteErog: new FormControl(),
        dsDenominazioneAziStage: new FormControl(),
        durataStage: new FormControl(),
        /*silTComuneEnteErog: new FormGroup({
          id: new FormControl(null)
        }),
        flgLuogoEnteErog: new FormControl(null),
        silTNazioneEnteErog: new FormGroup({
          idSilTNazione: new FormControl(null)
        }),
        silTToponimoEnteErog: new FormGroup({
          idSilTToponimo: new FormControl(null),
          dsSilTToponimo: new FormControl(null)
        }),
        dsNumCivicoEnteErog: new FormControl(null),
        dsIndirizzoEnteErog: new FormControl(null),
        silTComuneAziStage: new FormGroup({
          id: new FormControl(null)
        }),
        flgLuogoAziStage: new FormControl(null),
        silTNazioneAgiStage: new FormGroup({
          idSilTNazione: new FormControl(null)
        }),
        silTToponimoAziStage: new FormGroup({
          idSilTToponimo: new FormControl(null),
          dsSilTToponimo: new FormControl(null)
        }),
        dsNumCivicoAziStage: new FormControl(null),
        dsIndirizzoAziStage: new FormControl(null)*/

      })
    });

  }

  viewCorso(altroCorso:AltroCorso){
    this.showDettaglio = true;
    this.mode = MOD.VIEW
    this.altriCorso = altroCorso;
    this.toggleFormAltriCorsi(MOD.VIEW, altroCorso)
    this.form.disable();
    this.showForm = true;
  }
  onFilterComune(event:any, isAzienda:boolean = false){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("COMUNE",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          if(isAzienda){this.comuniAz = [...r.list];}
          else{this.comuniIst = [...r.list];}
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }

  get f() {
    return this.form.controls as any;
  }
  get flavCorsoForm() {
    return this.form.controls['lavCorsoForm'] as any;
  }

  get flavCorsoFormAltro() {
    return this.form.controls['lavCorsoFormAltro'] as any;
  }

  onChangeDurataStage(){
    this.setDurataStageRequired();
  }

  onChangeDurataCorso(){
    this.setDurataCorsoRequired();
  }



  private setDynamicValidators() {
    this.setDurataCorsoRequired();
    this.setDurataStageRequired();
  }



  private setDynamicControlStates(){
    this.setCertificazioneControlsState();
  }


  onChangeCertificazione(){
    this.setCertificazioneControlsState();
  }

  private setCertificazioneControlsState() {

  }



  private setDurataCorsoRequired() {
    const durataCorso = this.form.controls['lavCorsoFormAltro'].get('durataCorso').value;
    const codTipologiaDurataCorso = this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurataCorso').value;

    this.form.controls['lavCorsoFormAltro'].get('durataCorso').removeValidators(Validators.required);
    this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurataCorso').removeValidators(Validators.required);
    this.durataCorsoIsRequired = !(Utils.isNullOrUndefinedOrEmptyField(durataCorso) && Utils.isNullOrUndefinedOrEmptyField(codTipologiaDurataCorso));

    if (this.durataCorsoIsRequired) {
      this.form.controls['lavCorsoFormAltro'].get('durataCorso').setValidators(Validators.required);
      this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurataCorso').setValidators(Validators.required);
    }
    this.form.controls['lavCorsoFormAltro'].get('durataCorso').updateValueAndValidity();
    this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurataCorso').updateValueAndValidity();
  }




  private setDurataStageRequired() {
    const durataStage = this.form.controls['lavCorsoFormAltro'].get('durataStage').value;
    const codTipologiaDurata = this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurata').value;

    this.form.controls['lavCorsoFormAltro'].get('durataStage').removeValidators(Validators.required);
    this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurata').removeValidators(Validators.required);
    this.durataStageIsRequired = !(Utils.isNullOrUndefinedOrEmptyField(durataStage) && Utils.isNullOrUndefinedOrEmptyField(codTipologiaDurata));

    if (this.durataStageIsRequired) {
      this.form.controls['lavCorsoFormAltro'].get('durataStage').setValidators(Validators.required);
      this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurata').setValidators(Validators.required);
    }
    this.form.controls['lavCorsoFormAltro'].get('durataStage').updateValueAndValidity();
    this.form.controls['lavCorsoFormAltro'].get('codTipologiaDurata').updateValueAndValidity();
  }

  async onClickAnnulla(){
    if(this.mode === MOD.VIEW){
      this.showForm=false;
      return true;
    }
    const data: DialogModaleMessage = {
      titolo: this.formMode === 'ins' ? 'Inserimento titolo corso' : 'Modifica corso',
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
  async onClickConferma(){
    const msg = `Si conferma il salvataggio dei dati del corso?`;
    const data: DialogModaleMessage = {
      titolo: this.formMode === 'ins' ? "Inserimento corso" : "Modifica corso",
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

  conferma(){
    const altroCorso = this.form.getRawValue() as AltroCorso;
    altroCorso.lavCorsoForm.idSilLavAnagrafica = this.idSilLavAnagrafica;
    altroCorso.lavCorsoForm.dsAnnoCorso = altroCorso.annoGestione;

    let lavCorsoFormAltro=altroCorso.lavCorsoFormAltro

    lavCorsoFormAltro.dsIndirizzoEnteErog=this.formLuogoEnteErog.get('indirizzo.indirizzo').value
    lavCorsoFormAltro.dsNumCivicoEnteErog=this.formLuogoEnteErog.get('indirizzo.numeroCivico').value
    lavCorsoFormAltro.flgLuogoEnteErog=this.formLuogoEnteErog.get('indirizzo.luogo.flgLuogoItalia').value
    lavCorsoFormAltro.silTComuneEnteErog=this.formLuogoEnteErog.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoEnteErog.get('indirizzo.luogo.comune.id').value}:null
    lavCorsoFormAltro.silTNazioneEnteErog=this.formLuogoEnteErog.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoEnteErog.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    lavCorsoFormAltro.silTToponimoEnteErog=this.formLuogoEnteErog.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoEnteErog.get('indirizzo.toponimo.id').value}:null

    lavCorsoFormAltro.dsIndirizzoAziStage=this.formLuogoAziStage.get('indirizzo.indirizzo').value
    lavCorsoFormAltro.dsNumCivicoAziStage=this.formLuogoAziStage.get('indirizzo.numeroCivico').value
    lavCorsoFormAltro.flgLuogoAziStage=this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').value
    lavCorsoFormAltro.silTComuneAziStage=this.formLuogoAziStage.get('indirizzo.luogo.comune.id').value?{id:this.formLuogoAziStage.get('indirizzo.luogo.comune.id').value}:null
    lavCorsoFormAltro.silTNazioneAgiStage=this.formLuogoAziStage.get('indirizzo.luogo.stato.idSilTNazione').value?{idSilTNazione:this.formLuogoAziStage.get('indirizzo.luogo.stato.idSilTNazione').value}:null
    lavCorsoFormAltro.silTToponimoAziStage=this.formLuogoAziStage.get('indirizzo.toponimo.id').value?{idSilTToponimo:this.formLuogoAziStage.get('indirizzo.toponimo.id').value}:null


    const corsoFormazioneRequest: CorsoFormazioneRequest = {
      silTAltroCorsoForm:{
        dsSilTAltroCorsoForm: altroCorso.denominazioneCorso
      },
      lavCorsoForm: Utils.cleanObject(altroCorso.lavCorsoForm),
      lavCorsoFormAltro: Utils.cleanObject(altroCorso.lavCorsoFormAltro)
    }

    this.fascicoloService.insertOrUpdateCorsoFormazione(corsoFormazioneRequest).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          this.commonService.refreshFascicolo();
          altroCorso.lavCorsoForm = res.lavCorsoForm;
          altroCorso.lavCorsoFormAltro = res.lavCorsoFormAltro;
          if (this.formMode != MOD.EDIT){
            this.altriCorsoList.push(altroCorso);
          }

          this.initForm();
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
      }
    });


  }

  toggleFormAltriCorsi(mode: string, el?: AltroCorso) {

    this.formMode = mode;
    this.altroCorsoSelected = el;
    this.form.reset();
    if (this.altroCorsoSelected){

    this.fascicoloService.getDettaglioCorsoFormazione(this.altroCorsoSelected.lavCorsoForm.idSilLavCorsoForm).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          this.altroCorsoSelected.lavCorsoForm = res.lavCorsoForm;
          this.altroCorsoSelected.lavCorsoFormAltro = res.lavCorsoFormAltro;
          this.patchValueInform(this.altroCorsoSelected);
          this.setFormMode();
          this.showForm = true;

        }
      }
    });

    }else{
      this.setFormMode();
      this.showForm = true;

      this.formLuogoEnteErog.get('indirizzo.luogo.flgLuogoItalia').patchValue('I');
      this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').patchValue('I');



    }

  }

  private setFormMode() {
    if (this.formMode === MOD.VIEW)
      this.form.disable();
    else {
      this.form.enable();
      this.form.controls['lavCorsoForm'].get('dInizioCorso').setValidators([this.dataRangeValidator]);
      this.form.controls['lavCorsoForm'].get('dFineCorso').setValidators([this.dataRangeValidator]);
      this.setDynamicValidators();
      this.setDynamicControlStates();
    }

    if (this.formMode === MOD.EDIT){
      this.form.controls['denominazioneCorso'].disable();
      this.form.controls['annoGestione'].disable();
    }

  }

  private patchValueInform(el: AltroCorso) {

    if (el.lavCorsoForm) {

      if (el.lavCorsoForm.dInizioCorso && !(el.lavCorsoForm.dInizioCorso instanceof Date)){
        const dateTmp = new Date(el.lavCorsoForm.dInizioCorso);
        if(!isNaN(dateTmp.getTime()))
          el.lavCorsoForm.dInizioCorso = dateTmp;
      }
      if (el.lavCorsoForm.dFineCorso && !(el.lavCorsoForm.dFineCorso instanceof Date)){
        const dateTmp = new Date(el.lavCorsoForm.dFineCorso);
        if(!isNaN(dateTmp.getTime()))
          el.lavCorsoForm.dFineCorso = dateTmp;
        
        
        console.log(el.lavCorsoForm.dFineCorso);
      }
      console.log(el.lavCorsoForm.dFineCorso);
      if(el.lavCorsoFormAltro.silTComuneEnteErog)
        this.comuniIst.push((el.lavCorsoFormAltro.silTComuneEnteErog as Decodifica));
      if(el.lavCorsoFormAltro.silTComuneAziStage)
        this.comuniAz.push((el.lavCorsoFormAltro.silTComuneAziStage as Decodifica));
      if(el.lavCorsoFormAltro.silTNazioneEnteErog)
        this.nazioniEstere.push((el.lavCorsoFormAltro.silTNazioneEnteErog as Decodifica));
      if(el.lavCorsoFormAltro.silTNazioneAgiStage)
        this.nazioniEstere.push((el.lavCorsoFormAltro.silTNazioneAgiStage as Decodifica));

    }


    if(el.lavCorsoFormAltro){

      let constComuniTmp: Decodifica[] = [];

      if(el.lavCorsoFormAltro.silTComuneEnteErog){
        constComuniTmp.push({
          id: el.lavCorsoFormAltro.silTComuneEnteErog.id,
          descr: el.lavCorsoFormAltro.silTComuneEnteErog.descr
        });
        this.comuniIst.push({
          id: el.lavCorsoFormAltro.silTComuneEnteErog.id,
          descr: el.lavCorsoFormAltro.silTComuneEnteErog.descr
        });
      }

      if(el.lavCorsoFormAltro.silTComuneAziStage){
        constComuniTmp.push({
          id:  el.lavCorsoFormAltro.silTComuneAziStage.id,
          descr: el.lavCorsoFormAltro.silTComuneAziStage.descr
        });
        this.comuniAz.push({
          id:  el.lavCorsoFormAltro.silTComuneAziStage.id,
          descr: el.lavCorsoFormAltro.silTComuneAziStage.descr
        });
      }

      if(constComuniTmp.length > 0)
        this.comuni = Utils.clone(constComuniTmp);

    }

    this.form.patchValue(el);
    console.log(this.form.get('lavCorsoForm.dFineCorso').value);

    this.formLuogoEnteErog.get('indirizzo.luogo.flgLuogoItalia').patchValue(el.lavCorsoFormAltro?.flgLuogoEnteErog??'I');
      this.formLuogoEnteErog.get('indirizzo.luogo.stato.idSilTNazione').patchValue(el.lavCorsoFormAltro?.silTNazioneEnteErog?.idSilTNazione);
      this.formLuogoEnteErog.get('indirizzo.luogo.comune.id').patchValue(el.lavCorsoFormAltro?.silTComuneEnteErog?.id);
      this.formLuogoEnteErog.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(el.lavCorsoFormAltro?.silTComuneEnteErog?.silTProvincia?.idSilTProvincia)
      this.formLuogoEnteErog.get('indirizzo.toponimo.id').patchValue(el.lavCorsoFormAltro?.silTToponimoEnteErog?.idSilTToponimo);
      this.formLuogoEnteErog.get('indirizzo.indirizzo').patchValue(el.lavCorsoFormAltro?.dsIndirizzoEnteErog)
      this.formLuogoEnteErog.get('indirizzo.numeroCivico').patchValue(el.lavCorsoFormAltro?.dsNumCivicoEnteErog)


      this.formLuogoAziStage.get('indirizzo.luogo.flgLuogoItalia').patchValue(el.lavCorsoFormAltro?.flgLuogoAziStage??'I');
      this.formLuogoAziStage.get('indirizzo.luogo.stato.idSilTNazione').patchValue(el.lavCorsoFormAltro?.silTNazioneAgiStage?.idSilTNazione);
      this.formLuogoAziStage.get('indirizzo.luogo.comune.id').patchValue(el.lavCorsoFormAltro?.silTComuneAziStage?.id);
      this.formLuogoAziStage.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').patchValue(el.lavCorsoFormAltro?.silTComuneAziStage?.silTProvincia?.idSilTProvincia)
      this.formLuogoAziStage.get('indirizzo.toponimo.id').patchValue(el.lavCorsoFormAltro?.silTToponimoAziStage?.idSilTToponimo);
      this.formLuogoAziStage.get('indirizzo.indirizzo').patchValue(el.lavCorsoFormAltro?.dsIndirizzoAziStage)
      this.formLuogoAziStage.get('indirizzo.numeroCivico').patchValue(el.lavCorsoFormAltro?.dsNumCivicoAziStage)

}

  async onClickElimina(el: AltroCorso){
    const data: DialogModaleMessage = {
      titolo: "Eliminazione corso",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare il corso selezionato?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      const corsoFormazioneRequest: CorsoFormazioneRequest = {
        silTAltroCorsoForm:{
          dsSilTAltroCorsoForm: el.denominazioneCorso
        },
        lavCorsoForm: Utils.cleanObject(el.lavCorsoForm),
        lavCorsoFormAltro: Utils.cleanObject(el.lavCorsoFormAltro)
      }
      this.fascicoloService.deleteCorsoFormazione(corsoFormazioneRequest).subscribe({
        next: (res) => {
          if (res?.esitoPositivo) {
            this.commonService.refreshFascicolo();
            this.altriCorsoList = this.altriCorsoList.filter(al=> {return !(al.lavCorsoForm.idSilLavCorsoForm==el.lavCorsoForm.idSilLavCorsoForm)})

            const data: DialogModaleMessage = {
              titolo: "Gestione Fascicolo",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioEliminazione.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.showForm = false;
            this.initForm();
            this.showForm = false;
          }
        }
      });
    } else {
      console.log('Ha risposto NO');
    }
  }

  private dataRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    
    const dataInizio = this.form.controls['lavCorsoForm'].get('dInizioCorso').value;
    const dataFine = this.form.controls['lavCorsoForm'].get('dFineCorso').value;
    if (dataInizio && dataFine) {
       const dtInizio: Date = new Date(dataInizio);
       const dtFine: Date = new Date(dataFine);
       dtInizio.setHours(0,0,0,0);
       dtFine.setHours(0,0,0,0);
      invalid = dtInizio.valueOf() > dtFine.valueOf();
    }
    if(!invalid && dataInizio && dataFine){
      this.form.controls['lavCorsoForm'].get('dInizioCorso').setErrors(null);
      this.form.controls['lavCorsoForm'].get('dFineCorso').setErrors(null);
    }
    return invalid ? { invalidDataRange: { dataInizio, dataFine } } : null;
  };



}
