/*
* SPDX-FileCopyrightText: (C) Copyright 2025 Regione Piemonte
* SPDX-License-Identifier: EUPL-1.2
*/
export const environment = {
  production: true,
  ambiente: 'production',
  shibbolethAuthentication: true,

  publicPath: 'https://pslp.organizzazione.it',
  beServerPrefix: 'https://pslp.organizzazione.it',
  beService: '/pslpbff',

  shibbolethSSOLogoutURL: 'https://pslp.organizzazione.it/pslp_443s_liv3_sispliv2spid_gasprp_lavoro/logout.do',
  userManualURL: 'http://pslpbff-pa.organizzazione.it/UserManual/',

  appBaseHref: '/pslpwcl'
};
