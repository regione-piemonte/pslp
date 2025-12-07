/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.impl.generic;

import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import it.csi.pslp.pslpapi.api.dto.*;
import it.csi.pslp.pslpapi.util.PslpThreadLocalContainer;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.UriInfo;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.util.EntityUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.csi.pslp.pslpapi.api.dto.PslpMessaggio;
import it.csi.pslp.pslpapi.api.dto.common.CommonResponse;
import it.csi.pslp.pslpapi.api.dto.mappers.PslpMappers;
import it.csi.pslp.pslpapi.api.dto.response.DecodificaListResponse;
import it.csi.pslp.pslpapi.api.dto.response.DecodificaResponse;
import it.csi.pslp.pslpapi.integration.entity.PslpDMessaggio;
import it.csi.pslp.pslpapi.integration.entity.PslpDParametro;
import it.csi.pslp.pslpapi.util.CommonUtils;
import it.csi.pslp.pslpapi.util.PslpConstants;
import it.csi.pslp.pslpapi.util.QueryUtils;
import it.csi.pslp.pslpapi.util.QueryUtils.Operatore;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;

public class BaseApiServiceImpl {
	@Context
	protected UriInfo uriInfo;
	@Inject
	protected PslpMappers mappers;
	
	private ObjectMapper objectMapper;

	protected PslpMessaggio getMsg(String code, Object... values) {
		List<PslpDMessaggio> list = PslpDMessaggio.list("codPslpDMessaggio", code);
		if (list != null && list.size() > 0) {

			PslpMessaggio msg = mappers.MESSAGGIO.toModel(list.get(0));
			if (values != null && values.length > 0) {
				try {
					// messaggio.replaceAll per consentire alla String.format di formattare i
					// messaggi con apici
					String messaggio = msg.getDescrMessaggio();
					if (messaggio != null) {
						messaggio = messaggio.replaceAll("'", "''");
					}
					msg.setDescrMessaggio(MessageFormat.format(messaggio, CommonUtils.formatTextMessage(values)));
				} catch (Exception err) {
					msg = new PslpMessaggio();

					TipoMessaggio tipo = new TipoMessaggio();
					tipo.setCodTipoMessaggio("E");
					msg.setPslpDTipoMessaggio(tipo);
					msg.setCodMessaggio("E000");
					msg.setDescrMessaggio("Attenzione codice messaggio " + code + ", placeholders errati");
					return msg;
				}
			}

			return msg;
		}

		PslpMessaggio msg = new PslpMessaggio();
		TipoMessaggio tipo = new TipoMessaggio();
		tipo.setCodTipoMessaggio("E");
		msg.setPslpDTipoMessaggio(tipo);
		msg.setCodMessaggio("E000");
		msg.setDescrMessaggio("Attenzione codice messaggio " + code + " non mappato nella tabella SILAP_D_MESSAGGIO");
		return msg;
	}

	protected String getDescrMsg(String code, Object... values) {
		List<PslpDMessaggio> list = PslpDMessaggio.list("codPslpDMessaggio", code);
		if (list != null && list.size() > 0 && list.get(0).getDescrMessaggio() != null) {

			if (values != null && values.length > 0) {
				try { // messaggio.replaceAll per consentire alla String.format di formattare i
						// messaggi con apici
					String messaggio = list.get(0).getDescrMessaggio();
					if (messaggio != null) {
						messaggio = messaggio.replaceAll("'", "''");
					}
					return MessageFormat.format(messaggio, CommonUtils.formatTextMessage(values));
				} catch (Exception err) {
					return "Attenzione codice messaggio " + code + ", placeholders errati";
				}
			}
			return list.get(0).getDescrMessaggio();
		}
		return "Attenzione codice messaggio " + code + " non mappato nella tabella SILAP_D_MESSAGGIO";
	}

	protected Parametro getParametroByCod(String codParametro) {

		Optional<PslpDParametro> parametroOpt = PslpDParametro.find("codParametro", codParametro)
				.singleResultOptional();
		if (!parametroOpt.isPresent()) {
			throw new NotFoundException("getParametroByCod: " + codParametro);
		}
		return mappers.PARAMETRO.toModel(parametroOpt.get());
	}

