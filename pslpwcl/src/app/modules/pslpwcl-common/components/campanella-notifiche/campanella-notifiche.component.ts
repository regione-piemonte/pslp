/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificaWebRidotta, Utente } from 'src/app/modules/pslpapi';
import { NotificationClientManagerService } from '../../services/notification-client-manager.service';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { PromptModalService } from '../../services/prompt-modal.service';
import { DialogModaleMessage } from '../../models/dialog-modale-message';
import { TypeDialogMessage } from '../../models/type-dialog-message';
import { NOTIFICHE, TYPE_ALERT } from 'src/app/constants';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'pslpwcl-campanella-notifiche',
  templateUrl: './campanella-notifiche.component.html',
  styleUrls: ['./campanella-notifiche.component.scss']
})
export class CampanellaNotificheComponent implements OnInit {

  notificaWebRidotta: NotificaWebRidotta[] = [];
  private canvasRef: NgbOffcanvasRef | null = null;
  constructor(
    private offcanvasService: NgbOffcanvas,
    private notificationClientManagerService: NotificationClientManagerService,
    private readonly router: Router,
    private promptModalService: PromptModalService,
    private spinner: NgxSpinnerService
    ) { }

  unreadCount: number = 1;
  utente: Utente;

  ngOnInit(): void {
    combineLatest([
      this.notificationClientManagerService.unreadCount$,
      this.notificationClientManagerService.notifications$
    ]).subscribe(([count, notificaWebRidotta]) => {
      this.unreadCount = count;
      this.notificaWebRidotta = notificaWebRidotta;
    });
   
  }

  openCanvas(content: TemplateRef<any>) {
    this.canvasRef = this.offcanvasService.open(content, { position: 'end' });

    this.canvasRef.result.finally(() => {
      this.canvasRef = null;
    });
	}

  async onClickEliminaNotifica(notifica: NotificaWebRidotta, event: Event) {
    event.stopImmediatePropagation();
  
    const data: DialogModaleMessage = {
      titolo: "Elimina notifica",
      tipo: TypeDialogMessage.CancelOrConfirm,
      messaggio: "Sei sicuro di voler eliminare questa notifica?",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
  
    const res = await this.promptModalService.openModaleConfirm(data);
    if (res !== 'SI') return;
  
    
    this.notificationClientManagerService.aggiornaNotifica(notifica.idSilwebNotiWeb, NOTIFICHE.AZIONE.ELIMINA)
      .subscribe(notificaAggiornata => {
        if (notificaAggiornata) {
          this.notificationClientManagerService.effettuaRicerca();
          this.spinner.hide();
          const notificationElement = document.getElementById(`notifica-${notifica.idSilwebNotiWeb}`);
          if (notificationElement) {
            
            notificationElement.classList.add('slide-out');
  
            setTimeout(() => {
              this.notificationClientManagerService.rimuoviNotificaDallaLista(notifica.idSilwebNotiWeb);
            }, 500); 
          }
        } else {
          //console.error('Errore: la notifica non è stata eliminata con successo.');
        }
      });
  }
  

  onClickNotifica(notifica: NotificaWebRidotta){
    const data: DialogModaleMessage = {
      titolo: notifica.oggSilwebTTipoNotiWeb,
      tipo: TypeDialogMessage.Confirm,
      messaggio: notifica.testoSilwebTTipoNotiWeb,
      size: "lg",
      tipoTesto: TYPE_ALERT.INFO
    };
  
    this.promptModalService.openModaleConfirm(data);
    if(notifica.dataLettura)
      return;
    this.notificationClientManagerService.aggiornaNotifica(notifica.idSilwebNotiWeb, NOTIFICHE.AZIONE.LETTURA)
    .subscribe(notificaAggiornata => {
      if (notificaAggiornata) {
        this.notificationClientManagerService.refreshNotifications();
        this.notificationClientManagerService.effettuaRicerca();
      } else {
        //console.error('Errore: la notifica non è stata eliminata Parappapà.');
      }
    });
  }   

  onClickVediTutte(){
    this.router.navigateByUrl('/pslphome/ricerca-notifiche');
    this.canvasRef.close();
  }


}
