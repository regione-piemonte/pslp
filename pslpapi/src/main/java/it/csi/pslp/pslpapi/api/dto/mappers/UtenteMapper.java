/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpapi.api.dto.Utente;
import it.csi.pslp.pslpapi.integration.entity.PslpTUtente;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class UtenteMapper implements BaseMapperInterface<Utente,PslpTUtente> {

	public abstract Utente toModel(PslpTUtente entity);


}