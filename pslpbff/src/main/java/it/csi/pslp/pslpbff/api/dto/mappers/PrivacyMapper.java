/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpbff.api.dto.Privacy;
import it.csi.pslp.pslpbff.integration.entity.PslpDPrivacy;
import jakarta.enterprise.context.ApplicationScoped;
import org.mapstruct.Mapping;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class PrivacyMapper implements BaseMapperInterface<Privacy,PslpDPrivacy> {

	public abstract Privacy toModel(PslpDPrivacy entity);

}