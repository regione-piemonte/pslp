/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.UtenteApi;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.Utente;
import it.csi.pslp.pslpbff.api.dto.mappers.UtenteMapper;
import it.csi.pslp.pslpbff.api.dto.request.UtenteRequest;
import it.csi.pslp.pslpbff.api.dto.response.AnagraficaLavSilpapiResponse;
import it.csi.pslp.pslpbff.api.dto.response.UtenteResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagrafica;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavoratoreResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.api.impl.manager.MessaggioManager;
import it.csi.pslp.pslpbff.api.impl.manager.SilpapiManager;
import it.csi.pslp.pslpbff.api.impl.manager.UtenteManager;
import it.csi.pslp.pslpbff.integration.entity.PslpDPrivacy;
import it.csi.pslp.pslpbff.integration.entity.PslpTDelega;
import it.csi.pslp.pslpbff.integration.entity.PslpTUtente;
import it.csi.pslp.pslpbff.interceptor.Audited;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.PslpThreadLocalContainer;
import it.csi.pslp.pslpbff.util.ValidatoreCodiceFiscale;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

import java.time.Instant;
import java.util.Date;
import java.util.List;


@Provider
public class UtenteApiServiceImpl extends BaseApiServiceImpl implements UtenteApi {
	
	@Inject private UtenteManager utenteManager;

	@Inject private SilpapiManager silpapiManager;

	@Inject MessaggioManager messaggioManager;

	@Inject private UtenteMapper utenteMapper;

	@Audited
	@Override
	public Response self(@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
			@Context HttpServletRequest httpRequest) {
		
		Log.info("[UtenteApiServiceImpl::self]");

		final String methodName = "self";

		UtenteResponse result = new UtenteResponse();
		Utente utente = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
		utente = utenteManager.getUtente(utente);
		result.setUtente(utente);
		if(result.getUtente()==null){
			PslpMessaggio pslpMessaggio = messaggioManager.getMessaggioByCodice("E19");
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}else if(result.getUtente().getRuoli().isEmpty()){
			PslpMessaggio pslpMessaggio = messaggioManager.getMessaggioByCodice("E3");
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}
		return buildManagedResponseLogEnd(httpHeaders, result, methodName);
	}

	//---------------------------------------------------------
	// CDU 7
	@Override
	@Transactional
	public Response utenteByCodiceFiscale(String codiceFiscale, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		final String methodName = "utenteByCodiceFiscale";
		PslpMessaggio pslpMessaggio= null;
		LavoratoreResponse lavoratoreResponse = silpapiManager.getAnagraficaLav(String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_CF,codiceFiscale));
		/*if(!lavoratoreResponse.isEsitoPositivo()){
			pslpMessaggio = messaggioManager.getMessaggioByCodice("E7");
			pslpMessaggio.setTesto(pslpMessaggio.getTesto().replace("{COGNOME}  {NOME}  ({CODICE FISCALE} )", codiceFiscale));
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}*/
		LavAnagrafica anagrafica = lavoratoreResponse.getLavoratore();
		Utente utente = new Utente();
		utente.setCfUtente(codiceFiscale);
		if(anagrafica!=null) {
			utente.setCognome(anagrafica.getDsCognome());
			utente.setNome(anagrafica.getDsNome());
		}
		utente = utenteManager.getUtente(utente);
		if(utente==null){
			pslpMessaggio = messaggioManager.getMessaggioByCodice("E19");
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}
		/*if (pslpTUtenteList != null && !pslpTUtenteList.isEmpty()) {
			utente = mappers.UTENTE.toModel(pslpTUtenteList.get(0));
			UtenteResponse result = new UtenteResponse();
			result.setUtente(utente);
			return buildManagedResponseLogEnd(httpHeaders, result, methodName);
		}*/

