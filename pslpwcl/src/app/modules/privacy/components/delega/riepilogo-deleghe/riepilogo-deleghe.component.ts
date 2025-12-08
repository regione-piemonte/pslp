/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import {Delega, DelegaService, PrivacyService, PslpMessaggio, Utente } from 'src/app/modules/pslpapi';
import { Component, OnInit } from '@angular/core';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import {TooltipModule} from 'primeng/tooltip';


@Component({
  selector: 'pslpwcl-riepilogo-deleghe',
  templateUrl: './riepilogo-deleghe.component.html',
  styleUrls: ['./riepilogo-deleghe.component.scss']
})
export class RiepilogoDelegheComponent implements OnInit {


  delegheDelegatiFiltered: BehaviorSubject<Delega[]> = new BehaviorSubject([]);
  delegheDelegati: Delega[] = [];
  loadingDelegheDelegati = true;
  activeDelegheDelegati = false;
  idUtente!:number
  delegheDelegantiFiltered: BehaviorSubject<Delega[]> = new BehaviorSubject([]);
  delegheDeleganti: Delega[] = [];
  loadingDelegheDeleganti = true;
  activeDelegheDeleganti = false;

  utenteDelegatoAtt:Utente = null;
  messaggioConfermaEliminaDelega:PslpMessaggio;
  messagioEliminazione: PslpMessaggio;
  


  msgModale:string=""

  constructor(
    private privacyService: PrivacyService,
    private delegaService: DelegaService,
    private readonly appUserService:AppUserService,
    private logService:LogService,
    private router:Router,
    private commonService:CommonService,

    private spinner: NgxSpinnerService,


    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private promptModalService:PromptModalService
  ) { }

  ngOnInit(): void {

    // pslp_d_messaggio Conferma di Eliminazione delega
    this.commonService.getMessaggioByCode("C1").then(messaggio => {
      this.messaggioConfermaEliminaDelega = messaggio;
    });
    // pslp_d_messaggio Conferma operare per delegante
    this.commonService.getMessaggioByCode("C2").then(messaggio => {
      this.msgModale =  messaggio.testo;
    });
    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    //1 delegato ; 2 delegante
    this.utenteDelegatoAtt = this.appUserService.getUtenteOperateFor();
    this.idUtente = this.appUserService.getIdUtente();

    this.delegaService.findDelegheByDelegate(this.idUtente).subscribe(
      {
        next: (res: any) =>{

          if(res.esitoPositivo){
            this.delegheDelegati = res.delega.filter((de:Delega)=> de.pslpTUtente2.idUtente != this.utenteDelegatoAtt?.idUtente);
            this.delegheDelegatiFiltered.next(this.delegheDelegati);
          }

        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`fake login: ${this.constructor.name}: ${JSON.stringify(err)}`)
        },
        complete: () =>{
          this.loadingDelegheDelegati = false;

        }
      }
    );

