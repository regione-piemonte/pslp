/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import it.csi.pslp.pslpbff.api.PingApi;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.PslpRuntimeConfig;
import it.csi.pslp.pslpbff.util.TimeUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class PingApiServiceImpl extends BaseApiServiceImpl implements PingApi {

	
	@Inject private SilpapiManager silpapiManager;
	
	@Override
	public Response ping(SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		String profiloEsecuzione = PslpRuntimeConfig.getProfile();
		String quarkusVersion = PslpRuntimeConfig.getQuarkusVersion();
		String db = PslpRuntimeConfig.getDb();
		String msgText = String.format("PING OK - PROFILO=%s, QUARKUS=%s, DB=%s, TIMESTAMP=%s", profiloEsecuzione,quarkusVersion,db,TimeUtils.nowString());

		return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getDecodificaList(String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_COMUNE_BY_PROVINCIA, "001")));

	}

	@Override
	public Response getCurrentDate(@Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest ) {

		final String methodName = "getCurrentDate";
		
		SimpleDateFormat sf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		String msgText = sf.format(new Date());
		
		MsgResponse response = new MsgResponse();
		PslpMessaggio msg = new PslpMessaggio();
		msg.setDescrMessaggio(msgText);
		response.setEsitoPositivo(true);
		response.setMsg(msg);
		return buildManagedResponseLogEnd(httpHeaders, response, methodName);
	}
}
