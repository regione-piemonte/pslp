/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { Candidatura, Decodifica, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';

import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { Validation } from 'src/app/modules/pslpwcl-common/components/_validation/validation';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-dati-anagrafici',
  templateUrl: './dati-anagrafici.component.html',
  styleUrls: ['./dati-anagrafici.component.scss']
})
export class DatiAnagraficiComponent implements OnInit {


  province:Decodifica[]=[]
  comunesProvDom:Decodifica[]=[]
  comuniNascita:Decodifica[]=[]
  toponimos:Decodifica[]=[]

  minDate:Date = new Date(1900,1,1);
  sysDate: Date = new Date();
  fascicolo?:SchedaAnagraficaProfessionale
  cv?:Candidatura
  formDatiPersonali:FormGroup = this.fb.group({
    codiceFiscale:[{value: null, disabled: true},[]],
    cognome: [{value: null, disabled: true},[]],
    nome:[{value: null, disabled: true},[]],
    dataDiNascita: [{value: null, disabled: true},[]],
  });


  formDomicilio = this.fb.group({
    indirizzo: this.fb.group({
      luogo: this.fb.group({
          comune: this.fb.group({
          id: [{value: null, disabled: true},[]],
          descr: [{value: null, disabled: true},[]]
        }),
      }),
      cap: [{value: '', disabled: true},[]],
      indirizzo: [{value: '', disabled: true},[]],
     })
  });
  formRecapito:FormGroup = this.fb.group({
    cellulare: [{value: '', disabled: true},[]],
    cellulare2: [{value: '', disabled: true},[]],
   // telefonoAbitazione: [{value: '', disabled: true},[]],
    email: [{value: '', disabled: true},[]],
  });
  formAltreInfo:FormGroup=this.fb.group({
    titoloCv:[null, [Validators.required]],
    flgL68:[{value:"N",disabled:false}],
    flgStampaL68:[{value:"N",disabled:false}],
    ambitoDiffusione:['02']
  })
  form = this.fb.group({
    datiPersonali:this.formDatiPersonali,

    domicilio:this.formDomicilio,
    recapito:this.formRecapito,
    altreInfo:this.formAltreInfo
  })


  imageUrl:any=""
  datiFoto:any
  tipoFoto:any

  constructor(
    private fb:FormBuilder,
    private commonService:CommonService,
    private cvBagService:CvitaeService,
    private domSanitizer:DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fascicolo=this.commonService.fascicoloActual
    if(this.fascicolo?.datiAnagrafici?.datiGenerali?.foto){
      this.tipoFoto=this.commonService.fascicolo.datiAnagrafici.datiGenerali.foto.nomeFile.split(".")[1];
      this.datiFoto=this.commonService.fascicolo.datiAnagrafici.datiGenerali.foto.bFoto;
      this.imageUrl=this.domSanitizer.bypassSecurityTrustUrl(`data:${this.tipoFoto};base64,${this.datiFoto}`);
    }
    this.cvBagService.selectedCv.subscribe(
      ris=>this.cv=ris
    )
    this.patchForm()
  }
  patchForm(){
    this.formDatiPersonali.get("codiceFiscale").patchValue(this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.codiceFiscale)
    this.formDatiPersonali.get("cognome").patchValue(this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.cognome)
    this.formDatiPersonali.get("nome").patchValue(this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.nome)
    this.formDatiPersonali.get("dataDiNascita").patchValue(new Date(this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.dataDiNascita).toLocaleDateString())


    if(this.canModifica){
      this.formDomicilio.get("indirizzo.luogo.comune.id").patchValue(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.domicilio?.indirizzo?.luogo?.comune?.descr)
      this.formDomicilio.get("indirizzo.cap").patchValue(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.domicilio?.indirizzo?.cap)
      this.formDomicilio.get("indirizzo.indirizzo").patchValue(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.domicilio?.indirizzo?.indirizzoEsteso)

      this.formRecapito.get("cellulare").patchValue(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.recapito?.cellulare)
      this.formRecapito.get("cellulare2").patchValue(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.recapito?.telefonoAbitazione??this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.recapito?.cellulare2)
      this.formRecapito.get("email").patchValue(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.recapito?.email)
    }else{
      this.formDomicilio.get("indirizzo.luogo.comune.id").patchValue(this.cv?.idLavAnagrafica?.idComuneDomicilio.dsComune)
      this.formDomicilio.get("indirizzo.cap").patchValue(this.cv?.idLavAnagrafica?.capDom)
      this.formDomicilio.get("indirizzo.indirizzo").patchValue(this.cv?.idLavAnagrafica?.dsIndirizzoDom)

      this.formRecapito.get("cellulare").patchValue(this.cv?.idLavAnagrafica?.numCellulare??'')
      this.formRecapito.get("cellulare2").patchValue(this.cv?.idLavAnagrafica?.numTelefono??'')
      this.formRecapito.get("email").patchValue(this.cv?.idLavAnagrafica?.eMail??'')
    }


    this.formAltreInfo.get("titoloCv").patchValue(this.cv?.titoloCv)
    this.formAltreInfo.get("flgL68").patchValue(this.cv?.flgL68??'N')
    this.formAltreInfo.get("flgStampaL68").patchValue(this.cv?.flgStampaL68??'N')
    this.onChangeFlg68l()
    if(!this.canModifica){

      this.formAltreInfo.disable()
      this.formAltreInfo.clearValidators()
      this.formAltreInfo.updateValueAndValidity()

    }
  }
  onChangeFlg68l(){
    if(this.formAltreInfo.get("flgL68").value=='S'){
      this.formAltreInfo.get('flgStampaL68').enable()
    }else{
      this.formAltreInfo.get('flgStampaL68').setValue('N')
      this.formAltreInfo.get('flgStampaL68').disable()
    }
  }
  get canModifica(){
    return (this.cv?.flgGeneratoDaSistema!="S" && this.cvBagService.getAzioneActual()=="M") || !this.cv
  }
}

