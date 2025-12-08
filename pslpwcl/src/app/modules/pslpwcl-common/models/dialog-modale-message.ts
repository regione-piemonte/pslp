/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { ApiMessage } from './apiMessage';
import { TypeDialogMessage } from './type-dialog-message';

/**
 * Dialog modale message
 *
 *    tipo descrive varie opzioni previste
 *       SI/NO  -  ANNULLA/CONFERMA
 *    titolo = titolo della finestra modale
 *    messaggio  contenuto principale da visualizzare
 *    messaggioAggiuntivo  contenuto aggiuntivo
 */
export interface DialogModaleMessage {
  tipo: TypeDialogMessage;
  titolo: string;
  messaggio?: string;
  messaggioAggiuntivo?: string;
  size?: string;
  tipoTesto?: string;
  apiMessages?: ApiMessage[]
}
