/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.impl.generic;

import jakarta.enterprise.context.Dependent;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ext.Provider;

import it.csi.pslp.pslpapi.integration.entity.CsiLogAudit;

@Provider
@Dependent
public class CsiLogAuditManager {

	
	@Transactional(Transactional.TxType.REQUIRES_NEW)
	public void log(CsiLogAudit csiLogAudit){
		csiLogAudit.persist();
    }


}
