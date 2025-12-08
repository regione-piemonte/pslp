/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
/*
* SPDX-FileCopyrightText: Copyright 2019 - 2022 | CSI Piemonte
* SPDX-License-Identifier: EUPL-1.2
*/


export interface SidebarModule {
  code: string;
  routerUrl: string[];
  urlSubpaths: string[];
  i18n: string;
  isHome?: boolean;
  ignore?: boolean;
}

export const POSSIBLE_SIDEBAR_MODULES: SidebarModule[] = [
  { code: '', routerUrl: ['/home'], urlSubpaths: ['/home'], i18n: 'home', isHome: true },
  { code: 'INT', routerUrl: ['/int'], urlSubpaths: ['/int'], i18n: '' }
];
