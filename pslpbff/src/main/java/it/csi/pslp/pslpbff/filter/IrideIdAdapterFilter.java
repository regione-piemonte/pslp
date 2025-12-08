/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.filter;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URI;

import org.eclipse.microprofile.config.ConfigProvider;

import io.quarkus.logging.Log;
import io.smallrye.config.SmallRyeConfig;
import it.csi.iride2.policy.entity.Identita;
import it.csi.iride2.policy.exceptions.MalformedIdTokenException;
import it.csi.pslp.pslpbff.api.dto.Utente;
import it.csi.pslp.pslpbff.util.PslpThreadLocalContainer;
import it.csi.pslp.pslpbff.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.Provider;

@Provider
public class IrideIdAdapterFilter implements ContainerRequestFilter {


	public static final String AUTH_ID_MARKER = "Shib-Iride-IdentitaDigitale";
	
	private static final String PUBLIC_PREFIX_URI = "/api-public/v1";
	
	
	@Context
    private HttpServletRequest request;
	
	@Context
	private UriInfo uriInfo;
	
	
	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		
		if (requestContext.getUriInfo().getPath().startsWith(PUBLIC_PREFIX_URI))
			return;
		
		Utente utente = getUserInfo(requestContext);
		
		if (utente == null) {
			requestContext.abortWith(Response.status(Status.UNAUTHORIZED).build());
			return;
		}
		
		PslpThreadLocalContainer.CALLER_IP.set(RequestUtils.getIncomingIPAddress(request));
		PslpThreadLocalContainer.UTENTE_CONNESSO.set(utente);	
		
		PslpThreadLocalContainer.ID_RUOLO.set(getLong(requestContext.getHeaderString(PslpThreadLocalContainer.ID_RUOLO_KEY)));
		PslpThreadLocalContainer.ID_COD_FISC_SOGG_ABILITATO.set(requestContext.getHeaderString(PslpThreadLocalContainer.ID_COD_FISC_SOGG_ABILITATO_KEY));
	}
	
	
	private Utente getUserInfo(ContainerRequestContext requestContext) {
		String marker = getToken(requestContext);
		if (marker != null) {
			return initMarkerIride(marker, requestContext);

		} else if ("dev".equals(ConfigProvider.getConfig().unwrap(SmallRyeConfig.class).getProfiles().get(0))) {
			return initMarkerIride(null, requestContext);

		} else if (mustCheckPage(uriInfo.getRequestUri())) {
			Log.error("[IrideIdAdapterFilter::filter] Tentativo di accesso a pagina non home e non di servizio senza token di sicurezza");
			return null;
		}
		return null;
	}
	
	
	private Utente initMarkerIride(String token, ContainerRequestContext containerRequest) {
		
		PslpThreadLocalContainer.TOKEN_SHIBBOLETH.set(token);

		
		Identita identita;
		try {
			if (token != null) {
				Log.debug("[IrideIdAdapterFilter::filter] token: " + token);
				identita = new Identita(token);
			}
			else {
				Log.debug("[IrideIdAdapterFilter::filter] token caricato da file");
				
				String pathHome = System.getProperty("user.home");
				String filenameToken = pathHome + "/token.txt";
				File fileToken = new File(filenameToken);
				String sToken = "tokenxutente demo";
				if (fileToken.exists()) {
					FileReader fr = new FileReader(fileToken);
					BufferedReader br = new BufferedReader(fr);
					sToken = br.readLine();
					if (sToken != null) {
						sToken = sToken.trim();
					}
					br.close();
					fr.close();
					br = null;
					fr = null;
				}

				PslpThreadLocalContainer.TOKEN_SHIBBOLETH.set(sToken);
				identita = new Identita(sToken);
			}
			
		} catch (MalformedIdTokenException e) {
			Log.error("[IrideIdAdapterFilter::filter] Token non correttamente formattato. " + e.toString(), e);
			return null;

		} catch (Exception e) {
			Log.error("[IrideIdAdapterFilter::filter] Token non correttamente formattato. " + e.toString(), e);
			return null;
		}

		Log.trace("[IrideIdAdapterFilter::filter] Caricato marcatore IRIDE: " + identita);
		PslpThreadLocalContainer.IDENTITA.set(identita);
	
		
		Utente utente = new Utente();
		utente.setNome(identita.getNome());
		utente.setCognome(identita.getCognome());
		utente.setCfUtente(identita.getCodFiscale());

		return utente;
	}
	
	
	private boolean mustCheckPage(URI requestURI) {
		return requestURI != null;
	}
	
	private Long getLong(String value) {
		if (value != null && value.trim().length()>0)
			return Long.parseLong(value);
		return null;
	}
	
	
	private String getToken(ContainerRequestContext httpreq) {
		String marker = (String) httpreq.getHeaderString(AUTH_ID_MARKER);
		try {
			String decodedMarker = new String(marker.getBytes("ISO-8859-1"), "UTF-8");
			return decodedMarker;
		} catch (java.io.UnsupportedEncodingException e) {
			return marker;
		} catch (NullPointerException npe) {
			return marker;
		}
	}
	
}
