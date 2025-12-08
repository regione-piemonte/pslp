/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.filter;

import java.util.ArrayList;
import java.util.List;

import jakarta.enterprise.inject.Instance;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.logging.Log;

@Provider
public class XSRFTokenValidationFilter implements ContainerRequestFilter {

	public static final String COMPONENT_NAME = "pslpbff";

	final static List<String> SECURE_HTTP_METHODS = new ArrayList<String>();

	/** disable validation (for use in development mode) */
	@ConfigProperty(name = "xsrf.validation.disabled", defaultValue = "true")
	Instance<Boolean> disabled;

	/**
	 * nome dell'header XSRF che la componente client deve inserire ad ogni
	 * richiesta rest
	 */
	private static final String XSRF_HEADER_NAME = "X-XSRF-TOKEN";

	/*
	 * nome del cookie XSRF
	 */
	private static final String XSRF_COOKIE_NAME = "XSRF-TOKEN";

	private static final Response INVALID_CSRF_TOKEN_RESPONSE = Response.status(Response.Status.BAD_REQUEST)
			.entity("A valid CSRF token must be provided via the unambiguous header field: " + XSRF_HEADER_NAME
					+ " and cookie: " + XSRF_COOKIE_NAME)
			.build();

	static {
		SECURE_HTTP_METHODS.add("GET");
	}

	@Override
	public void filter(ContainerRequestContext requestContext) {
		Log.debug("[XSRFTokenValidationFilter::filter] START");
		if (!disabled.get()) {
			// No check for "secure" HTTP methods
			if (SECURE_HTTP_METHODS.contains(requestContext.getMethod())) {
				return;
			}

			Cookie csrfTokenCookie = requestContext.getCookies().get(XSRF_COOKIE_NAME);
			List<String> csrfTokenHeader = requestContext.getHeaders().get(XSRF_HEADER_NAME);

			// Check if the CSRF token header and cookie is present,
			// the header has an unambiguous value and both values
			// must match.
			if (csrfTokenCookie == null || csrfTokenHeader == null || csrfTokenHeader.size() != 1
					|| !csrfTokenHeader.get(0).equals(csrfTokenCookie.getValue())) {
				Log.error("[XSRFTokenValidationFilter::filter] cookie/header not present/valid");
				requestContext.abortWith(INVALID_CSRF_TOKEN_RESPONSE);
				Log.debug("[XSRFTokenValidationFilter::filter] END");
				return;
			}
			Log.debug("[XSRFTokenValidationFilter::filter] XSRF validation: OK");
			Log.debug("[XSRFTokenValidationFilter::filter] END");
		} else {
			Log.debug("[XSRFTokenValidationFilter::filter] skipping validation (disabled)");
			Log.debug("[XSRFTokenValidationFilter::filter] END");
			return;
		}

	}
}
