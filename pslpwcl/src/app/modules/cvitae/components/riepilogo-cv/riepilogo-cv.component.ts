/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { CvitaeService } from '../../services/cvitae.service';
import { Candidatura, ElencoCVRequest, GeneraCvRequest, PslpMessaggio, ParametroBlpResponse, ParametroBlpService, LavoratorePslpService, DettaglioCvRequest, FascicoloPslpService, DettaglioFascicoloResponse, SchedaAnagraficaProfessionale, StampaCvRequest, MappingService, CommonRequest} from 'src/app/modules/pslpapi';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { MessaggioService } from 'src/app/modules/pslpapi';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'pslpwcl-riepilogo-cv',
  templateUrl: './riepilogo-cv.component.html',
  styleUrls: ['./riepilogo-cv.component.scss']
})
export class RiepilogoCvComponent implements OnInit {


  colorSelected="#E7E6E6";
  foto=""
  fotoVisibile: boolean=false;
  areaTestoVisibile = false;
  ;



  isCvScaduti = false;
  isCvAnnullati= false;
  messaggiList: string[] = new Array();
  cvList:Candidatura[] = [];
  cvListFiltrati:Candidatura[]=[]

  nonPresenteIdSilavAnag = true;
  nonDomiciliatoPiemonte = true;
  nonCellularePresente = true;

  erroreE7: PslpMessaggio;
  erroreE31: PslpMessaggio;
  erroreE32: PslpMessaggio;
  messaggioDuplica: string;
  nCvInBozza: number = 0;
  nCvInBozzaParam: number=1;
  fascicoloSelected?: SchedaAnagraficaProfessionale;


  messagioCattProt:string;
  autorizzo: string;
  isApl = false;
  isContactCenter = false;


