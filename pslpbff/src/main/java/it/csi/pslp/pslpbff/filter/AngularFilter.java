/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.filter;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro per la gestione di Angular
 * 
 * @author Marchino Alessandro
 */
public class AngularFilter implements Filter {

	/** Logger */
	// private static final LogUtil LOG = new LogUtil(AngularFilter.class);
	/** The init-param to be used for the index */
	private static final String INDEXURL_INIT_PARAM = "indexUrl";

	private String indexUrl;

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		//final String methodName = "doFilter";
		if (!(req instanceof HttpServletRequest && res instanceof HttpServletResponse)) {
			// LOG.trace(methodName, "Request or response are NOT HTTP. Skip...");
			chain.doFilter(req, res);
			return;
		}
		HttpServletRequest httpRequest = (HttpServletRequest) req;
		String contextPath = httpRequest.getContextPath();
		String requestURI = httpRequest.getRequestURI();
		String angularPath = requestURI.substring(contextPath.length());
		if (isResourceRoute(angularPath)) {
			req.getRequestDispatcher(indexUrl).forward(req, res);
			return;
		}
		chain.doFilter(req, res);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		this.indexUrl = filterConfig.getInitParameter(INDEXURL_INIT_PARAM);
	}

	/**
	 * Checks whether the given route is an Angular-type route
	 * 
	 * @param angularPath the given path
	 * @return whether the route is Angular-type
	 */
	private boolean isResourceRoute(String angularPath) {
		return !angularPath.contains(indexUrl)
				// Assets
				&& !angularPath.contains("/assets/")
				// Files
				&& !angularPath.endsWith(".html") && !angularPath.endsWith(".js") && !angularPath.endsWith(".css")
				&& !angularPath.endsWith(".ico") && !angularPath.endsWith(".svg") && !angularPath.endsWith(".map")
				// Fonts
				&& !angularPath.endsWith(".woff2") && !angularPath.endsWith(".woff") && !angularPath.endsWith(".ttf")
				&& !angularPath.endsWith(".eot");
	}
}
