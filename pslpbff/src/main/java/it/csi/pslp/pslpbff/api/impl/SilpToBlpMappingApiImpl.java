/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import it.csi.pslp.pslpbff.api.SilpToBlpMappingApi;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.blp.GeneraCvRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpAlbiRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpConoscInformaticaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpEsperienzaLavRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpFormazioneRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpIstruzioneRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpLinguaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpPatenteRequest;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

public class SilpToBlpMappingApiImpl extends BaseApiServiceImpl implements SilpToBlpMappingApi {
    @ConfigProperty(name = "blpapi.url")
    String blpapiUrl;

    @ConfigProperty(name = "blpapi.user")
    String blpapiUser;

    @ConfigProperty(name = "blpapi.password")
    String blpapiPassword;

    @Inject
    RestUtils restUtils;

    @Audited
    @Override
    public Response insertLinguaDichFromSilp(MapSilpToBlpLinguaRequest mapSilpToBlpRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertFormazioneFromSilp(MapSilpToBlpFormazioneRequest mapSilpToBlpFormazioneRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpFormazioneRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertPatenteFromSilp(MapSilpToBlpPatenteRequest mapSilpToBlpPatenteRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpPatenteRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertPatentinoFromSilp(MapSilpToBlpPatenteRequest mapSilpToBlpPatenteRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpPatenteRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertConoscenzaInformaticaFromSilp(MapSilpToBlpConoscInformaticaRequest mapSilpToBlpConoscInformaticaRequest, SecurityContext securityContext, HttpHeaders httpHeaders,
            HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpConoscInformaticaRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertEsperienzaLavFromSilp(MapSilpToBlpEsperienzaLavRequest mapSilpToBlpEsperienzaLavRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        if (mapSilpToBlpEsperienzaLavRequest.getEsperienzaProfessionale() != null) {
            mapSilpToBlpEsperienzaLavRequest.getEsperienzaProfessionale().setIdEsperienzaProfessionale(null);
        }
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpEsperienzaLavRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertIstruzioneFromSilp(MapSilpToBlpIstruzioneRequest mapSilpToBlpIstruzioneRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpIstruzioneRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response insertAlboFromSilp(MapSilpToBlpAlbiRequest mapSilpToBlpAlbiRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, mapSilpToBlpAlbiRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response getAnagraficaByIdSilpAnag(GeneraCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaAnagrafica(CommonRequest body, Long idSilTAnagrafica, Long idBlpLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }
}
