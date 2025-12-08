/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.AgendaApi;
import it.csi.pslp.pslpbff.api.dto.ApiError;
import it.csi.pslp.pslpbff.api.dto.silpapi.CommonResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DecodificaListResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.FestivitaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.IncontriAppuntamentiRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.IncontriAppuntamentiResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.ListaIncServiziResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaIncontriAppuntamentiRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaIncontriAppuntamentiResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaSlotLiberiPrenotabiliRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaSlotLiberiPrenotabiliResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.AgendaManager;
import it.csi.pslp.pslpbff.exception.BusinessException;
import it.csi.pslp.pslpbff.interceptor.Audited;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AgendaApiServiceImpl extends BaseApiServiceImpl implements AgendaApi {

    @Inject
    AgendaManager agendaManager;

    @Audited
    @Override
    public Response getDettaglioIncontro(Long idIncontro, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        try {
            IncontriAppuntamentiResponse resp = agendaManager.getDettaglioIncontro(idIncontro);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.getDettaglioIncontro ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI getDettaglioIncontro:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.getDettaglioIncontro ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI getDettaglioIncontro:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }

    }

    @Audited
    @Override
    public Response festivitaAnno(@NotNull @Min(2000) @Max(2999) int anno, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        try {
            FestivitaResponse resp = agendaManager.getFestivitaAnno(anno);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.festivitaAnno ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI festivitaAnno:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.festivitaAnno ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI festivitaAnno:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }
    }

    @Audited
    @Override
    public Response ricercaIncontri(RicercaIncontriAppuntamentiRequest request, @NotNull @Min(-1) int page, int recForPage, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        try {
            RicercaIncontriAppuntamentiResponse resp = agendaManager.ricercaIncontri(request, page, recForPage);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.ricercaIncontri ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI ricercaIncontri:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.ricercaIncontri ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI ricercaIncontri:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }
    }

    @Audited
    @Override
    public Response ricercaSlotLiberiPrenotabili(@NotNull String tipo, RicercaSlotLiberiPrenotabiliRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        try {
            RicercaSlotLiberiPrenotabiliResponse resp = agendaManager.ricercaSlotLiberiPrenotabili(request, tipo);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.ricercaSlotLiberiPrenotabili ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI ricercaSlotLiberiPrenotabili:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.ricercaSlotLiberiPrenotabili ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI ricercaSlotLiberiPrenotabili:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }
    }

    @Audited
    @Override
    public Response salvaIncontro(IncontriAppuntamentiRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        try {
            IncontriAppuntamentiResponse resp = agendaManager.salvaIncontro(request);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.salvaIncontro ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI salvaIncontro:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.salvaIncontro ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI salvaIncontro:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }
    }

    @Audited
    @Override
    public Response verificaVincoliServizioLavoratore(@NotNull Long idSilLav, @NotNull Long idIncServizi, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        try {
            CommonResponse resp = agendaManager.verificaVincoliServizioLavoratore(idSilLav, idIncServizi);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.verificaVincoliServizioLavoratore ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI verificaVincoliServizioLavoratore:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.verificaVincoliServizioLavoratore ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI verificaVincoliServizioLavoratore:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }
    }

    @Audited
    @Override
    public Response elencoSedeEnteDelCpi(@NotNull Long idCpi, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        try {
            DecodificaListResponse resp = agendaManager.elencoSedeEnteDelCpi(idCpi, condizioneData);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.elencoSedeEnteDelCpi ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI elencoSedeEnteDelCpi:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.elencoSedeEnteDelCpi ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI elencoSedeEnteDelCpi:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }

    }

    @Audited
    @Override
    public Response listaIncServizi(@NotNull String categoria, String condizioneData, String ancheBloccati, String idOper, String codTipoAgenda, SecurityContext securityContext, HttpHeaders httpHeaders,
            HttpServletRequest httpRequest) {
        try {
            ListaIncServiziResponse resp = agendaManager.listaIncServizi(categoria, condizioneData, ancheBloccati, idOper, codTipoAgenda);
            return buildManagedResponseEndEsterna(httpHeaders, resp);
        } catch (BusinessException e) {
            Log.error(" errore in AgendaApiServiceImpl.listaIncServizi ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI listaIncServizi:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);

        } catch (Exception e) {
            Log.error(" errore in AgendaApiServiceImpl.listaIncServizi ", e);
            ApiError error = new ApiError();
            error.setCode("errSILP");
            error.setMessage("errore chiamata servizio SILPAPI listaIncServizi:" + e.getMessage());
            return buildManagedResponseKOEsterna(httpHeaders, error);
        }
    }

}
