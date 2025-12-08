/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

import java.util.List;

import lombok.Data;

@Data
public class SqlComplexResult<E> {
	int recordOfPage;
	int totalResult;
	int totalPage;
	List<E> list;
}
