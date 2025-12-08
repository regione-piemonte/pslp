/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PslpMessaggio {

	@JsonProperty("idMessaggio")
	private Long idMessaggio;

	@JsonProperty("codMessaggio")
	private String codMessaggio;

	@JsonProperty("dFine")
	private Date dFine;

	@JsonProperty("dInizio")
	private Date dInizio;

	@JsonProperty("descrMessaggio")
	private String descrMessaggio;

	@JsonProperty("intestazione")
	private String intestazione;

	@JsonProperty("testo")
	private String testo;

	@JsonProperty("pslpDTipoMessaggio")
	private TipoMessaggio pslpDTipoMessaggio;


}