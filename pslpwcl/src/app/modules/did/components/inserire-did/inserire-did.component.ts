/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { LogService } from 'src/app/services/log.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppUserService } from 'src/app/services/app-user.service';
import { Observable } from 'rxjs-compat';
import { ProfilingQuant, Studio, LavoratorePslpService , DecodificaPslpService, DidPslpService, CondizOccupazionale, PresenzaInItaliaMin, FormInserisciDid, InserisciDidResponse, SuntoLavoratore, LavoratoreResponse, FascicoloPslpService, SchedaAnagraficaProfessionale, TitoloDiStudio, TipoPatente, Decodifica, PslpMessaggio, MessaggioService } from 'src/app/modules/pslpapi';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { FormOrchestratore } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-inserire-did',
  templateUrl: './inserire-did.component.html',
  styleUrls: ['./inserire-did.component.scss']
})
export class InserireDidComponent implements OnInit {

  dataActualeInps:boolean = false;
  sezione = "DID";

  titoliStudio: Studio[] = [];
  titoliStudioFascicolo: TitoloDiStudio[] = [];

  patenti: Decodifica[];
  occupazioni: CondizOccupazionale[]=[];
  duratas: PresenzaInItaliaMin[]=[];
  profilingQuantitativo: ProfilingQuant;
  listaClasseoccupMin: any[];
  listaStatoOccupMin: any[];
  fascicolo:SchedaAnagraficaProfessionale;
  inserisciDidResponse: InserisciDidResponse; //controlli pre inserimento
  inserisciDidResponseOnchange: InserisciDidResponse; // on change data did
  suntoLavoratore: SuntoLavoratore;
  lavoratore: LavoratoreResponse;

  isCittadinoItaliano: boolean = true;
  selectedCittadinanza: PresenzaInItaliaMin;
  actualDate: Date = new Date();
  titoloErrore = "";
  messaggioErrore = ""
  msgErrore21: PslpMessaggio;
  msgConfermaC8: PslpMessaggio;
  form:FormGroup = this.fb.group({
    dataDid: [this.actualDate],

    titoloStudio: [null, Validators.required],
    occupazione: [null, Validators.required],
    durata: [null, Validators.required],

    componenti: [null, [Validators.required,Validators.min(1)]],
    radioFigli: [null, [Validators.required]],
    radioPatente: [null, [Validators.required]]
  });

  titoloStudioLavInserito:any;

