/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { DecodificaBlpService, DecodificaPslpService } from 'src/app/modules/pslpapi';

import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { Candidatura, ConoscenzaInformatica, Decodifica, DettaglioConoscenzaInformaticaRequest, InformaticaDich, InserisciAggiornaConInformaticaRequest, MapSilpToBlpConoscInformaticaRequest, PslpMessaggio, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi/model/models';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-conoscenze-informatiche',
  templateUrl: './conoscenze-informatiche.component.html',
  styleUrls: ['./conoscenze-informatiche.component.scss']
})
export class ConoscenzeInformaticheComponent implements OnInit {
  conoscenzeInformatiche: ConoscenzaInformatica[]=[];
  conoscenzeInformaticheFiltrate: ConoscenzaInformatica[]=[];
  conoscenzeInformaticheCv:InformaticaDich[]=[]
  fascicolo?:SchedaAnagraficaProfessionale;
  tipoConoscenze:Decodifica[]=[]
  cv?:Candidatura
  showForm:boolean=false
  conoscenzaSelected?:InformaticaDich
  informaticaDett: Decodifica[] = [];
  categoria: string;

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  form:FormGroup=this.fb.group({
    //tipoConoscenza:[null,Validators.required],
    specifiche:[null],
    livello:[null],
    silTInformaticaDett: this.fb.group({
      id: [null,Validators.required],
      informatica: this.fb.group({
        descr: [null]
      })
    })
  })

  messaggioNonCiSonoDati: PslpMessaggio;
  messaggioConoscenzaInfFasc: PslpMessaggio;
  messaggioConoscenzaInfCv: PslpMessaggio;
  
  constructor(
    private commonService:CommonService,
    private cvService:CvService,
    private cvBagService:CvitaeService,
    private fb:FormBuilder,
    private decodificaService:DecodificaPslpService,
    private mappingService:MappingService,
    private promptModalService: PromptModalService,
  ) { }


