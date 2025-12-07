/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Collection;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.csi.pslp.pslpapi.api.dto.ApiError;
import it.csi.pslp.pslpapi.api.dto.ApiMessage;
import it.csi.pslp.pslpapi.api.dto.common.CommonResponse;


public class ResponseUtils {

	public static String createJSONResponseMessage(String code, String message) {
		//Gson gson = new GsonBuilder().disableHtmlEscaping().create();
		String jsonResult = "";
		ApiError ex = new ApiError();
		ex.setCode(code);
		ex.setMessage(message);

		ObjectMapper om = new ObjectMapper();
		StringWriter sw = new StringWriter();
		try 
		{
			om.writeValue(sw, ex);
		} 
		catch (IOException e) 
		{
			//Qualunque eccezione mi produce una stringa vuota, devo gestire altro?
			e.printStackTrace();
			jsonResult = "";
		}
		jsonResult=sw.toString();

		//return gson.toJson(ex);
		return jsonResult;
	}
	
	/**
	 * Aggiunge un messaggio di errore all'elenco. Se ti tipo error pone anche l'esito totale a negativo
	 * @param message
	 */
	public static void addApiMessage(ApiMessage message, CommonResponse r) {
		r.getApiMessages().add(message);
		if(message.getError()) {
			r.setEsitoPositivo(false);
		}
	}
	
	public static String retrieveErrorsAsString(CommonResponse r){
		StringBuilder sb = new StringBuilder("");
		for (ApiMessage m : r.getApiMessages()) {
			sb.append(m.getCode()+"-"+m.getMessage()+"\n");
		}
		return sb.toString();
	}
	
	public static void clearApiMessage(CommonResponse r) {
		r.getApiMessages().clear();
	}

	public static void addApiMessages(Collection<ApiMessage> messages,CommonResponse r) {
		r.getApiMessages().addAll(messages);
	}

	
	
	public static boolean isPresenteErrore(String codice,CommonResponse r) {
		for (ApiMessage m : r.getApiMessages()) {
			if(m.getCode().equals(codice) && m.getError()) {
				return true;
			}
		}
		return false;
	}
	
	public static boolean isPresenteErroreConTesto(String codice,String testoParziale,CommonResponse r) {
		for (ApiMessage m : r.getApiMessages()) {
			if(m.getCode().equals(codice) && m.getError() && m.getMessage().indexOf(testoParziale)>=0) {
				return true;
			}
		}
		return false;
	}
}
