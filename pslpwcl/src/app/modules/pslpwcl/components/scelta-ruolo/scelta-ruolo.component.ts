/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Ruolo } from 'src/app/modules/pslpapi';
import { UserInfo } from 'src/app/modules/pslpwcl-common/models/userInfo';

import { AppUserService } from 'src/app/services/app-user.service';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';

import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { SessionStorageService } from 'src/app/services/storage/session-storage.service';

@Component({
  selector: 'pslpwcl-scelta-ruolo',
  templateUrl: './scelta-ruolo.component.html',
  styleUrls: ['./scelta-ruolo.component.scss']
})
export class SceltaRuoloComponent implements OnInit {
  ruoliList: RuoloRow[]
  form:FormGroup=this.fb.group(
   { ruoloScelto:new FormControl(null,Validators.required)}
  )


  constructor(
    private  spidUserService:SpidUserService,
    private appUserService: AppUserService,
    private fb:FormBuilder,
    private router:Router,
    private promptModalService:PromptModalService,

  ) { }

  ngOnInit(): void {
    //this.ruoliList = this.ruoloUtente;
    this.ruoliList=this.appUserService.getUtente().ruoli.map(r=>{
      return {
        id:r.idRuolo,
        nome:r.nomeRuolo,
        denominazioneRuolo:r.dsRuolo,
        denominazioneUtente:(this.utente as UserInfo).codFisc
      }
    })

  }
  onSelezionaRuolo(){
    let ruoloSelezionato=this.appUserService.getUtente().ruoli.find(r=>r.idRuolo==this.form.controls['ruoloScelto'].value);
    this.appUserService.setRuolo(ruoloSelezionato);
    this.appUserService.setUtenteOperateFor(this.appUserService.getUtente());
    if(ruoloSelezionato.idRuolo==0){
      this.router.navigateByUrl("");
    }else{
      this.openModalSelezionaCittadino();
    }
  }

  async openModalSelezionaCittadino() {
    const res = await this.promptModalService.openSelezionareCittadino("Selezionare cittadino");
    console.log(res)
    if(res){

      sessionStorage.removeItem("fascicolo")
      sessionStorage.removeItem("cvitae")
      sessionStorage.removeItem("azionecv")
      sessionStorage.removeItem("idBlpAnagrafica")
    }
    this.router.navigateByUrl("");
  }

  get utente(){
    return this.spidUserService.getUser();
  }

  get ruoloSelezionatoLabel(){
    return this.appUserService.getUtente().ruoli.find(r=>r.idRuolo==this.form.controls['ruoloScelto'].value) ?
        "seleziona ruolo " + this.appUserService.getUtente().ruoli.find(r=>r.idRuolo==this.form.controls['ruoloScelto'].value).nomeRuolo:"nessun ruolo selezionato"
  }
}

export interface RuoloRow{
  id?:number,
  nome?:string,
  denominazioneRuolo?:string
  denominazioneUtente?:string
}
