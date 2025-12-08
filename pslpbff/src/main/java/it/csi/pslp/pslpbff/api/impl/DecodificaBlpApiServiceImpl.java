/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import java.util.List;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import it.csi.pslp.pslpbff.api.DecodificaBlpApi;
import it.csi.pslp.pslpbff.api.dto.Decodifica;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.BlpapiManager;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

public class DecodificaBlpApiServiceImpl extends BaseApiServiceImpl implements DecodificaBlpApi {
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

    @Override
    public Response fill(String tipo, String txt, CommonRequest body, String conCodice, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        List<Decodifica> decodificaList = blpapiManager.getDecodificaList(String.format(blpapiUrl + PslpConstants.BLP_URL_DECODIFICA_FILL, tipo, txt), body);

        return buildManagedResponse(httpHeaders,
                new it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse.Builder().setList(decodificaList).build());
    }

    @Override
    public Response findDecodificaBlpByTipo(String tipo, CommonRequest body, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        List<Decodifica> decodificaList = blpapiManager.getDecodificaList(String.format(blpapiUrl + PslpConstants.BLP_URL_DECODIFICA_FIND, tipo), body);

        return buildManagedResponse(httpHeaders,
                new it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse.Builder().setList(decodificaList).build());

    }

    @Override
    public Response findDecodificaBlpById(String tipo, String id, CommonRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        Decodifica decodifica = blpapiManager.getDecodifica(String.format(blpapiUrl + PslpConstants.BLP_URL_DECODIFICA_FIND_BY_ID, tipo, id), body);
        return buildManagedResponse(httpHeaders,
                new it.csi.pslp.pslpbff.api.dto.response.DecodificaResponse.Builder().setDecodifica(decodifica).build());
    }

    @Override
    public Response findTitoliDiStudioByDescr(String descr, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        // UriInfo tmp=uriInfo;

        return restUtils.chiamateGet(uriInfo, blpapiUrl, blpapiUser, blpapiPassword);
    }
}
