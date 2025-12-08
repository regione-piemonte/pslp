/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DidPslpService, UltimaDid, LavoratorePslpService, SuntoLavoratore, RicercaStatiDidByCoResponse, MessaggioService, PslpMessaggio, DecodificaPslpService, PrivacyService, Privacy, InserisciDidResponse, FascicoloPslpService, DatiPersonali, FormInserisciDid } from 'src/app/modules/pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from 'src/app/services/log.service';
import { forkJoin } from 'rxjs';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { TYPE_ALERT } from 'src/app/constants';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { CommonService } from 'src/app/services/common.service';

import { UtilitiesService } from 'src/app/services/utilities.service';
@Component({
  selector: 'pslpwcl-main-did',
  templateUrl: './main-did.component.html',
  styleUrls: ['./main-did.component.scss']
})
export class MainDidComponent implements OnInit {
  sezione = "DID";
  ultimaDid?:UltimaDid;
  areaTestoVisibile:boolean = true;
  canInsert:boolean=true;

  suntoLavoratore?: SuntoLavoratore;
  raportiLavoroAperti?: RicercaStatiDidByCoResponse;
  inserisciDidResponse: InserisciDidResponse; //controlli pre inserimento
  esistePattiAttivazione: boolean;
  messaggiList: string[] = [];
  minore: number;
  dataComunicazione: string;
  numeroGiorniDataInps: number;
  messaggioErroreStampa: string;


  erroreE16: PslpMessaggio;
  erroreE12: PslpMessaggio;
  erroreE13: PslpMessaggio;
  erroreE14: PslpMessaggio;
  erroreE15: PslpMessaggio;
  erroreE17: PslpMessaggio;
  erroreE18: PslpMessaggio;
  erroreE22: PslpMessaggio;
  erroreE27: PslpMessaggio;
  erroreE30: PslpMessaggio;
  erroreE33: PslpMessaggio;


  messaggioIntestazione: PslpMessaggio;

  messaggioSalvatagio: PslpMessaggio;
  messaggioModifica: PslpMessaggio;
  messaggioElimina: PslpMessaggio;
  loaded = false;
  elencoPrivacyUtente: Privacy[];

  stampaDisabled: boolean = true;
  dataOggi = new Date();
  durataDissocupazione: number;


  constructor(
    private router: Router,
    private readonly appUserService:AppUserService,
    private didService:DidPslpService,
    private lavoratoreService: LavoratorePslpService,
    private logService: LogService,
    private messagioService: MessaggioService,
    private spinner: NgxSpinnerService,
    private decodificaService: DecodificaPslpService,
    private privacyService:PrivacyService,
    private promptModalService:PromptModalService,
    private fascicoloService:FascicoloPslpService,
    private commonService:CommonService,
    private utilitiesService:UtilitiesService
  ) {
    this.messagioService.findByCod("E22").subscribe({
      next: (res:any) =>{
        this.erroreE22 = res.msg;
        this.controlloFascicolo();
      }
    });
    //if(!appUserService.getUtenteOperateFor()){
      this.privacyService.privacyUtenteCollegato(this.utente.idUtente).subscribe(
        {
          next: async (res: any) =>{
            if(res.esitoPositivo)
              this.elencoPrivacyUtente = res.utentePrivacy;
              let chkPrivacy=false
              res.utentePrivacy.forEach((privacy:any)=>{
                if(((!!privacy?.pslpTUtente1 || !!privacy?.pslpTUtente2) && (privacy.pslpDPrivacy && privacy.pslpDPrivacy.codPrivacy=="PRV"))){
                chkPrivacy=true
                }
              })
              if(!chkPrivacy)
                {
                  const data: DialogModaleMessage = {
                  titolo: "DID",
                  tipo: TypeDialogMessage.YesOrNo,
                  messaggio: "PRIVACY DA CONFERMARE PER FASCICOLO</br></br> Scegliendo SI, "+
                  "il sistema reindirizzerà automaticamente alla GESTIONE PRIVACY, "+
                  "dove sarà possibile prendere visione e accettare l'informativa sulla Privacy.</br></br>"+
                  "Successivamente, sarà possibile operare con la funzionalita selezionata.</br>",
                  messaggioAggiuntivo: "Scegliendo NO, il sistema non permetterà di proseguire. ",
                  size: "lg",
                  tipoTesto: TYPE_ALERT.WARNING
                };
                const result = await this.promptModalService.openModaleConfirm(data);
                if(result=="SI"){
                  this.router.navigateByUrl("/pslpfcweb/private/privacy/riepilogo-privacy")

                }else{
                  this.router.navigateByUrl("/pslphome/home-page")
                  return
                }
              }

          },
          error: (err) =>{
            this.logService.error(this.constructor.name,`fake login: ${this.constructor.name}: ${JSON.stringify(err)}`)
          },
          complete: () =>{
            //  this.spinner.hide();
          }
        }
      )
    //}

  }

