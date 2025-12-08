/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpbff.api.dto.Delega;
import it.csi.pslp.pslpbff.integration.entity.PslpTDelega;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class DelegaMapper implements BaseMapperInterface<Delega,PslpTDelega> {

	public abstract Delega toModel(PslpTDelega entity);

}