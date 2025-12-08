/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpbff.api.dto.UtentePrivacy;
import it.csi.pslp.pslpbff.integration.entity.PslpRUtentePrivacy;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class UtentePrivacyMapper implements BaseMapperInterface<UtentePrivacy,PslpRUtentePrivacy> {

	public abstract UtentePrivacy toModel(PslpRUtentePrivacy entity);

}