  controlloFascicolo(){
    if(this.utente.idSilLavAnagrafica){
      if(!this.commonService.fascicoloActual){
        this.fascicoloService.getDettaglioFascicolo(this.utente.idSilLavAnagrafica).subscribe({
          next:async res=>{

            if(res.esitoPositivo && res.fascicolo){
              this.commonService.fascicoloActual=res.fascicolo
            }else{
                const data: DialogModaleMessage = {
                titolo: this.erroreE22?.descrMessaggio,
                tipo: TypeDialogMessage.Back,
                messaggio: this.erroreE22?.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.WARNING
                };
                const result = await this.promptModalService.openModaleConfirm(data);
                if(result){
                  this.router.navigateByUrl("/pslphome/home-page")
                }
            }
          }
        })
      }
    }else{
      const data: DialogModaleMessage = {
        titolo: this.erroreE22?.descrMessaggio,
        tipo: TypeDialogMessage.Back,
        messaggio: this.erroreE22?.testo,
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
        };
        const result = this.promptModalService.openModaleConfirm(data);
        if(result){
          this.router.navigateByUrl("/pslphome/home-page")
        }
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    // pslp_d_messaggio Info I13 - E' presente una politica A02 aperta con tipo progetto DID
    this.commonService.getMessaggioByCode("I13").then(messaggio => {
      this.messaggioIntestazione =  messaggio;
    });
    // pslp_d_messaggio Errore - E' presente una DID aperta
    this.commonService.getMessaggioByCode("E12").then(messaggio => {
      this.erroreE12 =  messaggio;
    });
    // pslp_d_messaggio Errore - E' presente una politica A02 aperta con tipo progetto DID
    this.commonService.getMessaggioByCode("E13").then(messaggio => {
      this.erroreE13 =  messaggio;
    });
    // pslp_d_messaggio Errore - Soggetto di età < 15 anni
    this.commonService.getMessaggioByCode("E14").then(messaggio => {
      this.erroreE14 =  messaggio;
    });
    // pslp_d_messaggio Errore - Soggetto non domiciliato in Piemonte
    this.commonService.getMessaggioByCode("E15").then(messaggio => {
      this.erroreE15 =  messaggio;
    });
    // pslp_d_messaggio Errore - Rapporti di lavoro in corso
    this.commonService.getMessaggioByCode("E16").then(messaggio => {
      this.erroreE16 =  messaggio;
    });
    // pslp_d_messaggio Errore - Comunicazioni obbligatorie non prese in carico
    this.commonService.getMessaggioByCode("E17").then(messaggio => {
      this.erroreE17 =  messaggio;
    });
    // pslp_d_messaggio Errore - DID sospesa
    this.commonService.getMessaggioByCode("E18").then(messaggio => {
      this.erroreE18 =  messaggio;
    });
    // pslp_d_messaggio Errore - Iscrizione collocamento mirato
    this.commonService.getMessaggioByCode("E27").then(messaggio => {
      this.erroreE27 =  messaggio;
    });


    // pslp_d_messaggio Errore - controllo stampa
    this.commonService.getMessaggioByCode("E30").then(messaggio => {
      this.erroreE30 =  messaggio;
    });
    //errore generico
    this.commonService.getMessaggioByCode("E33").then(messaggio => {
      this.erroreE33 =  messaggio;
    });

    const requestsMsg$ = [
      this.decodificaService.findParametro("MINORE_ETA_ESP_LAV"),
      this.decodificaService.findParametro("DATA_COM_ESP_LAV"),
      this.decodificaService.findParametro("GG_DID")
    ];

    forkJoin(requestsMsg$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0]?.esitoPositivo){
          this.minore = multiResponse[0].parametro.valoreParametro;
        }
        if (multiResponse[1]?.esitoPositivo){
          this.dataComunicazione = multiResponse[1].parametro.valoreParametro;
        }
        if (multiResponse[2]?.esitoPositivo){
          this.numeroGiorniDataInps = multiResponse[2].parametro.valoreParametro;
        }
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      },
      complete: () =>{
        this.caricaDati();
        this.spinner.hide();
      }
    });



  }


  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  navigateTo(url:string){
    this.router.navigateByUrl("/pslpfcweb/private/"+url);
  }
  navigateToInserireDid(){
    this.router.navigateByUrl("pslpfcweb/private/did/inserire-did");
  }

  caricaDati(){
    this.utente.cognome
    if(this.utente.idSilLavAnagrafica != null ){
      const requests$ = [
        this.didService.getUltimaDid(this.utente.idSilLavAnagrafica,this.utente.cfUtente),
        this.lavoratoreService.controlloRapportiLavoroAperti(this.utente.idSilLavAnagrafica),
        this.lavoratoreService.esistonoPattiDiAttivazione(this.utente.idSilLavAnagrafica),
        this.lavoratoreService.findSuntoLavoratore(this.utente.idSilLavAnagrafica),
        this.didService.controlliPreInserisciDid(this.utente.idSilLavAnagrafica)
      ];

      forkJoin(requests$).subscribe({
        next: (multiResponse: any[]) => {
          if (multiResponse[0]?.esitoPositivo && multiResponse[0].ultimaDid ){
            this.ultimaDid = multiResponse[0].ultimaDid;

            let tsDifference = this.dataOggi.getTime() - new Date(this.ultimaDid.dataDid).getTime();

            this.durataDissocupazione = Math.floor(tsDifference / (1000 * 60 * 60 * 24));

          }
          if (multiResponse[1]?.esitoPositivo){
            this.raportiLavoroAperti = multiResponse[1];
          }
          if (multiResponse[2]?.esitoPositivo){
            this.esistePattiAttivazione =  multiResponse[2].isPresentePattoAttivazione;
          }
          if (multiResponse[3]?.esitoPositivo){
            this.suntoLavoratore = multiResponse[3].suntoEsteso.sunto;
          }
          if (multiResponse[4]!= null){
            this.inserisciDidResponse = multiResponse[4];
          }
        },
        error: (err) => {
          this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
        },
        complete: () =>{
          this.controlloMessaggi();
          this.spinner.hide();
        }
      });

    }

  }

  formatareMessagio(msg: string){
    return msg.replace("{COGNOME}", this.utente?.cognome).replace("{NOME}", this.utente?.nome).replace("{CODICE FISCALE}", this.utente?.cfUtente);
  }

  onStampa(){
    //window.print();
    this.didService.controlliStampaDid(this.utente.idSilLavAnagrafica).subscribe({
      next:ris=>{
        if(ris.esitoPositivo){
          let did:FormInserisciDid={idSilLavSapDid:ris.lavSapDid.idSilLavSapDid,
            lavSapDid:{idSilLavSapDid:ris.lavSapDid.idSilLavSapDid}
          }
          this.didService.stampaAttestatoDisoccupazione(did).subscribe({
            next:(ris:any)=>{
              this.utilitiesService.downloadFileDaStampa(ris,'application/pdf',`stampa-did.pdf`)
              //FileSaver.saveAs(ris,`stampa-did.pdf`);
            }
          })
        }else{
          this.messaggioErroreStampa = this.erroreE30.testo;
        }
      },error:err=>{
        console.log(err)
      }
    })
  }

  controlloMessaggi(){
    let perTest = false;
    console.log(this.suntoLavoratore)
    let codStatoDid = this.suntoLavoratore?.codStatoDid?.toLocaleUpperCase();

    this.stampaDisabled = (codStatoDid == "I" || codStatoDid == "C") ? false : true;


    if(this.suntoLavoratore?.idRegioneDomic != "01" || perTest){
      this.messaggiList.push( this.formatareMessagio(this.erroreE15?.testo));
    }

    if(this.suntoLavoratore?.descrStatoDid?.toLocaleUpperCase() == "SOSPESA" || perTest){
      this.messaggiList.push(this.formatareMessagio(this.erroreE18?.testo));
    }
    if(this.suntoLavoratore?.descrStatoDid?.toLocaleUpperCase() == "APERTA" || perTest){
      this.messaggiList.push(this.formatareMessagio(this.erroreE12?.testo));
    }

    if(perTest){
      this.messaggiList.push(this.formatareMessagio(this.erroreE17?.testo));
    }

    if(this.raportiLavoroAperti?.listRapportiLavoroAperti.length > 0 || perTest){
      this.messaggiList.push(this.formatareMessagio(this.erroreE16.testo));
    }

    if((this.suntoLavoratore?.eta  != null && this.suntoLavoratore?.eta < Number(this.minore) )|| perTest){
      this.messaggiList.push(this.formatareMessagio(this.erroreE14.testo));
    }
    if(this.ultimaDid?.iscrizioneCollocamentoMirato){
      this.messaggiList.push(this.formatareMessagio(this.erroreE27.testo));
    }
    if(this.messaggiList.length ==  0 && !this.inserisciDidResponse.esitoPositivo){
      this.messaggiList.push(this.formatareMessagio(this.erroreE33.testo));
    }
    if(this.suntoLavoratore.flgStatoFinaleDid==null && this.suntoLavoratore.datatDid!=null){
      this.messaggiList=[]
      this.canInsert=false

    }

    if(this.messaggiList.length ==  0){
      this.areaTestoVisibile = false;
    }

  }



}
