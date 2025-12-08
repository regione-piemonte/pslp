/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Dropdown } from 'primeng/dropdown';
import { TYPE_ALERT } from 'src/app/constants';


import { ApiMessage, DatiAnagrafici, DatiGenerali, DatiPersonali, Decodifica, DecodificaListResponse, DecodificaResponse, DecodificaPslpService, DettaglioFascicoloResponse, Domicilio, IndirizzoStradario, NotizieCittadiniStranieri, Provincia, Recapito, Residenza, RicercaIndirizzoStradarioRequest, SchedaAnagraficaProfessionale, StradarioService, PslpMessaggio } from 'src/app/modules/pslpapi';
import { Validation } from 'src/app/modules/pslpwcl-common/components/_validation/validation';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-dati-anagrafici',
  templateUrl: './dati-anagrafici.component.html',
  styleUrls: ['./dati-anagrafici.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DatiAnagraficiComponent implements OnInit {



  @ViewChild('str') str:Dropdown
  fascicolo:SchedaAnagraficaProfessionale;
  genere: string = "?";
  statiCivili: Decodifica[] = [];    //STATO-CIVILE
  cittadinanze: Decodifica[] = [];   //CITTADINANZA
  province:Decodifica[] = [];
  comuniNascita: Decodifica[] = [];  //COMUNE
  statiNascita: Decodifica[] = [];   //NAZIONE

  titoliSoggiorno: Decodifica[] = [];
  questure: Decodifica[] = [];        //QUESTURA
  categorieMotiviRilasci: Decodifica[] = [];//CAT-MOTIVO-RILASCIO-PERMESSO
  attivaStradarioRes=false
  attivaStradarioDom=false
  comunesProvRes: Decodifica[] = [];   //COMUNE
  comunesProvDom: Decodifica[] = [];   //COMUNE
  statosEstero: Decodifica[] = [];  //NAZIONE
  entesTitolareSap: Decodifica[] = [];
  toponimos: Decodifica[] = [];       //TOPONIMO
  desrizioneMotiviPermesso: Decodifica[]=[]
  decrizioneMotiviPermessoFiltrati: Decodifica[]=[]
  stradarioRes: IndirizzoStradario[]=[]
  stradarioDom: IndirizzoStradario[]=[]
  provNasc:string=""
  provRes:string=""
  provDom:string=""

  minDate:Date = new Date(1900,1,1);
  sysDate: Date = new Date();

  emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  numRegEx = new RegExp('^[0-9]*$');


  active = 0;
  datiAnagrafici: DatiAnagrafici;


  canChangeProvinciaDomicilio=true
  provinciaIscrizioneCollMirato?:string
  canChangeRegioneDomicilio=true
  codiceRegionePoliticaA02?:string


  formDatiPersonali:FormGroup = this.fb.group({
    codiceFiscale:[null,[ Validators.minLength(11),Validators.maxLength(16)]],
    cognome: [null, [Validators.required, Validators.minLength(2)]],
    nome: [null, [Validators.required, Validators.minLength(2)]],

    genere: this.fb.group({ id: [null, [Validators.required]] }),
    statoCivile: this.fb.group({ id: [null]}),


    dataDiNascita: [null, [Validators.required]],

    luogoDiNascita: this.fb.group({
      flgLuogoItalia: ['I', [Validators.required]],

      comune: this.fb.group({
        id: [null, [Validators.required]],
        descr: [null],
        silTProvincia:
          this.fb.group({
            idSilTProvincia: [null, [Validators.required]],
            descr: [null]
          }),
      }),
      stato: this.fb.group({
        idSilTNazione: [null, [Validators.required]],
        dsSilTNazione: [null]
      }),
    }),

    cittadinanza: this.fb.group({
      id: ['', [Validators.required]],
      descr:['']
    })
  });
  formNotizieCittadiniStranieri:FormGroup =  this.fb.group({
    permessoDiSoggiorno: this.fb.group({
      titolo: this.fb.group({ id: [null, [Validators.required]]}),
      numero: [null, [Validators.required]],
      dataScadenza: [null, [Validators.required]],
      motivoRilascio: this.fb.group({
        silTCatMotRilPerm: this.fb.group({
          idSilTCatMotRilPerm: [null, [Validators.required]],
        }),
        idSilTMotRilPerm: [null, [Validators.required]],
      }),
      descrizioneMotivoTitolo: [null], //decodifica
      questura: this.fb.group({ id: [null, [Validators.required]]}),
    }),
  });
  formResidenza:FormGroup = this.fb.group({
    indirizzo: this.fb.group({
      luogo: this.fb.group({
        flgLuogoItalia: [null, [Validators.required]],

        comune: this.fb.group({
          id: [null, [Validators.required]],
          descr: [null],
          silTProvincia:
            this.fb.group({
              idSilTProvincia: [null, [Validators.required]],
              descr: [null]
            }),
        }),
        stato: this.fb.group({
          idSilTNazione: [null, [Validators.required]],
          dsSilTNazione: [null]
        }),
      }),

      toponimo: this.fb.group({
        id: [null, [Validators.required]],
        descr: [null]
      }),
      numeroCivico: [null, [Validators.required]],
      cap: [null, [Validators.required]],
      indirizzo: [null, [Validators.required]],
      localita: [null]
    })
  });
  formDomicilio:FormGroup = this.fb.group({
    ugualeAResidenza: [null, Validators.required],

    indirizzo: this.fb.group({
      luogo: this.fb.group({
        comune: this.fb.group({
          id: [null, [Validators.required]],
          descr: [null],
          silTProvincia:
            this.fb.group({
              idSilTProvincia: [null, [Validators.required]],
              descr: [null]
            }),
        }),
        flgLuogoItalia: [null, [Validators.required]],
        stato: this.fb.group({
          idSilTNazione: [null, [Validators.required]],
          dsSilTNazione: [null],
        }),
      }),
      toponimo: this.fb.group({
        id: [null, [Validators.required]],
        descr: [null],
      }),
      numeroCivico: [null, [Validators.required]],
      cap: [null, [Validators.required]],
      indirizzo: [null, [Validators.required]],
      localita: [null],
    })
  });
  formRecapito:FormGroup = this.fb.group({
    cellulare: [null, [Validators.required,Validators.pattern(this.numRegEx)]],
    cellulare2: [null,[Validators.pattern(this.numRegEx)]],
    telefonoAbitazione: [null,[Validation.phoneNumberValidator]],
    email: [null, [Validation.emailValidator]],
    indirizzoDigitale: [null, [Validation.emailValidator]],
  });

  form:FormGroup = this.fb.group({
    datiPersonali:this.formDatiPersonali,
    notizieCittadiniStranieri:this.formNotizieCittadiniStranieri,
    residenza:this.formResidenza,
    domicilio:this.formDomicilio,
    recapito:this.formRecapito
  })


  //messaggio patto attivazione
  messagioE34: PslpMessaggio;

  //messaggio collocamento mirato
  messagioE35: PslpMessaggio;

  constructor(
    private fb:FormBuilder,
    private decodificaService:DecodificaPslpService,
    private cd: ChangeDetectorRef,
    private spidUserService:SpidUserService,
    private appUserService:AppUserService,
    private promptModalService:PromptModalService,
    private stradarioService:StradarioService,
    private commonService:CommonService
  ) {

  }

  ngOnInit(): void {

    // pslp_d_messaggio patto attivazione
    this.commonService.getMessaggioByCode("E34").then(messaggio => {
      this.messagioE34 =  messaggio;
    });

    // pslp_d_messaggio collocamento mirato
    this.commonService.getMessaggioByCode("E35").then(messaggio => {
      this.messagioE35 =  messaggio;
    });

    //this.fascicolo=this.commonService.fascicoloActual
    console.log(this.canChangeProvinciaDomicilio);
    this.configDecodifiche();
    this.genere =  this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.genere.id;
    this.datiAnagrafici =  this.fascicolo ? this.fascicolo?.datiAnagrafici:{}
    if(this.fascicolo && this.fascicolo.datiAmministrativi){
      //this.canChangeProvinciaDomicilio=!this.fascicolo.datiAmministrativi.listaIscrizioniComi.find(i=>{return i.flgStato=="A"})
      console.log(this.fascicolo.datiAmministrativi.listaIscrizioniComi);
      if(this.fascicolo.datiAmministrativi.listaIscrizioniComi.length>0){
        this.provinciaIscrizioneCollMirato=this.fascicolo.datiAmministrativi.listaIscrizioniComi.find(i=>{return i.flgStato=="A"})?this.fascicolo.datiAmministrativi.listaIscrizioniComi.find(i=>{return i.flgStato=="A"}).dsProvincia:undefined; //idSilTRegione
        this.canChangeProvinciaDomicilio=!this.provinciaIscrizioneCollMirato;
        console.log(this.provinciaIscrizioneCollMirato)
      }

      console.log(this.fascicolo.politicheAttiveLavoratore.politicheAttive)

      if(this.fascicolo.politicheAttiveLavoratore.politicheAttive.length>0){
        this.codiceRegionePoliticaA02=this.fascicolo.politicheAttiveLavoratore.politicheAttive.find(p=>{return ((p?.lavSapSez6?.silTTipoProgettoMin?.codTipoProgettoMin==("05") || p?.lavSapSez6?.silTTipoProgettoMin?.codTipoProgettoMin== "08") && p.attivita.codice=="A02" && (p.ultimoEvento.eventoFlgFinale!="S"))})?.lavSapSez6?.silTRegione.idSilTRegione;
      }
      this.canChangeRegioneDomicilio=!this.codiceRegionePoliticaA02;
      console.log(this.codiceRegionePoliticaA02)
      console.log(this.canChangeRegioneDomicilio)
    }else{
      let cf = this.utente.cfUtente;
      this.genere = Number(cf.substring(9,11)) < 40 ? "M": "F";
      this.formDatiPersonali.get('genere.id').setValue(this.genere);

    }
    this.form.markAsUntouched()
    this.formResidenza.valueChanges.subscribe(ris=>{
      if(this.formDomicilio.get('ugualeAResidenza').value){
        //this.formResidenza.getRawValue() as Domicilio
        this.formDomicilio.patchValue(this.formResidenza.getRawValue() as Domicilio)
      }
    })

    // Inizializza i dati di debug dopo un breve delay per assicurarsi che tutto sia caricato
    setTimeout(() => {
      this.initializeDebugData();
    }, 100);
  }


  async configDecodifiche(){
    this.fascicolo=this.commonService.fascicoloActual

    //  MIGLIORAMENTO: Gestione più robusta delle chiamate HTTP
    try {
      // Carica le decodifiche in parallelo per migliorare le performance
      const [motiviPermesso, statiCivili] = await Promise.all([
        this.decodificaService.findDecodificaByTipo('MOTIVO-RILASCIO-PERMESSO').toPromise(),
        this.decodificaService.findDecodificaByTipo('STATO-CIVILE').toPromise()
      ]);

      if(motiviPermesso?.esitoPositivo){
        this.desrizioneMotiviPermesso = motiviPermesso.list;
      }
      if(statiCivili?.esitoPositivo){
        this.statiCivili = statiCivili.list;
      }
    } catch (error) {
      console.error('Errore nel caricamento delle decodifiche:', error);
    }

    const prov= await this.decodificaService.findDecodificaByTipo('PROVINCIA').toPromise()
        if(prov?.esitoPositivo){
          this.province = prov.list;
          if(this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.luogoDiNascita?.comune){
            this.provNasc=prov.list?.find((p)=>p?.id==this.fascicolo?.datiAnagrafici?.datiGenerali?.datiPersonali?.luogoDiNascita?.comune?.silTProvincia?.idSilTProvincia)?.codice;
            this.decodificaService.findComuneByIdProvincia(this.provNasc).subscribe({
              next: (r:any) => {
                if(r?.esitoPositivo){
                  this.comuniNascita.push(...r.list);
                }
              }
            })
          }

          if(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.residenza?.indirizzo.luogo.flgLuogoItalia=="I"){
            this.provRes=this.province.filter((p)=>p?.id==this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.residenza?.indirizzo?.luogo?.comune?.silTProvincia?.idSilTProvincia)[0].codice;
          }
          if(this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.domicilio?.indirizzo.luogo.flgLuogoItalia=="I"){
            this.provDom=this.province.filter(p=>p.id==this.fascicolo.datiAnagrafici.reperibilitaRecapiti.domicilio.indirizzo.luogo.comune.silTProvincia.idSilTProvincia)[0].codice
            this.decodificaService.findComuneByIdProvincia(this.provDom).subscribe({
              next: (r:any) => {
                if(r.esitoPositivo){
                  this.comunesProvDom.push(...r.list);
                }
              }
            })
          }
        }


    const cittadinanze= await this.decodificaService.findDecodificaByTipo('CITTADINANZA').toPromise()
    if(cittadinanze.esitoPositivo){
      this.cittadinanze=cittadinanze.list
    }
    const nazioni=await this.decodificaService.findDecodificaByTipo('NAZIONE').toPromise()
    if(nazioni.esitoPositivo){
      this.statiNascita = nazioni.list;
      this.statosEstero = nazioni.list;
    }
    //  MIGLIORAMENTO: Gestione parallela delle altre decodifiche
    try {
      const [questure, categorieMotivi, titoliSoggiorno] = await Promise.all([
        this.decodificaService.findDecodificaByTipo('QUESTURA').toPromise(),
        this.decodificaService.findDecodificaByTipo('CAT-MOTIVO-RILASCIO-PERMESSO').toPromise(),
        this.decodificaService.findDecodificaByTipo('status-lav-extra-ue').toPromise()
      ]);

      if(questure?.esitoPositivo){
        this.questure = questure.list;
      }
      if(categorieMotivi?.esitoPositivo){
        this.categorieMotiviRilasci = categorieMotivi.list;
      }
      if(titoliSoggiorno?.esitoPositivo){
        this.titoliSoggiorno = titoliSoggiorno.list;
      }
    } catch (error) {
      console.error('Errore nel caricamento delle decodifiche aggiuntive:', error);
    }
    const toponimo=await this.decodificaService.findDecodificaByTipo('TOPONIMO').toPromise()
    if(toponimo.esitoPositivo){
      this.toponimos=toponimo.list
    }

    if(this.fascicolo){
      this.settingForm();

    }else{
      //======================
      // DATI PERSONALI
      let datiPersonali = this.datiAnagrafici?.datiGenerali?.datiPersonali;
      if(!datiPersonali){
        datiPersonali={
          codiceFiscale: this.utente.cfUtente,
          cognome:this.utente.cognome,
          nome:this.utente.nome
        }
        this.formInit();

      }

        //this.formDatiPersonali.get('luogoDiNascita.comune.descr').setValue(datiPersonali?.luogoDiNascita?.comune?.descr || null);
      this.formDatiPersonali.controls['codiceFiscale'].setValue(datiPersonali?.codiceFiscale || null);
      this.formDatiPersonali.controls['cognome'].setValue(datiPersonali?.cognome || null);
      this.formDatiPersonali.controls['nome'].setValue(datiPersonali?.nome || null);

    }


  }

  formInit(){

    this.formDatiPersonali.get('luogoDiNascita.flgLuogoItalia').setValue("I");
    this.formDatiPersonali.get('cittadinanza.id').setValue("ITA");
    this.setLuogoNascitaControl();
    this.enableNotizieCittadiniStranieri();
    this.formResidenza.get("indirizzo.luogo.flgLuogoItalia").setValue("I");
    this.setLuogoResidenzaControl();
    this.formDomicilio.get('indirizzo.luogo.flgLuogoItalia').setValue("I");
    this.setLuogoDomicilioControl();

    this.formDomicilio.controls['ugualeAResidenza'].setValue(true);
    this.setDomicilioControl();


  }
//

  onCercaStradario(event:any,isResidenza:boolean){
    let txt:string = event?.filter;
    if(!txt || txt.length < 5){
      this.stradarioRes = [];
      this.stradarioDom = [];
      return
    }else{
      if(isResidenza) {
        let codiceIstat=this.comunesProvRes.filter(c=>c.id==this.formResidenza.get('indirizzo.luogo.comune.id').value && c.codice);
        let ricerca:RicercaIndirizzoStradarioRequest={
          codiceIstatComune:codiceIstat[0]?.codice,
          testoRicerca:txt
        }
        this.stradarioService.findIndirizzi(ricerca).subscribe(
          {
            next:ris=>{
              if(ris != undefined && ris != null){
                this.stradarioRes=ris.elementi;
              }
            }
          }
        )
      }else if(!isResidenza){
        let codiceIstat=this.comunesProvDom.filter(c=>c.id==this.formDomicilio.get('indirizzo.luogo.comune.id').value && c.codice);
        let ricerca:RicercaIndirizzoStradarioRequest={
          codiceIstatComune:codiceIstat[0]?.codice,
          testoRicerca:txt
        }
        this.stradarioService.findIndirizzi(ricerca).subscribe(
          {
            next:ris=>{
              if(ris != undefined && ris != null){
                this.stradarioDom=ris.elementi;
              }
            }
          }
        )
      }
    }
  }

  selezionaIndirizzo(event:any,isResidenza:boolean){
    let indirizzo:IndirizzoStradario=event.value
    let toponimoId=this.toponimos?.filter(t=>t.descr==indirizzo?.tipoVia)?.map(t=>t.id)[0]
    if(isResidenza){
      this.formResidenza.get('indirizzo.toponimo.id').setValue(toponimoId || null);
      this.formResidenza.get('indirizzo.toponimo.descr').setValue(indirizzo?.descrizione || null);
      this.formResidenza.get('indirizzo.numeroCivico').setValue(indirizzo?.civicoNumero + (indirizzo?.civicoSub ? indirizzo?.civicoSub:"") || null);
      this.formResidenza.get('indirizzo.cap').setValue(indirizzo?.cap || null);
      this.formResidenza.get('indirizzo.indirizzo').setValue(indirizzo?.nomeVia || null);
      this.formResidenza.get('indirizzo.localita').setValue(indirizzo?.localita || null);
      this.formResidenza.get('indirizzo.indirizzo').markAsTouched()
      this.formResidenza.get('indirizzo.indirizzo').updateValueAndValidity()
    }else{
      this.formDomicilio.get('indirizzo.toponimo.id').setValue(toponimoId || null);
      this.formDomicilio.get('indirizzo.toponimo.descr').setValue(indirizzo?.descrizione || null);
      this.formDomicilio.get('indirizzo.numeroCivico').setValue(indirizzo?.civicoNumero + (indirizzo?.civicoSub ? indirizzo?.civicoSub:"") || null);
      this.formDomicilio.get('indirizzo.cap').setValue(indirizzo?.cap || null);
      this.formDomicilio.get('indirizzo.indirizzo').setValue(indirizzo?.nomeVia || null);
      this.formDomicilio.get('indirizzo.localita').setValue(indirizzo?.localita || null);
      this.formDomicilio.get('indirizzo.indirizzo').markAsTouched()
      this.formDomicilio.get('indirizzo.indirizzo').updateValueAndValidity()
    }
  }
  //selezione della provincia
  onFilterComune(event:any, formProvenienza:string = 'nascita'){
      formProvenienza!='nascita'? (formProvenienza=="residenza"? (
        this.attivaStradarioRes=this.province.filter(p=>p.id==event.value).map(p=>p.special)[0]=="01"
      ) : this.attivaStradarioDom=this.province.filter(p=>p.id==event.value).map(p=>p.special)[0]=="01"):""
      if(formProvenienza == "residenza"){
        this.clearIndirizzo(true)
        this.formResidenza.get('indirizzo.luogo.comune.id').reset()
        if(this.attivaStradarioRes){
          this.formResidenza.get('indirizzo.toponimo.id').disable();
          this.formResidenza.get('indirizzo.toponimo.descr').disable();
          this.formResidenza.get('indirizzo.numeroCivico').disable();
          this.formResidenza.get('indirizzo.cap').disable();
          this.formResidenza.get('indirizzo.indirizzo').disable();
          this.formResidenza.get('indirizzo.localita').disable();
        }else{
          this.formResidenza.get('indirizzo.toponimo.id').enable()
          this.formResidenza.get('indirizzo.toponimo.descr').enable()
          this.formResidenza.get('indirizzo.numeroCivico').enable()
          this.formResidenza.get('indirizzo.cap').enable()
          this.formResidenza.get('indirizzo.indirizzo').enable()
          this.formResidenza.get('indirizzo.localita').enable()
        }
      }
      if(formProvenienza == "domicilio"){
        this.clearIndirizzo(false)
        this.formDomicilio.get('indirizzo.luogo.comune.id').reset()
        if(this.attivaStradarioDom){
          this.formDomicilio.get('indirizzo.toponimo.id').disable();
          this.formDomicilio.get('indirizzo.toponimo.descr').disable();
          this.formDomicilio.get('indirizzo.numeroCivico').disable();
          this.formDomicilio.get('indirizzo.cap').disable();
          this.formDomicilio.get('indirizzo.indirizzo').disable();
          this.formDomicilio.get('indirizzo.localita').disable();
        }else{
          this.formDomicilio.get('indirizzo.toponimo.id').enable()
          this.formDomicilio.get('indirizzo.toponimo.descr').enable()
          this.formDomicilio.get('indirizzo.numeroCivico').enable()
          this.formDomicilio.get('indirizzo.cap').enable()
          this.formDomicilio.get('indirizzo.indirizzo').enable()
          this.formDomicilio.get('indirizzo.localita').enable()
        }
      }
    this.findListaComuni(formProvenienza,event.value)
  }
  findListaComuni(formProvenienza:string,id:string){
    console.log(id)
    switch (formProvenienza){
      case 'nascita':
        this.comuniNascita=[]
        this.formDatiPersonali.get('luogoDiNascita.comune.id').reset()
        this.decodificaService.findComuneByIdProvincia(id).subscribe({
          next:res=>{
            this.comuniNascita=res.list
          }
        })
        break;
      case 'residenza':
        this.comunesProvRes=[]
        this.formResidenza.get('indirizzo.luogo.comune.id').reset()

        this.decodificaService.findComuneByIdProvincia(id).subscribe({
          next:res=>{
            console.log(res)
            this.comunesProvRes=res.list
          }
        })
        break;
      case 'domicilio':
        this.comunesProvDom=[]
        this.formDomicilio.get('indirizzo.luogo.comune.id').reset()
        this.decodificaService.findComuneByIdProvincia(id).subscribe({
          next:res=>{
            this.comunesProvDom=res.list
          }
        })
        break;
    }
  }
  onSelectComune(isResidenza:boolean){
    this.clearIndirizzo(isResidenza)
  }

  clearIndirizzo(isResidenza:boolean){
    if(isResidenza){
      this.formResidenza.get('indirizzo.toponimo.id').reset();
      this.formResidenza.get('indirizzo.toponimo.descr').reset();
      this.formResidenza.get('indirizzo.numeroCivico').reset();
      this.formResidenza.get('indirizzo.cap').reset();
      this.formResidenza.get('indirizzo.indirizzo').reset();
      this.formResidenza.get('indirizzo.localita').reset();
      this.stradarioRes=[]
    }else{
      this.formDomicilio.get('indirizzo.toponimo.id').reset();
      this.formDomicilio.get('indirizzo.toponimo.descr').reset();
      this.formDomicilio.get('indirizzo.numeroCivico').reset();
      this.formDomicilio.get('indirizzo.cap').reset();
      this.formDomicilio.get('indirizzo.indirizzo').reset();
      this.formDomicilio.get('indirizzo.localita').reset();
      this.stradarioDom=[]
    }
  }


  settingForm(){
    //======================
    // DATI PERSONALI
    let datiPersonali = this.datiAnagrafici?.datiGenerali?.datiPersonali;
    if(!datiPersonali){
      datiPersonali={
        codiceFiscale: this.user.codFisc?.toLocaleUpperCase(),
        cognome:this.user.cognome?.toLocaleUpperCase(),
        nome:this.user.nome?.toLocaleUpperCase()
      }
    }

      //this.formDatiPersonali.get('luogoDiNascita.comune.descr').setValue(datiPersonali?.luogoDiNascita?.comune?.descr || null);
    this.formDatiPersonali.controls['codiceFiscale'].setValue(datiPersonali?.codiceFiscale?.toLocaleUpperCase() || null);
    this.formDatiPersonali.controls['cognome'].setValue(datiPersonali?.cognome?.toLocaleUpperCase() || null);
    this.formDatiPersonali.controls['nome'].setValue(datiPersonali?.nome?.toLocaleUpperCase() || null);

    this.formDatiPersonali.controls['codiceFiscale'].disable();
    this.formDatiPersonali.controls['cognome'].disable();
    this.formDatiPersonali.controls['nome'].disable();
    this.formDatiPersonali.get('genere.id').disable();
    this.formDatiPersonali.controls['dataDiNascita'].disable()

    this.formDatiPersonali.get('genere.id').setValue(datiPersonali?.genere?.id || null)
    this.formDatiPersonali.get('statoCivile.id').setValue(datiPersonali?.statoCivile?.id || null)
    this.formDatiPersonali.controls['dataDiNascita'].setValue(datiPersonali?.dataDiNascita ? new Date(datiPersonali?.dataDiNascita) : null )

    this.formDatiPersonali.get('luogoDiNascita.flgLuogoItalia').setValue(datiPersonali?.luogoDiNascita?.flgLuogoItalia ||"I");
    this.formDatiPersonali.get('cittadinanza.id').setValue(datiPersonali?.cittadinanza?.id || null);
    this.setLuogoNascitaControl();
    if( datiPersonali?.luogoDiNascita?.flgLuogoItalia == 'I'){

      this.comuniNascita.push(...[{
        id:datiPersonali?.luogoDiNascita?.comune.id,
        descr:datiPersonali?.luogoDiNascita?.comune.descr,
      }]);
      this.formDatiPersonali.get('luogoDiNascita.comune.id').setValue(datiPersonali?.luogoDiNascita?.comune?.id || null);
      this.formDatiPersonali.get('luogoDiNascita.comune.descr').setValue(datiPersonali?.luogoDiNascita?.comune?.descr || null);
      this.formDatiPersonali.get('luogoDiNascita.comune.silTProvincia.idSilTProvincia').setValue(this.provNasc|| null);
    } else {
      this.formDatiPersonali.get('luogoDiNascita.stato.idSilTNazione').setValue(datiPersonali?.luogoDiNascita?.stato?.idSilTNazione || null);
      this.formDatiPersonali.get('luogoDiNascita.stato.dsSilTNazione').setValue(datiPersonali?.luogoDiNascita?.stato?.dsSilTNazione || null);
      this.formDatiPersonali.get('luogoDiNascita.comune.silTProvincia.idSilTProvincia').disable()
    }
    this.formDatiPersonali.get('luogoDiNascita.comune.id').disable()
    this.formDatiPersonali.get('luogoDiNascita.stato.idSilTNazione').disable()
    this.formDatiPersonali.get('luogoDiNascita.comune.silTProvincia.idSilTProvincia').disable()
    this.formDatiPersonali.get('luogoDiNascita.flgLuogoItalia').disable()
    //======================
    // NOTIZIE CITTADINI STRANIERI
    if(datiPersonali.cittadinanza)
      this.enableNotizieCittadiniStranieri(datiPersonali?.cittadinanza);

    //======================
    // RESIDENZA
    let residenza = this.datiAnagrafici?.reperibilitaRecapiti?.residenza;
    this.formResidenza.get("indirizzo.luogo.flgLuogoItalia").setValue(residenza?.indirizzo?.luogo?.flgLuogoItalia || "I");
    this.setLuogoResidenzaControl();
    if(residenza?.indirizzo?.luogo?.flgLuogoItalia == "I"){

      this.decodificaService.findComuneByIdProvincia(this.provRes).subscribe({
        next: (r:DecodificaListResponse) => {
          if(r.esitoPositivo){
            this.comunesProvRes=[]
            this.comunesProvRes.push(...r.list);
            this.formResidenza.get('indirizzo.luogo.comune.id').setValue(residenza?.indirizzo?.luogo?.comune?.id || null);
            this.formResidenza.get('indirizzo.luogo.comune.descr').setValue(residenza?.indirizzo?.luogo?.comune?.descr || null);
            this.formResidenza.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').setValue(this.provRes|| null);
          }
        }
      })

      this.formResidenza.get('indirizzo.toponimo.id').setValue(residenza?.indirizzo?.toponimo?.id || null);
      this.formResidenza.get('indirizzo.toponimo.descr').setValue(residenza?.indirizzo?.toponimo?.descr || null);
      this.formResidenza.get('indirizzo.numeroCivico').setValue(residenza?.indirizzo?.numeroCivico || null);
      this.formResidenza.get('indirizzo.cap').setValue(residenza?.indirizzo?.cap || null);
      this.formResidenza.get('indirizzo.indirizzo').setValue(residenza?.indirizzo?.indirizzo || null);
      this.formResidenza.get('indirizzo.localita').setValue(residenza?.indirizzo?.localita || null);
      if(residenza?.indirizzo?.luogo?.comune?.silTRegione?.descr=="PIEMONTE"){
          this.formResidenza.get('indirizzo.toponimo.id').disable();
          this.formResidenza.get('indirizzo.toponimo.descr').disable();
          this.formResidenza.get('indirizzo.numeroCivico').disable();
          this.formResidenza.get('indirizzo.cap').disable();
          this.formResidenza.get('indirizzo.indirizzo').disable();
          this.formResidenza.get('indirizzo.localita').disable();
      }
    } else {
      this.formResidenza.get('indirizzo.luogo.stato.idSilTNazione').setValue(residenza?.indirizzo?.luogo?.stato?.idSilTNazione || null);
    }

    //======================
    // DOMICILIO
    let domicilio = this.datiAnagrafici?.reperibilitaRecapiti?.domicilio;
    this.formDomicilio.controls['ugualeAResidenza'].setValue(domicilio?.ugualeAResidenza);
    this.setDomicilioControl();
    if(!this.formDomicilio.get('ugualeAResidenza').value){
      this.popolaDomicilio()
    }


    // this.formDomicilio.disable();

    //======================
    // RECAPITI
    let recapito = this.datiAnagrafici?.reperibilitaRecapiti?.recapito;
    this.formRecapito.controls['cellulare'].setValue(recapito?.cellulare || null)
    this.formRecapito.controls['cellulare2'].setValue(recapito?.cellulare2 || null)
    this.formRecapito.controls['telefonoAbitazione'].setValue(recapito?.telefonoAbitazione || null)
    this.formRecapito.controls['email'].setValue(recapito?.email || null)
    this.formRecapito.controls['indirizzoDigitale'].setValue(recapito?.indirizzoDigitale || null)


  }
  popolaDomicilio(){
    let domicilio = this.datiAnagrafici?.reperibilitaRecapiti?.domicilio;
    this.formDomicilio.get("indirizzo.luogo.flgLuogoItalia").setValue(domicilio?.indirizzo?.luogo?.flgLuogoItalia || "I");

    if(domicilio?.indirizzo?.luogo?.flgLuogoItalia == "I"){
      this.decodificaService.findComuneByIdProvincia(this.provDom).subscribe({
        next: (r:any) => {
          if(r.esitoPositivo){
            this.comunesProvDom=[]
            this.comunesProvDom.push(...r.list);
            this.formDomicilio.get('indirizzo.luogo.comune.id').setValue(domicilio?.indirizzo?.luogo?.comune?.id || null);
            this.formDomicilio.get('indirizzo.luogo.comune.descr').setValue(domicilio?.indirizzo?.luogo?.comune?.descr || null);
            this.formDomicilio.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').setValue(this.provDom|| null);
          }
        }
      })

      this.formDomicilio.get('indirizzo.luogo.stato.idSilTNazione').disable()
      this.formDomicilio.get('indirizzo.luogo.stato.dsSilTNazione').disable()
      if(domicilio?.indirizzo?.luogo?.comune?.silTRegione?.descr=="PIEMONTE"){
        this.formDomicilio.get('indirizzo.toponimo.id').disable();
        this.formDomicilio.get('indirizzo.toponimo.descr').disable();
        this.formDomicilio.get('indirizzo.numeroCivico').disable();
        this.formDomicilio.get('indirizzo.cap').disable();
        this.formDomicilio.get('indirizzo.indirizzo').disable();
        this.formDomicilio.get('indirizzo.localita').disable();
      }
    } else {
      this.formDomicilio.get('indirizzo.luogo.stato.idSilTNazione').setValue(domicilio?.indirizzo?.luogo?.stato?.idSilTNazione || null);
      this.formDomicilio.get('indirizzo.luogo.comune.id').disable()
      this.formDomicilio.get('indirizzo.luogo.comune.descr').disable()
      this.formDomicilio.get('indirizzo.luogo.comune.silTProvincia.idSilTProvincia').disable()
    }

      this.formDomicilio.get('indirizzo.toponimo.id').setValue(domicilio?.indirizzo?.toponimo?.id || null);
      this.formDomicilio.get('indirizzo.toponimo.descr').setValue(domicilio?.indirizzo?.toponimo?.descr || null);
      this.formDomicilio.get('indirizzo.numeroCivico').setValue(domicilio?.indirizzo?.numeroCivico || null);
      this.formDomicilio.get('indirizzo.cap').setValue(domicilio?.indirizzo?.cap || null);
      this.formDomicilio.get('indirizzo.indirizzo').setValue(domicilio?.indirizzo?.indirizzo || null);
      this.formDomicilio.get('indirizzo.localita').setValue(domicilio?.indirizzo?.localita || null);
  }
  setLuogoNascitaControl() {
    const flgLuogoItalia = this.formDatiPersonali.get('luogoDiNascita.flgLuogoItalia').value;
    if (flgLuogoItalia === 'I') {
      this.formDatiPersonali.get('luogoDiNascita.comune').enable();
      this.formDatiPersonali.get('luogoDiNascita.comune.silTProvincia').enable();
      this.formDatiPersonali.get('luogoDiNascita.stato').disable();
      this.formDatiPersonali.get('luogoDiNascita.stato').reset();
    } else {
      this.formDatiPersonali.get('luogoDiNascita.flgLuogoItalia').patchValue('E');
      this.formDatiPersonali.get('luogoDiNascita.comune.silTProvincia').reset()
      this.formDatiPersonali.get('luogoDiNascita.comune.silTProvincia').disable() ;
      this.formDatiPersonali.get('luogoDiNascita.comune').reset()
      this.formDatiPersonali.get('luogoDiNascita.comune').disable() ;
      this.formDatiPersonali.get('luogoDiNascita.stato').enable();
    }
  }

  // italia/estero residenza
  setLuogoResidenzaControl() {
    const flgLuogoItalia = this.formResidenza.get('indirizzo.luogo.flgLuogoItalia').value;
    if (flgLuogoItalia === 'I') {
      this.formResidenza.get('indirizzo.luogo.stato').reset();
      this.formResidenza.get('indirizzo.luogo.stato').disable();

      this.formResidenza.get('indirizzo.luogo.comune.silTProvincia').enable();
      this.formResidenza.get('indirizzo.luogo.comune').enable();
      this.formResidenza.get('indirizzo.toponimo').enable();
      this.formResidenza.get('indirizzo.numeroCivico').enable();
      this.formResidenza.get('indirizzo.cap').enable();
      this.formResidenza.get('indirizzo.indirizzo').enable();
      this.formResidenza.get('indirizzo.localita').enable();
    } else {

      this.formResidenza.get('indirizzo.luogo.comune.silTProvincia').reset();
      this.formResidenza.get('indirizzo.luogo.comune.silTProvincia').disable();

      this.formResidenza.get('indirizzo.luogo.comune').reset();
      this.formResidenza.get('indirizzo.luogo.comune').disable();

      this.formResidenza.get('indirizzo.toponimo').reset();
      this.formResidenza.get('indirizzo.toponimo').disable();

      this.formResidenza.get('indirizzo.numeroCivico').reset();
      this.formResidenza.get('indirizzo.numeroCivico').disable();

      this.formResidenza.get('indirizzo.cap').reset();
      this.formResidenza.get('indirizzo.cap').disable();

      this.formResidenza.get('indirizzo.indirizzo').reset();
      this.formResidenza.get('indirizzo.indirizzo').disable();

      this.formResidenza.get('indirizzo.localita').reset();
      this.formResidenza.get('indirizzo.localita').disable();

      this.formResidenza.get('indirizzo.luogo.flgLuogoItalia').patchValue('E');
      this.formResidenza.get('indirizzo.luogo.stato').reset();
      this.formResidenza.get('indirizzo.luogo.stato').enable();
    }
    let regioneFascicolo=this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.residenza?.indirizzo?.luogo?.comune?.silTRegione?.descr
    if(regioneFascicolo=="PIEMONTE"){
      this.attivaStradarioRes=true
      this.formResidenza.get('indirizzo.toponimo.id').disable();
      this.formResidenza.get('indirizzo.toponimo.descr').disable();
      this.formResidenza.get('indirizzo.numeroCivico').disable();
      this.formResidenza.get('indirizzo.cap').disable();
      this.formResidenza.get('indirizzo.indirizzo').disable();
      this.formResidenza.get('indirizzo.localita').disable();

    }
  }

  setRequired() {
    return this.formDatiPersonali.get('luogoDiNascita.flgLuogoItalia').value == 'I'
  }
  setRequiredResidenza() {
    return this.formResidenza.get('indirizzo.luogo.flgLuogoItalia').value == 'I'
  }

  setDomicilioControl() {
    const ugualeAResidenza = this.formDomicilio.get('ugualeAResidenza').value;
    if(ugualeAResidenza){
      this.formDomicilio.disable();
      this.formDomicilio.get('ugualeAResidenza').enable()
      this.attivaStradarioDom=false
      this.formDomicilio.patchValue(this.formResidenza.getRawValue() as Domicilio)

    }else{

      this.formDomicilio.reset();
      this.formDomicilio.get('ugualeAResidenza').patchValue(false)
      this.formDomicilio.get('indirizzo.luogo.flgLuogoItalia').patchValue("I")
      this.formDomicilio.get('indirizzo.luogo.comune.silTProvincia').enable();
      this.setLuogoDomicilioControl()
    }

  }
  setRequiredDomicilio() {

    return this.formDomicilio.get('indirizzo.luogo.flgLuogoItalia').value == 'I' && this.formDomicilio
  }
  // italia/estero domicilio
  setLuogoDomicilioControl() {
    const flgLuogoItalia = this.formDomicilio.get('indirizzo.luogo.flgLuogoItalia').value;

    this.formDomicilio.get('indirizzo.luogo.flgLuogoItalia').enable();
    if (flgLuogoItalia == 'I') {
      this.formDomicilio.get('indirizzo.luogo.stato').disable();
      this.formDomicilio.get('indirizzo.luogo.comune').enable();
      this.formDomicilio.get('indirizzo.luogo.comune.silTProvincia').enable();
      this.formDomicilio.get('indirizzo.toponimo').enable();
      this.formDomicilio.get('indirizzo.numeroCivico').enable();
      this.formDomicilio.get('indirizzo.cap').enable();
      this.formDomicilio.get('indirizzo.indirizzo').enable();
      this.formDomicilio.get('indirizzo.localita').enable();
      this.formDomicilio.get('indirizzo.luogo.stato').reset();
    } else {
      this.formDomicilio.get('indirizzo.luogo.comune').reset();
      this.formDomicilio.get('indirizzo.luogo.comune.silTProvincia').reset();
      this.formDomicilio.get('indirizzo.toponimo').reset();
      this.formDomicilio.get('indirizzo.numeroCivico').reset();
      this.formDomicilio.get('indirizzo.cap').reset();
      this.formDomicilio.get('indirizzo.indirizzo').reset();
      this.formDomicilio.get('indirizzo.localita').reset();
      this.formDomicilio.get('indirizzo.luogo.flgLuogoItalia').patchValue('E');
      this.formDomicilio.get('indirizzo.luogo.stato').reset();
      this.formDomicilio.get('indirizzo.luogo.stato').enable();
      this.formDomicilio.get('indirizzo.luogo.comune').disable();
      this.formDomicilio.get('indirizzo.luogo.comune.silTProvincia').disable();
      this.formDomicilio.get('indirizzo.toponimo').disable();
      this.formDomicilio.get('indirizzo.numeroCivico').disable();
      this.formDomicilio.get('indirizzo.cap').disable();
      this.formDomicilio.get('indirizzo.indirizzo').disable();
      this.formDomicilio.get('indirizzo.localita').disable();

    }
    let regioneFascicolo=this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.domicilio?.indirizzo?.luogo?.comune?.silTRegione?.descr

    if(regioneFascicolo=="PIEMONTE"){
      this.attivaStradarioDom=true
      this.formDomicilio.get('indirizzo.toponimo.id').disable();
      this.formDomicilio.get('indirizzo.toponimo.descr').disable();
      this.formDomicilio.get('indirizzo.numeroCivico').disable();
      this.formDomicilio.get('indirizzo.cap').disable();
      this.formDomicilio.get('indirizzo.indirizzo').disable();
      this.formDomicilio.get('indirizzo.localita').disable();
    }
    console.log(this.formDomicilio)
  }

  enableNotizieCittadiniStranieri(citt?: Decodifica) {
    let cittadinanza:Decodifica={}
    if(citt){
      cittadinanza = this.cittadinanze.find(cit => cit.id == citt.id);
    }else{
      let id=this.formDatiPersonali.get("cittadinanza").value.id
      cittadinanza= this.cittadinanze.find(cit => cit.id == id);
    }
    console.log("enableNotizieCittadiniStranieri",citt)
    if (cittadinanza) {
      if (cittadinanza.special == 'S') {
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno').disable();
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno').reset();
      } else {
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.titolo').enable();
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.numero').enable();
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.dataScadenza').enable();
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.questura').enable();
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.motivoRilascio.silTCatMotRilPerm').enable();
        //this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.motivoRilascio.idSilTMotRilPerm').enable();

        if(citt){

          this.initFormPermessoSoggiorno()
        }
      }
    } else {
      this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno').disable();
      this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno').reset();
    }
  }


  initFormPermessoSoggiorno(){

    let permessoDiSoggiorno=this.fascicolo.datiAnagrafici.datiGenerali.notizieCittadiniStranieri.permessoDiSoggiorno
    console.log("init permesso di soggiorno",permessoDiSoggiorno)
    if(permessoDiSoggiorno){
      this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.titolo').patchValue(permessoDiSoggiorno.titolo);
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.numero').patchValue(permessoDiSoggiorno.numero);
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.dataScadenza').patchValue(new Date(permessoDiSoggiorno.dataScadenza));
        this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.questura.id').patchValue(permessoDiSoggiorno?.questura?.id);
        if(permessoDiSoggiorno.motivoRilascio){
          this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.motivoRilascio.silTCatMotRilPerm.idSilTCatMotRilPerm').patchValue(permessoDiSoggiorno.motivoRilascio.silTCatMotRilPerm?.idSilTCatMotRilPerm?.toString());
          this.decrizioneMotiviPermessoFiltrati=this.desrizioneMotiviPermesso.filter(ds=>ds.special==permessoDiSoggiorno.motivoRilascio.silTCatMotRilPerm?.idSilTCatMotRilPerm?.toString())
          this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.motivoRilascio.idSilTMotRilPerm').patchValue(permessoDiSoggiorno.motivoRilascio?.idSilTMotRilPerm);
        }
    }
  }
  filtraMotivoRilascio(event: any) {
    this.decrizioneMotiviPermessoFiltrati=this.desrizioneMotiviPermesso.filter(ds=>ds.special==event.value)
    this.formNotizieCittadiniStranieri.get('permessoDiSoggiorno.motivoRilascio.idSilTMotRilPerm').enable()
  }

  /**
   * Confronta due valori considerando null e undefined come equivalenti
   */
  private areValuesEqual(val1: any, val2: any): boolean {
    // Se entrambi sono null/undefined, sono uguali
    if ((val1 == null) && (val2 == null)) {
      return true;
    }
    // Altrimenti confronta normalmente
    return val1 === val2;
  }

  /**
   * Verifica se il domicilio è stato modificato dall'utente confrontando i valori attuali del form con quelli originali
   */
  isDomicilioModified(): boolean {
    const originalDomicilio = this.fascicolo?.datiAnagrafici?.reperibilitaRecapiti?.domicilio;
    if (!originalDomicilio) {
      return false;
    }

    const currentFormValue = this.formDomicilio.getRawValue();

    // Confronta il flag ugualeAResidenza
    if (!this.areValuesEqual(currentFormValue.ugualeAResidenza, originalDomicilio.ugualeAResidenza)) {
      return true;
    }

    // Se ugualeAResidenza è true, il domicilio non può essere modificato direttamente
    if (currentFormValue.ugualeAResidenza) {
      return false;
    }

    // Confronta i campi dell'indirizzo
    const originalIndirizzo:any = originalDomicilio.indirizzo;
    const currentIndirizzo = currentFormValue.indirizzo;

    if (!originalIndirizzo || !currentIndirizzo) {
      return false;
    }

    // Confronta i campi principali dell'indirizzo
    const fieldsToCompare = [
      'indirizzo',
      'numeroCivico',
      'cap',
      'localita'
    ];

    for (const field of fieldsToCompare) {
      if (!this.areValuesEqual(originalIndirizzo[field], currentIndirizzo[field])) {
        return true;
      }
    }

    // Confronta il comune
    if (!this.areValuesEqual(originalIndirizzo.luogo?.comune?.id, currentIndirizzo.luogo?.comune?.id)) {
      return true;
    }

    // Confronta la provincia
    if (!this.areValuesEqual(originalIndirizzo.luogo?.comune?.silTProvincia?.idSilTProvincia,
        currentIndirizzo.luogo?.comune?.silTProvincia?.idSilTProvincia)) {
      return true;
    }

    // Confronta il flag Italia/Estero
    if (!this.areValuesEqual(originalIndirizzo.luogo?.flgLuogoItalia, currentIndirizzo.luogo?.flgLuogoItalia)) {
      return true;
    }

    // Confronta lo stato (per indirizzi esteri)
    if (!this.areValuesEqual(originalIndirizzo.luogo?.stato?.idSilTNazione, currentIndirizzo.luogo?.stato?.idSilTNazione)) {
      return true;
    }

    return false;
  }

  // Proprietà per il debug del controllo domicilio
  debugDomicilioData: any = {};

  // Proprietà per controllare se mostrare il debug
  get showDebugDomicilio(): boolean {
    return this.debugDomicilioData && Object.keys(this.debugDomicilioData).length > 0;
  }

  // Metodo per inizializzare i dati di debug
  initializeDebugData(): void {
    this.debugDomicilioData = {
      timestamp: new Date().toISOString(),
      isInitialized: true,
      fascicolo: this.fascicolo,
      canChangeRegioneDomicilio: this.canChangeRegioneDomicilio,
      canChangeProvinciaDomicilio: this.canChangeProvinciaDomicilio,
      codiceRegionePoliticaA02: this.codiceRegionePoliticaA02,
      provinciaIscrizioneCollMirato: this.provinciaIscrizioneCollMirato,
      utente: this.utente ? {
        cognome: this.utente.cognome,
        nome: this.utente.nome,
        cfUtente: this.utente.cfUtente
      } : null,
      messagioE34: this.messagioE34,
      messagioE35: this.messagioE35,
      formValues: {
        ugualeAResidenza: this.formDomicilio?.get('ugualeAResidenza')?.value,
        provinciaResidenza: this.formResidenza?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value,
        provinciaDomicilio: this.formDomicilio?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value
      }
    };
  }

  // Metodo per testare specificamente il controllo E34
  testControlloE34(): void {
    console.log("🧪 TEST CONTROLLO E34 - Inizio");

    // Aggiorna i dati di debug prima del test
    this.updateDebugData();

    // Simula il controllo E34
    const ugualeAresidenza = this.formDomicilio?.get('ugualeAResidenza')?.value;
    let regioneNew = "";

    if (ugualeAresidenza) {
      const provinciaId = this.formResidenza?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value;
      const provincia = this.province?.find(p => p.id == provinciaId);
      regioneNew = provincia?.special || "Non trovata";
    } else {
      const provinciaId = this.formDomicilio?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value;
      const provincia = this.province?.find(p => p.id == provinciaId);
      regioneNew = provincia?.special || "Non trovata";
    }

    console.log("🧪 TEST E34 - Valori:");
    console.log("- regioneNew:", regioneNew);
    console.log("- canChangeRegioneDomicilio:", this.canChangeRegioneDomicilio);
    console.log("- codiceRegionePoliticaA02:", this.codiceRegionePoliticaA02);
    console.log("- Condizione completa:", !this.canChangeRegioneDomicilio && this.codiceRegionePoliticaA02 != regioneNew);

    if (!this.canChangeRegioneDomicilio && this.codiceRegionePoliticaA02 != regioneNew) {
      console.log("🧪 TEST E34 - CONDIZIONE SODDISFATTA - Mostrando messaggio E34");

      let messaggio = this.messagioE34 ? this.messagioE34.testo : "E' in corso un patto di attivazione presso una regione diversa da quella del domicilio. Si consiglia di contattare il CPI di competenza";

      const data: DialogModaleMessage = {
        titolo: "Test Controllo E34",
        tipo: TypeDialogMessage.Back,
        messaggio: messaggio,
        messaggioAggiuntivo: "Questo è un test del controllo E34",
        size: "lg",
        tipoTesto: TYPE_ALERT.ERROR
      };

      this.promptModalService.openModaleConfirm(data);
    } else {
      console.log("🧪 TEST E34 - CONDIZIONE NON SODDISFATTA");
      alert("Controllo E34: Condizione non soddisfatta - Nessun messaggio da mostrare");
    }
  }

  // Metodo per aggiornare i dati di debug
  updateDebugData(): void {
    if (this.debugDomicilioData) {
      this.debugDomicilioData.timestamp = new Date().toISOString();
      this.debugDomicilioData.formValues = {
        ugualeAResidenza: this.formDomicilio?.get('ugualeAResidenza')?.value,
        provinciaResidenza: this.formResidenza?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value,
        provinciaDomicilio: this.formDomicilio?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value
      };

      // Calcola la regione nuova per il debug
      const ugualeAresidenza = this.formDomicilio?.get('ugualeAResidenza')?.value;
      let regioneNew = "";

      if (ugualeAresidenza) {
        const provinciaId = this.formResidenza?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value;
        const provincia = this.province?.find(p => p.id == provinciaId);
        regioneNew = provincia?.special || "Non trovata";
      } else {
        const provinciaId = this.formDomicilio?.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia")?.value;
        const provincia = this.province?.find(p => p.id == provinciaId);
        regioneNew = provincia?.special || "Non trovata";
      }

      this.debugDomicilioData.regioneNew = regioneNew;
      this.debugDomicilioData.provinceCount = this.province?.length || 0;
      this.debugDomicilioData.provinceSample = this.province?.slice(0, 3) || [];

      // Analizza le politiche attive per il controllo E34
      const politicheA02 = this.fascicolo?.politicheAttiveLavoratore?.politicheAttive?.filter(p =>
        p.attivita?.codice === "A02"
      ) || [];

      const politicheDID = politicheA02.filter(p =>
        p?.lavSapSez6?.silTTipoProgettoMin?.codTipoProgettoMin === "05"
      );

      const politicheAperte = politicheDID.filter(p =>
        p.ultimoEvento?.eventoFlgFinale !== "S"
      );

      // Aggiungi dettagli sul controllo E34
      this.debugDomicilioData.controlloE34 = {
        codiceRegionePoliticaA02: this.codiceRegionePoliticaA02,
        regioneNew: regioneNew,
        canChangeRegioneDomicilio: this.canChangeRegioneDomicilio,
        condizione1: !!this.codiceRegionePoliticaA02, // Politica A02 presente
        condizione2: !this.canChangeRegioneDomicilio, // Non può cambiare regione
        condizione3: this.codiceRegionePoliticaA02 != regioneNew, // Regioni diverse
        tutteCondizioni: !!this.codiceRegionePoliticaA02 && !this.canChangeRegioneDomicilio && this.codiceRegionePoliticaA02 != regioneNew,
        analisiPolitiche: {
          totali: this.fascicolo?.politicheAttiveLavoratore?.politicheAttive?.length || 0,
          politicheA02: politicheA02.length,
          politicheDID: politicheDID.length,
          politicheAperte: politicheAperte.length,
          dettagliPoliticheAperte: politicheAperte.map(p => ({
            codice: p.attivita?.codice,
            tipoProgetto: p?.lavSapSez6?.silTTipoProgettoMin?.codTipoProgettoMin,
            regione: p?.lavSapSez6?.silTRegione?.idSilTRegione,
            stato: p.ultimoEvento?.eventoFlgFinale
          }))
        }
      };
    }
  }

  chkDomicilio():boolean{
    let domicilio=this.fascicolo.datiAnagrafici.reperibilitaRecapiti.domicilio;
    let residenza=this.fascicolo.datiAnagrafici.reperibilitaRecapiti.residenza;

    // Inizializza i dati di debug
    this.debugDomicilioData = {
      domicilio: domicilio,
      residenza: residenza,
      isDomicilioModified: this.isDomicilioModified(),
      ugualeAResidenza: this.formDomicilio.get('ugualeAResidenza').value,
      provinciaResidenza: this.formResidenza.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia").value,
      provinciaDomicilio: this.formDomicilio.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia").value,
      canChangeRegioneDomicilio: this.canChangeRegioneDomicilio,
      codiceRegionePoliticaA02: this.codiceRegionePoliticaA02,
      messagioE34: this.messagioE34,
      timestamp: new Date().toISOString()
    };

    // Controllo se il domicilio è stato modificato, altrimenti non procedere con i controlli
    if (!this.isDomicilioModified()) {
      this.debugDomicilioData.result = "Domicilio non modificato - controllo saltato";
      return true;
    }

    const ugualeAresidenza= this.formDomicilio.get('ugualeAResidenza').value
    console.log(ugualeAresidenza)
    let regioneNew="";
    ugualeAresidenza? regioneNew=this.province.filter(p=>p.id==this.formResidenza.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia").value).map(p=>p.special)[0]:
    regioneNew=this.province.filter(p=>p.id==this.formDomicilio.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia").value).map(p=>p.special)[0]

    // Aggiorna i dati di debug con la regione calcolata
    this.debugDomicilioData.regioneNew = regioneNew;
    this.debugDomicilioData.province = this.province;

    console.log("=== DEBUG CONTROLLO E34 ===");
    console.log("regioneNew:", regioneNew);
    console.log("canChangeRegioneDomicilio:", this.canChangeRegioneDomicilio);
    console.log("codiceRegionePoliticaA02:", this.codiceRegionePoliticaA02);
    console.log("Condizione 1 (!canChangeRegioneDomicilio):", !this.canChangeRegioneDomicilio);
    console.log("Condizione 2 (codiceRegionePoliticaA02 != regioneNew):", this.codiceRegionePoliticaA02 != regioneNew);
    console.log("Condizione completa:", !this.canChangeRegioneDomicilio && this.codiceRegionePoliticaA02 != regioneNew);

    if(!this.canChangeRegioneDomicilio && this.codiceRegionePoliticaA02!=regioneNew){
      console.log("🚨 CONTROLLO E34 ATTIVATO - Mostrando messaggio");
      let messaggio=this.messagioE34? this.messagioE34.testo: "E' in corso un patto di attivazione presso una regione diversa da quella del domicilio. Si consiglia di contattare il CPI di competenza"
      console.log("Messaggio E34:", messaggio);

      const data: DialogModaleMessage = {
        titolo: " ",
        tipo: TypeDialogMessage.Back,
        messaggio: messaggio,
        messaggioAggiuntivo: " ",
        size: "lg",
        tipoTesto: TYPE_ALERT.ERROR
      };
      this.debugDomicilioData.result = "Controllo fallito - regione diversa (E34)";
      this.debugDomicilioData.errorMessage = messaggio;
      this.debugDomicilioData.controlloE34.eseguito = true;
      this.debugDomicilioData.controlloE34.messaggioMostrato = true;

      console.log("Aprendo modale con messaggio E34...");
      this.promptModalService.openModaleConfirm(data);
      return false;
    } else {
      console.log(" Controllo E34 superato - nessun messaggio da mostrare");
      this.debugDomicilioData.controlloE34.eseguito = true;
      this.debugDomicilioData.controlloE34.messaggioMostrato = false;
    }

    let messaggio=this.messagioE35? this.messagioE35.testo.replace("{COGNOME}",this.utente.cognome).replace("{NOME}",this.utente.nome).replace("{CODICEFISCALE}",this.utente.cfUtente).replace("{provinciaIscrizioneCollMirato}",this.provinciaIscrizioneCollMirato): "Il cittadino " + this.utente.cognome
                    +"  "+ this.utente.nome +" ("+this.utente.cfUtente+")"
                    +" risulta iscritto al collocamento mirato nella provincia di "+ this.provinciaIscrizioneCollMirato+"."
                    +" Non è possibile variare il comune di domicilio in una provincia diversa da quella dell'iscrizione.";

    // Aggiorna i dati di debug con informazioni aggiuntive
    this.debugDomicilioData.messagioE35 = this.messagioE35;
    this.debugDomicilioData.utente = {
      cognome: this.utente.cognome,
      nome: this.utente.nome,
      cfUtente: this.utente.cfUtente
    };
    this.debugDomicilioData.provinciaIscrizioneCollMirato = this.provinciaIscrizioneCollMirato;
    this.debugDomicilioData.messaggioE35 = messaggio;

    if(ugualeAresidenza){
      this.debugDomicilioData.controlloUgualeAResidenza = true;
      const provinciaOriginale = domicilio.indirizzo.luogo.comune.silTProvincia.idSilTProvincia;
      const provinciaNuova = this.formResidenza.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia").value;

      this.debugDomicilioData.provinciaOriginale = provinciaOriginale;
      this.debugDomicilioData.provinciaNuova = provinciaNuova;
      this.debugDomicilioData.provinceDiverse = provinciaOriginale != provinciaNuova;

      if(!this.canChangeRegioneDomicilio && (provinciaOriginale != provinciaNuova)){
        this.debugDomicilioData.result = "Controllo fallito - provincia diversa (uguale a residenza)";
        this.debugDomicilioData.errorMessage = messaggio;

        const data: DialogModaleMessage = {
          titolo:" " ,
          tipo: TypeDialogMessage.Back,
          messaggio: messaggio,
          messaggioAggiuntivo: " ",
          size: "lg",
          tipoTesto: TYPE_ALERT.ERROR
        };
        this.promptModalService.openModaleConfirm(data);
        return false;
      }
    }else{
      this.debugDomicilioData.controlloUgualeAResidenza = false;
      const provinciaOriginale = domicilio.indirizzo.luogo.comune.silTProvincia.idSilTProvincia;
      const provinciaNuova = this.formDomicilio.get("indirizzo.luogo.comune.silTProvincia.idSilTProvincia").value;

      this.debugDomicilioData.provinciaOriginale = provinciaOriginale;
      this.debugDomicilioData.provinciaNuova = provinciaNuova;
      this.debugDomicilioData.provinceDiverse = provinciaOriginale != provinciaNuova;

      if(!this.canChangeRegioneDomicilio && (provinciaOriginale != provinciaNuova)){
        this.debugDomicilioData.result = "Controllo fallito - provincia diversa (domicilio diverso)";
        this.debugDomicilioData.errorMessage = messaggio;

        const data: DialogModaleMessage = {
          titolo:" " ,
          tipo: TypeDialogMessage.Back,
          messaggio: messaggio,
          messaggioAggiuntivo: " ",
          size: "lg",
          tipoTesto: TYPE_ALERT.ERROR
        };
        this.promptModalService.openModaleConfirm(data);
        return false;
      }
    }

    this.debugDomicilioData.result = "Controllo superato con successo";
    return true;
  }

  getFascicolo(){
    Object.keys(this.form.controls).forEach((key: string) => {
      const abstractControl = this.form.controls[key];
      if(abstractControl.disabled){
        this.form.controls[key].clearValidators()
        this.form.controls[key].updateValueAndValidity()
      }
  });
  if(!this.form.valid){
    this.form.markAllAsTouched()
    return false;
  }

  if(this.fascicolo && !this.chkDomicilio()) return false;
    let fascicoloUpdated: SchedaAnagraficaProfessionale = this.fascicolo?Utils.clone(this.fascicolo):{datiAnagrafici:{datiGenerali:{datiPersonali:{}},reperibilitaRecapiti:{}},idSilLavAnagrafica:undefined };

    let datiPersonali: DatiPersonali = this.formDatiPersonali.getRawValue() as DatiPersonali;
    let notizieCittadiniStranieri:NotizieCittadiniStranieri = this.formNotizieCittadiniStranieri.getRawValue() as NotizieCittadiniStranieri;
    let residenza:Residenza = this.formResidenza.getRawValue() as Residenza;
    let domicilio:Domicilio = !this.formDomicilio.controls["ugualeAResidenza"].value? this.formDomicilio.getRawValue() as Domicilio:this.formResidenza.getRawValue() as Domicilio;
    let recapito:Recapito = this.formRecapito.getRawValue() as Recapito;
    if(this.formDatiPersonali.get("luogoDiNascita.flgLuogoItalia").value=="I"){
      datiPersonali={
        ...datiPersonali,
        luogoDiNascita:{
          ...datiPersonali.luogoDiNascita
        }
      }
    }
    fascicoloUpdated.datiAnagrafici.datiGenerali.datiPersonali= datiPersonali;
    fascicoloUpdated.datiAnagrafici.datiGenerali.notizieCittadiniStranieri= notizieCittadiniStranieri;

    fascicoloUpdated.datiAnagrafici.reperibilitaRecapiti.domicilio= domicilio;
    fascicoloUpdated.datiAnagrafici.reperibilitaRecapiti.recapito= recapito;
    fascicoloUpdated.datiAnagrafici.reperibilitaRecapiti.residenza= residenza;
    return fascicoloUpdated;
  }
  get user():any {
    return this.spidUserService.getUser()
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  cambioGenere(gen:string){
    this.genere = gen;
  }
}