	protected <R extends CommonResponse> Response buildManagedResponseLogEndNegative(PslpMessaggio msg,
																					 HttpHeaders httpHeaders) {
		ApiMessage error = new ApiMessage.Builder().setCode(msg.getCodMessaggio()).setMessage(msg.getTesto()).setTitle(msg.getDescrMessaggio())
				.build();
		CommonResponse common = new CommonResponse.Builder().setEsitoPositivo(false).addApiMessage(error).build();
		return Response.ok(common).build();
	}

	protected <R extends CommonResponse> Response buildManagedResponseLogEndNegative(PslpMessaggio msg,
																					 HttpHeaders httpHeaders, String methodName) {
		ApiMessage error = new ApiMessage.Builder().setTipo(msg.getPslpDTipoMessaggio().getCodTipoMessaggio())
				.setCode(msg.getCodMessaggio()).setMessage(msg.getDescrMessaggio()).build();
		CommonResponse common = new CommonResponse.Builder().setEsitoPositivo(false).addApiMessage(error).build();
		return Response.ok(common).build();
	}

	protected <R extends CommonResponse> Response buildManagedResponseLogEndNegativeApiError(PslpMessaggio msg,
																							 HttpHeaders httpHeaders, String methodName) {
		ApiError error = new ApiError.Builder().setMessage(msg.getPslpDTipoMessaggio().getCodTipoMessaggio())
				.setCode(msg.getCodMessaggio()).setMessage(msg.getDescrMessaggio()).build();
		return Response.status(Response.Status.SEE_OTHER).entity(error).build();
	}

	protected <R extends CommonResponse> Response buildManagedResponseLogEnd(HttpHeaders httpHeaders, R responseContent,
			String methodName) {
		return Response.ok(responseContent).build();
	}

	protected <R> Response buildManagedResponseEndEsterna(HttpHeaders httpHeaders, R responseContent) {
		return Response.ok(responseContent).build();
	}

