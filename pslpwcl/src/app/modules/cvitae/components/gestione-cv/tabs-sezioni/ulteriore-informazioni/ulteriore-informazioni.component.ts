/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { Candidatura, InserisciAggiornaCandidaturaRequest, PslpMessaggio } from 'src/app/modules/pslpapi';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-ulteriore-informazioni',
  templateUrl: './ulteriore-informazioni.component.html',
  styleUrls: ['./ulteriore-informazioni.component.scss']
})
export class UlterioreInformazioniComponent implements OnInit {

  form:FormGroup=this.fb.group({
    ulterioreInformazioni:[null],
    incentivi:[null],
    flgTrasferta:[null],
    flgMezzoProprio:[null]
  })

  cv:Candidatura;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioUlterioreInfo: PslpMessaggio;

  constructor(
    private fb:FormBuilder,
    private cvService:CvService,
    private cvBagService:CvitaeService,
    private promptModalService:PromptModalService,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {// pslp_d_messaggio Inserimento generico
    
    // pslp_d_messaggio Proffesioni desiderata
    this.commonService.getMessaggioByCode("I35").then(messaggio => {
      this.messagioUlterioreInfo =  messaggio;
    });
    
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });
    // pslp_d_messaggio modifica generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento =  messaggio;
    });
    this.cvBagService.selectedCv.subscribe(
      ris=>this.cv=ris
    )

    this.form.get("ulterioreInformazioni").patchValue(this.cv.ulterioriInformazioni)
    this.form.get("incentivi").patchValue(this.cv.incentiviEQualita)
    this.form.get("flgTrasferta").patchValue(this.cv.flgTrasferte)
    this.form.get("flgMezzoProprio").patchValue(this.cv.flgMezzoProprio)
    if(!this.canModifica){
      this.form.disable()
    }else{
      this.form.enable()
    }
  }

  onConferma(){
    this.cv.ulterioriInformazioni=this.form.get("ulterioreInformazioni").value
    this.cv.incentiviEQualita=this.form.get("incentivi").value
    this.cv.flgMezzoProprio=this.form.get("flgMezzoProprio").value
    this.cv.flgTrasferte=this.form.get("flgTrasferta").value
    let request:any={
      candidatura: this.cv
    }
    this.cvService.aggiornaCv(request).subscribe(
      ris=>{
        if(ris.esitoPositivo){
          this.cvBagService.updateSelectedCv(this.cv)
          const data: DialogModaleMessage = {
            titolo: "Altre informazioni",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }
      }
    )
  }
  get canModifica(){
    return this.cvBagService.getAzioneActual()=="M"
  }
}
