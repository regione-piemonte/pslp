/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers.silpapi;


import it.csi.pslp.pslpbff.api.dto.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.mappers.BaseMapperInterface;
import jakarta.enterprise.context.ApplicationScoped;
import org.mapstruct.Mapper;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class ApiMessageSilpApiMapper implements BaseMapperInterface<ApiMessage, it.csi.pslp.pslpbff.api.dto.silpapi.ApiMessage> {

	public abstract ApiMessage toModel(it.csi.pslp.pslpbff.api.dto.silpapi.ApiMessage entity);

}