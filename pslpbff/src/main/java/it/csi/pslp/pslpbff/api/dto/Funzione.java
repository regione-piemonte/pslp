/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Funzione {

	@JsonProperty("idFunzione")
	private Long idFunzione;

	@JsonProperty("dsNoteFunzione")
	private String dsNoteFunzione;

	@JsonProperty("iconaFunzione")
	private String iconaFunzione;

	@JsonProperty("sottotitoloFunzione")
	private String sottotitoloFunzione;

	@JsonProperty("titoloFunzione")
	private String titoloFunzione;

	@JsonProperty("pslpDPrivacies")
	private List<Privacy> pslpDPrivacies;

	@JsonProperty("flgAttiva")
	private String flgAttiva;

}