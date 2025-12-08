/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import it.csi.pslp.pslpbff.api.AnnunciPublicApi;
import it.csi.pslp.pslpbff.api.dto.blp.CallInfo;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.blp.ConsultaAnnunciRequest;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;


@Provider
public class AnnunciPublicApiServiceImpl extends BaseApiServiceImpl implements AnnunciPublicApi {

    @ConfigProperty(name = "blpapi.url")
    String blpapiUrl;

    @ConfigProperty(name = "blpapi.user")
    String blpapiUser;

    @ConfigProperty(name = "blpapi.password")
    String blpapiPassword;

    @Inject
    RestUtils restUtils;


	private CallInfo impostaCallInfo() {
		CallInfo info = new CallInfo();
		info.setIdAppChiamante("PSLP");
		return info;
	}

    @Audited
	@Override
	public Response consultaAnnunci(ConsultaAnnunciRequest request, @Min(-1) @NotNull int page,
			int recForPage, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
    	request.setCallInfo(impostaCallInfo());
    	return restUtils.chiamatePost(uriInfo,request,blpapiUrl,blpapiUser,blpapiPassword);
    }

    @Audited
	@Override
	public Response getDettaglioAnnuncio(@NotNull Long idAnnuncio, SecurityContext securityContext,
			HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		CommonRequest request = new CommonRequest();
    	request.setCallInfo(impostaCallInfo());
    	return restUtils.chiamatePost(uriInfo,request,blpapiUrl,blpapiUser,blpapiPassword);
	}

}
