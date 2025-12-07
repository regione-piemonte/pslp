/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.common;

import java.util.Collection;

import it.csi.pslp.pslpapi.api.dto.ApiMessage;

/**
 * Classe base da cui devono estendere le classi restituite dai servizi api
 */
public abstract class BaseResponse extends CommonResponse {

	// Esito globale della chiamata, posto a false se e' presente almeno un
	// messaggio di tipo error
	protected boolean esitoPositivo = true;

	/**
	 * Aggiunge un messaggio di errore all'elenco. Se ti tipo error pone anche
	 * l'esito totale a negativo
	 * 
	 * @param message
	 */
	public void addApiMessage(ApiMessage message) {
		getApiMessages().add(message);
		if (message.getError()) {
			setEsitoPositivo(false);
		}
	}

	public String retrieveErrorsAsString() {
		StringBuilder sb = new StringBuilder("");
		for (ApiMessage m : getApiMessages()) {
			sb.append(m.getCode() + "-" + m.getMessage() + "\n");
		}
		return sb.toString();
	}

	public void clearApiMessage() {
		getApiMessages().clear();
	}

	public void addApiMessages(Collection<ApiMessage> messages) {
		this.getApiMessages().addAll(messages);
	}

	public boolean isPresenteErrore(String codice) {
		for (ApiMessage m : getApiMessages()) {
			if (m.getCode().equals(codice) && m.getError()) {
				return true;
			}
		}
		return false;
	}

	public boolean isPresenteErroreConTesto(String codice, String testoParziale) {
		for (ApiMessage m : getApiMessages()) {
			if (m.getCode().equals(codice) && m.getError() && m.getMessage().indexOf(testoParziale) >= 0) {
				return true;
			}
		}
		return false;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("BaseResponseExt [esitoPositivo=");
		builder.append(esitoPositivo);
		builder.append(", ");
		if (super.toString() != null) {
			builder.append("toString()=");
			builder.append(super.toString());
		}
		builder.append("]");
		return builder.toString();
	}

}
