/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpapi.api.dto.Ruolo;
import it.csi.pslp.pslpapi.integration.entity.PslpDRuolo;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class RuoloMapper implements BaseMapperInterface<Ruolo,PslpDRuolo> {

	public abstract Ruolo toModel(PslpDRuolo entity);

}