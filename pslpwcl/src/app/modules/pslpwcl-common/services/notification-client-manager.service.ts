/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, interval } from 'rxjs';
import { NotificaResponse, NotificaWebRidotta, NotifichePslpService, RicercaNotificheResponse, Utente } from '../../pslpapi';

import { catchError, distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AppUserService } from 'src/app/services/app-user.service';
import { NOTIFICHE } from 'src/app/constants';
import { PaginationDataChange } from '../models/pagination-data-change';
import { LogService } from 'src/app/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationClientManagerService {

  private notificaWebRidotta: NotificaWebRidotta[] = [];

  private notificationsSubject = new BehaviorSubject<NotificaWebRidotta[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  private destroy$ = new Subject<void>();

  utente: Utente;

  idSilLavAnagrafica: number;
  currentPaginationData: PaginationDataChange = {limit: 50, page: 0, offset: 0, sort: {column: '0', direction: 'desc'}};

  private pagedResponseSubject = new BehaviorSubject<RicercaNotificheResponse>({ list: [] });
  pagedResponse$ = this.pagedResponseSubject.asObservable();
  stato: string;

  constructor(
    private notifichePslpService: NotifichePslpService,
    private appUserService: AppUserService,
    private logService: LogService
  ) {
    this.subscribeToUtente();
  }

  private subscribeToUtente(): void {
    this.appUserService.idSilLavAnagraficaSubject.pipe(
      distinctUntilChanged(),
      switchMap((idSilLavAnagrafica: number) => {
        this.idSilLavAnagrafica = idSilLavAnagrafica;
        if (!this.idSilLavAnagrafica) 
          return EMPTY;
        
        return this.startPolling(this.idSilLavAnagrafica);
      }),
      takeUntil(this.destroy$) 
    ).subscribe();
  }


  private startPolling(idSilLavAnagrafica: number): Observable<RicercaNotificheResponse> {
    return interval(NOTIFICHE.TIME_UPDATE).pipe(
      startWith(0), 
      switchMap(() => this.fetchUnreadNotifications(idSilLavAnagrafica))
    );
  }


  private fetchUnreadNotifications(idSilLavAnagrafica: number): Observable<RicercaNotificheResponse> {
   
    return this.notifichePslpService.notifichePullNotify(idSilLavAnagrafica).pipe(
      tap((response: RicercaNotificheResponse) => { 
        if (response && response.esitoPositivo) {
          const newNotifications = response.list || [];
          const newCount = response.countNotifiche || 0;
  
          this.notificaWebRidotta = newNotifications;
          this.notificationsSubject.next(this.notificaWebRidotta);
          this.unreadCountSubject.next(newCount);
        } else {
          //console.error('Errore nel recupero notifiche:', response.apiMessages);
        }
      }),catchError((error: any) => {
        console.error('Errore chiamata notifiche:', error);
        return EMPTY; 
      })
    );
  }

  refreshNotifications(): void {
    if (this.idSilLavAnagrafica) {
      this.fetchUnreadNotifications(this.idSilLavAnagrafica).subscribe();
    }
  }

  aggiornaNotifica(idSilwebNotiWeb: number, operazioneDaEseguire?: string): Observable<NotificaWebRidotta | null> {
    return this.notifichePslpService.aggiornaNotifica(idSilwebNotiWeb, operazioneDaEseguire).pipe(
      map((response: NotificaResponse) => {
        if (response?.esitoPositivo && response.NotificaWebRidotta) {
          return response.NotificaWebRidotta;
        }
        return null;
      })
    );
  }

  rimuoviNotificaDallaLista(idSilwebNotiWeb: number): void {
    this.notificaWebRidotta = this.notificaWebRidotta.filter(
      notifica => notifica.idSilwebNotiWeb !== idSilwebNotiWeb
    );
    this.notificationsSubject.next(this.notificaWebRidotta);
    this.unreadCountSubject.next(Math.max(this.unreadCountSubject.value - 1, 0));
  }

  aggiornaNotificaNellaLista(notificaAggiornata: NotificaWebRidotta): void {
    let dcrementCounter = false;
  
    this.notificaWebRidotta = this.notificaWebRidotta.map(notifica => {
      if (notifica.idSilwebNotiWeb === notificaAggiornata.idSilwebNotiWeb) {
        if (notifica.dataLettura === null && notificaAggiornata.dataLettura !== null) {
          dcrementCounter = true;
        }
        return notificaAggiornata;
      }
      return notifica;
    });
  
    this.notificationsSubject.next(this.notificaWebRidotta);
  
    if (dcrementCounter) {
      this.decrementUnreadCount(1);
    }
  }
  
  

  incrementUnreadCount(increment: number = 1): void {
    const currentCount = this.unreadCountSubject.value;
    this.unreadCountSubject.next(currentCount + increment);
  }
  
  
  decrementUnreadCount(decrement: number = 1): void {
    const currentCount = this.unreadCountSubject.value;
    const newCount = Math.max(currentCount - decrement, 0); 
    this.unreadCountSubject.next(newCount);
  }
  
  
  resetUnreadCount(): void {
    this.unreadCountSubject.next(0);
  }

  effettuaRicerca(stato?:string) {
    this.stato = stato || 'T'
    this.notifichePslpService.notificheRicerca(this.idSilLavAnagrafica,this.currentPaginationData.page, stato, this.currentPaginationData.limit).subscribe({
      next: (res: any) => {
        this.currentPaginationData
        this.pagedResponseSubject.next(res);
      },
      error: (error) => {
        this.logService.error(this.constructor.name, `errore: ${error}`);
      }
    });
  }
  
}

