/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { DialogModaleMessage } from '../models/dialog-modale-message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogModaleComponent } from '../components/dialog-modale/dialog-modale.component';

@Injectable({
  providedIn: 'root'
})
export class PlspshareService {

  constructor(
    private modalService: NgbModal
  ) { }

  public openModal(data: DialogModaleMessage): Promise<any> {
    const modalRef = this.modalService.open(DialogModaleComponent, {
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.fromParent = data;
    return modalRef.result;
  }


//   public openNewModal(mess: DialogModaleMessage): string {

//     let result = "";
//     this.ref = this.dialogService.open(NewDialogComponent, {
//         header: mess.titolo,
//         width: '70%',
//         contentStyle: {"max-height": "500px", "overflow": "auto"},
//         baseZIndex: 10000,

//         data: {dialogModaleMessage: mess}
//     });

//     this.ref.onClose.subscribe((risposta: string) => {
//         if (risposta) {
//             result = risposta;
//         }
//     });
//     return result;
// }

// public openListModal(data: ListModaleMessage): Promise<any> {
//   const modalRef = this.modalService.open(ListModaleComponent, {
//     keyboard: false,
//     backdrop: 'static'
//   });
//   modalRef.componentInstance.fromParent = data;
//   return modalRef.result;
// }

// public openAggiungiS(data: ListModaleMessage): Promise<any> {
//   const modalRef = this.modalService.open(ListModaleComponent, {
//     keyboard: false,
//     backdrop: 'static'
//   });
//   modalRef.componentInstance.fromParent = data;
//   return modalRef.result;
// }

// public richiestaFinestraModale(data: DialogModaleMessage): Promise<any> {
//   return this.openModal(data);
// }

// apriModale(messaggio: string, messaggioAggiuntivo: string, titoloPagina: string, tipo: TypeDialogMessage) {
//   const data: DialogModaleMessage = {
//     titolo: titoloPagina,
//     tipo: tipo,
//     messaggio: messaggio,
//     messaggioAggiuntivo: messaggioAggiuntivo
//   };
//   return this.richiestaFinestraModale(data);
// }


}
