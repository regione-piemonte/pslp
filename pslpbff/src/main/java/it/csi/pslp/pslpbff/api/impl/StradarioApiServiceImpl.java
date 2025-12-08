/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;




import it.csi.pslp.pslpbff.api.StradarioApi;
import it.csi.pslp.pslpbff.api.dto.request.RicercaIndirizzoStradarioRequest;
import it.csi.pslp.pslpbff.api.dto.response.RicercaIndirizzoStradarioResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.StradarioManager;
import it.csi.pslp.pslpbff.interceptor.Audited;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class StradarioApiServiceImpl extends  BaseApiServiceImpl implements StradarioApi {

	@Inject StradarioManager stradarioManager;

	@Override
	public Response findIndirizzi(RicercaIndirizzoStradarioRequest formRicercaIndirizzo, SecurityContext securityContext,
			HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

		RicercaIndirizzoStradarioResponse result = stradarioManager.findIndirizzi(formRicercaIndirizzo);
		return Response.ok(result).build();
	}

}
