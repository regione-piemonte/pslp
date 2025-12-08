/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import java.util.List;

import it.csi.pslp.pslpbff.api.MessaggioApi;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.response.MsgListResponse;
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.integration.entity.PslpDMessaggio;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;



@Provider
public class MessaggioApiServiceImpl extends BaseApiServiceImpl implements MessaggioApi {

	
	@Override
	public Response findByCod(String cod, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest) {
		MsgResponse result = new MsgResponse();
		result.setMsg(mappers.MESSAGGIO.toModel(PslpDMessaggio.find("codMessaggio", cod).firstResult()));
		return buildManagedResponseLogEnd(httpHeaders, result, "find");
	}
	

	@Override
	public Response find(Long id, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest) {
		MsgResponse result = new MsgResponse();
		result.setMsg(mappers.MESSAGGIO.toModel(PslpDMessaggio.findById(id)));
		return buildManagedResponseLogEnd(httpHeaders, result, "find");
	}


	@Override
	public Response findAll(@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
			@Context HttpServletRequest httpRequest) {
		MsgListResponse result = new MsgListResponse();
		
		List<PslpMessaggio> msgs = mappers.MESSAGGIO.toModels(PslpDMessaggio.listAll());
		for (PslpMessaggio msg : msgs)
			result.getMsgMap().put(msg.getCodMessaggio(), msg);
		return buildManagedResponseLogEnd(httpHeaders, result, "findAll");
	}
}
