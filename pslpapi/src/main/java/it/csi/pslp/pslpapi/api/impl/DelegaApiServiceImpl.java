/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.impl;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpapi.api.DelegaApi;
import it.csi.pslp.pslpapi.api.dto.ApiMessage;
import it.csi.pslp.pslpapi.api.dto.Delega;
import it.csi.pslp.pslpapi.api.dto.response.DelegaListResponse;
import it.csi.pslp.pslpapi.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpapi.integration.entity.PslpTDelega;
import it.csi.pslp.pslpapi.interceptor.Audited;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

import java.util.List;

@Provider
public class DelegaApiServiceImpl extends BaseApiServiceImpl implements DelegaApi {

	@Audited
	@Override
	@RolesAllowed({ "ROLE_BLP" })
	public Response findDelegheByDelegante(String cfDelegante, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {


		DelegaListResponse response = new DelegaListResponse();

		try{
			List<PslpTDelega> pslpTDelegaList = PslpTDelega.find("pslpTUtente1.cfUtente = ?1 and dFine >= now() ", cfDelegante).list();
			List<Delega> delega = mappers.DELEGA.toModels(pslpTDelegaList);
			response.setList(delega);
		} catch(Exception e){
			Log.error(e.getMessage());
			response.addApiMessage(new ApiMessage(msgFromString(e.getMessage())));
			response.setEsitoPositivo(false);
		}
		//return  buildManagedResponse(httpHeaders, new DelegaListResponse().Builder().setList(mappers.DELEGA.toModels(pslpTDelegaList)).build());

		return buildManagedResponseLogEnd(httpHeaders, response, "findDelegheByDelegante");
	}
}
