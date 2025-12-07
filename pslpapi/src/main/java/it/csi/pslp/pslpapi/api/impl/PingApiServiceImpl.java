/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import it.csi.pslp.pslpapi.api.PingApi;
import it.csi.pslp.pslpapi.api.dto.PslpMessaggio;
import it.csi.pslp.pslpapi.api.dto.response.MsgResponse;
import it.csi.pslp.pslpapi.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpapi.util.PslpConstants;
import it.csi.pslp.pslpapi.util.PslpRuntimeConfig;
import it.csi.pslp.pslpapi.util.TimeUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class PingApiServiceImpl extends BaseApiServiceImpl implements PingApi {

		
	@Override
	public Response ping(SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		
		
		final String methodName = "ping";
		
		String profiloEsecuzione = PslpRuntimeConfig.getProfile();
		String quarkusVersion = PslpRuntimeConfig.getQuarkusVersion();
		String db = PslpRuntimeConfig.getDb();
		String msgText = String.format("PING OK - PROFILO=%s, QUARKUS=%s, DB=%s, TIMESTAMP=%s", profiloEsecuzione,quarkusVersion,db,TimeUtils.nowString());

		MsgResponse response = new MsgResponse();
		PslpMessaggio msg = new PslpMessaggio();
		msg.setDescrMessaggio(msgText);
		response.setEsitoPositivo(true);
		response.setMsg(msg);
		return buildManagedResponseLogEnd(httpHeaders, response, methodName);

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