	protected <R extends CommonResponse> Response buildManagedResponse(HttpHeaders httpHeaders, R responseContent) {
		return Response.ok(responseContent).build();
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected DecodificaResponse findDecodificaById(Class<? extends PanacheEntityBase> entity, Object id) {
		try {
			QueryUtils queryUtils = new QueryUtils();
			queryUtils.addParameterAnd("id", id);
			Method m = entity.getMethod("find", String.class, Map.class);
			PanacheQuery query = (PanacheQuery<?>) m.invoke(null, queryUtils.getQuery(), queryUtils.getParams());
			PanacheQuery<Decodifica> res = query.project(Decodifica.class);
			return new DecodificaResponse.Builder().setDecodifica(res.firstResult()).build();
		} catch (Exception e) {
			Log.error("[BaseApiServiceImpl::findDecodificaById]", e);
		}
		return new DecodificaResponse();
	}

	protected DecodificaListResponse findDecodifica(Class<? extends PanacheEntityBase> entity) {
		return findDecodifica(entity, null, null);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected DecodificaListResponse findDecodifica(Class<? extends PanacheEntityBase> entity,
			String dataInizioColumnName, String dataFineColumnName) {
		try {
			QueryUtils queryUtils = new QueryUtils();
			if (dataInizioColumnName != null && dataFineColumnName != null)
				queryUtils.addValidRangeDateAnd(dataInizioColumnName, dataFineColumnName, new Date());
			Method m = entity.getMethod("find", String.class, Sort.class, Map.class);
			PanacheQuery query = (PanacheQuery<?>) m.invoke(null, queryUtils.getQuery(), Sort.ascending("descr"),
					queryUtils.getParams());
			PanacheQuery<Decodifica> res = query.project(Decodifica.class);
			return new DecodificaListResponse.Builder().setList(res.list()).build();
		} catch (Exception e) {
			Log.error("[BaseApiServiceImpl::findDecodifica]", e);
		}
		return new DecodificaListResponse();
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected DecodificaListResponse findDecodificaOrderByKey(Class<? extends PanacheEntityBase> entity,
			String dataInizioColumnName, String dataFineColumnName) {
		try {
			QueryUtils queryUtils = new QueryUtils();
			if (dataInizioColumnName != null && dataFineColumnName != null)
				queryUtils.addValidRangeDateAnd(dataInizioColumnName, dataFineColumnName, new Date());
			Method m = entity.getMethod("find", String.class, Sort.class, Map.class);
			PanacheQuery query = (PanacheQuery<?>) m.invoke(null, queryUtils.getQuery(), Sort.ascending("id"),
					queryUtils.getParams());
			PanacheQuery<Decodifica> res = query.project(Decodifica.class);
			return new DecodificaListResponse.Builder().setList(res.list()).build();
		} catch (Exception e) {
			Log.error("[BaseApiServiceImpl::findDecodificaOrderByKey]", e);
		}
		return new DecodificaListResponse();
	}

	protected DecodificaListResponse fillDecodifica(Class<? extends PanacheEntityBase> entity, String txt) {
		return fillDecodifica(entity, null, null, txt);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected DecodificaListResponse fillDecodifica(Class<? extends PanacheEntityBase> entity,
			String dataInizioColumnName, String dataFineColumnName, String txt) {
		try {
			QueryUtils queryUtils = new QueryUtils();
			if (dataInizioColumnName != null && dataFineColumnName != null)
				queryUtils.addValidRangeDateAnd(dataInizioColumnName, dataFineColumnName, new Date());
			queryUtils.addParameterAnd("descr", txt, Operatore.LIKE_START);
			Method m = entity.getMethod("find", String.class, Sort.class, Map.class);
			PanacheQuery query = (PanacheQuery<?>) m.invoke(null, queryUtils.getQuery(), Sort.ascending("descr"),
					queryUtils.getParams());
			PanacheQuery<Decodifica> res = query.page(Page.ofSize(PslpConstants.NUMERO_RECORD_COMMAD_COMPLETATION))
					.project(Decodifica.class);
			return new DecodificaListResponse.Builder().setList(res.list()).build();
		} catch (Exception e) {
			Log.error("[BaseApiServiceImpl::unchecked]", e);
		}
		return new DecodificaListResponse();
	}

	

	private <T> T callService(HttpUriRequest request, Class<T> valueType) throws IOException {

		PoolingHttpClientConnectionManager poolingConnManager = new PoolingHttpClientConnectionManager();
		poolingConnManager.setMaxTotal(128);
		poolingConnManager.setDefaultMaxPerRoute(128);

		CloseableHttpClient httpClient = HttpClients.custom().setConnectionManager(poolingConnManager).build();

		try (CloseableHttpResponse response = httpClient.execute(request)) {
			try {
				final int statusCode = response.getStatusLine().getStatusCode();
				final String result;
				if (statusCode == 200) {
					HttpEntity entity = response.getEntity();
					if (entity != null) {
						result = new String(entity.getContent().readAllBytes(), StandardCharsets.UTF_8);
						if (objectMapper == null)
							objectMapper = new ObjectMapper();
						return objectMapper.readValue(result, valueType);
					}
				}

		} finally {
			EntityUtils.consume(response.getEntity());
		}
		}
		return null;
	}

	private <T> T callService(HttpUriRequest request, String username, String password,  Class<T> entityResponseType)
			throws IOException {

		if (username != null && username.trim().length()>0 && password != null && password.trim().length()>0) {
			request.setHeader("Authorization",
					"Basic " + Base64.getEncoder().encodeToString(String.format("%s:%s", username, password).getBytes()));
		}

		return callService(request, entityResponseType);
	}

	protected <T> T get(String url, String username, String password, Class<T> entityResponseType)
			throws IOException {
		final HttpGet httpGet = new HttpGet(url);
		return callService(httpGet, username, password, entityResponseType);
	}

	protected <T> T post(String url, String body, String username,String password, Class<T> entityResponseType) throws IOException {
		final HttpPost httpPost = new HttpPost(url);
		httpPost.setEntity(new StringEntity(body, ContentType.APPLICATION_JSON));
		return callService(httpPost, username, password, entityResponseType);
	}


	protected PslpMessaggio msgFromString(String dsMessaggio) {
		PslpMessaggio msg = new PslpMessaggio();
		TipoMessaggio tipo = new TipoMessaggio();
		tipo.setCodTipoMessaggio("E");
		tipo.setDescrTipoMessaggio("Errore");
		msg.setPslpDTipoMessaggio(tipo);
		msg.setCodMessaggio("E500");
		msg.setDescrMessaggio(dsMessaggio);
		return msg;
	}

}
