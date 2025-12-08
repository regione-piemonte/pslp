/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.integration.entity.PslpDMessaggio;
import jakarta.enterprise.context.Dependent;

@Dependent
public class MessaggioManager extends BaseApiServiceImpl {
	public PslpMessaggio getMessaggioByCodice(String codice){

		return mappers.MESSAGGIO.toModel(PslpDMessaggio.find("codMessaggio", codice).firstResult());
	}
}
