/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { DialogModaleMessage } from '../../models/dialog-modale-message';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeDialogMessage } from '../../models/type-dialog-message';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  @Input() fromParent: DialogModaleMessage;

  testoBottoneAnnulla = 'No';
  testoBottoneConferma = 'Si';
  annullaPresente = true;
  @Input() callback: any;
  @Input() modal: any;
  @Input() flgAzioeneX: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.fromParent.tipo === TypeDialogMessage.Cancel) {
      this.testoBottoneConferma = 'ANNULLA';
    } else if (this.fromParent.tipo === TypeDialogMessage.Back) {
      this.testoBottoneConferma = 'INDIETRO';
    }

    if (this.fromParent.tipo === TypeDialogMessage.CancelOrConfirm || this.fromParent.tipo === TypeDialogMessage.Confirm) {
      this.testoBottoneAnnulla = 'ANNULLA';
      this.testoBottoneConferma = 'CONFERMA';
    } else  if (this.fromParent.tipo === TypeDialogMessage.BackOrContinue || this.fromParent.tipo === TypeDialogMessage.Continue) {
      this.testoBottoneAnnulla = 'INDIETRO';
      this.testoBottoneConferma = 'PROSEGUI';
    }
    this.annullaPresente = this.fromParent.tipo === TypeDialogMessage.CancelOrConfirm
      || this.fromParent.tipo === TypeDialogMessage.BackOrContinue
      || this.fromParent.tipo === TypeDialogMessage.YesOrNo;
    if (Utils.isNullOrUndefinedOrEmptyField(this.fromParent.messaggio)) {
      this.fromParent.messaggio = 'Sei sicuro di voler uscire?';
    }
    if (Utils.isNullOrUndefinedOrEmptyField(this.fromParent.messaggioAggiuntivo)) {
      this.fromParent.messaggioAggiuntivo = '';
    }

  }

    /**
   * Closes modal
   *
   */
    closeModal(sendData: string) {
      // this.activeModal.close(sendData);
      this.callback(this.modal, sendData);

    }


}
