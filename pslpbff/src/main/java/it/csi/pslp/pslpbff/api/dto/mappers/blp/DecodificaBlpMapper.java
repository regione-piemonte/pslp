/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers.blp;

import it.csi.pslp.pslpbff.api.dto.Decodifica;
import it.csi.pslp.pslpbff.api.dto.mappers.BaseMapperInterface;
import jakarta.enterprise.context.ApplicationScoped;
import org.mapstruct.Mapper;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class DecodificaBlpMapper implements BaseMapperInterface<Decodifica,it.csi.pslp.pslpbff.api.dto.blp.Decodifica> {

    public abstract Decodifica toModel(it.csi.pslp.pslpbff.api.dto.blp.Decodifica entity);
}
