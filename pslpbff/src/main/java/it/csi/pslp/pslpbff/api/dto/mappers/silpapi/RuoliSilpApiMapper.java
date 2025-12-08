/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers.silpapi;

import it.csi.pslp.pslpbff.api.dto.mappers.BaseMapperInterface;
import it.csi.pslp.pslpbff.api.dto.silpapi.Ruolo;
import org.mapstruct.Mapper;

import it.csi.pslp.pslpbff.integration.entity.PslpDRuolo;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class RuoliSilpApiMapper implements BaseMapperInterface<PslpDRuolo, Ruolo> {
	public abstract PslpDRuolo toModel(Ruolo entity);

}