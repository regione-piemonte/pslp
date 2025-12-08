/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { AppUserService } from 'src/app/services/app-user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';
import { Utente, UtenteService, LavoratorePslpService } from 'src/app/modules/pslpapi';
import { UserInfo } from 'src/app/modules/pslpwcl-common/models/userInfo';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message'; 
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';


@Component({
  selector: 'pslpwcl-riepilogo-privacy',
  templateUrl: './riepilogo-privacy.component.html',
  styleUrls: ['./riepilogo-privacy.component.scss']
})
export class RiepilogoPrivacyComponent implements OnInit {

  messaggioUtente: string = "";
  loadedRiepilogo: boolean = true;
  hasUtente= false;

  constructor(
    private readonly logService: LogService,
    private readonly utenteService: UtenteService,
    private readonly appUserService:AppUserService,
    private readonly spidUserService: SpidUserService,
    private readonly router: Router,
    private readonly lavoratoreService: LavoratorePslpService,
    private promptModalService:PromptModalService,
  ) {
    this.spidUserService.userUpdate.subscribe(
      r=>{
        if(r){
          this.hasUtente=true;
          
          this.utenteService.self().subscribe({
            next: (res: any) =>{
              this.logService.info(this.constructor.name,'risposta positiva');
              this.logService.info(this.constructor.name,res);
              if(res.esitoPositivo){
                let utente:Utente = res.utente;
              }
              
            },
            error: (err) =>{
             this.logService.error(this.constructor.name,`findFunzione: ${this.constructor.name}: ${JSON.stringify(err)}`)
            },
            complete: () =>{
            //  this.spinner.hide();
            }
          })
        }else{
          if(!sessionStorage.getItem("utentelogato")){
            this.hasUtente=false;
            sessionStorage.setItem("utentelogato",'true');
            window.location.reload();
          }else{
            this.utenteService.self().subscribe({
              next: (res: any) => {
                if (res.esitoPositivo) {
                  if (res.utente.ruoli.length > 1 && !this.ruoloUtente) {
      
                    this.router.navigateByUrl('/pslphome/scelta-ruolo');
                  } else if(res.utente.ruoli.length == 1 && res.utente.ruoli[0].nomeRuolo=="Cittadino"){
                    this.appUserService.setRuolo(res.utente.ruoli[0])
                  }
                  let utente: Utente = res.utente;
                  this.appUserService.setUtente(utente);
      
                  let userInfo: UserInfo = {
                    nome: utente.nome,
                    cognome: utente.cognome,
                    codFisc: utente.cfUtente,
                    ente: utente.cfUtente,
                    livAuth: 1,
                    community: '',
                  };
      
                  this.spidUserService.setUser(userInfo);
                  if(utente.idSilLavAnagrafica){
                    this.lavoratoreService.findSuntoLavoratore(utente.idSilLavAnagrafica).subscribe({
                      next:ris=>{
                        if(ris.esitoPositivo){
                            this.appUserService.setSuntoLavoratore(ris.suntoEsteso.sunto)
                          }
                      }
                    })
                  }
                }else{
                  const data: DialogModaleMessage = {
                    titolo: "Altre informazioni",
                    tipo: TypeDialogMessage.Back,
                    messaggio: res.apiMessages[0].message,
                    messaggioAggiuntivo: " ",
                    size: "lg",
                    tipoTesto: TYPE_ALERT.ERROR
                  };
                  this.promptModalService.openModaleConfirm(data);
                }
                //this.logService.info("prova", res.esitoPositivo,this.elencoCard)
              },
              error: (err) => {
                this.logService.error(
                  this.constructor.name,
                  `fake login: ${this.constructor.name}: ${JSON.stringify(err)}`
                );
              },
              complete: () => {
                //  this.spinner.hide();
              },
            });
          }

        }
      }
    )
  }

  ngOnInit(): void {
    
    //this.decreaseLoading();
  }

  get nomeUtente() {
    return this.hasUtente
      ? `${this.spidUserService.getUser().nome} - ${
          this.spidUserService.getUser().cognome
        }`
      : 'Nome utente';
  }

  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato().nomeRuolo
      : '';
  }

  async decreaseLoading() {
    //const userMessage = await this.utilitiesService.getMessage('MI001');
    //this.messaggioUtente = userMessage;
    //this.logService.info(this.constructor.name, this.messaggioUtente);
  }


  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }


}
