/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CONTROL_STATE, MOD } from 'src/app/constants';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { LogService } from 'src/app/services/log.service';
import { DecodificaPslpService, Decodifica } from 'src/app/modules/pslpapi';
import { forkJoin } from 'rxjs';
import { IndirizzoStradario, FascicoloPslpService, RicercaIndirizzoStradarioRequest, StradarioService } from 'src/app/modules/pslpapi';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'pslpwcl-form-stradario',
  templateUrl: './form-stradario.component.html',
  styleUrls: ['./form-stradario.component.scss']
})
export class FormStradarioComponent implements OnChanges, OnInit {

  @Input() label!: string;
  @Input() mode!: string;
  @Input() form!: FormGroup;
  @Input() hideLocalita?: boolean = false;
  @Input() refreshListe?: FormControl;
  @Input() domicilioUguale?: FormControl;
  @Input() campiObbligatori?: boolean;

  comunesProv: Decodifica[] = [];
  provincie: any[] = [];
  statosEstero: Decodifica[] = [];
  toponimos: Decodifica[] = [];
  indirizzi: IndirizzoStradario[] = [];

  stradarioUsoEsclusivo: boolean = false;
  stradarioAttivo: boolean = false;
  localitaAbb: boolean = false;
  piemonte: boolean = false;
  capAbb: boolean = false;
  copiaDomicilio: boolean = false;
  flgLuogoItalia: string = 'I';
  lFlagObb: boolean = false;

  
  get fc() {
    return this.form.controls as any;
  }

  get VIEW_MODE() {
    return this.mode === MOD.VIEW;
  }

  get INS_MODE(): boolean {
    return this.mode === MOD.INS;
  }

  get EDIT_MODE(): boolean {
    return this.mode === MOD.EDIT;
  }

  constructor(
    private logService: LogService,
    private decodificaService: DecodificaPslpService,
    private stradarioService: StradarioService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.logService.info(this.constructor.name, `ngOnInit`);

    this.loadDecodifiche();
    this.loadParametri();
    this.initList();
    this.setFormMode();
    this.formChangesHandler();
    this.checks();

    if(this.INS_MODE)
      this.provincie = [];
    else {
      if (this.fc.luogo.controls['comune'].controls['silTProvincia']?.controls['idSilTProvincia']?.value == undefined || 
          this.fc.luogo.controls['comune'].controls['silTProvincia']?.controls['idSilTProvincia']?.value == null) {
          this.provincie = [];
      }
    }

    this.spinner.hide();
  }

  ngOnChanges() {
    this.initList();
    this.setFormMode();
    this.checks();
  } 

  // veifiche
  private checks() {
    if(this.campiObbligatori !== null && this.campiObbligatori !== undefined) {
      this.lFlagObb = this.campiObbligatori;
    }
    if(this.fc.cap !== undefined) 
      this.capAbb = true;
    
    if(this.fc.localita !== undefined) 
      this.localitaAbb = true;

    if(this.fc.luogo
      .controls['comune']
      .controls['silTRegione']
      .controls['descr']
      .value === 'PIEMONTE') {
        this.piemonte = true;
    }

    if(this.fc.luogo.controls['flgLuogoItalia'].value === null || this.fc.luogo.controls['flgLuogoItalia'].value === undefined) {
      this.fc.luogo.controls['flgLuogoItalia'].patchValue('I');
      this.flgLuogoItalia = 'I';
    }
  }

