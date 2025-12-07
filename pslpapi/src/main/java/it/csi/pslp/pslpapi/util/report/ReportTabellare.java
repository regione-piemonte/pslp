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
public class ReportTabellare {

	private String name;
	private String titolo;
	private List<String> nomiColonne;
	private List<List<Object>> valori;
	private boolean landscape;
	
	public ReportTabellare() {
	}

	public ReportTabellare(String titolo) {
		this.titolo = titolo;
	}

	public void addValori(List<Object> valore) {
		if (valori == null)
			this.valori = new ArrayList<>();
		this.valori.add(valore);
	}


	public void addNomiColonne(String nomeColonna) {
		if (nomiColonne == null)
			this.nomiColonne = new ArrayList<>();
		this.nomiColonne.add(nomeColonna);
	}


	public String getName() {
		if (name != null)
			return name;
		else return titolo;
	}


}
