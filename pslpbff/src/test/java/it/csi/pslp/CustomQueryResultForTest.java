/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;
package it.csi.pslp;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

/**
 * Entity scollegata da una tabella ma che serve solo come contenitore del risultato di una query custom
 * @author 1871
 *
 */
@Entity
public class CustomQueryResultForTest {
	@Id
	int id;
	
	String desc1;
	String desc2;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getDesc1() {
		return desc1;
	}
	public void setDesc1(String desc1) {
		this.desc1 = desc1;
	}
	public String getDesc2() {
		return desc2;
	}
	public void setDesc2(String desc2) {
		this.desc2 = desc2;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("CustomQueryResultForTest [id=");
		builder.append(id);
		builder.append(", ");
		if (desc1 != null) {
			builder.append("desc1=");
			builder.append(desc1);
			builder.append(", ");
		}
		if (desc2 != null) {
			builder.append("desc2=");
			builder.append(desc2);
		}
		builder.append("]");
		return builder.toString();
	}

}