  ngOnInit(): void {
    
    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati =  messaggio;
    });
    // pslp_d_messaggio conoscenza informatica fascicolo
    this.commonService.getMessaggioByCode("I28").then(messaggio => {
      this.messaggioConoscenzaInfFasc =  messaggio;
    });
    // pslp_d_messaggio  conoscenza informatica Cv
    this.commonService.getMessaggioByCode("I29").then(messaggio => {
      this.messaggioConoscenzaInfCv =  messaggio;
    });
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
    this.fascicolo=this.commonService.fascicoloActual
    this.conoscenzeInformatiche=this.fascicolo.informazioniCurriculari.conoscenzeInformatiche
    this.cvBagService.selectedCv.subscribe(
      ris=>{
        this.cv=ris
        this.conoscenzeInformaticheCv=ris.informaticaDichList
        this.conoscenzeInformaticheFiltrate=this.conoscenzeInformatiche.filter(con=>!this.conoscenzeInformaticheCv.find(conCv=>con.conoscenzaSpecifica.id==conCv.idConoscenzaSpecifica.idInformaticaDett))

      }
    )
    this.decodificaService.findDecodificaByTipo("informatica").subscribe({
      next:ris=>{
        if(ris.esitoPositivo)
          this.tipoConoscenze=ris.list
      }
    })
  }
  inserisciConoscenzaInfoDaFascicolo(conoscenza:ConoscenzaInformatica){
    let request:any={
      conoscenzaInformatica:conoscenza,
      idCv:this.cv.id
    }
    this.mappingService.insertConoscenzaInformaticaFromSilp(request).subscribe(
      ris=>{
        if(ris.esitoPositivo){
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.conoscenzeInformaticheCv.push(ris.informaticaDich)
          this.conoscenzaSelected=ris.informaticaDich
          this.updateCv()
        }
      }
    )
  }

  toggleForm(isChiusura:boolean){
    this.form.reset();
    this.form.get("silTInformaticaDett.id").enable();
    this.form.get("silTInformaticaDett.informatica").disable();
    this.informaticaDett=[]
    this.conoscenzaSelected=undefined
    this.showForm=!isChiusura;
  }


  inserisciAggiornaConoscenzaCv(){
    let request:any={
      conoscenzaInformatica:Utils.cleanObject(this.creaConoscenza())
    }
    console.log(this.categoria);
    console.log(this.tipoConoscenze.find(c=>c.descr==this.categoria)?.id);
    request.conoscenzaInformatica.idConoscenzaSpecifica.idInformatica = {
      id: this.tipoConoscenze.find(c=>c.descr==this.categoria)?.id
    }
    console.log(request)
    if(this.conoscenzaSelected){

      this.cvService.aggiornaConoscenzeInfoDich(request).subscribe(
        ris=>{
          if(ris.esitoPositivo){
            this.conoscenzeInformaticheCv
            .splice(this.conoscenzeInformaticheCv.findIndex(con=>con.id==this.conoscenzaSelected.id),1,ris.informaticaDich)
            const data: DialogModaleMessage = {
              titolo: "Gestione CV",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioAggiornamento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.updateCv()
            this.showForm=false;
            this.form.reset();
          }
        }
      )
    }else{
      this.cvService.inserisciConoscenzeInfoDich(request).subscribe(
        ris=>{
          if(ris.esitoPositivo){
            const data: DialogModaleMessage = {
              titolo: "Gestione CV",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioInserimento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.conoscenzeInformaticheCv.push(ris.informaticaDich)
            this.conoscenzaSelected=ris.informaticaDich
            this.updateCv();
            this.showForm=false;
            this.form.reset();
          }
        }
      )
    }
  }

  creaConoscenza():InformaticaDich{
    console.log(this.form.get("silTInformaticaDett.id").value)
    return {
      ...this.conoscenzaSelected,
      idCandidatura:this.cv?.id,
      livelloConoscenza:this.form.get("livello").value,
      idConoscenzaSpecifica:{
        idInformaticaDett:this.form.get("silTInformaticaDett.id").value
      },
      dsTipoConoscenza:this.categoria,
      dsSpecifiche:this.informaticaDett.find(i=>i.id==this.form.get("silTInformaticaDett.id").value).descr,
      codUserAggiorn:"",
      codUserInserim:this.conoscenzaSelected?.codUserInserim??"",
      dAggiorn:new Date(),
      dInserim:this.conoscenzaSelected?.dInserim??new Date(),

    }

  }
  async onClickEliminaInformaticaCv(conoscenza:InformaticaDich){
    const data: DialogModaleMessage = {
      titolo: "Eliminazione conoscenza informatica",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare la conoscenza informatica selezionata?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      console.log('Ha risposto SI');
      // this.alertMessageService.emptyMessages();
      this.eliminaConoscenza(conoscenza);
    } else {
      console.log('Ha risposto NO');
    }
  }
  eliminaConoscenza(conoscenza:InformaticaDich){
    let request:any={
      idConoscenzaInformatica:conoscenza.id
    }

    this.cvService.deleteConoscenzeInfoDichById(request).subscribe(
      ris=>{
        if(ris.esitoPositivo){
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.conoscenzeInformaticheCv.splice(this.conoscenzeInformaticheCv.findIndex(con=>con.id==conoscenza.id),1)
          this.updateCv()
        }
      }
    )
  }
  patchForm(conoscenza:InformaticaDich,azione:string){
    this.showForm=true
    this.conoscenzaSelected=conoscenza
    this.informaticaDett.push(...[{
      id:this.conoscenzaSelected.idConoscenzaSpecifica.idInformaticaDett,
      descr: this.conoscenzaSelected.dsSpecifiche
    }])
    this.form.get("silTInformaticaDett.id").setValue(this.conoscenzaSelected.idConoscenzaSpecifica.idInformaticaDett);
    this.form.get("livello").patchValue(this.conoscenzaSelected.livelloConoscenza)
    this.form.get("silTInformaticaDett.informatica.descr").setValue(this.conoscenzaSelected.dsTipoConoscenza)
    this.categoria=this.conoscenzaSelected.dsTipoConoscenza
    //this.form.get("tipoConoscenza").patchValue(this.conoscenzaSelected.dsTipoConoscenza)
    // this.form.get("descr").patchValue(this.conoscenzaSelected.dsSpecifiche)
    if(!this.canModifica || azione!="m"){
      this.form.disable()
    }else if(azione == "m"){
      this.form.disable()
      this.form.get("livello").enable();
    }
  }

  updateCv(){
    this.cv.informaticaDichList=this.conoscenzeInformaticheCv
    this.cvBagService.updateSelectedCv(this.cv)
  }

  get canModifica(){
    return this.cv?.flgGeneratoDaSistema!="S" && this.cvBagService.getAzioneActual()=="M"
  }


  //DECODIFICA PRESA DAL FASCICOLO PER INFORMATICA DETT
  onFilterInformaticaDett(event:any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("INFORMATICA-DETT",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.informaticaDett =r.list.filter((inf:any)=>!this.conoscenzeInformaticheCv.find(con=>con.idConoscenzaSpecifica==inf.id));
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }


  onVisualizzaCompetenzaInformaticaFascicolo(informatica: ConoscenzaInformatica){
    this.promptModalService.openVisualizzaConoscenzaInformatica(informatica);
  }

  onChangeInformaticaDett(event:any){

    this.categoria  = this.informaticaDett.find(i=>i.id==event.value).special;
  }

}