    this.delegaService.findDelegheByDelegante(this.idUtente).subscribe(
      {
        next: (res: any) =>{

          if(res.esitoPositivo){
            this.delegheDeleganti = res.delega;
            this.delegheDelegantiFiltered.next(this.delegheDeleganti);
          }

        },
        error: (err) =>{
          this.logService.error(this.constructor.name,`fake login: ${this.constructor.name}: ${JSON.stringify(err)}`)
        },
        complete: () =>{
          this.loadingDelegheDeleganti = false;

        }
      }
    );

  }


  filter(isDeleghe: boolean, isActive: boolean){
    if(isDeleghe){
      this.delegheDelegatiFiltered.next(
        isActive ?this.delegheDelegati.filter(d=>!(new Date(d.dFine).getTime() <= new Date().getTime())):this.delegheDelegati);
    }else{
      this.delegheDelegantiFiltered.next(
        isActive ?this.delegheDeleganti.filter(d=>!(new Date(d.dFine).getTime() <= new Date().getTime())):this.delegheDeleganti);
    }
  }

  viewDelega(delega:Delega){

    this.commonService.delegaActual = delega;
    this.router.navigateByUrl("/pslpfcweb/private/deleghe/presentazione-deleghe");
  }
  async deleteDelega(delega:Delega, perCuiPossoOperare:boolean = false){
    

    const data: DialogModaleMessage = {
      titolo: this.messaggioConfermaEliminaDelega.descrMessaggio,
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: this.messaggioConfermaEliminaDelega.testo,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      
      this.delegaService.cancellaDelega(delega.idDelega).subscribe({
        next: (r:any)=> {
          if(r.esitoPositivo){
            if(perCuiPossoOperare){
              this.delegheDelegati.splice(this.delegheDelegati.indexOf(delega),1);
              this.delegheDelegatiFiltered.next(this.delegheDelegati);
            }
            else {
              this.delegheDeleganti.splice(this.delegheDeleganti.indexOf(delega),1);
              this.delegheDelegantiFiltered.next(this.delegheDeleganti);
            }
            this.messageService.add({severity:'info', summary:'Conferma', detail:this.messagioEliminazione.testo});
          } else {
            this.logService.error(this.constructor.name,"Si è verificato un errore durante l\'eliminazione ")
            this.messageService.add({severity:'Error', summary:'Errore', detail:'Si è verificato un errore durante l\'eliminazione'});
          }
        },
        error: (err:any) =>{
          this.logService.error(this.constructor.name,"Si è verificato un errore durante l\'eliminazione ")
          this.messageService.add({severity:'Error', summary:'Errore', detail:'Si è verificato un errore durante l\'eliminazione'});

        },
        complete: () =>{
          this.loadingDelegheDeleganti = false;

        }
      })
    }
  }

  attivaDelega(delega:Delega){
    this.confirmationService.confirm({
      message: 'Vuoi attivare la delega?',
      header: 'Conferma',
      icon: 'pi pi-info-circle',
      acceptLabel: "Conferma",
      rejectLabel: "Annulla",
      accept: () => {

        this.delegaService.attivaDelega(delega.idDelega).subscribe({
          next: (r:any)=> {
            if(r.esitoPositivo){

              this.messageService.add({severity:'info', summary:'Conferma', detail:'Delega attivata correttamente'});
            } else {
              this.logService.error(this.constructor.name,"Si è verificato un errore durante l\'attivazione ")
              this.messageService.add({severity:'Error', summary:'Errore', detail:'Si è verificato un errore durante l\'attivazione'});
            }
          },
          error: (err:any) =>{
            this.logService.error(this.constructor.name,"Si è verificato un errore durante l\'eliminazione ")
            this.messageService.add({severity:'Error', summary:'Errore', detail:'Si è verificato un errore durante l\'attivazione'});

          },
          complete: () =>{
            this.loadingDelegheDeleganti = false;

          }
        })


      },
      reject: (type:ConfirmEventType) => {
          this.messageService.add({severity:'info', summary:'Annulata', detail:'Attivazione delega annullata'});
          }
    });
  }

  addDelega(isMinore:boolean = false){
    this.privacyService.privacyUtenteCollegato(this.idUtente).subscribe(
      {
        next:async ris=>{
          if(ris.esitoPositivo){
            if(isMinore){
              let chkMinorePrv=ris.utentePrivacy.find(p=>{return p.pslpDPrivacy.codPrivacy=="PRV_MIN" && (!!p.pslpTUtente1 || !!p.pslpTUtente2) })
              if(!chkMinorePrv){
                const data: DialogModaleMessage = {
                  titolo: "Gestione Deleghe",
                  tipo: TypeDialogMessage.YesOrNo,
                  messaggio: "PRIVACY DA CONFERMARE PER MINORENNI</br></br> Scegliendo SI, "+
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
                  //this.router.navigateByUrl("/pslphome/home-page")
                  return
                }
              }else{
                this.commonService.isDelegaForMinore = isMinore;
                this.router.navigateByUrl("/pslpfcweb/private/deleghe/aggiungi-delega");
              }
            }else{
              let chkMaggiorenniPrv=ris.utentePrivacy.find(p=>{return p.pslpDPrivacy.codPrivacy=="PRV_MAG" && (!!p.pslpTUtente1 || !!p.pslpTUtente2) })
              if(!chkMaggiorenniPrv){
                const data: DialogModaleMessage = {
                  titolo: "Gestione Deleghe",
                  tipo: TypeDialogMessage.YesOrNo,
                  messaggio: "PRIVACY DA CONFERMARE PER MAGGIORENNI</br></br> Scegliendo SI, "+
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
                  //this.router.navigateByUrl("/pslphome/home-page")
                  return
                }
              }else{
                this.commonService.isDelegaForMinore = isMinore;
                this.router.navigateByUrl("/pslpfcweb/private/deleghe/aggiungi-delega");
              }
            }

          }

        }
      }
    )


  }
  async selezionaDelega(delega:Delega){
    const msg = `${this.msgModale}`;
    const data: DialogModaleMessage = {
      titolo: "Seleziona utente",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: " ",
      size: "lg",
      tipoTesto: TYPE_ALERT.INFO
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if(result=="SI"){
      this.operaPer(delega)
      this.router.navigateByUrl("/pslpfcweb/private/privacy/riepilogo-privacy")
    }
  }
  operaPer(delega:Delega){

    this.appUserService.setUtenteOperateFor(delega.pslpTUtente2);
  }

  mostraPrendereDelega(dFine: Date){
    return new Date(dFine).getTime() <= new Date().getTime();
  }

}
