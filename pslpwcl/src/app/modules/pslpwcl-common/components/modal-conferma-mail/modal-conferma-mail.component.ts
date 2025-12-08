/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ControlliFascicoloRequest, FascicoloPslpService, LavAnagrafica, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { DialogModaleMessage } from '../../models/dialog-modale-message';
import { TypeDialogMessage } from '../../models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { PromptModalService } from '../../services/prompt-modal.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'pslpwcl-modal-conferma-mail',
  templateUrl: './modal-conferma-mail.component.html',
  styleUrls: ['./modal-conferma-mail.component.scss']
})
export class ModalConfermaMailComponent implements OnInit {
  @Input() title:string = "Conferma Mail";
  @Input() messaggio:string;
  @Input() tipo:string;
  @Input() size:string;
  @Input() tipoTesto:string;
  @Input() callback:any;
  @Input() modal:any;
  @Input() utente:LavAnagrafica;

  emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  formMail = this.fb.group({
    mail: ['', [Validators.required, Validators.pattern(this.emailRegex)]]
  })
  fascicolo:SchedaAnagraficaProfessionale;

  constructor(
    private fb: FormBuilder,
    private readonly appUserService:AppUserService,
    private spinner: NgxSpinnerService,
    private commonService:CommonService,
    private fascicoloService:FascicoloPslpService,
    private promptModalService:PromptModalService,
    private logService:LogService
  ) { }

  ngOnInit(): void {
    
    this.initForm();
    
    if(!this.utente?.dsMail){
      this.fascicoloService.getDettaglioFascicolo(this.utente?.idSilLavAnagrafica).subscribe({
        next: (r:any)=>{
          if(r.esitoPositivo){
            this.fascicolo = r.fascicolo;
            console.log("fascicolo",this.fascicolo);
          }
        }
      })
      
      console.log("non esiste mail",this.utente.dsMail);
    }else{
      this.formMail.get("mail").disable();
      console.log("esiste mail");
    }
  }

  private initForm(){

    this.formMail.get("mail").setValue(this.utente?.dsMail);
  }

  onClickConferma(){
    if(this.utente.dsMail){
      this.callback(this.modal,this.formMail.get("mail").value);
      return;
    }
    let fascicoloTmp:SchedaAnagraficaProfessionale;
    if(!this.fascicolo){
      fascicoloTmp=this.commonService.fascicoloActual;
    }else{
      fascicoloTmp={...this.fascicolo};
    }

    fascicoloTmp.datiAnagrafici.reperibilitaRecapiti.recapito.email=this.formMail.get("mail").value;
    
    console.log("fascicoloTmp",fascicoloTmp);
    
    this.spinner.show()
 
    console.log(this.fascicolo);
    let controlliFascicoloRequest:ControlliFascicoloRequest = {
       coordTabAttivo: '1.1',
      coordTabDestino: '1.2',

      flgFattaDomandaSalva: true,

      idSilLavAnagrafica: this.fascicolo ? this.fascicolo.idSilLavAnagrafica.toString():"",
      schedaModificata: fascicoloTmp,
      schedaOriginale: this.fascicolo,

      tipoOperazione: 'edit'

    }
    
      //modifica per evitare apesantire ulteriormente il salvataggio dio un fascicolo
      controlliFascicoloRequest.schedaOriginale.esperienzeLavorative = null;
      controlliFascicoloRequest.schedaModificata.esperienzeLavorative = null;

   this.fascicoloService.controllaProseguiSalva(controlliFascicoloRequest).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){

            let controlliFascicoloRequest2:ControlliFascicoloRequest = {
              coordTabAttivo: '1.2',
              coordTabDestino: '1.3',

              flgFattaDomandaSalva: true,

              idSilLavAnagrafica: this.fascicolo ? this.fascicolo.idSilLavAnagrafica.toString():"",
              schedaModificata: fascicoloTmp,
              schedaOriginale: this.fascicolo,

              tipoOperazione: 'edit'

            }
            
      //modifica per evitare apesantire ulteriormente il salvataggio dio un fascicolo
      controlliFascicoloRequest2.schedaOriginale.esperienzeLavorative = null;
      controlliFascicoloRequest2.schedaModificata.esperienzeLavorative = null;
            this.fascicoloService.controllaProseguiSalva(controlliFascicoloRequest2).subscribe({
              next: (r) => {
                if(r.esitoPositivo){
                  this.callback(this.modal,this.formMail.get("mail").value);

                }else{
                  let msg="Errore nell'inserimento dei dati"
                  const data: DialogModaleMessage = {
                    titolo: "Gestione delega",
                    tipo: TypeDialogMessage.Back,
                    messaggio:msg,
                    size: "lg",
                    tipoTesto: TYPE_ALERT.WARNING
                  };
                  this.promptModalService.openModaleConfirm(data)
                }
              }
            })

        }else{
          let msg="Errore nell'inserimento dei dati"
          const data: DialogModaleMessage = {
            titolo: "Gestione delega",
            tipo: TypeDialogMessage.Back,
            messaggio:msg,
            size: "lg",
            tipoTesto: TYPE_ALERT.WARNING
          };
          this.promptModalService.openModaleConfirm(data)
        }
      },
      error: err => {
        this.logService.error(this.constructor.name ,err)
      },
    })
    
  }

  onClickAnnulla(){
    this.callback(this.modal,null);
  }
}
