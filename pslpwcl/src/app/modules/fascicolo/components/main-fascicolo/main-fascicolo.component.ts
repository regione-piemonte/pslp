/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TYPE_ALERT } from 'src/app/constants';
import { PslpMessaggio, MessaggioService, Privacy, PrivacyService } from 'src/app/modules/pslpapi';
import { PingService } from 'src/app/modules/pslpapi/api/ping.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'pslpwcl-main-fascicolo',
  templateUrl: './main-fascicolo.component.html',
  styleUrls: ['./main-fascicolo.component.scss']
})
export class MainFascicoloComponent implements OnInit ,OnDestroy{
  sezione = "Fascicolo";
  loaded = false;
  elencoPrivacyUtente: Privacy[];

  private readonly subscriptions = [] as Array<Subscription>;



  constructor(
    private readonly utilitiesService:UtilitiesService,
    private router: Router,
    private readonly appUserService:AppUserService,
    private messaggioService:MessaggioService,
    private logService: LogService,
    private privacyService:PrivacyService,
    private promptModalService:PromptModalService
  ) {

    //if(!appUserService.getUtenteOperateFor()){
      this.privacyService.privacyUtenteCollegato(this.utente.idUtente).subscribe(
        {
          next: async (res: any) =>{
            if(res.esitoPositivo)
              this.elencoPrivacyUtente = res.utentePrivacy;
            console.log(this.elencoPrivacyUtente);
            console.log(res.utentePrivacy);
              let chkPrivacy=false
              res.utentePrivacy.forEach((privacy:any)=>{
                if(((!!privacy?.pslpTUtente1 || !!privacy?.pslpTUtente2) && (privacy.pslpDPrivacy && privacy.pslpDPrivacy.codPrivacy=="PRV"))){
                chkPrivacy=true
                }
              })
              if(!chkPrivacy)
                {
                  const data: DialogModaleMessage = {
                  titolo: "Gestione Fascicolo",
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

  messaggio: PslpMessaggio

  ngOnInit() {
    //this.utilitiesService.showSpinner();
    this.messaggioService.findByCod("I4").subscribe(
      (r:any)=>this.messaggio=r.msg
    )
   /* this.messaggio = {
      intestazione: "Da recuperare da DB",
      testo: "Da recuperare da DB"
    }*/
  }

  /**
   * on destroy
   */
  ngOnDestroy() {
    // this.subscriptions.forEach(s => s.unsubscribe());
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  navigateTo(url:string){
    this.router.navigateByUrl("/pslpfcweb/private/"+url);
  }
  get miniTitolo(){
    return "Fascicolo";
  }


}
