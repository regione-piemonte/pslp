/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import jakarta.ws.rs.WebApplicationException;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
 

 

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.request.RicercaIndirizzoStradarioRequest;
import it.csi.pslp.pslpbff.api.dto.response.RicercaIndirizzoStradarioResponse;
import it.csi.pslp.pslpbff.api.dto.stradario.IndirizzoStradario;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import jakarta.enterprise.context.Dependent;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.Invocation;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Dependent
public class StradarioManager extends BaseApiServiceImpl {

	@ConfigProperty(name = "apimbbone.url")
	private String apimbboneUrl;

	@ConfigProperty(name = "loccsi.url")
	private String loccsiUrl;

	@ConfigProperty(name = "loccsi.consumer.key")
	private String loccsiConsumerKey;

	@ConfigProperty(name = "loccsi.consumer.secret")
	private String loccsiConsumerSecret;

	private String token = null;

	public RicercaIndirizzoStradarioResponse findIndirizzi(RicercaIndirizzoStradarioRequest formRicercaIndirizzo) {
		Log.info("StradarioManager::findIndirizzi START");
		RicercaIndirizzoStradarioResponse r = null;
		if (token == null) token = refreshToken();
		String url = loccsiUrl + "/catalogs/civici_full/suggest?q=" + formRicercaIndirizzo.getTestoRicerca();
		if (formRicercaIndirizzo.getCodiceIstatComune() != null) url += " __" + formRicercaIndirizzo.getCodiceIstatComune() + "__";
		 
		Client client = ClientBuilder.newClient();
		WebTarget target = client.target(url);
		Invocation.Builder invocationBuilder = target.request(MediaType.APPLICATION_JSON);
		invocationBuilder.header("Authorization: Bearer ", token);
		Response resp = invocationBuilder.get();
		if (resp.getStatus() == 200) {
			r = readIndirizzi(resp);
		}
		else if (resp.getStatus() == 401) {
			token = refreshToken();
			invocationBuilder.header("Authorization: Bearer ", token);
			resp = invocationBuilder.get();
			r = readIndirizzi(resp);
		}
		client.close();
		Log.info("StradarioManager::findIndirizzi END");
		return r;
	}

	private RicercaIndirizzoStradarioResponse readIndirizzi(Response resp) {
		RicercaIndirizzoStradarioResponse r = new RicercaIndirizzoStradarioResponse();
		if (resp.getStatus() == 200) {
			List<Map<String, Object>> result = resp.readEntity(new GenericType<List<Map<String, Object>>>() {
			});
			for (Map<String, Object> entry : result) {
				Map<String, Object> featureCollection = (Map<String, Object>) entry.get("featureCollection");
				if (featureCollection != null) {
					List<Map<String, Object>> features = (List<Map<String, Object>>) featureCollection.get("features");
					if (features != null) {
						for (Map<String, Object> feature : features) {
							Map<String, String> properties = (Map<String, String>) feature.get("properties");
							if (properties != null) {
								IndirizzoStradario e = new IndirizzoStradario();
								r.getElementi().add(e);
								e.setDescrizione(properties.get("loccsi_label"));
								e.setTipoVia(properties.get("tipo_via"));
								e.setNomeVia(properties.get("nome_via"));
								String civicoNumero = properties.get("civico_num");
								if (StringUtils.isNotEmpty(civicoNumero)) {
									e.setCivicoNumero(civicoNumero);
								}
								String civicoSub = properties.get("civico_sub");
								if (StringUtils.isNotEmpty(civicoSub)) {
									e.setCivicoSub(civicoSub);
								}
								String localita = properties.get("localita");
								if (StringUtils.isNotEmpty(localita)) {
									e.setLocalita(localita);
								}
								String comune = properties.get("comune");
								if (StringUtils.isNotEmpty(comune)) {
									e.setComune(comune);
								}
								String codiceIstat = properties.get("codice_istat");
								if (StringUtils.isNotEmpty(codiceIstat)) {
									e.setComune(codiceIstat);
								}
								String cap = properties.get("cap");
								if (StringUtils.isNotEmpty(cap)) {
									e.setCap(cap);
								}
								String circoscrizione = properties.get("circoscrizione");
								if (StringUtils.isNotEmpty(circoscrizione)) {
									e.setCircoscrizione(circoscrizione);
								}
								String provincia = properties.get("descrizione_provincia");
								if (StringUtils.isNotEmpty(provincia)) {
									e.setProvincia(provincia);
								}
								String siglaProvincia = properties.get("sigla_provincia");
								if (StringUtils.isNotEmpty(siglaProvincia)) {
									e.setProvincia(siglaProvincia);
								}
							}
						}
					}
				}
			}
		}else{
			throw new WebApplicationException(resp.getStatus());
		}

		return r;
	}

	public String refreshToken() {
		Log.info("[StradarioManager::refreshToken] START");
		Map<String, Object> queryParams = new HashMap<>();
		queryParams.put("grant_type", "client_credentials");
		Map<String, Object> headerParams = new HashMap<>();
		String auth = loccsiConsumerKey + ":" + loccsiConsumerSecret;
		String authentication = Base64.getEncoder().encodeToString(auth.getBytes());
		headerParams.put("Authorization", "Basic " + authentication);
		headerParams.put("Content-Type", "application/x-www-form-urlencoded");
		Map<String, Object> tokenResponse = postService(apimbboneUrl, headerParams, queryParams, Map.class);
		String token = (String) tokenResponse.get("access_token");
		Log.info("[StradarioManager::refreshToken] END");
		return token;
	}
	
	protected <T> T postService(String urlService, Map<String, Object> headerParams, Object request,
			Class<T> entityResponseType) {
		return postService(urlService, null, headerParams, request, entityResponseType);
	}
	
	protected <T> T postService(String urlService, Map<String, Object> queryParams, Map<String, Object> headerParams,
			Object request, Class<T> entityResponseType) {

 
		Client client = ClientBuilder.newClient( );

		WebTarget target = client.target(urlService);
		if (queryParams != null) {
			for (Map.Entry<String, Object> entry : queryParams.entrySet()) {
				target = target.queryParam(entry.getKey(), entry.getValue());
			}
		}

		if (headerParams == null) {
			headerParams = new HashMap<String, Object>();
		}

		Invocation.Builder invocationBuilder = target.request(MediaType.APPLICATION_JSON);
		for (Map.Entry<String, Object> entry : headerParams.entrySet()) {
			invocationBuilder.header(entry.getKey(), entry.getValue());
		}

		Response resp = invocationBuilder.post(Entity.entity(request, MediaType.APPLICATION_JSON));
		if (resp.getStatus() != 200) {
			throw new RuntimeException("Errore comunicazione servizio:" + resp.getStatus());
		}
		return resp.readEntity(entityResponseType);
	}
}
