/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util.report;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Sezione {

	private String titolo;
	private List<SubSezione> subsezioni;
	private boolean pageBreak = false;

	public Sezione() {
	}

	public Sezione(String titolo) {
		this.titolo = titolo;
	}

	public void addSubsezione(SubSezione subsezione) {
		if (subsezioni == null)
			this.subsezioni = new ArrayList<>();
		this.subsezioni.add(subsezione);
	}

}
