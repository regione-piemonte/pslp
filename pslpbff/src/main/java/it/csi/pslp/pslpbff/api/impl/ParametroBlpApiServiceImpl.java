/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;


import it.csi.pslp.pslpbff.api.ParametroBlpApi;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.BlpapiManager;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.core.UriInfo;
import org.eclipse.microprofile.config.inject.ConfigProperty;


public class ParametroBlpApiServiceImpl extends BaseApiServiceImpl implements ParametroBlpApi {
    @ConfigProperty(name = "blpapi.url")
    String blpapiUrl;

    @ConfigProperty(name = "blpapi.user")
    String blpapiUser;

    @ConfigProperty(name = "blpapi.password")
    String blpapiPassword;

    @Inject
    RestUtils restUtils;

    @Inject
    BlpapiManager blpapiManager;


    /**
     * summary = Restituisce il parametro passando come parametro il codice a cercare
     * description =
     *
     * @param tipo
     * @param body
     * @param securityContext
     * @param httpHeaders
     * @param httpRequest
     * @return Response
     * responses:
     * <ul>
     * <li>
     * <p>responseCode = 200, description = Parametro trovato<br>
     * schema implementation = { @see ParametroBlpResponse }</p>
     * </li>
     * <li>
     * <p>responseCode = 500, description = Errore sul sistema<br>
     * schema implementation = { @see ApiError }</p>
     * </li>
     * </ul>
     */
    @Override
    public Response findParametroByCodBlp(String tipo, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        CommonRequest body = new CommonRequest();
        body.setCallInfo(creaCallInfoBlp());

        return restUtils.chiamatePost(uriInfo,body,blpapiUrl,blpapiUser,blpapiPassword);
    }
}
