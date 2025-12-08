/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.DelegaApi;
import it.csi.pslp.pslpbff.api.dto.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.Utente;
import it.csi.pslp.pslpbff.api.dto.request.FormAnagraficaLav;
import it.csi.pslp.pslpbff.api.dto.response.DelegaListResponse;
import it.csi.pslp.pslpbff.api.dto.response.DelegaResponse;
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import it.csi.pslp.pslpbff.api.dto.silos.DatiSMS;
import it.csi.pslp.pslpbff.api.dto.silos.Destinatario;
import it.csi.pslp.pslpbff.api.dto.silos.EsitoMessaggio;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagrafica;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavoratoreResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.MessaggioManager;
import it.csi.pslp.pslpbff.api.impl.manager.SilosapiManager;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.api.impl.manager.UtenteManager;
import it.csi.pslp.pslpbff.exception.BusinessException;
import it.csi.pslp.pslpbff.integration.entity.PslpDParametro;
import it.csi.pslp.pslpbff.integration.entity.PslpDPrivacy;
import it.csi.pslp.pslpbff.integration.entity.PslpDRuolo;
import it.csi.pslp.pslpbff.integration.entity.PslpRUtenteRuolo;
import it.csi.pslp.pslpbff.integration.entity.PslpTDelega;
import it.csi.pslp.pslpbff.integration.entity.PslpTDelegaOtp;
import it.csi.pslp.pslpbff.integration.entity.PslpTUtente;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.PslpThreadLocalContainer;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
public class DelegaApiServiceImpl extends BaseApiServiceImpl implements DelegaApi {
    @Inject
    UtenteManager    utenteManager;
    @Inject
    SilpapiManager   silpapiManager;
    @Inject
    MessaggioManager messaggioManager;
    @Inject
    SilosapiManager  silosapiManager;

    @Override
    public Response findDelegheByDelegate(Long idUtenteDelegante, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        List<PslpTDelega> pslpTDelegaList = PslpTDelega.find("pslpTUtente1.idUtente", idUtenteDelegante).list();
        return buildManagedResponse(httpHeaders, new DelegaListResponse.Builder().setList(mappers.DELEGA.toModels(pslpTDelegaList)).build());
    }

    @Override
    public Response findDelegheByDelegante(Long idUtenteDelegato, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        List<PslpTDelega> pslpTDelegaList = PslpTDelega.find("pslpTUtente2.idUtente", idUtenteDelegato).list();
        return buildManagedResponse(httpHeaders, new DelegaListResponse.Builder().setList(mappers.DELEGA.toModels(pslpTDelegaList)).build());
    }

