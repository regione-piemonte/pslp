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
  selector: 'pslpwcl-dialog-modale',
  templateUrl: './dialog-modale.component.html',
  styleUrls: ['./dialog-modale.component.scss']
})
/**
 *  Componente che consente di visualizzare
 *  una finestra modale
 *
 *  con possibilità di indicare se si vogliono pulsanti SI/NO
 *     ANNULLA/CONFERMA   o solo CONFERMA
 * in base a cosa valorizzato in
 *  @input fromParent: DialogModaleMessage
 */
export class DialogModaleComponent implements OnInit {

  @Input() fromParent: DialogModaleMessage;
  testoBottoneAnnulla = 'No';
  testoBottoneConferma = 'Si';
  annullaPresente = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
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
    if (Utils.isNullOrUndefined(this.fromParent.messaggio)) {
      this.fromParent.messaggio = 'Sei sicuro di voler uscire?';
    }
    if (Utils.isNullOrUndefined(this.fromParent.messaggioAggiuntivo)) {
      this.fromParent.messaggioAggiuntivo = 'I dati modificati dall\'ultimo salvataggio andranno perduti.';
    }
  }

  /**
   * Closes modal
   *
   */
  closeModal(sendData: any) {
    this.activeModal.close(sendData);
  }

}
