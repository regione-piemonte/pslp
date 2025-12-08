/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { filter } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LavAnagrafica, DecodificaPslpService, TipoResponsabilita, UtenteService, PrivacyService, FormAnagraficaLav, DelegaService, PslpMessaggio } from 'src/app/modules/pslpapi';
import { NgxSpinnerService } from 'ngx-spinner';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';

@Component({
  selector: 'pslpwcl-aggiungi-delega',
  templateUrl: './aggiungi-delega.component.html',
  styleUrls: ['./aggiungi-delega.component.scss']
})
export class AggiungiDelegaComponent implements OnInit {

  form = this.fb.group({
    codiceFiscale: ['',Validators.required],
    nome: ['',Validators.required],
    cognome: ['',Validators.required],
    dataNascita: ['',Validators.required],

    tipoDelega: [null, Validators.required]
  })

  titoloErrore = "";
  messaggioErrore = ""
  tipoResponsabilitaList: Array<TipoResponsabilita> = []
  selectedTipo?:TipoResponsabilita;
  tipoDelega = true;
  forDelega: boolean = true;
  messagioInserimento: PslpMessaggio;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private logService: LogService,
    private decodificaService:DecodificaPslpService,
    private commonService:CommonService,
    private delegaService: DelegaService,

    private promptModalService:PromptModalService,
    private utenteService:UtenteService,

    private privacyService:PrivacyService,

    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.form.controls['nome'].disable();
    this.form.controls['cognome'].disable();
    this.form.controls['dataNascita'].disable();
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });

    //-Aggiungere filtro per minorenni

    this.spinner.show()
    this.decodificaService.findTipoResponsabilita().subscribe(
      {
        next: (res: any) =>{
          if(res.esitoPositivo){
            this.tipoResponsabilitaList = res.list

            this.tipoResponsabilitaList = this.commonService.isDelegaForMinore?
                         this.tipoResponsabilitaList.filter(tipo=> tipo.flgMinorenne =="S")
                        :this.tipoResponsabilitaList.filter(tipo=> tipo.flgMinorenne !="S");
          }
        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`Errore di recuper tipo Responsabilita `)
        },
        complete: () =>{
          // this.loadingDelegheDeleganti = false;
           this.spinner.hide();
        }
      })
  }

  indietro() {
    this.router.navigateByUrl('pslpfcweb/private/deleghe/riepilogo-deleghe');
  }


  utenteFound: LavAnagrafica;
  isUtenteFound: boolean = false;
  onCerca(){
    this.form.controls['nome'].setValue("");
    this.form.controls['cognome'].setValue("");
    this.form.controls['dataNascita'].setValue("");
    this.tipoDelega= true;
    this.messaggioErrore = ""
    this.titoloErrore = ""
    this.isUtenteFound = false;
    let codiceFiscale:string = this.form.controls['codiceFiscale'].value;
    if(codiceFiscale == ''){
      return
    }
    this.utenteService.cercaCFSilp(codiceFiscale,this.commonService.isDelegaForMinore, this.forDelega).subscribe({
      next: res => {

        if(res.esitoPositivo){
          this.utenteFound = res.anagraficaLav;
          this.form.controls['nome'].setValue(this.utenteFound.dsNome);
          this.form.controls['cognome'].setValue(this.utenteFound.dsCognome);
          this.form.controls['dataNascita'].setValue(
            new Date(this.utenteFound.dataNasc).toLocaleDateString());

          this.isUtenteFound = true;
          this.tipoDelega = false;
        } else {
          this.logService.info(this.constructor.name,
            "title: "+JSON.stringify(res.apiMessages[0].title)+
              "message: "+JSON.stringify(res.apiMessages[0].message))

            this.titoloErrore = res.apiMessages[0].title;
            this.messaggioErrore = res.apiMessages[0].message;
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

  async inserireCodOtp(){
    const resp = await this.promptModalService.openCodiceOtp("Inserire OTP", this.utenteFound.codFiscale);

    if(resp){

      this.salvaDelega();

    }
  }

  async salvaDelega(){
    let tipoResponsabilita:TipoResponsabilita = this.form.controls['tipoDelega'].value;
      if(tipoResponsabilita== undefined || tipoResponsabilita == null){
        return
      }
      let formAnagrafica: FormAnagraficaLav ={
        anagraficaLav: this.utenteFound,
        tipoResponsabilita:tipoResponsabilita,
        isMinorenne: this.commonService.isDelegaForMinore,
      }
      this.delegaService.insertDelega(formAnagrafica).subscribe({
        next: res=>{
          if(res.esitoPositivo){
            this.form.reset()
            this.isUtenteFound = false;
            
            this.confermaMail();
            
          }else{
            let msg="Errore nell'inserimento dei dati"
            const data: DialogModaleMessage = {
              titolo: "Gestione Deleghe",
              tipo: TypeDialogMessage.Back,
              messaggio:msg,
              size: "lg",
              tipoTesto: TYPE_ALERT.WARNING
            };
            this.promptModalService.openModaleConfirm(data)
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

  async confermaMail(){
    const resp = await this.promptModalService.openConfermaMail("Conferma Mail", this.utenteFound);
    if(resp){
      const data: DialogModaleMessage = {
        titolo: "Gestione Deleghe",
        tipo: TypeDialogMessage.Confirm,
        messaggio: this.messagioInserimento.testo,
        size: "lg",
        tipoTesto: TYPE_ALERT.SUCCESS
      };
      this.promptModalService.openModaleConfirm(data);

      this.router.navigateByUrl("pslpfcweb/private/deleghe/riepilogo-deleghe");
    }
  }

  async onSalva(){
    //this.spinner.show();
    if(!this.commonService.isDelegaForMinore){
      this.delegaService.invioCodiceOtp(this.utenteFound.codFiscale).subscribe({
        next: (res: any) => {
          if(res.esitoPositivo){
            //this.spinner.hide();
            this.inserireCodOtp();
          }else{
            //this.spinner.hide();
          }
        },
        error: (error:any) => {
          //this.spinner.hide();
        }
      });
    }else{
      this.salvaDelega();
    }
    

  }

  get tipoResponsabilitaIsCompiled(){
    let tipoResponsabilita:TipoResponsabilita = this.form.controls['tipoDelega'].value;
    return tipoResponsabilita!= undefined && tipoResponsabilita != null;
  }



}
