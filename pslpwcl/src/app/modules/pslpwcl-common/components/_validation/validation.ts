/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';

//---------------------------- Components ---------------------------------
@Component({
  selector: 'app-control-messages',
  template: '<div *ngIf="errorMessage !== null">{{errorMessage}}</div>'
})
export class ControlMessagesComponent {

  @Input() control!: AbstractControl;

  get errorMessage() {
    let a: any = null;

    //-> Per prevenire il caso in cui ho required con datePicker
    //->-> Anche se il campo input ha dei dati, ma sono formalmente incorretti
    //->-> Es: [ads] allora segnava 2 errori { required:.., matDatepickerParse:..}
    //->-> Cosi facendo prende l'ultimo errore ignorando gli altri
    for (const propertyName in this.control.errors) {
      a = propertyName;
    }

    if ( a && this.control && this.control.errors && this.control.errors!.hasOwnProperty(a) && this.control.touched) {
      return Validation.getValidatorErrorMessage(a, this.control.errors![a]);
    }
    return null;
  }
}


export class Validation {

  static CHECK_CODICE_CONTROLLO = true; // check codice di controllo nel codice fiscale
  static EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any):string{

      const config: ValidationConfig = {
          required: 'Campo Obbligatorio',
          invalidEmailAddress: 'Indirizzo email invalido',
          invalidEmailAddressNoAt: 'L\'indirizzo mail deve contenere \'@\'',
          phoneNumberValidator: 'Numero di telefono non valido',
          pattern:'Caratteri non validi per il campo',
          maxlength:`Attenzione: il campo deve contenere al massimo ${validatorValue.requiredLength} caratteri`,
          minlength: `Attenzione: il campo deve contenere almeno ${validatorValue.requiredLength} caratteri`,
          caratteriAlfabeticiApostrofo: `Attenzione: il campo può contenere solo caratteri alfabetici`,
          caratteriNonAmmessi: `Attenzione: caratteri non ammessi nel ${validatorValue.campo}.`,
          numeroSuperiore: `Attenzione: numero inserito è troppo grande.`,
          valoreMax:'Il Voto non puo\' essere maggiore del Valore massimo',
          msg: validatorValue,

          outOfRange:"il numero inserito è fuori dal range ammessibile ",

          matDatepickerParse: 'Attenzione: la data inserita non è formalmente corretta.',
          matDatepickerFilter:validatorValue.msg,

          formatoOreNonCorretto: 'Attenzione: le ore possono essere h oppure h.5 masssimo 999.5',

          erroreGruppoCodice: 'Attenzione: inserire un codice operatore oltre al gruppo',


          invalidCFiscaleAddress: 'Codice fiscale non valido',
          invalidLengthCFiscaleAddress: 'Il codice fiscale deve avere lunghezza 16',
          invalidCharCFiscaleAddress: 'Sono ammessi solo lettere e numeri',
          notAnObject: 'Selezionare una voce dal menu di scelta',
          invalidDataRange:'La data inizio deve essere precedente alla data fine',
          invalidDataRangeCessaz:'La data cessazione deve essere successiva alla data assunzione',
          invalidDataRangePeriodo:'La data fine periodo formativo deve essere futura alla data assunzione'
      };
      return config[validatorName];
  }

  /*
    * Validazione codice fiscale (N.B. non usare una regex per validare il cf, non funziona
    *  nei casi di omocodia a meno di regex una regex lunghissima e non fa verifiche sul codice di controllo).
    * In caso di stringa blank ritorna vero. Altrimenti ritorna vero solo se il codice fiscale è valido.
    * Per rendere meno stringente il controllo settare CHECK_CODICE_CONTROLLO a false
    * Source: http://www.icosaedro.it/cf-pi/
    */
  static cFiscaleValidator(control:FormControl){
      const cf: string = control.value.toUpperCase();
      if (!cf || !cf.trim()) { return null; }
      if (cf.length !== 16) {
          return { invalidLengthCFiscaleAddress: true };
      }
      if (! /^[0-9A-Z]{16}$/.test(cf)) {
          return { invalidCharCFiscaleAddress: true };
      }
      const map = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17,
          19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];
      let s = 0;
      for (let i = 0; i < 15; i++) {
          let c = cf.charCodeAt(i);
          if (c < 65) {
              c = c - 48;
          } else {
              c = c - 55;
          }
          if (i % 2 === 0) {
              s += map[c];
          } else {
              s += c < 10 ? c : c - 10;
          }
      }
      const atteso = String.fromCharCode(65 + s % 26);
      if (atteso !== cf.charAt(15) && Validation.CHECK_CODICE_CONTROLLO) {
          return { invalidCFiscaleAddress: true };
      }
      return null;
  }


  //----------------Congome & Nome
  private static cognomeNomeValidator(control:FormControl, isNome:boolean = false):ValidationErrors | null {
    const nome: string = control.value;
    if (!nome || !nome.trim()) { return null; }

    let format = /[`!@#$0123456789%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/;

    if (nome.length < 2) {
      return { minlength: {
                actualLength:nome.length,
                requiredLength:2
              }};
    }
    if (nome.length == 2 && nome.indexOf("'") !== -1) {
      return { minlength: {
                actualLength:1,
                requiredLength:2
              }};
    }
    if(format.test(nome)){
      return { caratteriNonAmmessi: {
                    campo: isNome? "nome":"cognome"
      }};
    }
    return null;
  }
  private static cognomeNomeRequired(control:FormControl,isNome:boolean = false):ValidationErrors | null{
    const nome: string = control.value;
    if (!nome || !nome.trim()) { return { required: true };}
    return Validation.cognomeNomeValidator(control, isNome);
  }

  //----------------Cognome
  static cognomeValidator(control:FormControl):ValidationErrors | null{
    return Validation.cognomeNomeValidator(control);
  }
  static cognomeRequired(control:FormControl):ValidationErrors | null{
    return Validation.cognomeNomeRequired(control);
  }

  //----------------Nome
  static nomeValidator(control:FormControl):ValidationErrors | null{
    return Validation.cognomeNomeValidator(control, true);
  }
  static nomeRequired(control:FormControl):ValidationErrors | null{
    return Validation.cognomeNomeRequired(control, true);
  }
  // nome e cognome metodi che reinderizzano a quello in comune

  //----------------ORE
  static oreValidator(control:FormControl):ValidationErrors | null {
    const ore: string = control.value;
    if (!ore?.trim()) { return null; }

    let format = /^[0-9]{1,3}([.,][5])?$/;

    if(!format.test(ore)){
      return { formatoOreNonCorretto: true };
    }
    return null;
  }
  static oreRequired(control:FormControl):ValidationErrors | null{
    const ore: string = control.value;
    if (!ore?.trim()) { return { required: true };}
    return Validation.oreValidator(control);
  }


  static int4Validator(control:FormControl):ValidationErrors | null{
    const num: string = control.value;
    if (!num?.trim()) { return null; }

    let format = /^[0-9]{1,10}?$/;

    if(!format.test(num)){
      return { caratteriNonAmmessi: {campo: "numerico"} };
    }
    if(Number(num) > 2147483647){
      return { numeroSuperiore: true };
    }
    return null;
  }
  static int4Required(control:FormControl):ValidationErrors | null{
    const num: string = control.value;

    if (!num?.trim()) { return { required: true };}
    return Validation.int4Validator(control);
  }

  //----------------Gruppo Codice
  static gruppoCodiceValidator(control:FormControl):ValidationErrors | null {
    const gruppoCodice: string = control.value;
    if (!gruppoCodice || !gruppoCodice.trim()) { return null; }

    let format = /^[a-zA-Z][\d]{1,5}$/;

    if(!format.test(gruppoCodice)){
      return{ erroreGruppoCodice: true };
    }
    return null;
  }

  //----------------Date
  static dateValidator(control:FormControl){
    const dateString: string = control.value;

  }

  //----------------Email
  static emailValidator(control:FormControl):ValidationErrors | null {
      const mail: string = control.value;
      if (!mail) return null;

      if (!mail.match(Validation.EMAIL_REGEX)) {
          return { invalidEmailAddress: true };
      }
      return null;
  }
  static emailRequired(control:FormControl):ValidationErrors | null{
    const mail: string = control.value;
    if (!mail || !mail.trim()) { return { required: true };}
    return Validation.emailValidator(control);
  }

  //----------------Phone Number
  static phoneNumberValidator(control:FormControl):ValidationErrors | null {
      if (!control.value || control.value.match(/^\s*$/g) || control.value.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$/g)) {
          return null;
      } else {
          return { phoneNumberValidator: true };
      }
  }
  static phoneNumberRequired(control:FormControl):ValidationErrors | null{
    const phone: string = control.value;
    if (!phone || !phone.trim()) { return { required: true };}
    return Validation.phoneNumberValidator(control);
  }

  //-----------------Dati Peculiari
  static condOccupazionaleRequired(control:FormControl,isRequired:boolean):ValidationErrors|null{
    if(isRequired){
      const dato=control.value
      if(!dato || !dato.trim()){return {required:true}}
      return null
    }
    return null
  }

    //--------------Permesso di soggiorno
    static permessoDiSoggiornoValidator(control:FormControl):ValidationErrors | null{
      const permessoDiSoggiorno: string=control.value;
      if(!permessoDiSoggiorno || permessoDiSoggiorno.match(/^[a-zA-Z]{1}[0-9]{8}$/) ){
        return null;
      }else{
        return {invalidPermessoDiSoggiorno: true}
      }
    }

  static objectValidator(control: AbstractControl) {
      if (!control || !control.value || typeof control.value === 'object') {
          return null;
      } else {
          return { notAnObject: true };
      }
  }
}

interface ValidationConfig {
  [key: string]: string;
}
