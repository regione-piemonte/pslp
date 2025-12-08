/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import it.csi.pslp.pslpbff.api.CvApi;
import it.csi.pslp.pslpbff.api.dto.blp.Candidatura;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioAbilitazioneDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioAlboDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioConoscenzaInformaticaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioCvRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioEsperienzaLavRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioIstruzioneDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioLinguaDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioProfessioneDesiderataRequest;
import it.csi.pslp.pslpbff.api.dto.blp.ElencoCVRequest;
import it.csi.pslp.pslpbff.api.dto.blp.GeneraCvRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaCandidaturaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaConInformaticaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaCorsoFormazioneRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaEsperienzaLavRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaIstruzioneDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaLinguaDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciAggiornaProfessioneDesiderataRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciEliminaAbilitazioneRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciEliminaAlboDichRequest;
import it.csi.pslp.pslpbff.api.dto.blp.InserisciEliminaPatentePossedutaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.StampaCvRequest;
import it.csi.pslp.pslpbff.api.dto.blp.ValidaCvRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.CurriculumVitaeRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.CurriculumVitaeResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.CvManager;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.RestUtils;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CvApiServiceImpl extends BaseApiServiceImpl implements CvApi {

    @ConfigProperty(name = "blpapi.url")
    String blpapiUrl;

    @ConfigProperty(name = "blpapi.user")
    String blpapiUser;

    @ConfigProperty(name = "blpapi.password")
    String blpapiPassword;

    @Inject
    RestUtils restUtils;

    @Inject
    SilpapiManager silpapiManager;

    @Inject
    CvManager cvManager;

    @Audited
    @Override
    public Response aggiornaConoscenzeInfoDich(InserisciAggiornaConInformaticaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaCorso(InserisciAggiornaCorsoFormazioneRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaCvAutomatico(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciCv(InserisciAggiornaCandidaturaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaCv(InserisciAggiornaCandidaturaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaEsperienzaLavoro(InserisciAggiornaEsperienzaLavRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciProfessioneDesiderata(InserisciAggiornaProfessioneDesiderataRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaProfessioneDesiderata(InserisciAggiornaProfessioneDesiderataRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response eliminaProfessioneDesiderataById(DettaglioProfessioneDesiderataRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoProfessioniDesiderateByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaIstruzioneDich(InserisciAggiornaIstruzioneDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response aggiornaLinguaDich(InserisciAggiornaLinguaDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePut(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteAbilitazioneDichById(DettaglioAbilitazioneDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciAbilitazioneDich(InserisciEliminaAbilitazioneRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteAlboDichById(DettaglioAlboDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciAlboDich(InserisciEliminaAlboDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteConoscenzeInfoDichById(DettaglioConoscenzaInformaticaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteCorsoById(it.csi.pslp.pslpbff.api.dto.blp.CorsoFormazioneBlpRequest body, @Context SecurityContext securityContext,
            HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteEsperienzaLavoroById(DettaglioEsperienzaLavRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteIstruzioneDichById(DettaglioIstruzioneDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deleteLinguaDichById(DettaglioLinguaDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response deletePatentePossedutaById(InserisciEliminaPatentePossedutaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciPatentePosseduta(InserisciEliminaPatentePossedutaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoAbilitazioniDichByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoAlbiDichByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoConoscenzeInfoDichByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoCorsiByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoEsperienzeLavoroByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoIstruzioniByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoLingueIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response elencoPatentiPosseduteByIdCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response eliminaCvById(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Override
    public Response copiaCvValidato(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response generaCvAutomatico(GeneraCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response getCvById(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response getElencoCvForLavAnagrafica(ElencoCVRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciConoscenzeInfoDich(InserisciAggiornaConInformaticaRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciCorso(InserisciAggiornaCorsoFormazioneRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciEsperienzaLavoro(InserisciAggiornaEsperienzaLavRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciIstruzioneDich(InserisciAggiornaIstruzioneDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response inserisciLinguaDich(InserisciAggiornaLinguaDichRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response rinnovaScadenzaCv(DettaglioCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Audited
    @Override
    public Response validaCv(ValidaCvRequest body, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, body, blpapiUrl, blpapiUser, blpapiPassword);
    }

    @Override
    public Response inviaDatiCvASilp(Candidatura candidatura, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        CurriculumVitaeRequest  request  = cvManager.costruisciRequestCv(candidatura);
        CurriculumVitaeResponse response = silpapiManager.inviaDatiCvASilp(request);

        return buildManagedResponseEndEsterna(httpHeaders, response);
    }

    @Override
    public Response stampaCv(StampaCvRequest stampaCvRequest, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return restUtils.chiamatePost(uriInfo, stampaCvRequest, blpapiUrl, blpapiUser, blpapiPassword);
    }
}