		UtenteResponse result = new UtenteResponse();
		result.setUtente(utente);
		return buildManagedResponseLogEnd(httpHeaders, result, methodName);

	}

	@Override
	@Transactional
	public Response cercaCFSilp(String codiceFiscale, boolean minorenne, boolean forDelega, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		Utente utenteConesso = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
		PslpMessaggio pslpMessaggio = utenteManager.validaCFUtente(codiceFiscale, minorenne, forDelega);
		if (pslpMessaggio != null) {

			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}
		List<PslpTUtente> pslpTUtenteList = PslpTUtente.find("cfUtente",codiceFiscale).list();
		LavoratoreResponse lavoratoreResponse = silpapiManager.getAnagraficaLav(String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_CF,codiceFiscale));
		if(!lavoratoreResponse.isEsitoPositivo() && minorenne){
			pslpMessaggio = messaggioManager.getMessaggioByCodice("E7");
			pslpMessaggio.setTesto(pslpMessaggio.getTesto().replace("{COGNOME}  {NOME}  ({CODICE FISCALE} )", codiceFiscale));
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}
		LavAnagrafica anagrafica = lavoratoreResponse.getLavoratore();

		if(anagrafica == null){

			if(pslpTUtenteList != null && !pslpTUtenteList.isEmpty()  && !forDelega){
				AnagraficaLavSilpapiResponse result = new AnagraficaLavSilpapiResponse();
				anagrafica = new LavAnagrafica();
				anagrafica.setCodFiscale(pslpTUtenteList.get(0).getCfUtente());
				anagrafica.setDsCognome(pslpTUtenteList.get(0).getCognome());
				anagrafica.setDsNome(pslpTUtenteList.get(0).getNome());
				result.setAnagraficaLav(anagrafica);
				return buildManagedResponse(httpHeaders, result);
			}
			pslpMessaggio = messaggioManager.getMessaggioByCodice("E7");
			pslpMessaggio.setTesto(pslpMessaggio.getTesto().replace("{COGNOME}  {NOME}  ({CODICE FISCALE} )", codiceFiscale));
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}else if(pslpTUtenteList != null && !pslpTUtenteList.isEmpty()){
			Long idSilLavAn=	pslpTUtenteList.get(0).getIdSilLavAnagrafica();
			Log.info(idSilLavAn);
			Log.info(anagrafica.getIdSilLavAnagrafica());
			if(idSilLavAn == null){
				PslpTUtente tmp = pslpTUtenteList.get(0);
				tmp.setIdSilLavAnagrafica(anagrafica.getIdSilLavAnagrafica());
				PslpTUtente.getEntityManager().merge(tmp);
			}else if(!idSilLavAn.equals(anagrafica.getIdSilLavAnagrafica())){

				pslpMessaggio = messaggioManager.getMessaggioByCodice("E24");
				pslpMessaggio.setTesto(pslpMessaggio.getTesto());
				return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
			}
		}

		if(!minorenne && forDelega && (anagrafica.getDsTelefonoCell()==null || anagrafica.getDsTelefonoCell().length()<6)){
			pslpMessaggio = messaggioManager.getMessaggioByCodice("E8");
			pslpMessaggio.setTesto(pslpMessaggio.getTesto().replace("{Cognome}  {Nome}  ({codice fiscale} )", codiceFiscale));
			return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
		}

		if(forDelega) {
			List<PslpTDelega> pslpTDelegaList = PslpTDelega.find("pslpTUtente2.cfUtente = ?1 and pslpTUtente1.cfUtente = ?2", codiceFiscale, utenteConesso.getCfUtente()).list();

			if (!pslpTDelegaList.isEmpty()) {
				pslpMessaggio = messaggioManager.getMessaggioByCodice("E20");
				pslpMessaggio.setTesto(pslpMessaggio.getTesto().replace("{Cognome}  {Nome}  ({codice fiscale} )", codiceFiscale));
				return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
			}
		}

		final String methodName = "cercaCFSilp";
		AnagraficaLavSilpapiResponse result = new AnagraficaLavSilpapiResponse();
		result.setAnagraficaLav(anagrafica);
		return buildManagedResponseLogEnd(httpHeaders, result, methodName);

	}

	@Transactional
	@Override
	public Response insertUtente(UtenteRequest request, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpRequest) {
		Date adesso = Date.from ((Instant) PslpDPrivacy.getEntityManager().createQuery("select now()").getResultList().get(0));
		Utente utenteConesso = PslpThreadLocalContainer.UTENTE_CONNESSO.get();
		List<PslpTUtente> utentes = PslpTUtente.find("cfUtente", request.getUtente().getCfUtente()).list();

		PslpTUtente utente = null;
		UtenteResponse result = new UtenteResponse();
		if(utentes == null || utentes.isEmpty()){
			if(!(ValidatoreCodiceFiscale.calcolaCognome(request.getUtente().getCognome())+ ValidatoreCodiceFiscale.calcolaNome(request.getUtente().getNome())).toUpperCase().equals(request.getUtente().getCfUtente().substring(0,6).toUpperCase())){
				PslpMessaggio pslpMessaggio = messaggioManager.getMessaggioByCodice("E23");
				return buildManagedResponseLogEndNegative(pslpMessaggio, httpHeaders);
			}
			utente = utenteMapper.toEntity(utenteManager.getUtente(request.getUtente()));
			utente.setDAggiorn(adesso);
			utente.setDInserim(adesso);
			utente.setCodUserInserim(utenteConesso.getCfUtente());
			utente.setCodUserAggiorn(utenteConesso.getCfUtente());
			if(utente.getIdUtente() == null)
				utente.persist();
		}else {
			utente = utentes.get(0);
		}



		result.setUtente(utenteMapper.toModel(utente));
		return buildManagedResponse(httpHeaders, result);
	}


}