    // ======================================================================
    // CDU 05 - 5.6 e 5.7 Salvataggio delega
    @Transactional
    @Audited
    @Override
    public Response insertDelega(FormAnagraficaLav formAnagraficaLav, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        Utente utenteConesso = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
        Date   adesso        = Date.from((Instant) PslpDPrivacy.getEntityManager().createQuery("select now()").getResultList().get(0));
        Utente utente        = new Utente();
        utente.setCfUtente(formAnagraficaLav.getAnagraficaLav().getCodFiscale());
        utente.setNome(formAnagraficaLav.getAnagraficaLav().getDsNome());
        utente.setCognome(formAnagraficaLav.getAnagraficaLav().getDsCognome());
        utente.setIdSilLavAnagrafica(formAnagraficaLav.getAnagraficaLav().getIdSilLavAnagrafica());
        PslpTUtente pslpTUtente = null;

        // ricerco in utente
        List<PslpTUtente> list = PslpTUtente.find("cfUtente", utente.getCfUtente()).list();
        if (list != null && !list.isEmpty()) {
            // TODO: aggiornare il dato pslp_t_utente in base ad ultimo che ha modificato, accesso a nome di un cittadino
            pslpTUtente = list.get(0);
        } else {
            // se non ci sono inserisco l'utente
            // TODO: la tabella ruolo-utente viene aggiornata-inserita soltanto con dato dell'operatore-cittadino che accede

            // utente
            pslpTUtente = new PslpTUtente();
            pslpTUtente.setCfUtente(utente.getCfUtente());
            pslpTUtente.setCognome(utente.getCognome());
            pslpTUtente.setNome(utente.getNome());
            pslpTUtente.setIdSilLavAnagrafica(utente.getIdSilLavAnagrafica());

            Date now = new Date();
            pslpTUtente.setCodUserAggiorn(utenteConesso.getCfUtente());
            pslpTUtente.setDAggiorn(now);
            pslpTUtente.setCodUserInserim(utenteConesso.getCfUtente());
            pslpTUtente.setDInserim(now);

            pslpTUtente.persist();

            // utente-ruolo
            PslpRUtenteRuolo pslpRUtenteRuolo = new PslpRUtenteRuolo();
            pslpRUtenteRuolo.setDInizio(now);

            PslpTUtente pslpTUtenteKey = new PslpTUtente();
            pslpTUtenteKey.setIdUtente(pslpTUtente.getIdUtente());
            pslpRUtenteRuolo.setPslpTUtente(pslpTUtenteKey);

            PslpDRuolo pslpDRuoloKey = new PslpDRuolo();
            pslpDRuoloKey.setIdRuolo(PslpConstants.ID_RUOLO_CITTADINO);
            pslpRUtenteRuolo.setPslpDRuolo(pslpDRuoloKey);

            pslpRUtenteRuolo.persist();

        }

        PslpTDelega pslpTDelega = new PslpTDelega();
        pslpTDelega.setPslpTUtente1(PslpTUtente.find("cfUtente", utenteConesso.getCfUtente()).singleResult());
        pslpTDelega.setPslpTUtente2(pslpTUtente);
        pslpTDelega.setPslpDTipoResponsabilita(mappers.TIPO_RESPONSABILITA.toEntity(formAnagraficaLav.getTipoResponsabilita()));
        pslpTDelega.setNumCellulare(formAnagraficaLav.getAnagraficaLav().getDsTelefonoCell());
        pslpTDelega.setDInserim(adesso);
        pslpTDelega.setCodUserInserim(utenteConesso.getCfUtente());
        pslpTDelega.setDAggiorn(adesso);
        pslpTDelega.setCodUserAggiorn(utenteConesso.getCfUtente());
        pslpTDelega.setDInizio(adesso);

        if (formAnagraficaLav.isMinorenne()) {
            LocalDate dataFine = formAnagraficaLav.getAnagraficaLav().getDataNasc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            dataFine = dataFine.plusYears(18);
            pslpTDelega.setDFine(Date.from(dataFine.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
        } else {
            Optional<PslpDParametro> ngiorni  = PslpDParametro.find("codParametro", PslpConstants.PARAMETRO_GIORNI_DELEGA_MAGGIORENNE).firstResultOptional();
            LocalDate                dataFine = pslpTDelega.getDInizio().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            ;
            dataFine = dataFine.plusDays(Integer.parseInt(ngiorni.orElseThrow(() -> {
                Log.debug("parametro non presente");
                return new BusinessException("parametro " + PslpConstants.PARAMETRO_GIORNI_DELEGA_MAGGIORENNE + " non presente");
            }).getValoreParametro()));
            pslpTDelega.setDFine(Date.from(dataFine.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
        }

        pslpTDelega.persist();
        DelegaResponse delegaResponse = new DelegaResponse();

        if (pslpTDelega.isPersistent()) {
            delegaResponse.setEsitoPositivo(true);
            delegaResponse.setDelega(mappers.DELEGA.toModel(pslpTDelega));
        } else {
            delegaResponse.setEsitoPositivo(false);
            List<ApiMessage> apiMessages = new ArrayList<ApiMessage>();
            apiMessages.add(new ApiMessage.Builder().setMessage("Errore").build());
            delegaResponse.setApiMessages(apiMessages);
            return buildManagedResponse(httpHeaders, delegaResponse);
        }
        return buildManagedResponse(httpHeaders, delegaResponse);
    }

    // ======================================================================
    // CDU 05 - 5.8 Elimina delega
    @Transactional
    @Audited
    @Override
    public Response cancellaDelega(Long idDelega, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        PslpMessaggio pslpMessaggio = new PslpMessaggio();
        Long          risp          = PslpTDelega.delete("idDelega", idDelega);
        // TODO audit
        if (risp < 1) {

            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }
        pslpMessaggio.setCodMessaggio("00");
        pslpMessaggio.setDescrMessaggio(PslpConstants.OK);
        MsgResponse response = new MsgResponse();
        response.setMsg(pslpMessaggio);
        return buildManagedResponse(httpHeaders, response);
    }

    @Transactional
    @Override
    public Response attivaDelega(Long idDelega, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        Date        adesso = Date.from((Instant) PslpDPrivacy.getEntityManager().createQuery("select now()").getResultList().get(0));
        PslpTDelega delega = PslpTDelega.findById(idDelega);
        delega.setDFine(adesso);

        Optional<PslpDParametro> ngiorni  = PslpDParametro.find("codParametro", PslpConstants.PARAMETRO_GIORNI_DELEGA_MAGGIORENNE).firstResultOptional();
        LocalDate                dataFine = delega.getDFine().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        ;
        dataFine = dataFine.plusDays(Integer.parseInt(ngiorni.orElseThrow(() -> {
            Log.debug("parametro non presente");
            return new BusinessException("parametro " + PslpConstants.PARAMETRO_GIORNI_DELEGA_MAGGIORENNE + " non presente");
        }).getValoreParametro()));
        delega.setDFine(Date.from(dataFine.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));

        delega.persistAndFlush();
        PslpMessaggio pslpMessaggio = new PslpMessaggio();
        if (!delega.isPersistent()) {
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
            pslpMessaggio.setTesto("Errore DB");
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }
        pslpMessaggio.setCodMessaggio("00");
        pslpMessaggio.setDescrMessaggio(PslpConstants.OK);
        MsgResponse response = new MsgResponse();
        response.setMsg(pslpMessaggio);
        return buildManagedResponse(httpHeaders, response);
    }

    // ======================================================================
    // CDU 05 - invio codice OTP
    @Transactional
    @Audited
    @Override
    public Response invioCodiceOtp(String codiceFiscale, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        PslpMessaggio pslpMessaggio = utenteManager.validaCFUtente(codiceFiscale, false, true);
        if (pslpMessaggio != null) {
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }
        pslpMessaggio = new PslpMessaggio();
        Random  random        = new Random();
        Integer numeroCasuale = random.nextInt(900000) + 100000;
        // String codiceOtp = numeroCasuale.toString();
        String codiceOtp = "111111";
        // servizio per inviare codice OTP al numero cellulare

        /*
         * EsitoMessaggio esitoMessaggio = invioSmsOtp(codiceOtp, codiceFiscale);
         * Log.info(esitoMessaggio);
         * if(esitoMessaggio== null || !esitoMessaggio.getErrori().isEmpty()){
         * pslpMessaggio.setCodMessaggio("00");
         * pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
         * pslpMessaggio.setTesto("Errore invio OTP" );
         * return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
         * }
         */

        Utente               utenteConesso      = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
        Date                 adesso             = Date.from((Instant) PslpDPrivacy.getEntityManager().createQuery("select now()").getResultList().get(0));
        List<PslpTDelegaOtp> pslpTDelegaOtpList = PslpTDelegaOtp.list("codiceFiscale", codiceFiscale);
        PslpTDelegaOtp       delegaOtp          = null;
        if (pslpTDelegaOtpList != null && !pslpTDelegaOtpList.isEmpty()) {
            delegaOtp = pslpTDelegaOtpList.get(0);
        } else {
            delegaOtp = new PslpTDelegaOtp();
            delegaOtp.setCodiceFiscale(codiceFiscale);
            delegaOtp.setCodUserInserim(utenteConesso.getCfUtente());
            delegaOtp.setDInserim(adesso);
        }

        delegaOtp.setOtpGenerato(Long.parseLong(codiceOtp));
        delegaOtp.setDataInvio(adesso);
        delegaOtp.setDAggiorn(adesso);
        delegaOtp.setCodUserAggiorn(utenteConesso.getCfUtente());

        delegaOtp.persist();

        if (!delegaOtp.isPersistent()) {
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
            pslpMessaggio.setTesto("Errore DB");
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }
        pslpMessaggio.setCodMessaggio("00");
        pslpMessaggio.setDescrMessaggio(PslpConstants.OK);
        pslpMessaggio.setTesto(codiceOtp);
        MsgResponse response = new MsgResponse();
        response.setMsg(pslpMessaggio);
        return buildManagedResponse(httpHeaders, response);
    }

    private EsitoMessaggio invioSmsOtp(String codiceOtp, String codiceFiscale) {
        LavoratoreResponse lavoratoreResponse = silpapiManager.getAnagraficaLav(String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_CF, codiceFiscale));
        if (lavoratoreResponse != null && lavoratoreResponse.isEsitoPositivo()) {
            LavAnagrafica                               lavAnagrafica  = lavoratoreResponse.getLavoratore();
            it.csi.pslp.pslpbff.api.dto.silos.Messaggio inviaMessaggio = new it.csi.pslp.pslpbff.api.dto.silos.Messaggio();
            inviaMessaggio.setCaller("PSLP");
            inviaMessaggio.setTitolo("Token " + codiceFiscale);
            inviaMessaggio.setFlgImmediato(it.csi.pslp.pslpbff.api.dto.silos.Messaggio.FlgImmediatoEnum.S);
            DatiSMS datiSMS = new DatiSMS();
            datiSMS.setTesto(messaggioManager.getMessaggioByCodice("T1").getTesto().replace("{codice}", codiceOtp));
            inviaMessaggio.setDatiSMS(datiSMS);
            List<Destinatario> destinatarios = new ArrayList<>();
            Destinatario       destinatario  = new Destinatario();
            destinatario.setCodiceFiscale(lavAnagrafica.getCodFiscale());
            destinatario.setCognome(lavAnagrafica.getDsCognome());
            destinatario.setNome(lavAnagrafica.getDsNome());
            destinatario.setCellulare(lavAnagrafica.getDsTelefonoCell());
            destinatario.setIdLavoratore(lavAnagrafica.getIdSilLavAnagrafica());
            destinatario.setEnte("CPI Torino");
            destinatarios.add(destinatario);
            inviaMessaggio.setDestinatari(destinatarios);

            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            try {
                Log.info(ow.writeValueAsString(inviaMessaggio));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            return silosapiManager.inviaMessaggio(inviaMessaggio);
        }

        return null;
    }

    // ======================================================================
    // CDU 05 - verifica codice OTP
    @Transactional
    @Audited
    @Override
    public Response verificaCodiceOtp(String codiceFiscale, Long codiceOtp, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
        List<PslpTDelegaOtp> pslpTDelegaOtpList = PslpTDelegaOtp.list("codiceFiscale", codiceFiscale);
        PslpMessaggio        pslpMessaggio      = new PslpMessaggio();
        if (pslpTDelegaOtpList == null || pslpTDelegaOtpList.isEmpty()) {
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
            pslpMessaggio.setTesto("CF non trovato");
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }

        Utente utenteConnesso = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
        Date   adesso         = Date.from((Instant) PslpDPrivacy.getEntityManager().createQuery("select now()").getResultList().get(0));

        PslpTDelegaOtp delegaOtp = pslpTDelegaOtpList.get(0);
        delegaOtp.setOtpInserito(codiceOtp);
        delegaOtp.setDAggiorn(adesso);
        delegaOtp.setCodUserAggiorn(utenteConnesso.getCfUtente());
        delegaOtp.persist();
        if (!delegaOtp.isPersistent()) {
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.KO);
            pslpMessaggio.setTesto("Errore DB");
            return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
        }
        if (!delegaOtp.getOtpGenerato().toString().equals(delegaOtp.getOtpInserito().toString())) {
            return buildManagedResponseLogEndNegative(messaggioManager.getMessaggioByCodice("E10"), httpHeaders);
        }

        pslpMessaggio.setCodMessaggio("00");
        pslpMessaggio.setDescrMessaggio(PslpConstants.OK);
        MsgResponse response = new MsgResponse();
        response.setMsg(pslpMessaggio);
        return buildManagedResponse(httpHeaders, response);
    }

}