  // gestione modifiche valori (PROVINCIA, LUOGO e UGUALE A RESIDENZA)
  private formChangesHandler() {
    this.fc.luogo
      .controls['comune']
      .controls['silTRegione']
      .controls['descr']
      .valueChanges
      .subscribe(([prev, next]: [any, any]) => {
        if(next && next === 'PIEMONTE') {
          this.piemonte = true;
          this.setControls();
        } else {
          this.piemonte = false;
          this.setControls();
        }
      });
    this.fc.luogo
      .controls['flgLuogoItalia']
      .valueChanges
      .subscribe(([prev, next]: [any, any]) => {
          this.flgLuogoItalia = next;
          if(this.flgLuogoItalia === 'E') {
            this.clearValidators();
          }
          if(prev !== next) {
            if(this.campiObbligatori !== null && this.campiObbligatori !== undefined) {
              this.lFlagObb = this.campiObbligatori;
            } else {
              this.lFlagObb = false;
            }
          }
      });
    if(this.refreshListe) {
      if(this.refreshListe.value) {
        const comune = this.fc.luogo.controls['comune'].controls['descr'].value;
        const idComune = this.fc.luogo.controls['comune'].controls['id'].value;
        const idProvincia = this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].value;
        const provincia = this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].value;
        this.comunesProv = [{id: idComune, descr: comune}];
        this.provincie = [{idSilTProvincia: idProvincia, descr: provincia}];
      }
      this.refreshListe
      .valueChanges
      .subscribe(([prev, next]: [any, any]) => {
        if(next) {
          const comune = this.fc.luogo.controls['comune'].controls['descr'].value;
          const idComune = this.fc.luogo.controls['comune'].controls['id'].value;
          const idProvincia = this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].value;
          const provincia = this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].value;
          this.comunesProv = [{id: idComune, descr: comune}];
          this.provincie = [{idSilTProvincia: idProvincia, descr: provincia}];
        }
      });
    }
    if(this.domicilioUguale) {
      this.copiaDomicilio = this.domicilioUguale.value;
      this.domicilioUguale
      .valueChanges
      .subscribe(([prev, next]: [any, any]) => {
          this.copiaDomicilio = next;
          this.setControls();
        
      });
    }
    
  }

  // impostazione modalita del form (VIEW, EDIT o INS)
  private setFormMode() {
    if (this.mode === MOD.VIEW) {
      this.form.disable;
    } else if (this.mode === MOD.INS || this.mode === MOD.EDIT) {
      this.setControls();
    }
  }

  // caricamento decodifiche (toponime e nazioni)
  private loadDecodifiche() {
    const requests$ = [
      this.decodificaService.findDecodificaByTipo('nazione-estera'),
      this.decodificaService.findDecodificaByTipo('toponimo')
    ];
    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo)
          this.statosEstero = multiResponse[0].list
        if (multiResponse[1].esitoPositivo)
          this.toponimos = multiResponse[1].list
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      }
    });
  }

  // caricamento parametri i config
  private loadParametri() {
    
  }

  // gestione dello stato dei campi
  setControls() {
    
    if(this.copiaDomicilio || this.VIEW_MODE) { // domicilio uguale alla residenza o in modalita di visualizzazione

      this.disableAll();

    } else {
      if(this.stradarioAttivo) { // stradario attivo
        if (this.flgLuogoItalia == 'I') { // luogo italia
          if(
            this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].value === null ||
            this.fc.luogo.controls['comune'].controls['descr'].value === null
          ) { // provincia e/o comune non impostato

            this.setStateProviciaComune();

          } else {// provincia e comune impostati

            if(this.piemonte) { // in piemonte
              if(this.stradarioUsoEsclusivo) { // stradario ad uso esclusivo
                this.setStateStradarioUsoEsclusivo();
  
              } else { // stradario non è ad uso esclusivo
                this.setStateStradarioNonUsoEsclusivo();
              }
            } else { // non in piemonte
              this.setStateStradarioNonUsoEsclusivo();
            }
          }
        } else { // luogo fuori italia
          this.setStateStradarioFuoriItalia();
        }
      } else { // stradario disattivato
        this.setStateStradarioNonUsoEsclusivo();
      }
    }
  }

  // aggiunge l'asterisco in roso sulla label dei campi per indicare che sono obbligatori
  get required(): boolean {
    if(this.lFlagObb == true)
      return this.fc.luogo.controls['flgLuogoItalia'].value == 'I';
    else
      return null;
  }

  setFlgItalia() {
    if(this.flgLuogoItalia === 'E') {
      this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].reset();
      this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].reset();
      this.provincie = [];
      this.fc.luogo.controls['comune'].controls['id'].reset();
      this.fc.luogo.controls['comune'].controls['descr'].reset();
      this.fc.luogo.controls['comune'].controls['codIstat'].reset();
      this.fc.luogo.controls['comune'].controls['silTRegione'].controls['descr'].reset();
      this.comunesProv = [];
      this.fc.ricerca.reset();
      this.indirizzi = [];
      this.fc.toponimo.controls['id'].reset();
      this.fc.toponimo.controls['descr'].reset();
      this.fc.numeroCivico.reset();
      this.fc.indirizzo.reset();
      if(this.capAbb)
        this.fc.cap.reset();
      if(this.localitaAbb)
        this.fc.localita.reset();
    } else {
      this.provincie = [];
      this.fc.luogo.controls['stato'].controls['idSilTNazione'].reset();
      this.fc.luogo.controls['stato'].controls['dsSilTNazione'].reset();
    }
    this.setControls();
  }

  // ricerca provincia
  onSearchProvincia(term: string) {
    if (term.length < 2)
      return;
    this.decodificaService.fillDecodificaByTipo('provincia', term).subscribe({
      next: (res: any) => {
        this.provincie = this.mapProvincia(res.list);
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `onSearchProvincia ${JSON.stringify(err)}`);
      }
    });
  }

  // gestione set campo provincia
  setProvincia(provincia: any) {
    if(provincia)
      this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].patchValue(provincia.descr);
    else {
      this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].reset();
    }
    

    this.fc.ricerca.reset();
    this.indirizzi = [];
    this.fc.toponimo.controls['id'].reset();
    this.fc.toponimo.controls['descr'].reset();
    this.fc.numeroCivico.reset();
    
    this.fc.indirizzo.reset();
    
    this.fc.luogo.controls['comune'].controls['id'].reset();
    this.fc.luogo.controls['comune'].controls['descr'].reset();
    this.comunesProv = [];
    
    if(this.capAbb)
      this.fc.cap.reset();
    if(this.localitaAbb)
      this.fc.localita.reset();

    this.addValidators();

    this.setControls();
    this.lFlagObb = true;
  }

  // gestione pulizzia campo provincia
  onClearProvincia() {

    if(this.campiObbligatori !== null && this.campiObbligatori !== undefined) {
      this.lFlagObb = this.campiObbligatori;
    } else {
      this.lFlagObb = false;
    }

    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].reset();
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].reset();
    this.fc.luogo.controls['comune'].controls['id'].reset();
    this.fc.luogo.controls['comune'].controls['descr'].reset();
    this.comunesProv = [];
    this.fc.ricerca.reset();
    this.indirizzi = [];
    this.fc.toponimo.controls['id'].reset();
    this.fc.toponimo.controls['descr'].reset();
    this.fc.numeroCivico.reset();
    this.fc.indirizzo.reset();
    if(this.capAbb)
      this.fc.cap.reset();
    if(this.localitaAbb)
      this.fc.localita.reset();

    if(this.lFlagObb){
      this.addValidators();          
    } else {        
      this.clearValidators();
    }

    this.setControls();
  }

  // ricerca comune
  onSearchComune(term: string) {
    const idProvincia = this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].value;
    if (term.length < 2)
      return;
    this.decodificaService.fillComuneByIdProvincia(idProvincia, term).subscribe({
      next: (res: any) => {
        this.comunesProv = res.list;
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `onSearchComune ${JSON.stringify(err)}`);
      }
    });
  }
  
  // gestione set campo comune
  setComune(comune:any) {
    if(comune) {
      this.fc.luogo.controls['comune'].controls['descr'].patchValue(comune.descr);
      this.fc.luogo.controls['comune'].controls['codIstat'].patchValue(comune.codice);
      this.fc.luogo.controls['comune'].controls['silTRegione'].controls['descr'].patchValue(comune.special);
    }
    else {
      this.fc.luogo.controls['comune'].controls['descr'].reset();
      this.fc.luogo.controls['comune'].controls['codIstat'].reset();
      this.fc.luogo.controls['comune'].controls['silTRegione'].controls['descr'].reset();
    }
    this.fc.ricerca.reset();
    this.indirizzi = [];
    this.fc.toponimo.controls['id'].reset();
    this.fc.toponimo.controls['descr'].reset();
    this.fc.numeroCivico.reset();
    this.fc.indirizzo.reset();
    
    if(this.capAbb)
      this.fc.cap.reset();
    
    if(this.localitaAbb)
      this.fc.localita.reset();

    this.addValidators();

    this.setControls();
  }

  // gestione pulizzia campo comune
  onClearComune() {
    this.fc.luogo.controls['comune'].controls['id'].reset();
    this.fc.luogo.controls['comune'].controls['descr'].reset();
    this.fc.ricerca.reset();
    this.indirizzi = [];
    this.fc.toponimo.controls['id'].reset();
    this.fc.toponimo.controls['descr'].reset();
    this.fc.numeroCivico.reset();
    this.fc.indirizzo.reset();
    
    if(this.capAbb)
      this.fc.cap.reset();
    
    if(this.localitaAbb)
      this.fc.localita.reset();

    if(this.lFlagObb){
      this.addValidators();          
    } else {        
      this.clearValidators();
    }

    this.setControls();
  }

  // ricerca indirizzo
  onSearchIndirizzo(event: any) {
    const term = event.term;
    if (term.length < 5) {
      this.indirizzi = [];
      return;
    }
    const idComune = this.fc.luogo.controls['comune'].controls['codIstat'].value;

    let body: RicercaIndirizzoStradarioRequest = {
      codiceIstatComune: idComune,
      testoRicerca: term
    };
    this.stradarioService.findIndirizzi(body).subscribe({
      next: (res: any) => {
        if(res != undefined && res != null)
          this.indirizzi = res.elementi;
        else {
          this.indirizzi = [];
        }
      },
      error: (err) => {
        this.logService.error(this.constructor.name, `onSearchIndirizzo ${JSON.stringify(err)}`);
      }
    });
  }

  customSearchFunction(term: string, item:any) {
    /*
      il filtro viene applicato lato server,
      quindi front end non filtro e mostro tutti i risultati
      che arrivano dal server.
    */
    return true;
  }

  // set dei campi in base alla ricerca
  setIndirizzo(indirizzo: IndirizzoStradario) {
    if(indirizzo !== undefined) {
      this.toponimos.forEach(t => {
        if(t.descr === indirizzo.tipoVia) {
          this.fc.toponimo.controls['id'].patchValue(t.id);
          this.fc.toponimo.controls['descr'].patchValue(t.descr);
        }
      });

      let civico = indirizzo.civicoNumero;
      if(indirizzo.civicoSub != undefined) {
        civico += ' ' + indirizzo.civicoSub;
      }
      this.fc.numeroCivico.patchValue(civico);
      this.fc.indirizzo.patchValue(indirizzo.nomeVia);
      if(this.capAbb)
        this.fc.cap.patchValue(indirizzo.cap);
      if(indirizzo.localita && this.localitaAbb)
        this.fc.localita.patchValue(indirizzo.localita);
    }
  }

  // init delle liste del comune e province per la modifica / visualizzazione
  private initList() {
    if (this.fc.luogo.controls['comune'].controls['silTProvincia']?.value !== undefined && this.fc.luogo.controls['comune'].controls['silTProvincia']?.value !== null) {
      const provincia = this.fc.luogo.controls['comune'].controls['silTProvincia'].value;
      
      if(provincia.idSilTProvincia != null && provincia.idSilTProvincia != undefined) {
        this.provincie = [{idSilTProvincia: provincia.idSilTProvincia, descr: provincia.descr}];
        this.addValidators();
        this.lFlagObb = true;
      } else {
        this.provincie = [];
      }
    } else {
      this.provincie = [];
    }
    
    if (this.fc.luogo.controls['comune']?.value !== undefined) {
      const comune = this.fc.luogo.controls['comune'].value;
      this.comunesProv = [{id: comune.id, descr: comune.descr}];
    }
  }

  // disabilita tutti i campi
  private disableAll() {
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].disable();
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].disable();
    this.fc.luogo.controls['comune'].controls['id'].disable();
    this.fc.luogo.controls['comune'].controls['descr'].disable();
    this.fc.luogo.controls['stato'].controls['idSilTNazione'].disable();
    this.fc.luogo.controls['stato'].controls['dsSilTNazione'].disable();
    this.fc.luogo.controls['flgLuogoItalia'].disable();
    this.fc.ricerca.disable();
    this.fc.toponimo.controls['id'].disable();
    this.fc.toponimo.controls['descr'].disable();
    this.fc.indirizzo.disable();
    this.fc.numeroCivico.disable();
    
    if(this.localitaAbb)
      this.fc.localita.disable();
    
    if(this.capAbb)
      this.fc.cap.disable();
  }

  // disabilita i campi che vengono popolati dalla ricerca
  private setStateStradarioUsoEsclusivo() {
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].enable();
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].enable();
    this.fc.luogo.controls['comune'].controls['id'].enable();
    this.fc.luogo.controls['comune'].controls['descr'].enable();
    this.fc.luogo.controls['stato'].controls['idSilTNazione'].disable();
    this.fc.luogo.controls['stato'].controls['dsSilTNazione'].disable();
    this.fc.luogo.controls['flgLuogoItalia'].enable();
    this.fc.ricerca.enable();
    this.fc.toponimo.controls['id'].disable();
    this.fc.toponimo.controls['descr'].disable();
    this.fc.indirizzo.disable();
    this.fc.numeroCivico.disable();
    
    if(this.localitaAbb)
      this.fc.localita.disable();
    
    if(this.capAbb)
      this.fc.cap.disable();
  }

  // abilita i campi che vengono compilati dalla ricerca
  private setStateStradarioNonUsoEsclusivo() {
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].enable();
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].enable();
    this.fc.luogo.controls['comune'].controls['id'].enable();
    this.fc.luogo.controls['comune'].controls['descr'].enable();
    this.fc.luogo.controls['stato'].controls['idSilTNazione'].disable();
    this.fc.luogo.controls['stato'].controls['dsSilTNazione'].disable();
    this.fc.luogo.controls['flgLuogoItalia'].enable();
    this.fc.ricerca.enable();
    this.fc.toponimo.controls['id'].enable();
    this.fc.toponimo.controls['descr'].enable();
    this.fc.indirizzo.enable();
    this.fc.numeroCivico.enable();
    
    if(this.localitaAbb)
      this.fc.localita.enable();
    
    if(this.capAbb)
      this.fc.cap.enable();
  }

  // disabilita i campi legati a Luogo Italia
  private setStateStradarioFuoriItalia() {
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].disable();
    this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].disable();
    this.fc.luogo.controls['comune'].controls['id'].disable();
    this.fc.luogo.controls['comune'].controls['descr'].disable();
    this.fc.luogo.controls['stato'].controls['idSilTNazione'].enable();
    this.fc.luogo.controls['stato'].controls['dsSilTNazione'].enable();
    this.fc.luogo.controls['flgLuogoItalia'].enable();
    this.fc.ricerca.disable();
    this.fc.toponimo.controls['id'].disable();
    this.fc.toponimo.controls['descr'].disable();
    this.fc.indirizzo.disable();
    this.fc.numeroCivico.disable();
    
    if(this.localitaAbb)
      this.fc.localita.disable();
    
    if(this.capAbb)
      this.fc.cap.disable();
  }

  // gestione dello stato dei campi provincia e comune
  private setStateProviciaComune() {

    if(this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].value === null) {

      this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['idSilTProvincia'].enable();
      this.fc.luogo.controls['comune'].controls['silTProvincia'].controls['descr'].enable();
      this.fc.luogo.controls['comune'].controls['id'].disable();
      this.fc.luogo.controls['comune'].controls['descr'].disable();
      
    } else {
      this.fc.luogo.controls['comune'].controls['id'].enable();
      this.fc.luogo.controls['comune'].controls['descr'].enable();
    }
    if(this.fc.luogo.controls['comune'].controls['id'].value === null) {
      this.fc.ricerca.disable();
    } else {
      this.fc.ricerca.enable();
    }

    this.fc.luogo.controls['stato'].controls['idSilTNazione'].disable();
    this.fc.luogo.controls['stato'].controls['dsSilTNazione'].disable();
    this.fc.luogo.controls['flgLuogoItalia'].enable();
    
    this.fc.toponimo.controls['id'].disable();
    this.fc.toponimo.controls['descr'].disable();
    this.fc.indirizzo.disable();
    this.fc.numeroCivico.disable();
    
    if(this.localitaAbb)
      this.fc.localita.disable();
    
    if(this.capAbb)
      this.fc.cap.disable();
  }

  addValidators() {
    this.form.addValidators([this.validateForm.bind(this)])
  }

  validateForm(group: AbstractControl){

    if(group.get('luogo.comune.silTProvincia.idSilTProvincia').value == null || group.get('luogo.comune.silTProvincia.idSilTProvincia').value == undefined)
      return { required: true };

    if(group.get('luogo.comune.id').value == null || group.get('luogo.comune.id').value == undefined)
      return { required: true };

    if(this.campiObbligatori === true) {
      if(group.get('toponimo.id').value == null || group.get('toponimo.id').value == undefined)
        return { required: true };

      if(group.get('indirizzo').value == null || group.get('indirizzo').value == undefined)
        return { required: true };

      if(group.get('numeroCivico').value == null || group.get('numeroCivico').value == undefined)
        return { required: true };

      if(this.capAbb)
        if(group.get('cap').value == null || group.get('numeroCivico').value == undefined)
          return { required: true };
    }
    return null;
  }

  clearValidators() {
    this.form.clearValidators();
  }

  private mapProvincia(provincie:any) {
    if(provincie) {
      let result:any = [];
      provincie.forEach((p:any) => {
        const { id, descr } = p;
        const t = {
          idSilTProvincia: id,
          descr: descr
        };
        result.push(t);
      });
      return result;
    }
    return [];
  }


}
