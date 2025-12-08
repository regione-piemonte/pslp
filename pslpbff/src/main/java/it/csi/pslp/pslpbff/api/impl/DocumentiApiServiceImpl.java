/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import it.csi.pslp.pslpbff.api.DocumentiApi;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaRichiesteDocumenti;
import it.csi.pslp.pslpbff.api.dto.silpapi.InserisciAggiornaRichiestaDocumentoRequest;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.interceptor.Audited;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class DocumentiApiServiceImpl extends BaseApiServiceImpl implements DocumentiApi {

    @Inject
    SilpapiManager silpapiManager;

    @Audited
    @Override
	public Response ricercaRichiesteDocumenti(FormRicercaRichiesteDocumenti form, @NotNull @Min(0) int page,
			int recForPage, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
    	return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.ricercaRichiesteDocumenti(form, page, recForPage));
	}

    @Audited
    @Override
	public Response visualizzaRichiestaDocumento(Long idRichiestaDocumento, SecurityContext securityContext,
			HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
    	return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.visualizzaRichiestaDocumento(idRichiestaDocumento));
	}

    @Audited
    @Override
	public Response inserisciRichiestaDocumento(InserisciAggiornaRichiestaDocumentoRequest form,
			SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
    	return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.inserisciRichiestaDocumento(form));
	}

    @Audited
	@Override
	public Response stampaDocumentoRichiesto(Long idRichiestaDocumento, SecurityContext securityContext,
			HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		return  silpapiManager.stampaDocumentoRichiesto(idRichiestaDocumento).composeResponse();
	}





}
