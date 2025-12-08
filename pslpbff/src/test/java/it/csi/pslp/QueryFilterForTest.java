/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;
package it.csi.pslp;

/**
 * Un generico oggetto pojo dove impostare i parametri in input per una query
 * @author 1871
 *
 */
public class QueryFilterForTest {
	
	
	String pDescriz;
	Long numMaxRecord;
	public String getpDescriz() {
		return pDescriz;
	}
	public void setpDescriz(String pDescriz) {
		this.pDescriz = pDescriz;
	}
	public Long getNumMaxRecord() {
		return numMaxRecord;
	}
	public void setNumMaxRecord(Long numMaxRecord) {
		this.numMaxRecord = numMaxRecord;
	}
	


}
