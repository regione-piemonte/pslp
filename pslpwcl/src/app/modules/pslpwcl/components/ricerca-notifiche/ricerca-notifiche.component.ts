/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { NOTIFICHE, TYPE_ALERT } from 'src/app/constants';
import { NotificaWebRidotta, RicercaNotificheResponse } from 'src/app/modules/pslpapi';
import { RicercaNotificheRequest } from 'src/app/modules/pslpapi/model/ricercaNotificheRequest';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { NotificationClientManagerService } from 'src/app/modules/pslpwcl-common/services/notification-client-manager.service';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'pslpwcl-ricerca-notifiche',
  templateUrl: './ricerca-notifiche.component.html',
  styleUrls: ['./ricerca-notifiche.component.scss']
})
export class RicercaNotificheComponent implements OnInit {

  @Input() title: string;
  @Input() callback: any;
  @Input() modal: any;

  ricercaPerInvio: RicercaNotificheRequest;

  pagedResponse: RicercaNotificheResponse;
  
  ricercaEffettuata = true;
  statoOptions = [
    { id: 'T', descr : 'Tutte le notifiche' },
    { id: 'L', descr: 'Letto' },
    { id: 'N', descr: 'Non letto' }
  ];
  
  selectedStato: string | null = 'T';

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }


  constructor(
    private readonly appUserService: AppUserService,
    private notificationClientManagerService: NotificationClientManagerService,
    private promptModalService: PromptModalService
  ) { }

  ngOnInit(): void {
  this.notificationClientManagerService.pagedResponse$.subscribe((pagedResponse: RicercaNotificheResponse) => this.pagedResponse = pagedResponse);
  this.effettuaRicerca();
  }

  effettuaRicerca() {
    this.notificationClientManagerService.effettuaRicerca(this.selectedStato);
  }

  onStatoChange() {
    this.effettuaRicerca();
  }

  onClickEliminaNotifica(notifica: NotificaWebRidotta, event: Event) {
  
    const data: DialogModaleMessage = {
      titolo: "Elimina notifica",
      tipo: TypeDialogMessage.CancelOrConfirm,
      messaggio: "Sei sicuro di voler eliminare questa notifica?",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
  
    this.promptModalService.openModaleConfirm(data).then(res => {
      if (res !== 'SI') return;
  
      this.notificationClientManagerService.aggiornaNotifica(notifica.idSilwebNotiWeb, NOTIFICHE.AZIONE.ELIMINA)
        .subscribe(notificaAggiornata => {
          if (notificaAggiornata) {
            this.pagedResponse.list = this.pagedResponse.list.filter(n => n.idSilwebNotiWeb !== notifica.idSilwebNotiWeb);
            setTimeout(() => {
              this.notificationClientManagerService.rimuoviNotificaDallaLista(notifica.idSilwebNotiWeb);
            }, 500); 
          } else {
            console.error('Errore: la notifica non è stata eliminata.');
          }
        });
    });
  }
  

  onClickNotifica(notifica: NotificaWebRidotta) {
    const data: DialogModaleMessage = {
      titolo: notifica.oggSilwebTTipoNotiWeb,
      tipo: TypeDialogMessage.Confirm,
      messaggio: notifica.testoSilwebTTipoNotiWeb,
      size: "lg",
      tipoTesto: TYPE_ALERT.INFO
    };
  
    this.promptModalService.openModaleConfirm(data);
  
    this.notificationClientManagerService.aggiornaNotifica(notifica.idSilwebNotiWeb, NOTIFICHE.AZIONE.LETTURA)
      .subscribe(notificaAggiornata => {
        if (notificaAggiornata) {
          this.pagedResponse.list = this.pagedResponse.list.filter(n => n.idSilwebNotiWeb !== notifica.idSilwebNotiWeb);
          this.notificationClientManagerService.refreshNotifications();
        } else {
          console.error('Errore: la notifica non è stata aggiornata.');
        }
      });
  }


}
