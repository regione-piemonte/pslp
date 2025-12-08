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
public class DelegaOtp {

	@JsonProperty("idDelegaOtp")
	private Long idDelegaOtp;
	
	@JsonProperty("codiceFiscale")
	private String codiceFiscale;
	
	@JsonProperty("otp_generato")
	private String otp_generato;
	
	@JsonProperty("otpInserito")
	private String otpInserito;
	
	@JsonProperty("dataInvio")
	private Date dataInvio;
	

	@JsonProperty("codUserAggiorn")
	private String codUserAggiorn;

	@JsonProperty("codUserInserim")
	private String codUserInserim;

	@JsonProperty("dAggiorn")
	private Date dAggiorn;

	@JsonProperty("dFine")
	private Date dFine;

	@JsonProperty("dInizio")
	private Date dInizio;

	@JsonProperty("dInserim")
	private Date dInserim;


}