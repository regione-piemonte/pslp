/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util.report;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Valore {

	private String name;
	private String value;

	private String name2;
	private String value2;
	
	public Valore() {
	}

	public Valore(String name, String value) {
		this.name = name;
		this.value = value;
	}

	public Valore(String name, String value, String name2, String value2) {
		this.name = name;
		this.value = value;
		this.name2 = name2;
		this.value2 = value2;
	}


}
