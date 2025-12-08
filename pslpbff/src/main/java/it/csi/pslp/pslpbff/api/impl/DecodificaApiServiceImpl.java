/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.panache.common.Sort;
import it.csi.pslp.pslpbff.api.DecodificaApi;
import it.csi.pslp.pslpbff.api.dto.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.response.ParametroListResponse;
import it.csi.pslp.pslpbff.api.dto.response.ParametroResponse;
import it.csi.pslp.pslpbff.api.dto.response.TipoResponsabilitaListResponse;
import it.csi.pslp.pslpbff.api.dto.response.TipoResponsabilitaResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.integration.entity.PslpDParametro;
import it.csi.pslp.pslpbff.integration.entity.PslpDTipoResponsabilita;
import it.csi.pslp.pslpbff.util.CommonUtils;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.QueryUtils;
import it.csi.pslp.pslpbff.util.QueryUtils.Operatore;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class DecodificaApiServiceImpl extends BaseApiServiceImpl implements DecodificaApi {
    @Inject
    private SilpapiManager silpapiManager;

    @Inject
    RestUtils restUtils;
    @ConfigProperty(name = "silpapi.url")
    String    silpapiUrl;

    @ConfigProperty(name = "silpapi.user")
    String silpapiUser;

    @ConfigProperty(name = "silpapi.password")
    String silpapiPassword;

    // ======================================================================
    // TIPO RESPONSABILITA
    @Override
    public Response findTipoResponsabilitaById(String id, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest) {

        return buildManagedResponse(httpHeaders,
                new TipoResponsabilitaResponse.Builder().setTipoResponsabilita(
                        mappers.TIPO_RESPONSABILITA.toModel(PslpDTipoResponsabilita.findById(id))).build());

    }

    @Override
    public Response findTipoResponsabilita(@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest) {
        QueryUtils queryUtils = new QueryUtils();
        queryUtils.addValidRangeDateAnd("dataInizio", "dataFine", new Date());
        List<PslpDTipoResponsabilita> list = PslpDTipoResponsabilita.list(queryUtils.getQuery(), Sort.ascending("descrTipoResponsabilita"), queryUtils.getParams());
        return buildManagedResponse(httpHeaders,
                new TipoResponsabilitaListResponse.Builder().setList(mappers.TIPO_RESPONSABILITA.toModels(list)).build());
    }

    @Override
    public Response fillTipoResponsabilita(String txt, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest) {
        QueryUtils queryUtils = new QueryUtils();
        queryUtils.addValidRangeDateAnd("dataInizio", "dataFine", new Date());
        queryUtils.addParameterAnd("descrTipoResponsabilita", txt, Operatore.LIKE_START);
        List<PslpDTipoResponsabilita> list = PslpDTipoResponsabilita.list(queryUtils.getQuery(), Sort.ascending("descrTipoResponsabilita"), queryUtils.getParams());
        return buildManagedResponse(httpHeaders,
                new TipoResponsabilitaListResponse.Builder().setList(mappers.TIPO_RESPONSABILITA.toModels(list)).build());
    }
    // ======================================================================

    // ======================================================================
    // PARAMETRO
    @Override
    public Response findParametro(String codParametro, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest) {

        QueryUtils queryUtils = new QueryUtils();
        queryUtils.addParameterAnd("codParametro", codParametro, Operatore.UGUALE);
        List<PslpDParametro> list = PslpDParametro.list(queryUtils.getQuery(), queryUtils.getParams());

        ParametroResponse resp = new ParametroResponse();

        if (list != null & list.size() > 0) {
            resp.setEsitoPositivo(true);
            resp.setParametro(mappers.PARAMETRO.toModel(list.get(0)));
        } else {
            resp.setEsitoPositivo(false);
            List<ApiMessage> apiMessages = new ArrayList<ApiMessage>();
            apiMessages.add(new ApiMessage.Builder().setMessage("Parametro non esistente sulla base dati cod=" + codParametro).build());
            resp.setApiMessages(apiMessages);
        }

        return buildManagedResponse(httpHeaders, resp);
    }
    // ======================================================================

    @Override
    public Response findTuttiParametro(SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        List<PslpDParametro> list = PslpDParametro.listAll();
        return buildManagedResponse(httpHeaders, new ParametroListResponse.Builder().setList(mappers.PARAMETRO.toModels(list)).build());
    }
    // ======================================================================

    // ======================================================================
    // Comune by id provincia

    @Override
    public Response findComuneByIdProvincia(String idProvincia, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,
                silpapiManager.getDecodificaList(String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_COMUNE_BY_PROVINCIA, idProvincia)));
    }
    // ======================================================================

    // ======================================================================
    // Comune by id provincia e parte del testo del comune per filtrare

    @Override
    public Response fillComuneByIdProvincia(String idProvincia, String txt, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,
                silpapiManager.getDecodificaList(String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_COMUNE_BY_PROVINCIA_FILTRO, idProvincia, txt)));
    }

    // ======================================================================

    // ======================================================================
    // Find Decodifica - per fare tornare le diverse decodifica in base al tipo di codifica passato come parametro

    @Override
    public Response findDecodificaByTipo(String tipo, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        // queste decodifiche hanno un risultato diverso se chiamate da PSLP
        if ("INC-SERV-CATEG-CONSERVIZI".equalsIgnoreCase(tipo)) {
            tipo = "INC-SERV-CATEG-CONSERV-CIT";
        } else if ("INC-SERV-CATEG-CONLABOR".equalsIgnoreCase(tipo)) {
            tipo = "INC-SERV-CATEG-CONLABOR-CIT";
        }

        String url               = String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND, tipo);
        String urlCondizioneData = "";
        if (CommonUtils.isNotVoid(condizioneData)) {
            urlCondizioneData = "?condizioneData=" + condizioneData;
        }
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getDecodificaList(url + urlCondizioneData));
    }

    // ======================================================================
    // Fill Decodifica con filtro- per fare tornare le diverse decodifica in base al tipo di codifica passato come parametro con filtro

    @Override
    public Response fillDecodificaByTipo(String tipo, String txt, String conCodice, String condizioneData, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        // queste decodifiche hanno un risultato diverso se chiamate da PSLP
        if ("INC-SERV-CATEG-CONSERVIZI".equalsIgnoreCase(tipo)) {
            tipo = "INC-SERV-CATEG-CONSERV-CIT";
        } else if ("INC-SERV-CATEG-CONLABOR".equalsIgnoreCase(tipo)) {
            tipo = "INC-SERV-CATEG-CONLABOR-CIT";
        }

        String url               = String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FILL, tipo, txt);
        String urlConCodice      = "";
        String urlCondizioneData = "";
        if (CommonUtils.isNotVoid(conCodice)) {
            urlConCodice = "?conCodice=" + conCodice;
        }
        if (CommonUtils.isNotVoid(condizioneData)) {
            if (CommonUtils.isNotVoid(conCodice)) {
                urlCondizioneData = "&";
            } else {
                urlCondizioneData = "?";
            }
            urlCondizioneData += "condizioneData=" + condizioneData;
        }
        return buildManagedResponseEndEsterna(httpHeaders,
                silpapiManager.getDecodificaList(url + urlConCodice + urlCondizioneData));
    }

    // ======================================================================
    // Fill Decodifica con filtro- per fare tornare le diverse decodifica in base al tipo di codifica passato come parametro con filtro

    @Override
    public Response fillInformaticaDettByIdInformatica(Long idInformatica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,
                silpapiManager.getDecodificaList(String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_INFORMATICADETT_BY_IDINFORMATICA, idInformatica)));
    }

    // ======================================================================
    // Find Decodifica - per fare tornare le diverse decodifica in base al tipo e id di codifica passato come parametro

    @Override
    public Response findDecodificaByTipoEdId(String tipo, String id, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,
                silpapiManager.getDecodifica(String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_TIPO_ID, tipo, id)));
    }

    @Override
    public Response findTitoloStudioById(String id, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findTitoloStudioById(id));
    }

    @Override
    public Response findTipoLavoro(String id, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findTipoLavoroById(id));

    }
}
