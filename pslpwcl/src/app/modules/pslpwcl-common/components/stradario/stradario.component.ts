/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Decodifica, DecodificaPslpService, IndirizzoStradario, RicercaIndirizzoStradarioRequest, StradarioService } from '../../../pslpapi';

@Component({
  selector: 'pslpwcl-stradario',
  templateUrl: './stradario.component.html',
  styleUrls: ['./stradario.component.scss']
})
export class StradarioComponent implements OnInit,OnChanges{
  @Input() form:FormGroup
  @Input() statosEstero:Decodifica[]=[]
  @Input() comuni:Decodifica[]=[]
  @Input() province:Decodifica[]=[]

  @Input() toponimos:Decodifica[]=[]
  @Input() idChiamante:string=undefined
  @Input() mod:string="m"
  stradario: IndirizzoStradario[]=[]
  constructor(
    private decodificaService:DecodificaPslpService,
    private stradarioService:StradarioService
  ) { }
  ngOnChanges(): void {
    if(this.mod=='view'){
      this.form.disable()
    }else{
      this.form.enable()
      this.chkAttivaStradario()

      if(!this.form.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').value){
        this.form.get('indirizzo.toponimo.id').disable();
        this.form.get('indirizzo.toponimo.descr').disable();
        this.form.get('indirizzo.numeroCivico').disable();
        this.form.get('indirizzo.cap').disable();
        this.form.get('indirizzo.indirizzo').disable();
        this.form.get('indirizzo.localita').disable();
        this.form.get('indirizzo.luogo.comune.id').disable();

      }
    }
  }




  ngOnInit(): void {
    if(this.mod=='view'){
      this.form.disable()
    }else{
      this.form.enable()
      this.chkAttivaStradario()

      if(!this.form.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').value){
        this.form.get('indirizzo.toponimo.id').disable();
        this.form.get('indirizzo.toponimo.descr').disable();
        this.form.get('indirizzo.numeroCivico').disable();
        this.form.get('indirizzo.cap').disable();
        this.form.get('indirizzo.indirizzo').disable();
        this.form.get('indirizzo.localita').disable();
        this.form.get('indirizzo.luogo.comune.id').disable();

      }
    }
  }

  setRequiredResidenza() {
    return !!this.form.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').value
  }

 onFilterComune(event:any){

      this.clearIndirizzo()
      this.form.get('indirizzo.luogo.comune.id').enable()
      this.form.get('indirizzo.luogo.comune.id').reset()
      this.form.get('indirizzo.luogo.comune.id').addValidators(Validators.required)
      this.form.get('indirizzo.luogo.comune.id').markAsTouched()
      this.form.get('indirizzo.luogo.comune.id').updateValueAndValidity()
      this.findListaComuni(event.value)
      this.chkAttivaStradario()
  }
  findListaComuni(id:string){

        this.comuni=[]
        this.form.get('indirizzo.luogo.comune.id').reset()

        this.decodificaService.findComuneByIdProvincia(id).subscribe({
          next:res=>{
            console.log(res)
            this.comuni=res.list
          }
        })
  }
  chkAttivaStradario(){
    if(this.attivaStradario){
      this.form.get('indirizzo.toponimo.id').disable();
      this.form.get('indirizzo.toponimo.descr').disable();
      this.form.get('indirizzo.numeroCivico').disable();
      this.form.get('indirizzo.cap').disable();
      this.form.get('indirizzo.indirizzo').disable();
      this.form.get('indirizzo.localita').disable();
    }else{
      this.form.get('indirizzo.toponimo.id').enable()
      this.form.get('indirizzo.toponimo.descr').enable()
      this.form.get('indirizzo.numeroCivico').enable()
      this.form.get('indirizzo.cap').enable()
      this.form.get('indirizzo.indirizzo').enable()
      this.form.get('indirizzo.localita').enable()
    }
  }
 /* onFilterComune(event:any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    this.decodificaService.fillDecodificaByTipo("COMUNE",txt).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.comuni=r.list

        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }*/
  onSelectComune(){
    this.clearIndirizzo()
  }

