/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.LavoratoreApi;
import it.csi.pslp.pslpbff.api.NotificheApi;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.PslpConstants;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@ApplicationScoped
public class NotificheApiServiceImpl extends BaseApiServiceImpl implements NotificheApi {

    @Inject SilpapiManager silpapiManager;


    @Override
    public Response notifichePullNotify(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.pullNotify(idSilLavAnagrafica));
    }

    @Override
    public Response notificheRicerca(Long idSilLavAnagrafica, String stato, int page, int recForPage, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.ricercaNotify(idSilLavAnagrafica,stato, page, recForPage));
    }

    @Override
    public Response aggiornaNotifica(Long idSilwebNotiWeb, String operazioneDaEseguire, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.aggiornaNotifica(idSilwebNotiWeb, operazioneDaEseguire));
    }
}
