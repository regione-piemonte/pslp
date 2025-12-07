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
public class SubSezione {

	private String titolo;
	private List<Valore> valori;

	public SubSezione() {
	}

	public SubSezione(String titolo) {
		this.titolo = titolo;
	}

	public void addValore(Valore valore) {
		if (valori == null)
			this.valori = new ArrayList<>();
		this.valori.add(valore);
	}

	public void addValore(String name) {
		if (valori == null)
			this.valori = new ArrayList<>();
		this.valori.add(new Valore(name, ""));
	}

	public void addValore(String name, String value) {
		if (valori == null)
			this.valori = new ArrayList<>();
		this.valori.add(new Valore(name, value));
	}

	public void addValore(String name, String value, String name2, String value2) {
		if (valori == null)
			this.valori = new ArrayList<>();

		this.valori.add(new Valore(name, value, name2, value2));
	}

}
