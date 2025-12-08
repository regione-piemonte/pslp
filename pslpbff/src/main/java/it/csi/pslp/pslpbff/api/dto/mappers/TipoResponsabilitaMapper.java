/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpbff.api.dto.TipoResponsabilita;
import it.csi.pslp.pslpbff.integration.entity.PslpDTipoResponsabilita;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class TipoResponsabilitaMapper implements BaseMapperInterface<TipoResponsabilita,PslpDTipoResponsabilita> {

	public abstract TipoResponsabilita toModel(PslpDTipoResponsabilita entity);

}