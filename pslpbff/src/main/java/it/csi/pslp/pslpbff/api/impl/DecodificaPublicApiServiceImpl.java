/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import java.util.Date;
import java.util.List;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.panache.common.Sort;
import it.csi.pslp.pslpbff.api.DecodificaPublicApi;
import it.csi.pslp.pslpbff.api.dto.Decodifica;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.response.FunzioneListResponse;
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.BlpapiManager;
import it.csi.pslp.pslpbff.integration.entity.PslpDFunzione;
import it.csi.pslp.pslpbff.integration.entity.PslpDMessaggio;
import it.csi.pslp.pslpbff.integration.entity.PslpRRuoloFunzione;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;


@Provider
public class DecodificaPublicApiServiceImpl extends BaseApiServiceImpl implements DecodificaPublicApi {

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

	// ======================================================================
	// FUNZIONE
	@Override
	@Audited
	public Response findFunzione(@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
			@Context HttpServletRequest httpRequest) {
		List<PslpDFunzione> list = PslpDFunzione.listAll(Sort.ascending("ordinamento"));
		return buildManagedResponse(httpHeaders,
				new FunzioneListResponse.Builder().setList(mappers.FUNZIONE.toModels(list)).build());
	}

	@Override
	public Response findFunzioneByIdruolo(Long idRuolo, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		List<PslpRRuoloFunzione> pslpRRuoloFunzioneList = PslpRRuoloFunzione.find("pslpDRuolo.idRuolo = ?1 and dFine is null or dFine >= ?2", Sort.ascending("pslpDFunzione.ordinamento"),idRuolo, new Date()).list();
		List<PslpDFunzione> list = pslpRRuoloFunzioneList.stream().map(PslpRRuoloFunzione::getPslpDFunzione).toList();
		return buildManagedResponse(httpHeaders,
				new FunzioneListResponse.Builder().setList(mappers.FUNZIONE.toModels(list)).build());
	}

	@Override
	public Response findByCodPublic(String cod, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		MsgResponse result = new MsgResponse();
		result.setMsg(mappers.MESSAGGIO.toModel(PslpDMessaggio.find("codMessaggio", cod).firstResult()));
		return buildManagedResponseLogEnd(httpHeaders, result, "find");
	}
	// ======================================================================

    @Override
    public Response fill(String tipo, String txt, CommonRequest body, String conCodice, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {


        List<Decodifica> decodificaList = blpapiManager.getDecodificaList(String.format(blpapiUrl+PslpConstants.BLP_URL_DECODIFICA_FILL, tipo,txt),body);

        return buildManagedResponse(httpHeaders,
                new it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse.Builder().setList(decodificaList).build());
    }

    @Override
    public Response findDecodificaBlpByTipo(String tipo, CommonRequest body, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        List<Decodifica> decodificaList = blpapiManager.getDecodificaList(String.format(blpapiUrl+PslpConstants.BLP_URL_DECODIFICA_FIND, tipo),body);

        return buildManagedResponse(httpHeaders,
                new it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse.Builder().setList(decodificaList).build());


    }

    @Override
    public Response findDecodificaBlpById(String tipo, String id, CommonRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        Decodifica decodifica = blpapiManager.getDecodifica(String.format(blpapiUrl+PslpConstants.BLP_URL_DECODIFICA_FIND_BY_ID, tipo,id),body);
        return buildManagedResponse(httpHeaders,
                new it.csi.pslp.pslpbff.api.dto.response.DecodificaResponse.Builder().setDecodifica(decodifica).build());
    }

}
