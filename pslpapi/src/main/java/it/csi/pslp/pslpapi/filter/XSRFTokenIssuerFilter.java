/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.filter;

import java.util.UUID;

import io.quarkus.logging.Log;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.ext.Provider;


//Disabilitato il filtro e abilitato su .properties per problema su CORS origin
//@Provider
public class XSRFTokenIssuerFilter implements ContainerResponseFilter {

	public static final String COMPONENT_NAME = "pslpapi";

	private static final String XSRF_COOKIE_NAME = "XSRF-TOKEN";

	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
		Log.debug("[XSRFTokenIssuerFilter::filter] START");

		// Check if cookie already exists
		if (requestContext.getCookies().containsKey(XSRF_COOKIE_NAME)) {
			Log.debug("[XSRFTokenIssuerFilter::filter] no need to create a new token");
			Log.debug("[XSRFTokenIssuerFilter::filter] END");
			return;
		}

		Log.debug("[XSRFTokenIssuerFilter::filter] creating a new random token");
		String randomToken = UUID.randomUUID().toString();
		var tokenCookie = new NewCookie(XSRF_COOKIE_NAME, randomToken, "/", null, null, -1, true, false);
		responseContext.getHeaders().add("Set-Cookie", tokenCookie);
		responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");


		responseContext.getHeaders().add("Access-Control-Allow-Headers", "*");
		responseContext.getHeaders().add("Access-Control-Request-Headers", "content-type,x-pingother");
		responseContext.getHeaders().add("Access-Control-Allow-Methods", "OPTIONS,POST,PUT,GET,DELETE");
		responseContext.getHeaders().add("Content-Type", "application/json");

		
		
		
	    	
		
		Log.debug("[XSRFTokenIssuerFilter::filter] END");
	}
}
