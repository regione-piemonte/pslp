/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpapi.api.dto.PslpMessaggio;
import it.csi.pslp.pslpapi.integration.entity.PslpDMessaggio;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class MessaggioMapper implements BaseMapperInterface<PslpMessaggio,PslpDMessaggio> {

	public abstract PslpMessaggio toModel(PslpDMessaggio entity);

}