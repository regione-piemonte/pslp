/*
* SPDX-FileCopyrightText: (C) Copyright 2025 Regione Piemonte
* SPDX-License-Identifier: EUPL-1.2
*/
export const environment = {
  production: false,
  ambiente: 'tu1-rp-01',
  shibbolethAuthentication: true,

  publicPath: 'https://tu-pslp.organizzazione.it',
  beServerPrefix: 'https://tu-pslp.organizzazione.it',
  beService: '/pslpbff',

  shibbolethSSOLogoutURL: 'https://tu-pslp.organizzazione.it/tu-pslp_443s_liv3_sispliv2spid_gasprp_lavoro/logout.do',
  userManualURL: 'http://dev-pslpbff-pa.organizzazione.it/UserManual/',

  appBaseHref: '/pslpwcl'
};
