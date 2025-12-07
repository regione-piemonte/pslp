/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

import java.util.HashMap;
import java.util.Map;

public class QueryFilter {

	private final StringBuffer query;
	private final Map<String, Object> params;

	public QueryFilter() {
		params = new HashMap<String, Object>();
		query = new StringBuffer();
	}

	public QueryFilter openBrackets() {
		query.append(" (");
		return this;
	}

	public QueryFilter closeBrackets() {
		query.append(")");
		return this;
	}

	public QueryFilter and(String name, Object value) {
		return and(name, value, Operatore.UGUALE);
	}

	public QueryFilter and(String name, Object value, Operatore operatore) {
		addParameter("and", name, value, operatore);
		return this;
	}

	public QueryFilter addParameterOr(String name, Object value) {
		return and(name, value, Operatore.UGUALE);
	}

	public QueryFilter or(String name, Object value, Operatore operatore) {
		addParameter("or", name, value, operatore);
		return this;
	}

	private void addParameter(String queryOperator, String name, Object value, Operatore operatore) {

		if (CommonUtils.isNotVoid(value)) {
			if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
				query.append(" " + queryOperator + " ");

			String placeholderName = name.replaceAll("\\.", "");//Per gestire campi con notazione puntata
			if (value instanceof String) {
				
				query.append(name + " " + operatore.getOperatore() + ":" + placeholderName);

				if (Operatore.LIKE == operatore)
					params.put(placeholderName, "%" + value.toString().trim().toUpperCase() + "%");
				else
					params.put(placeholderName, value.toString().toUpperCase());

			} else {
				query.append(name + " " + operatore.getOperatore() + ":" + placeholderName);
				params.put(placeholderName, value);
			}
				

		}
	}

	public String getQuery() {
		return this.query.toString();
	}

	public Map<String, Object> getParams() {
		return this.params;
	}

	public enum Operatore {

		MAGGIORE(">"), MAGGIORE_UGUALE(">="), MINORE("<"), MINORE_UGUALE("<="), UGUALE("="), LIKE("like");

		private String operatore;

		Operatore(String operatore) {
			this.operatore = operatore;
		}

		public String getOperatore() {
			return operatore;
		}
	}

}