  constructor(
    private fb:FormBuilder,
    private readonly appUserService:AppUserService,
    private promptModalService:PromptModalService,
    private decodificaService:DecodificaPslpService,
    private lavoratoreService:LavoratorePslpService,
    private messaggioService: MessaggioService,
    private logService:LogService,
    private didService: DidPslpService,
    private spinner: NgxSpinnerService,
    private router:Router,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {

    this.fascicolo=this.commonService.fascicoloActual
    this.titoliStudioFascicolo = this.fascicolo.informazioniCurriculari.percorsoFormativo.titoliDiStudio;
    this.patenti=this.fascicolo?.informazioniCurriculari?.patenti.filter(p=>p.special=="P");

    this.loadDecodifiche();
    this.messaggioService.findByCod("E21").subscribe(
      (r:any)=>this.msgErrore21=r.msg
    );
    this.messaggioService.findByCod("C8").subscribe(
      (r:any)=>this.msgConfermaC8=r.msg
    );
    this.lavoratoreService.findSuntoLavoratore(this.utente.idSilLavAnagrafica).subscribe({
      next: (res: any)=>{
        if (res?.esitoPositivo){
          this.suntoLavoratore = res?.suntoEsteso.sunto;
          if(this.suntoLavoratore.dataDidInps != null){
            this.actualDate = this.suntoLavoratore.dataDidInps;
            this.dataActualeInps = true;
          }
          this.loadOnChange();
        }
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, onInit`);
      },
      complete: () =>{
       //this.loadOnChange();
      }
    });
  }

  private loadOnChange(){
    let formInserisciDidOn: FormInserisciDid = {
      dataDid: this.actualDate,
      idSilLavAnagrafica: this.utente.idSilLavAnagrafica
    };
    if(this.utente.idSilLavAnagrafica != null ){
      const requests$ = [
        this.didService.controlliPreInserisciDid(this.utente.idSilLavAnagrafica),
        this.didService.onChangeDataDid(formInserisciDidOn),
        this.lavoratoreService.findLavoratore(this.utente.idSilLavAnagrafica),
        //this.fascicoloService.getDettaglioFascicolo(this.utente.idSilLavAnagrafica),
        this.didService.findTitoliStudioByIdLav(this.utente.idSilLavAnagrafica)
      ];
      forkJoin(requests$).subscribe({
        next: (multiResponse: any[]) => {
          if (multiResponse[0]?.esitoPositivo){
            this.inserisciDidResponse = multiResponse[0];
            this.profilingQuantitativo = this.inserisciDidResponse.profQuantitativo;
            this.initForm();
          }
          if (multiResponse[1]?.esitoPositivo){
            this.inserisciDidResponseOnchange = multiResponse[1];
          }
          if (multiResponse[2]?.esitoPositivo){
            this.lavoratore = multiResponse[2];
            if(this.lavoratore?.lavoratore?.silTCittadinanza?.id == "ITA"){
              this.selectedCittadinanza = this.duratas[0];
            }
          }
          /*if (multiResponse[3]?.esitoPositivo){
            this.fascicolo = multiResponse[3].fascicolo;
            this.titoliStudioFascicolo = this.fascicolo.informazioniCurriculari.percorsoFormativo.titoliDiStudio;
          }*/
          if(multiResponse[3]?.esitoPositivo){
            this.titoliStudio = multiResponse[3].list;

            this.titoliStudio = this.titoliStudio.map((titolo: Studio) =>{
              titolo.descr = titolo.descr.toUpperCase() + " - " + titolo.silTGradoStudio.dsSilTGradoStudio.toUpperCase();
              return titolo;
            });

            if(this.titoloStudioLavInserito){
              this.titoliStudio.push(this.titoloStudioLavInserito.silTStudio);
              this.form.get("titoloStudio").patchValue(this.titoliStudio.find(ti=>ti.id==this.titoloStudioLavInserito.silTStudio.id));
              //this.form.get("titoloStudio").setValue(this.titoloStudioLavInserito.silTStudio);
            }
          }
        },
        error: (err) => {
          this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
        },
        complete: () =>{
          this.spinner.hide();
        }
      });

    }
  }

  private loadDecodifiche(){
    let requests$: any[] = [];

    requests$.push(this.didService.findAllCondizioneOccupazionale());
    requests$.push(this.didService.findAllDurataPresenzaItalia());
    requests$.push(this.decodificaService.findDecodificaByTipo("stato-occup-min"));
    requests$.push(this.decodificaService.findDecodificaByTipo("classe-occup-min"));
    Observable.forkJoin(requests$)
     .subscribe({
      next: (multiResponse: any[]) => {
        multiResponse.forEach((singleRes,index) => {
          if(singleRes.esitoPositivo){
            if(index === 0)
              this.occupazioni = singleRes.list.map((dato: any) => {
                dato.descr = dato.descr.toUpperCase();
                return dato;
              });
            else if(index === 1)
              this.duratas = singleRes.list.map((dato: any) => {
                dato.descr = dato.descr.toUpperCase();
                return dato;
              });
            else if(index === 2)
              this.listaClasseoccupMin = singleRes.list;
            else if(index === 3)
              this.listaStatoOccupMin = singleRes.list;

          }else{
            // this.alertMessageService.setApiMessages(singleRes.apiMessages);
          }
          this.spinner.hide();
        });

        // this.patchValueInForm(flgArrivoDaModale);
        // if(!flgArrivoDaModale)
        //   this.findOccupMin();

      },
      error: (err) => {
        this.logService.error(JSON.stringify(err),`${this.constructor.name}, loadDecodifiche`);
        this.spinner.hide();
      }
     });
  }

  private initForm() {
    if(this.patenti.length === 0 ){
      this.profilingQuantitativo.flgPatente = 'N';
      this.form.get('radioPatente').patchValue(this.profilingQuantitativo.flgPatente);
    }else{
      this.profilingQuantitativo.flgPatente = 'S';
      this.form.get('radioPatente').patchValue(this.profilingQuantitativo.flgPatente);
      this.form.get('radioPatente').disable();
    }
    this.form.markAsUntouched()
  }

  onClickReset(){
    this.form.reset();
  }

  async onClickOpenModalTitoloStudio() {
    const res = await this.promptModalService.openTitoloStudio("Inserire titolo di studio idoneo per il profiling quantitativo", this.suntoLavoratore);
    if(res){
      this.titoloStudioLavInserito = res;
      this.loadOnChange();
      // this.loadDecodifiche(true);
    }
    // this.spinner.hide();
  }
  async onClickOpenModalInserisciPatente() {
    const res = await this.promptModalService.openPatente("Inserire patente idonea per il profiling quantitativo", "Patente", true);
    if(res){
      //console.log(res)

      this.profilingQuantitativo.flgPatente = 'S';
      this.patenti.push(res)
      this.form.get('radioPatente').patchValue(this.profilingQuantitativo.flgPatente);
      this.form.get('radioPatente').disable();
    }
    // this.spinner.hide();
  }

  async onClickOpenModalInserisciPatentino() {
    const res = await this.promptModalService.openPatente("Inserire patentino idoneo per il profiling quantitativo","Patentino");
    if(res){
      this.profilingQuantitativo.flgPatente = 'S';
      this.form.get('radioPatente').patchValue(this.profilingQuantitativo.flgPatente);
      this.form.get('radioPatente').disable();
    }
    // this.spinner.hide();
  }

  async onClickInserisciDid(){
    //Si vuole procedere con l'inserimento DID per il cittadino  {COGNOME}  {NOME}  ({CODICE FISCALE} ) ?
    const msg = this.msgConfermaC8.testo.replace("{COGNOME}",this.utente.cognome).replace("{NOME}",this.utente.nome).replace("{CODICE FISCALE}",this.utente.cfUtente);
    //`Si vuole procedere con l'inserimento DID per il cittadino ${this.utente.nome} ${this.utente.cognome} (${this.utente.cfUtente} ) ?`;
    const data: DialogModaleMessage = {
      titolo: "Inserisci e conferma DID",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.salvaDid();
    }

  }
  onClickAnnulla() {
    this.router.navigateByUrl('pslpfcweb/private/did/riepilogo-did');
  }
  salvaDid(){

    const objectForm = this.form.getRawValue();
    if(this.profilingQuantitativo != null){
      if(this.profilingQuantitativo?.numCompFamiglia == null) this.profilingQuantitativo.numCompFamiglia = Number(objectForm.componenti);
      if(this.profilingQuantitativo?.flgFigliACarico == null) this.profilingQuantitativo.flgFigliACarico = objectForm.radioFigli;
      if(this.profilingQuantitativo?.flgPatente == null) this.profilingQuantitativo.flgPatente = objectForm.radioPatente;
      if(this.profilingQuantitativo?.silTPresenzaInItaliaMin == null) this.profilingQuantitativo.silTPresenzaInItaliaMin = objectForm.durata;
      if(this.profilingQuantitativo?.silTCondizOccupazionale == null) this.profilingQuantitativo.silTCondizOccupazionale = objectForm.occupazione;
      if(this.profilingQuantitativo?.silTStudio == null) this.profilingQuantitativo.silTStudio = objectForm.titoloStudio;
    }

    let formInserisciDid: FormInserisciDid = {
      dataDid: this.actualDate,
      dataDidForzataDaDidINPS: this.dataActualeInps,
      possessoPatente: objectForm.radioPatente,
      presenzaDiFigliACarico: objectForm.radioFigli,
      numeroComponentiNucleoFamiliare: Number(objectForm.componenti),
      durataPresenzaInItalia:objectForm.durata,
      idSilLavAnagrafica: this.utente.idSilLavAnagrafica,
      condizOccupazionale: objectForm.occupazione,
      profilingQuantitativo: this.profilingQuantitativo,
      lavTitoloStudio: objectForm.titoloStudio,
      abilitaDataPresuntoLicenziamento:false,
      dataAnzianita: objectForm.dataDid,
      statoOccupazionale: this.inserisciDidResponseOnchange.listStatoOccupazionale[0]
    }

    this.spinner.show()
    this.didService.salvaDid(formInserisciDid).subscribe({
      next:(res) => {
        if (res?.esitoPositivo) {
          const data: DialogModaleMessage = {
            titolo: "Inserisci e conferma DID",
            tipo: TypeDialogMessage.Confirm,
            messaggio: "DID inserita con successo",
            messaggioAggiuntivo: "",
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data);
          this.initForm();
          this.router.navigateByUrl('pslpfcweb/private/did/riepilogo-did');
        }else{
          if(res.apiMessages[0]?.code == "103015"){
            const formOrchestratore:FormOrchestratore = {
              codiceFiscaleLavoratore: this.utente.cfUtente,
              idSilLavAnagrafica:this.utente.idSilLavAnagrafica
            }
            this.spinner.show()
            this.didService.sendSapSilp(formOrchestratore).subscribe({
              next:(res:any) => {
                if (res?.esitoPositivo) {
                  this.didService.salvaDid(formInserisciDid).subscribe({
                    next:(res) => {
                      if (res?.esitoPositivo) {

                        //per riuscire a stampare nel caso sia appena fatto l'inserimento DID
                        this.didService.riceviSap(formOrchestratore).subscribe({
                          next:(res)  => {
                            console.log(res);
                            const data: DialogModaleMessage = {
                              titolo: "Inserisci e conferma DID",
                              tipo: TypeDialogMessage.Confirm,
                              messaggio: "DID inserita con successo",
                              messaggioAggiuntivo: "",
                              size: "lg",
                              tipoTesto: TYPE_ALERT.SUCCESS
                            };
                            this.promptModalService.openModaleConfirm(data);
                            this.initForm();
                            this.spinner.hide()
                            this.router.navigateByUrl('pslpfcweb/private/did/riepilogo-did');

                          }
                        });


                      }else{
                        const data: DialogModaleMessage = {
                          titolo: "Errore",
                          tipo: TypeDialogMessage.Confirm,
                          messaggio: this.msgErrore21.testo,
                          messaggioAggiuntivo: "",
                          size: "lg",
                          tipoTesto: TYPE_ALERT.ERROR
                        };
                        this.promptModalService.openModaleConfirm(data);

                        this.messaggioErrore = this.msgErrore21.testo;
                        this.titoloErrore = res.apiMessages[0].title;
                      }
                    }
                  });
                }else{
                  const data: DialogModaleMessage = {
                    titolo: "Errore",
                    tipo: TypeDialogMessage.Confirm,
                    messaggio: this.msgErrore21.testo,
                    messaggioAggiuntivo: "",
                    size: "lg",
                    tipoTesto: TYPE_ALERT.ERROR
                  };
                  this.promptModalService.openModaleConfirm(data);

                  this.messaggioErrore = this.msgErrore21.testo;
                  this.titoloErrore = res.apiMessages[0].title;
                }
              }
          });
          }else{
            const data: DialogModaleMessage = {
              titolo: "Inserisci e conferma DID",
              tipo: TypeDialogMessage.Confirm,
              messaggio: res.apiMessages[0].message,
              messaggioAggiuntivo: "",
              size: "lg",
              tipoTesto: TYPE_ALERT.ERROR
            };
            this.promptModalService.openModaleConfirm(data);

            this.messaggioErrore = res.apiMessages[0].message;
            this.titoloErrore = res.apiMessages[0].title;
          }
          this.spinner.hide()
        }
      },
      error: (err) => {
        this.logService.log(this.constructor.name, "Errore salvaDid");
      },
      complete: () => {

      }
    });


  }


  get provinciaDomicilio(){
    let provincia = this.inserisciDidResponse?.profQuantitativo?.silLavAnagrafica?.comuneDomicilio?.silTProvincia?.descr;
    return provincia;
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  transformOptionLabel(label: string): string {
    return label.toUpperCase();
  }
}