  //cvListFiltered: BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private router: Router,
    private cvitaeService: CvitaeService,
    private cvService:CvService,
    private readonly appUserService:AppUserService,
    private promptModalService: PromptModalService,
    private messaggioService:MessaggioService,
    private parametroBlpService:ParametroBlpService,
    private lavoratorePslpService:LavoratorePslpService,
    private fascicoloService: FascicoloPslpService,
    private commonService: CommonService,
    private utilitiesService: UtilitiesService,
    private mappingService:MappingService
  ) { }
   ngOnInit(): void {
    this.caricaMessaggi().then(()=>{

    //SRS - v06•	Un operatore APL Master o APL non può inserire o modificare un CV. Questa funzionalità sarà solo disponibile su SilpWeb.
    this.isApl = this.ruoloUtente.dsRuolo.includes("APL") ? true : false;
    //Controllo per il ruolo Contact Center
    this.isContactCenter = this.ruoloUtente?.idRuolo==7 ? true : false;

    //Controllo nel caso non sia presente ancora su SILP il fascicolo.
    this.nonPresenteIdSilavAnag = !this.utente.idSilLavAnagrafica? true : false;

    if(this.nonPresenteIdSilavAnag){
      this.messaggioService.findByCod("E29").subscribe({
        next:(r:any)=>{
          this.erroreE7=r.msg;
            const data: DialogModaleMessage = {
              titolo: "Gestione Curriculum Vitae",
              tipo: TypeDialogMessage.Back,
              messaggio:this.erroreE7.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.WARNING
            };
            this.promptModalService.openModaleConfirm(data);
        }
      });
    }else{
      this.fascicoloService.getDettaglioFascicolo(this.utente.idSilLavAnagrafica).subscribe({
        next: (r:any)=>{
          if(r.esitoPositivo){
            this.commonService.fascicoloActual = r.fascicolo;
            this.fascicoloSelected=r.fascicolo;

            if(this.fascicoloSelected.datiAnagrafici.reperibilitaRecapiti.domicilio.indirizzo.luogo?.comune?.silTRegione?.descr!="PIEMONTE"){
              this.nonDomiciliatoPiemonte = true;
              const data: DialogModaleMessage = {
                titolo: "Gestione Curriculum Vitae",
                tipo: TypeDialogMessage.Back,
                messaggio:this.erroreE32.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.WARNING
              };
              this.promptModalService.openModaleConfirm(data);
            }else{
              this.nonDomiciliatoPiemonte = false;
            }

            if(!this.fascicoloSelected.datiAnagrafici.reperibilitaRecapiti.recapito.cellulare){
              const data: DialogModaleMessage = {
                titolo: "Gestione Curriculum Vitae",
                tipo: TypeDialogMessage.Back,
                messaggio:this.erroreE31.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.WARNING
              };
              this.promptModalService.openModaleConfirm(data);
              this.nonCellularePresente = true;
            }else{
              this.nonCellularePresente = false;
            }
          }
        }
      })
    }
    this.elencoCV();
  });
  }

  async caricaMessaggi():Promise<void>{
    // pslp_d_messaggio duplica
    this.commonService.getMessaggioByCode('I39').then((messaggio) => {
      this.messaggioDuplica = messaggio.testo;
    });

    // pslp_d_messaggio Appartenente alle categorie di persone con disabilità (L.68/99)
    this.commonService.getMessaggioByCode('I17').then((messaggio) => {
      this.messagioCattProt = messaggio.testo;
    });

    // pslp_d_messaggio autorizzo
    this.commonService.getMessaggioByCode('I18').then((messaggio) => {
      this.autorizzo = messaggio.testo;
    });

    // pslp_d_messaggio Errore E31 - Cellulare non presente
    this.commonService.getMessaggioByCode("E31").then(messaggio => {
      this.erroreE31 =  messaggio;
    });

    // pslp_d_messaggio Errore E32 - Non domiciliato in Piemonte
    this.commonService.getMessaggioByCode("E32").then(messaggio => {
      this.erroreE32 =  messaggio;
    });
    return Promise.resolve();
  }

  elencoCV(){
    let elencoCvRequest:any={
      codiceFiscale:this.utente.cfUtente,
      //statoCv:"T"
    }

    this.cvService.getElencoCvForLavAnagrafica(elencoCvRequest).subscribe(
      {
        next:ris=>{
          if(ris.esitoPositivo){
            this.cvList=ris.blpDCandidature.map(c=>{
              if(c.codStatoCandidatura.codStatoCandidatura=="B"){
                c.dScadenza=null
              }
              return c;
            })
            this.cvListFiltrati=this.cvList.filter(cv=>{return (cv.codStatoCandidatura.codStatoCandidatura=="V" || cv.codStatoCandidatura.codStatoCandidatura=="B")})
            this.cvitaeService.cvitaeActual=undefined
          }

          // controllo quantita di CV in bozza
          this.parametroBlpService.findParametroByCodBlp("CVBZ").subscribe((risp:ParametroBlpResponse)=>{
            this.nCvInBozzaParam=Number(risp.parametro.dsValore);
            this.nCvInBozza = this.cvList.filter(cv=>cv.codStatoCandidatura.codStatoCandidatura=="B").length;

          })

        }
      }
    );



  }

  //Controllo inserimento CV personalizato
  get controlloInserimentoCvPersonalizzato(){
    /*
      - non presenteid silav per evitare creare un cv nel caso non sia presente un fascicolo su SILP
      - non domicilliato su piemonte
      - non presente numero cellulare
      - isApl non può generare un CV dentro di PSLP un Operatore APL
      - I CV possono essere: CV personalizzato (inserito dal cittadino, massimo 1 (dato parametrico)).
    */
    return this.nonPresenteIdSilavAnag || this.isApl || !(this.nCvInBozza < this.nCvInBozzaParam) || this.nonCellularePresente || this.nonDomiciliatoPiemonte
  }

  filterCvScaduti(){
      if(this.isCvScaduti){
        this.cvListFiltrati=this.cvList.filter(cv=>cv.codStatoCandidatura.codStatoCandidatura=="S")
        this.isCvAnnullati=false
      }else{
        this.cvListFiltrati=this.cvList.filter(cv=>{return (cv.codStatoCandidatura.codStatoCandidatura=="V" || cv.codStatoCandidatura.codStatoCandidatura=="B")})
      }
  }


  filterCvAnnullati(){
    if(this.isCvAnnullati){
      this.cvListFiltrati=this.cvList.filter(cv=>cv.codStatoCandidatura.codStatoCandidatura=="A")
      this.isCvScaduti=false
    }else{
      this.cvListFiltrati=this.cvList.filter(cv=>{return (cv.codStatoCandidatura.codStatoCandidatura=="V" || cv.codStatoCandidatura.codStatoCandidatura=="B")})
    }
  }
  creaCvAutomatico(){
    let request:any={
      //callInfo:{codFiscale:"",idAppChiamante:""},
      idSilLavAnagrafica:this.utente.idSilLavAnagrafica
    }
    this.cvService.generaCvAutomatico(request).subscribe({
      next:res=>{
        if(res.esitoPositivo){
          const data: DialogModaleMessage = {
            titolo: "Generazione CV",
            tipo: TypeDialogMessage.Continue,
            messaggio:"CV generato con successo",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.cvList.push(res.blpDCandidatura)
          this.filterCvScaduti()
        }else{
          const data: DialogModaleMessage = {
            titolo: "Generazione CV",
            tipo: TypeDialogMessage.Continue,
            messaggio:"Errore durante la generazione del CV",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.ERROR
          };
          this.promptModalService.openModaleConfirm(data)
        }
      }
    })
  }
  viewCv(cv: Candidatura){
    this.cvitaeService.setAzioneActual("V");
    this.cvitaeService.cvitaeActual = cv;
    this.cvitaeService.updateSelectedCv(cv)
    if(cv.flgGeneratoDaSistema || (cv.codStatoCandidatura?.codStatoCandidatura!="B" && cv.codStatoCandidatura?.codStatoCandidatura!="V")){
      this.cvitaeService.isCvModificabile=false
    }
    this.router.navigateByUrl("/pslpfcweb/cvitae/private/gestione-cv");

  }

  modificaCv(cv: Candidatura){
    const commonRequest : CommonRequest = {
      callInfo : null
    };
    if(cv.codStatoCandidatura.codStatoCandidatura=="B" || cv.flgGeneratoDaSistema=="S"){
      this.cvitaeService.setAzioneActual("M");
      this.cvitaeService.cvitaeActual = cv;
      this.cvitaeService.updateSelectedCv(cv);
      if(cv.codStatoCandidatura.codStatoCandidatura=="B"){

        this.mappingService.aggiornaAnagrafica(commonRequest,cv.idLavAnagrafica.idSilLavAnagrafica,cv.idLavAnagrafica.id).subscribe(
          ris=>{
            let tmp=cv
            cv.idLavAnagrafica=ris.blpLavAnagrafica
            this.cvitaeService.cvitaeActual = cv;
            this.cvitaeService.updateSelectedCv(cv);
          }
        )
      }
      this.router.navigateByUrl("/pslpfcweb/cvitae/private/gestione-cv");
    }else{
      let request:any={
        idCv:cv.id
      }
      this.cvService.copiaCvValidato(request).subscribe({
        next:ris=>{
          if(ris.esitoPositivo){
            this.cvitaeService.setAzioneActual("M");
            this.cvitaeService.cvitaeActual = ris.blpDCandidatura;
            this.cvitaeService.updateSelectedCv(ris.blpDCandidatura)
            this.router.navigateByUrl("/pslpfcweb/cvitae/private/gestione-cv");
          }
          const data: DialogModaleMessage = {
            titolo: "Generazione CV",
            tipo: TypeDialogMessage.Continue,
            messaggio:this.messaggioDuplica,
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }
      })
    }

  }

  async eliminaCv(cv:Candidatura){

    const data: DialogModaleMessage = {
      titolo: 'Eliminare CV',
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: `Si conferma l'eliminazione del CV?`,
      messaggioAggiuntivo: '',
      size: 'lg',
      tipoTesto: TYPE_ALERT.WARNING,
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      let request:any={
        idCv:cv.id,
        idAnagrafica:cv.idLavAnagrafica.id
      }
      this.cvService.eliminaCvById(request).subscribe({
        next:ris=>{
          if(ris.esitoPositivo){
            const data: DialogModaleMessage = {
              titolo: "Eliminazione CV",
              tipo: TypeDialogMessage.Continue,
              messaggio:"CV eliminato correttamente",
              messaggioAggiuntivo: "",
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)

            this.cvList.splice(this.cvList.findIndex(c=>c.id==cv.id),1);
            this.filterCvScaduti()
          }
        }
      })
    }

  }

  aggiornaCvAutomatico(cv: any){

    let request:any={
      idCv:cv.id
    }

    this.cvService.aggiornaCvAutomatico(request).subscribe({
      next:ris=>{
        if(ris.esitoPositivo){
          const data: DialogModaleMessage = {
            titolo: "Aggiornamento CV automatico",
            tipo: TypeDialogMessage.Continue,
            messaggio:"CV aggiornato correttamente",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.cvList.splice(this.cvList.findIndex(cvR=>cvR.id==cv.id),1,ris.blpDCandidatura)
          this.filterCvScaduti()
        }
      }
    })
  }
  async inserireCodOtp(cv: Candidatura): Promise<boolean>{
    const resp = await this.promptModalService.openCodiceOtp("Inserire OTP", cv.idLavAnagrafica?.codiceFiscale);
    return new Promise((resolve) => {
      if(resp){

        resolve(true);
      }else{
        resolve(false);
      }
    })
  }

  async rinnovaCv(cv: Candidatura) {
    cv.codStatoCandidatura
    let request:any={
      idCv:cv.id
    }
    if(this.ruoloUtente?.idRuolo==7){
      if(!await this.inserireCodOtp(cv)){
        return;
      }
    }

    this.cvService.rinnovaScadenzaCv(request).subscribe({next:ris=>{
      if(ris.esitoPositivo){
        const data: DialogModaleMessage = {
          titolo: "Rinnovo scadenza CV",
          tipo: TypeDialogMessage.Continue,
          messaggio:"CV aggiornato correttamente",
          messaggioAggiuntivo: "",
          size: "lg",
          tipoTesto: TYPE_ALERT.SUCCESS
        };
        this.promptModalService.openModaleConfirm(data)
        this.cvList.splice(this.cvList.findIndex(cvR=>cvR.id==cv.id),1,ris.blpDCandidatura)
        this.filterCvScaduti()
      }
    }})
  }
   async stampaCv(cv: Candidatura){
    this.cvitaeService.cvitaeActual = cv;
    this.cvitaeService.updateSelectedCv(cv)
    const risp = await this.promptModalService.openModaleSelezionaColoreCv();
    if(risp){
      console.log(risp)

      this.colorSelected = risp.colorSelected;
      this.foto = risp.datiFoto;
      this.fotoVisibile = risp.fotoVisibile;
      const stampaRequest: any = {
        idCandidatura: cv.id,
        color: this.colorSelected,
        testoAutorizzoDatiPersonali: this.autorizzo,
        messagioCattProt: this.messagioCattProt,
        foto: this.foto
      };

      this.cvService.stampaCv(stampaRequest).subscribe({
        next:(ris:any)=>{

          if(ris.esitoPositivo){
            const byteArray=new Uint8Array(atob(ris.bytes).split('').map(char=>char.charCodeAt(0)))
            this.utilitiesService.downloadFileDaStampa(byteArray,'application/pdf',`stampa-cv.pdf`)
          }else{
            console.log("non va")
          }
        },error:err=>console.log(err)
      });

      //per aspetare che il colore sia aplicato
      // setTimeout(() => {
      //   window.print();
      // }, 500);
    }
  }
  creaCvPersonalizzato(){
    this.cvitaeService.updateSelectedCv(undefined);
    this.cvitaeService.setAzioneActual("M");
    this.router.navigateByUrl("/pslpfcweb/cvitae/private/gestione-cv");
  }
  get canCreateCv(){
    return !this.cvList.filter(cv=>cv.codStatoCandidatura.codStatoCandidatura=="V" && cv.flgGeneratoDaSistema=="S" ).length && !this.nonPresenteIdSilavAnag && !this.nonCellularePresente && !this.nonDomiciliatoPiemonte
  }
  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }
}
