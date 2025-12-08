/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.stradario;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class IndirizzoStradario {

	@JsonProperty("descrizione")
	private String descrizione;

	@JsonProperty("tipoVia")
	private String tipoVia;

	@JsonProperty("nomeVia")
	private String nomeVia;

	@JsonProperty("civicoNumero")
	private String civicoNumero;

	@JsonProperty("civicoSub")
	private String civicoSub;

	@JsonProperty("cap")
	private String cap;

	@JsonProperty("localita")
	private String localita;
	
	@JsonProperty("comune")
	private String comune;
	
	@JsonProperty("codIstat")
	private String codIstat;
	
	@JsonProperty("provincia")
	private String provincia;
	
	@JsonProperty("siglaProvincia")
	private String siglaProvincia;
	
	@JsonProperty("circoscrizione")
	private String circoscrizione;
	
}
