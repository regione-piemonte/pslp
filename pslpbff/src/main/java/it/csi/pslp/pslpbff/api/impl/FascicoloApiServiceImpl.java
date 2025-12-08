/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.FascicoloApi;
import it.csi.pslp.pslpbff.api.dto.silpapi.*;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.PslpConstants;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

@ApplicationScoped
public class FascicoloApiServiceImpl extends BaseApiServiceImpl implements FascicoloApi {

    @Inject SilpapiManager silpapiManager;

    //======================================================================
    //  CDU 08 -  torna il fascicolo  mediante getDettaglioFascicolo del servizio SILPAPI
    @Audited
    @Override
    public Response getDettaglioFascicolo(Long idSilLavAnagrafica, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getFascicolo(String.format(PslpConstants.SILPAPI_URL_FASCICOLO_DETTAGLIO,idSilLavAnagrafica), httpHeaders) );
    }

    //======================================================================
    //  CDU 09 -  salva il fascicolo
    @Audited
    @Override
    public Response controllaProseguiSalva(ControlliFascicoloRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.controllaSalvaFascicolo(PslpConstants.SILPAPI_URL_FASCICOLO_CONTROLLA_SALVA, request));
    }

    @Override
    public Response ricercaSediAzienda(RicercaSediAziendaRequest request, int page, int recForPage, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        Log.info(String.format(PslpConstants.SILPAPI_URL_FASCICOLO_RICERCA_SEDI_AZIENDA,page, recForPage));
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.ricercaSediAziendaSilp(String.format(PslpConstants.SILPAPI_URL_FASCICOLO_RICERCA_SEDI_AZIENDA,page, recForPage), request));
    }


    // =====================================================================================
    //  CDU 09 -  dettaglio esperienza professionale
    //
    @Audited
    @Override
    public Response getDettaglioEsperienzaProfessionale(Long idSilLavEsperienzaLavoro, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getDettaglioEsperienzaProfessionale(String.format(PslpConstants.SILPAPI_URL_FASCICOLO_DETTAGLIO_ESPERIENZA_LAVORO, idSilLavEsperienzaLavoro)));
    }

    @Override
    public Response getDettaglioCorsoFormazione(Long idSilLavCorsoForm, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getDettaglioCorsoFormazione(String.format(PslpConstants.SILPAPI_URL_FASCICOLO_DETTAGLIO_CORSO_FORMAZIONE, idSilLavCorsoForm)));

    }

    // =====================================================================================
    //  CDU 09 -  dettaglio titolo di studio
    //
    @Audited
    @Override
    public Response getDettaglioTitoloDiStudio(Long idSilLavTitoloStudio, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.getDettaglioTitoloDiStudio(String.format(PslpConstants.SILPAPI_URL_FASCICOLO_DETTAGLIO_TITOLO_STUDIO, idSilLavTitoloStudio)));
    }

    // =====================================================================================
    //  CDU 09 -  delete esperienza professionale
    //
    @Audited
    @Override
    public Response deleteEsperienzaProfessionale(Long idSilLavEsperienzaLavoro, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.deleteDettaglioEsperienzaProfessionale(idSilLavEsperienzaLavoro));
    }

    @Audited
    @Override
    public Response insertOrUpdateEsperienzaLavoro(EsperienzaLavoroRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrUpdateEsperienzaLavoroSilp(request));
    }

    //======================================================================
    //  CDU 09 -  insert or update titolo di studio
    @Audited
    @Override
    public Response insertOrUpdateTitoloStudio(TitoloStudioRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrUpdateTitoloStudio(request));
    }

    //======================================================================
    //  CDU 09 -  insert or update corso formazione
    @Audited
    @Override
    public Response insertOrUpdateCorsoFormazione(CorsoFormazioneRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrUpdateCorsoFormazione(request));
    }

    //======================================================================
    //  CDU 09 -  elimina corso formazione
    @Override
    public Response deleteCorsoFormazione(CorsoFormazioneRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.deleteCorsoFormazione(request));
    }

    //======================================================================
    //  CDU 09 -  insert or update lingua
    @Audited
    @Override
    public Response insertOrUpdateLingua(LinguaRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrUpdateLingua(request));
    }

    //======================================================================
    //  CDU 09 -  insert or delete albo
    @Audited
    @Override
    public Response insertOrDeleteAlbo(AlboRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrDeleteAlbo(request));
    }

    //======================================================================
    //  CDU 09 -  insert or update informatica
    @Audited
    @Override
    public Response insertOrUpdateInformatica(InformaticaRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrUpdateInformatica(request));
    }

    //======================================================================
    //  CDU 09 -  insert or update patente
    @Audited
    @Override
    public Response insertOrDeletePatente(PatenteRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.insertOrDeletePatente(request));
    }

    @Override
    @Audited
    public Response deleteInformatica(InformaticaRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.deleteInformatica(request));
    }

    @Override
    @Audited
    public Response deleteLingua(LinguaRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.deleteLingua(request));
    }

    //======================================================================
    //  CDU 09 -  delete titolo studio
    @Audited
    @Override
    public Response deleteTitoloStudio(TitoloStudioRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        return buildManagedResponseEndEsterna(httpHeaders, silpapiManager.deleteTitoloStudio(request));
    }

    @Audited
    @Override
    public Response inserisciModificaFascicoloCittadino(ControlliFascicoloRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        return buildManagedResponseEndEsterna(httpHeaders,silpapiManager.inserisciModificaFascicoloCittadino(request));
    }


}
