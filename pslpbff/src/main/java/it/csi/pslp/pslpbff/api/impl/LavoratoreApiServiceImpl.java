/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import it.csi.pslp.pslpbff.api.LavoratoreApi;
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
public class LavoratoreApiServiceImpl extends BaseApiServiceImpl implements LavoratoreApi {

    @Inject SilpapiManager silpapiManager;

    @Audited
    @Override
    public Response esistonoPattiDiAttivazione(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,silpapiManager.esistonoPattiDiAttivazione(idSilLavAnagrafica));
    }

    @Audited
    @Override
    public Response controlloRapportiLavoroAperti(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,silpapiManager.controlloRapportiLavoroAperti(idSilLavAnagrafica));
    }

    @Audited
    @Override
    public Response findLavoratore(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getAnagraficaLavFull(String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_ID,idSilLavAnagrafica)));
    }

    @Audited
    @Override
    public Response findLavoratoreByCodiceFiscale(String cf, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        //LavAnagrafica anagrafica = ;
        //AnagraficaLavSilpapiResponse result = new AnagraficaLavSilpapiResponse();
        //result.setAnagraficaLav(anagrafica);
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getAnagraficaLav(String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_CF,cf)));
    }

    @Audited
    @Override
    public Response findSuntoLavoratore(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findSuntoLavoratore(idSilLavAnagrafica));
    }
}
