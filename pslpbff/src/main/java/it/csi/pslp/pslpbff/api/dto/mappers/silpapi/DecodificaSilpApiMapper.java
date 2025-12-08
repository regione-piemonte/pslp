/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers.silpapi;

import it.csi.pslp.pslpbff.api.dto.Decodifica;
import it.csi.pslp.pslpbff.api.dto.mappers.BaseMapperInterface;
import jakarta.enterprise.context.ApplicationScoped;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class DecodificaSilpApiMapper implements BaseMapperInterface<Decodifica,it.csi.pslp.pslpbff.api.dto.silpapi.Decodifica> {

	public abstract Decodifica toModel(it.csi.pslp.pslpbff.api.dto.silpapi.Decodifica entity);

}