/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import it.csi.pslp.pslpbff.api.PrivacyApi;
import it.csi.pslp.pslpbff.api.dto.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.Utente;
import it.csi.pslp.pslpbff.api.dto.UtentePrivacy;
import it.csi.pslp.pslpbff.api.dto.request.FormConfermaPrivacy;
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import it.csi.pslp.pslpbff.api.dto.response.PrivacyResponse;
import it.csi.pslp.pslpbff.api.dto.response.UtentePrivacyListResponse;
import it.csi.pslp.pslpbff.api.dto.response.UtentePrivacyResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.integration.entity.PslpDPrivacy;
import it.csi.pslp.pslpbff.integration.entity.PslpRUtentePrivacy;
import it.csi.pslp.pslpbff.integration.entity.PslpTUtente;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.PslpThreadLocalContainer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class PrivacyApiServiceImpl extends BaseApiServiceImpl implements PrivacyApi {

    //======================================================================
    //  CDU 03 -  5.1	Visualizza Privacy utente collegato

    @Override
    public Response privacyUtenteCollegato(Long idUtente, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        List<PslpRUtentePrivacy> list= PslpRUtentePrivacy.find("pslpTUtente1.idUtente",idUtente).list();
        List<PslpDPrivacy> listPrivacy = PslpDPrivacy.listAll();
        List<UtentePrivacy> utentePrivacyList = listPrivacy.stream()
                .map(from->{
                    UtentePrivacy utentePrivacy = new UtentePrivacy();
                    PslpRUtentePrivacy privacyUtenteVisual = null;
                    for (PslpRUtentePrivacy privacyUtente: list) {
                        if(privacyUtente.getPslpDPrivacy().getIdPrivacy().equals(from.getIdPrivacy()))
                            privacyUtenteVisual = privacyUtente;
                    }

                    if(privacyUtenteVisual != null)
                        utentePrivacy = mappers.UTENTE_PRIVACY.toModel(privacyUtenteVisual);
                    else{
                        utentePrivacy.setPslpDPrivacy(mappers.PRIVACY.toModel(from));
                    }

                    return utentePrivacy;
                })
                .collect(Collectors.toList());

        return buildManagedResponse(httpHeaders, new UtentePrivacyListResponse.Builder().setList(utentePrivacyList).build());
    }

    //======================================================================
    //  CDU 03 -  5.2	Visualizza Privacy
    @Override
    public Response visualizzaPrivacy(String codPrivacy, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        final String methodName = "visualizzaPrivacy";
        PslpDPrivacy privacy = PslpDPrivacy.find("codPrivacy", codPrivacy).firstResult();
        PrivacyResponse privacyResponse = new PrivacyResponse();
        privacyResponse.setPrivacy(mappers.PRIVACY.toModel(privacy));
        return buildManagedResponseLogEnd(httpHeaders, privacyResponse , methodName);
    }


    //======================================================================
    //  CDU 03 -  5.3	Conferma Privacy
    @Audited
    @Override
    @Transactional
    public Response confermaPrivacy(FormConfermaPrivacy formConfermaPrivacy, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {

        UtentePrivacyResponse utentePrivacyResponse = new UtentePrivacyResponse();
        Date adesso = Date.from ((Instant) PslpDPrivacy.getEntityManager().createQuery("select now()").getResultList().get(0));
        Utente utente = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
        PslpRUtentePrivacy pslpRUtentePrivacy = getPslpRUtentePrivacy(formConfermaPrivacy, adesso, utente);

        if(pslpRUtentePrivacy.isPersistent()){
            utentePrivacyResponse.setEsitoPositivo(true);
            utentePrivacyResponse.setUtentePrivacy(new UtentePrivacy());
        }else{
            utentePrivacyResponse.setEsitoPositivo(false);
            List<ApiMessage> apiMessages = new ArrayList<ApiMessage>();
            apiMessages.add(new ApiMessage.Builder().setMessage("Errore" ).build());
            utentePrivacyResponse.setApiMessages(apiMessages);
            return  buildManagedResponse(httpHeaders, utentePrivacyResponse);
        }
        return buildManagedResponse(httpHeaders, utentePrivacyResponse);
    }

    private static PslpRUtentePrivacy getPslpRUtentePrivacy(FormConfermaPrivacy formConfermaPrivacy, Date adesso, Utente utente) {
        PslpRUtentePrivacy pslpRUtentePrivacy = new PslpRUtentePrivacy();
        PslpDPrivacy pslpDPrivacy = new PslpDPrivacy();
        PslpTUtente pslpTUtente = new PslpTUtente();
        pslpDPrivacy.setIdPrivacy(formConfermaPrivacy.getIdPrivacy());
        pslpTUtente.setIdUtente(formConfermaPrivacy.getIdUtente());
        pslpRUtentePrivacy.setPslpDPrivacy(pslpDPrivacy);
        pslpRUtentePrivacy.setPslpTUtente1(pslpTUtente);
        pslpRUtentePrivacy.setDAggiorn(adesso);
        pslpRUtentePrivacy.setDInserim(adesso);
        pslpRUtentePrivacy.setDPresaVisione(adesso);
        pslpRUtentePrivacy.setCodUserAggiorn(utente.getCfUtente());
        pslpRUtentePrivacy.setCodUserInserim(utente.getCfUtente());

        pslpRUtentePrivacy.persist();
        return pslpRUtentePrivacy;
    }

    //======================================================================
    //  CDU 05 -  presa visione privacy
    @Audited
    @Override
    public Response presaVisionePrivacy(Long idUtente, String codPrivacy, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        final String methodName = "presaVisionePrivacy";
        List<PslpRUtentePrivacy> utentePrivacy = PslpRUtentePrivacy.find("pslpTUtente1.idUtente = ?1 and pslpDPrivacy.codPrivacy = ?2", idUtente, codPrivacy).list();
        if(utentePrivacy!=null && !utentePrivacy.isEmpty()){
            PslpMessaggio pslpMessaggio = new PslpMessaggio();
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.OK);
            MsgResponse response = new MsgResponse();
            response.setMsg(pslpMessaggio);
            return buildManagedResponse(httpHeaders, response);
        }

        PslpDPrivacy privacy = PslpDPrivacy.find("codPrivacy", codPrivacy).firstResult();
        PrivacyResponse privacyResponse = new PrivacyResponse();
        privacyResponse.setPrivacy(mappers.PRIVACY.toModel(privacy));
        return buildManagedResponseLogEnd(httpHeaders, privacyResponse , methodName);
    }
}
