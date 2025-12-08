/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.DidApi;
import it.csi.pslp.pslpbff.api.dto.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.response.ReportResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.*;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.integration.entity.PslpDTipoMessaggio;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.CommonUtils;
import it.csi.pslp.pslpbff.util.PslpConstants;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class DidApiServiceImpl extends BaseApiServiceImpl implements DidApi {

    @Inject
    SilpapiManager silpapiManager;

    @Audited
    @Override
    public Response getUltimaDid(Long idSilLavAnagrafica, String codiceFiscale, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        if (idSilLavAnagrafica == null || codiceFiscale == null) {
            PslpMessaggio pslpMessaggio = new PslpMessaggio();
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getUltimaDid(idSilLavAnagrafica, codiceFiscale));
    }

    //======================================================================
    //  CDU 11 - controlli pre inserimento
    @Audited
    @Override
    public Response controlliPreInserisciDid(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.controlliPreInserisciDid(idSilLavAnagrafica));
    }

    @Override
    public Response controlliStampaDid(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.controlliStampaDid(idSilLavAnagrafica));
    }

    //======================================================================
    //  CDU 11 - on change data did
    @Audited
    @Override
    public Response onChangeDataDid(FormInserisciDid formInserisciDid, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.onChangeDataDid(formInserisciDid));
    }

    //======================================================================
    //  CDU 11 - Inserisci Did
    @Audited
    @Override
    public Response salvaDid(FormInserisciDid request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.salvaDid(request));
    }

    //======================================================================
    //  CDU 11 - ricerca DidInps
    @Audited
    @Override
    public Response ricercaDidInps(FormRicercaDidInps formRicercaDidInps, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        //TODO : data DID INPS, obbligatorio uno tra CF o numero DID INPS
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.ricercaDidInps(formRicercaDidInps));
    }


    //======================================================================
    //  CDU 11 - find-titoliStudioLav
    @Audited
    @Override
    public Response findTitoliStudioByIdLav(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findTitoliStudioByIdLav(idSilLavAnagrafica));
    }

    //======================================================================
    //  CDU 11 - findAll-condizioneOccupazionale
    @Audited
    @Override
    public Response findAllCondizioneOccupazionale(SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findAllCondizioneOccupazionale());
    }

    //======================================================================
    //  CDU 11 - findAll-presenzaInItalia
    @Audited
    @Override
    public Response findAllDurataPresenzaItalia(SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findAllDurataPresenzaItalia());
    }

    @Override
    public Response findTipoPatenteByFlgPossesso(String flgPossesso, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.findTipoPatenteByFlgPossesso(flgPossesso));
    }

    //======================================================================
    //  CDU 11 - inserisce patente/ patentino
    @Audited
    @Override
    public Response inserisciPatenteLavoratore(DatiPatenteLavoratore formRicercaDidInps, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.inserisciPatenteLavoratore(formRicercaDidInps));
    }

    @Audited
    @Override
    public Response inserisciTitoloStudioLavoratore(DatiTitoloStudioLavoratore request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.inserisciTitoloStudioLavoratore(request));
    }

    @Override
    public Response sendSapSilp(FormOrchestratore formOrchestratore, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.sendSapSilp(formOrchestratore));
    }

    @Override
    public Response stampaAttestatoDisoccupazione(FormInserisciDid did, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {


        ReportResponse pS=silpapiManager.stampaAttestatoDisoccupazione(did);
        if (Boolean.TRUE.equals(pS.getEsitoPositivo())) {
            Log.info(pS.composeResponse());
            return pS.composeResponse();
        }

        return  buildManagedResponseEndEsterna(httpHeaders, pS);
    }

    //per riuscire a stampare nel caso sia appena fatto l'inserimento DID
    @Override
    public Response riceviSap(FormOrchestratore formOrchestratore, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.riceviSap(formOrchestratore));
    }

}