  clearIndirizzo(){

      this.form.get('indirizzo.toponimo.id').reset();
      this.form.get('indirizzo.toponimo.descr').reset();
      this.form.get('indirizzo.numeroCivico').reset();
      this.form.get('indirizzo.cap').reset();
      this.form.get('indirizzo.indirizzo').reset();
      this.form.get('indirizzo.localita').reset();
      this.stradario=[]
      this.chkAttivaStradario()
  }

  onCercaStradario(event:any){
    let txt:string = event?.filter;
    if(!txt || txt.length < 5){
      this.stradario = [];
      return
    }
        let codiceIstat=this.comuni.filter(c=>c.id==this.form.get('indirizzo.luogo.comune.id').value && c.codice);
        let ricerca:RicercaIndirizzoStradarioRequest={
          codiceIstatComune:codiceIstat[0]?.codice,
          testoRicerca:txt
        }
        this.stradarioService.findIndirizzi(ricerca).subscribe(
          {
            next:res=>{
              if(res != undefined && res != null)
                this.stradario=res.elementi
              else{
                this.stradario=[]
              }
            }
          }
        )

  }

  selezionaIndirizzo(event:any){
    let indirizzo:IndirizzoStradario=event.value
    let toponimoId=this.toponimos?.filter(t=>t.descr==indirizzo?.tipoVia)?.map(t=>t.id)[0]

      this.form.get('indirizzo.toponimo.id').setValue(toponimoId || null);
      this.form.get('indirizzo.toponimo.descr').setValue(indirizzo?.descrizione || null);
      this.form.get('indirizzo.numeroCivico').setValue(indirizzo?.civicoNumero + (indirizzo?.civicoSub ? indirizzo?.civicoSub:"") || null);
      this.form.get('indirizzo.cap').setValue(indirizzo?.cap || null);
      this.form.get('indirizzo.indirizzo').setValue(indirizzo?.nomeVia || null);
      this.form.get('indirizzo.localita').setValue(indirizzo?.localita || null);

  }

  setLuogoResidenzaControl() {
    const flgLuogoItalia = this.form.get('indirizzo.luogo.flgLuogoItalia').value;
    if (flgLuogoItalia === 'I') {
      this.form.get('indirizzo.luogo.stato').reset();
      this.form.get('indirizzo.luogo.stato').disable();

      this.form.get('indirizzo.luogo.comune.silTProvincia').enable();
      this.form.get('indirizzo.luogo.comune').enable();
      this.form.get('indirizzo.toponimo').enable();
      this.form.get('indirizzo.numeroCivico').enable();
      this.form.get('indirizzo.cap').enable();
      this.form.get('indirizzo.indirizzo').enable();
      this.form.get('indirizzo.localita').enable();
    } else {

      this.form.get('indirizzo.luogo.comune.silTProvincia').reset();
      this.form.get('indirizzo.luogo.comune.silTProvincia').disable();

      this.form.get('indirizzo.luogo.comune').reset();
      this.form.get('indirizzo.luogo.comune').disable();

      this.form.get('indirizzo.toponimo').reset();
      this.form.get('indirizzo.toponimo').disable();

      this.form.get('indirizzo.numeroCivico').reset();
      this.form.get('indirizzo.numeroCivico').disable();

      this.form.get('indirizzo.cap').reset();
      this.form.get('indirizzo.cap').disable();

      this.form.get('indirizzo.indirizzo').reset();
      this.form.get('indirizzo.indirizzo').disable();

      this.form.get('indirizzo.localita').reset();
      this.form.get('indirizzo.localita').disable();

      this.form.get('indirizzo.luogo.flgLuogoItalia').patchValue('E');
      this.form.get('indirizzo.luogo.stato').reset();
      this.form.get('indirizzo.luogo.stato').enable();
    }
  }
  get attivaStradario(){
    return this.province.length && this.province.filter(c=>c.id==this.form.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').value).map(c=>c.special)[0]=='01'
  }

  get isSelectedProvincia(){
    return !!this.form.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').value
  }

  get isSelectedComune(){
    return !!this.form.get('indirizzo.luogo.comune.id').value
  }
}
