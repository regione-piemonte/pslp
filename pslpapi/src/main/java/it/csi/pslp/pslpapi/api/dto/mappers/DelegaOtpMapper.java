/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.mappers;

import org.mapstruct.Mapper;

import it.csi.pslp.pslpapi.api.dto.DelegaOtp;
import it.csi.pslp.pslpapi.integration.entity.PslpTDelegaOtp;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Mapper(componentModel = "jakarta")
public abstract class DelegaOtpMapper implements BaseMapperInterface<DelegaOtp,PslpTDelegaOtp> {

	public abstract DelegaOtp toModel(PslpTDelegaOtp entity);

}