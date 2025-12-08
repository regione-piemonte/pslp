/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LavAnagrafica, DecodificaPslpService, TipoResponsabilita, UtenteService, PrivacyService, FormAnagraficaLav, DelegaService, UtenteRequest, Utente, PslpMessaggio, MessaggioService } from 'src/app/modules/pslpapi';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { Validation } from '../_validation/validation';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from '../../models/dialog-modale-message';
import { TypeDialogMessage } from '../../models/type-dialog-message';

@Component({
  selector: 'pslpwcl-modal-selezionare-cittadino',
  templateUrl: './modal-selezionare-cittadino.component.html',
  styleUrls: ['./modal-selezionare-cittadino.component.scss']
})
export class ModalSelezionareCittadinoComponent implements OnInit {

  @Input() title: string;
  @Input() callback: any;
  @Input() modal: any;


  utenteFound: LavAnagrafica;

  isUtenteFound: boolean = false;

  info9: PslpMessaggio;
  isUtenteNuovo: boolean = false;
  selezionaCittadinoAttivo: boolean = false;
  minDate:Date = new Date(1900,1,1);
  sysDate: Date = new Date();

  form = this.fb.group({
    codiceFiscale: ['',[Validators.required, Validation.cFiscaleValidator]],
    nome: ['',Validators.required],
    cognome: ['',Validators.required],
    dataNascita: ['',Validators.required],

  })

  titoloErrore = "";
  messaggioErrore = ""
  tipoResponsabilitaList: Array<TipoResponsabilita> = []
  selectedTipo?:TipoResponsabilita;
  tipoDelega = true;
  forDelega: boolean = false;


  constructor(
    private fb: FormBuilder,
    private logService: LogService,
    private readonly appUserService:AppUserService,
    private utenteService:UtenteService,
    private promptModalService:PromptModalService,
    private messaggioService: MessaggioService

  ) { }

  ngOnInit(): void {
    this.form.controls['nome'].disable();
    this.form.controls['cognome'].disable();
    this.form.controls['dataNascita'].disable();
    this.messaggioService.findByCod("I9").subscribe(
      (r:any)=>this.info9=r.msg
    );

    //-Aggiungere filtro per minorenni
  }

  onClickSelezionaCittadino(){


    //this.appUserService.setUtenteOperateFor(delega.pslpTUtente2);
    let codiceFiscale:string = this.form.controls['codiceFiscale'].value.toUpperCase();

    if(this.isUtenteFound){
      this.utenteService.utenteByCodiceFiscale(codiceFiscale).subscribe({
        next:res => {

          if(res.esitoPositivo){
            this.appUserService.setUtenteOperateFor(res.utente);

            this.callback(this.modal,'OK');
          }else{
            const data: DialogModaleMessage = {
              titolo: "Altre informazioni",
              tipo: TypeDialogMessage.Back,
              messaggio: res.apiMessages[0].message,
              messaggioAggiuntivo: " ",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data);
            return
          }

        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`Errore di recuper tipo Responsabilita `)
        },
        complete: () =>{

        }
      });
    }else{
      this.form.markAllAsTouched();
      if(!this.form.valid){
        return;
      }
      let utenteRequest: UtenteRequest = {
        utente: {
          cfUtente : this.form.controls['codiceFiscale'].value.toUpperCase(),
          nome : this.form.controls['nome'].value.toUpperCase(),
          cognome : this.form.controls['cognome'].value.toUpperCase()
        }
      };
      this.utenteService.insertUtente(utenteRequest).subscribe({
        next:res => {

          if(res.esitoPositivo){
            this.appUserService.setUtenteOperateFor(res.utente);
            this.callback(this.modal,'OK');
          }else{
            this.titoloErrore = res.apiMessages[0].title;
            this.messaggioErrore = res.apiMessages[0].message;
          }

        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`Errore di recuper tipo Responsabilita `)
        },
        complete: () =>{

        }
      });

    }


  }

  onCerca(){
    this.isUtenteNuovo = false;
    this.form.controls['nome'].setValue("");
    this.form.controls['cognome'].setValue("");
    this.form.controls['dataNascita'].setValue("");
    this.messaggioErrore = ""
    this.titoloErrore = ""
    this.isUtenteFound = false;
    let codiceFiscale:string = this.form.controls['codiceFiscale'].value.toUpperCase();
    if(codiceFiscale == ''){
      return
    }

    this.utenteService.cercaCFSilp(codiceFiscale,this.forDelega, this.forDelega).subscribe({
      next: res => {

        if(res.esitoPositivo){
          this.utenteFound = res.anagraficaLav;
          this.form.controls['nome'].setValue(this.utenteFound.dsNome);
          this.form.controls['nome'].updateValueAndValidity();
          this.form.controls['cognome'].setValue(this.utenteFound.dsCognome);
          this.form.controls['cognome'].updateValueAndValidity();
          this.form.controls['dataNascita'].setValue(
            new Date(this.utenteFound.dataNasc).toLocaleDateString());
            this.form.controls['dataNascita'].updateValueAndValidity();

          this.isUtenteFound = true;
          this.tipoDelega = false;


          this.form.controls['nome'].disable();
          this.form.controls['cognome'].disable();
          this.form.controls['dataNascita'].disable();
          this.selezionaCittadinoAttivo = true;
        } else {
          this.logService.info(this.constructor.name,
            "title: "+JSON.stringify(res.apiMessages[0].title)+
              "message: "+JSON.stringify(res.apiMessages[0].message))

          if(res.apiMessages[0]?.code != "E7"){
            this.titoloErrore = res.apiMessages[0].title;
            this.messaggioErrore = res.apiMessages[0].message;
            this.selezionaCittadinoAttivo = false;
          }else{
            this.form.enable();
            this.isUtenteFound = false;
            this.form.controls['nome'].enable();
            this.form.controls['cognome'].enable();
            this.form.controls['dataNascita'].disable();
            this.selezionaCittadinoAttivo = true;
            this.isUtenteNuovo = true;
          }
        }

      },
      error: (err) =>{
        this.logService.error(this.constructor.name,`Errore di recuper tipo Responsabilita `)
      },
      complete: () =>{
        //  this.spinner.hide();
      }
    })
  }

  onChangeCf(){
    this.messaggioErrore = null;
  }

  get tipoResponsabilitaIsCompiled(){
    let tipoResponsabilita:TipoResponsabilita = this.form.controls['tipoDelega'].value;
    return tipoResponsabilita!= undefined && tipoResponsabilita != null;
  }

}
