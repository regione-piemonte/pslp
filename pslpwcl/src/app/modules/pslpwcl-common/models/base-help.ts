/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */

export enum TipoComponenteHelp {
  MESSAGGIO = 'MESSAGGIO',
  MANUALE = 'MANUALE',
  VIDEO = 'VIDEO'
}
export enum GruppoHelp {
  ASSISTENZA = 'ASSISTENZA',
  MANUALI = 'MANUALI',
  VIDEO = 'VIDEO TUTORIAL'
}
export interface ComponenteHelp {
  tipo: TipoComponenteHelp;
  gruppo: GruppoHelp;
  link: string;
  testo: string;
  titolo: string;
}


export interface BaseHelp {
    id?: string;
    titolo?: string;
    listaMessaggi?: Array<ComponenteHelp>;
    listaManuali?: Array<ComponenteHelp>;
    // listaVideo?: Array<MenuHelpVideo>;

  }
