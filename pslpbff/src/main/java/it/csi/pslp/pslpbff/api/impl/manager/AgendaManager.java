/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.silpapi.CommonRequest;
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
import it.csi.pslp.pslpbff.exception.BusinessException;
import it.csi.pslp.pslpbff.util.CommonUtils;
import jakarta.enterprise.context.Dependent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Dependent
public class AgendaManager extends BaseApiServiceImpl {

    @ConfigProperty(name = "silpapi.url")
    String silpapiUrl;

    @ConfigProperty(name = "silpapi.user")
    String silpapiUser;

    @ConfigProperty(name = "silpapi.password")
    String silpapiPassword;

    public IncontriAppuntamentiResponse getDettaglioIncontro(Long idIncontro) {
        CommonRequest request = new CommonRequest();
        request.setCallInfo(creaCallInfo());

        try {
            // /silpapi/api/v1/agende/incontri/dettaglio/
            IncontriAppuntamentiResponse response = post(silpapiUrl + "/agende/incontri/dettaglio/" + idIncontro, writeValueAsString(request), silpapiUser, silpapiPassword, IncontriAppuntamentiResponse.class);
            return response;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.getDettaglioIncontro", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI dettaglio incontro: " + e.getMessage());
        }

    }

    public FestivitaResponse getFestivitaAnno(@NotNull @Min(2000) @Max(2999) int anno) {

        try {
            // /silpapi/api/v1/agende/incontri/dettaglio/
            FestivitaResponse response = get(silpapiUrl + "/agende/festivita/anno/" + anno, silpapiUser, silpapiPassword, FestivitaResponse.class);
            return response;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.getFestivitaAnno", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI festivita anno: " + e.getMessage());
        }

    }

    public RicercaIncontriAppuntamentiResponse ricercaIncontri(RicercaIncontriAppuntamentiRequest request, @NotNull @Min(-1) int page, int recForPage) {
        request.setCallInfo(creaCallInfo());

        try {
            // /silpapi/api/v1/agende/incontri/ricerca?page=
            RicercaIncontriAppuntamentiResponse response = post(silpapiUrl + "/agende/incontri/ricerca?page=" + page + "&recForPage=" + recForPage, writeValueAsString(request), silpapiUser, silpapiPassword,
                    RicercaIncontriAppuntamentiResponse.class);
            return response;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.ricercaIncontri", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI ricercaIncontri: " + e.getMessage());
        }
    }

    public RicercaSlotLiberiPrenotabiliResponse ricercaSlotLiberiPrenotabili(RicercaSlotLiberiPrenotabiliRequest request, @NotNull String tipo) {
        request.setCallInfo(creaCallInfo());

        try {

            // /silpapi/api/v1/agende/incontri/slot-liberi/ricerca/{tipo}
            RicercaSlotLiberiPrenotabiliResponse response = post(silpapiUrl + "/agende/incontri/slot-liberi/ricerca/" + tipo, writeValueAsString(request), silpapiUser, silpapiPassword,
                    RicercaSlotLiberiPrenotabiliResponse.class);
            return response;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.ricercaSlotLiberiPrenotabili", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI ricercaSlotLiberiPrenotabili: " + e.getMessage());
        }
    }

    public IncontriAppuntamentiResponse salvaIncontro(IncontriAppuntamentiRequest request) {
        request.setCallInfo(creaCallInfo());

        try {
            // /silpapi/api/v1/agende/incontri/salva
            IncontriAppuntamentiResponse response = post(silpapiUrl + "/agende/incontri/salva", writeValueAsString(request), silpapiUser, silpapiPassword,
                    IncontriAppuntamentiResponse.class);
            return response;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.salvaIncontro", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI salvaIncontro: " + e.getMessage());
        }
    }

    public CommonResponse verificaVincoliServizioLavoratore(@NotNull Long idSilLav, @NotNull Long idIncServizi) {
        CommonRequest request = new CommonRequest();
        request.setCallInfo(creaCallInfo());

        try {
            // /silpapi/api/v1/agende/incontri/verifica-vincoli-servizio-lavoratore?idSilLav=" + idSilLav + "&idIncServizi=" + idIncServizi,
            CommonResponse response = post(silpapiUrl + "/agende/incontri/verifica-vincoli-servizio-lavoratore?idSilLav=" + idSilLav + "&idIncServizi=" + idIncServizi, writeValueAsString(request), silpapiUser,
                    silpapiPassword, CommonResponse.class);
            return response;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.verificaVincoliServizioLavoratore", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI verificaVincoliServizioLavoratore: " + e.getMessage());
        }
    }

    public DecodificaListResponse elencoSedeEnteDelCpi(@NotNull Long idCpi, String condizioneData) {
        try {

            String url = "/decodifica/elenco-sede-ente-del-cpi/" + idCpi + (condizioneData != null ? "?condizioneData=" + condizioneData : "");

            DecodificaListResponse response = get(silpapiUrl + url, silpapiUser, silpapiPassword, DecodificaListResponse.class);
            return response;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.elencoSedeEnteDelCpi", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI elencoSedeEnteDelCpi: " + e.getMessage());
        }

    }

    public ListaIncServiziResponse listaIncServizi(@NotNull String categoria, String condizioneData, String ancheBloccati, String idOper, String codTipoAgenda) {
        try {

            String url = "/agende/lista-inc-servizi/" + categoria;
            if (CommonUtils.isNotVoid(condizioneData)) {
                url = url + "?condizioneData=" + condizioneData;
            }
            if (CommonUtils.isNotVoid(ancheBloccati)) {
                if (CommonUtils.isNotVoid(condizioneData)) {
                    url = url + "&";
                } else {
                    url = url + "?";
                }
                url = url + "ancheBloccati='ancheBloccati'";
            }
            if (CommonUtils.isNotVoid(idOper)) {
                if (CommonUtils.isNotVoid(condizioneData) || CommonUtils.isNotVoid(ancheBloccati)) {
                    url = url + "&";
                } else {
                    url = url + "?";
                }
                url = url + "idOperatore=" + idOper;
            }
            if (CommonUtils.isNotVoid(codTipoAgenda)) {
                if (CommonUtils.isNotVoid(condizioneData) || CommonUtils.isNotVoid(ancheBloccati) || CommonUtils.isNotVoid(idOper)) {
                    url = url + "&";
                } else {
                    url = url + "?";
                }
                url = url + "codTipoAgenda=" + codTipoAgenda;
            }
            CommonRequest request = new CommonRequest();
            request.setCallInfo(creaCallInfo());

            ListaIncServiziResponse response = post(silpapiUrl + url, writeValueAsString(request), silpapiUser, silpapiPassword, ListaIncServiziResponse.class);
            return response;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            Log.error("Errore chiamata AgendaManager.listaIncServizi", e);
            throw BusinessException.createError("Errore chiamata servizio SILPAPI listaIncServizi: " + e.getMessage());
        }
    }

    private String writeValueAsString(Object req) throws JsonProcessingException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        return ow.writeValueAsString(req);
    }
}
