/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
export enum AmbitoEnum {
  GG   = 'GG',
  RDC  = 'RDC',
  FASC = 'FASC',
  COMI = 'COMI',
  // le seguenti non esitono su db
  DID  = 'DID',
  ISCR = 'ISCR',
  // COLLOCAMENTO MIRATO CATEGORIA PROTETTA
  CMPRO = 'CMPRO',
  // COLLOCAMENTO MIRATO DISABILI
  CMDIS = 'CMDIS',

  // altri servizi
  PRENOTA_ALTRISERVIZI = 'PRENOTA_ALTRISERVIZI',

  // programma GOL
  GOL_DID = 'GOL_DID',
  GOL_CM = 'GOL_CM',
}
