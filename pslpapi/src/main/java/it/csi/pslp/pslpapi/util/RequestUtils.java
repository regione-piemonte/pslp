/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

import jakarta.servlet.http.HttpServletRequest;

public class RequestUtils {

	public static final String CODICE_FISCALE = "CODICE_FISCALE";
	public static final String CODICE_APPLICATIVO = "CODICE_APPLICATIVO";

	/*********** UTILITY PER LEGGERE PARAMETRI DALLA REQUEST ************/

	public static String getIncomingIPAddress(HttpServletRequest req) {

		StringBuilder sb = new StringBuilder("");
		if (req != null) {
			String xForwardedFor = req.getHeader("X-Forwarded-For");
			xForwardedFor = xForwardedFor != null && xForwardedFor.contains(",") ? xForwardedFor.split(",")[0]
					: xForwardedFor;
			String remoteHost = req.getRemoteHost();
			String remoteAddr = req.getRemoteAddr();
			int remotePort = req.getRemotePort();
			if (CommonUtils.isNotVoid(remoteHost) && !remoteHost.equalsIgnoreCase(remoteAddr)) {
				sb.append(remoteHost).append(" ");
			}
			if (CommonUtils.isNotVoid(xForwardedFor)) {
				sb.append(xForwardedFor).append("(fwd)=>");
			}
			if (remoteAddr != null) {
				sb.append(remoteAddr).append(":").append(remotePort);
			}
		} else {
			sb.append("null");
		}
		return sb.toString();
	}

	public static String getCodiceFiscaleCurrentUser(HttpServletRequest httpRequest) {
		return getAttributeValue(httpRequest, CODICE_FISCALE);
	}

	public static String getCodiceApplicativo(HttpServletRequest httpRequest) {
		return getAttributeValue(httpRequest, CODICE_APPLICATIVO);
	}

	private static String getAttributeValue(HttpServletRequest httpRequest, String attributeName) {
		if (httpRequest != null && httpRequest.getSession() != null) {
			return (String) httpRequest.getSession().getAttribute(attributeName);
		}
		return null;
	}

	/*********** UTILITY PER IMPOSTARE PARAMETRI DALLA REQUEST ************/

	public static void setCodiceFiscaleCurrentUser(HttpServletRequest httpRequest, String value) {
		setAttributeValue(httpRequest, CODICE_FISCALE, value);
	}

	public static void setCodiceApplicativo(HttpServletRequest httpRequest, String value) {
		setAttributeValue(httpRequest, CODICE_APPLICATIVO, value);
	}

	private static void setAttributeValue(HttpServletRequest httpRequest, String attributeName, Object value) {
		httpRequest.getSession().setAttribute(attributeName, value);
	}

}
