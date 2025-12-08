/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.mappers.silpapi.RuoliSilpApiMapper;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.ListaRuoliResponse;
import jakarta.persistence.EntityManager;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.RuoloFunzione;
import it.csi.pslp.pslpbff.api.dto.Utente;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.integration.entity.PslpDRuolo;
import it.csi.pslp.pslpbff.integration.entity.PslpRRuoloFunzione;
import it.csi.pslp.pslpbff.integration.entity.PslpRUtenteRuolo;
import it.csi.pslp.pslpbff.integration.entity.PslpTUtente;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.ValidatoreCodiceFiscale;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@Dependent
public class UtenteManager extends BaseApiServiceImpl {
	
	@Inject
	MessaggioManager messaggioManager;
	
	@Inject
	RuoliSilpApiMapper ruoliSilpApiMapper;

	@Inject
	SilpapiManager silpapiManager;
	@ConfigProperty(name = "silpapi.url")
	String silpapiUrl;

	@ConfigProperty(name = "silpapi.user")
	String silpapiUser;

	@ConfigProperty(name = "silpapi.password")
	String silpapiPassword;
	

	@Transactional
	public Utente getUtente(Utente utenteIride) {
		
		Utente utente = null;
		List<it.csi.pslp.pslpbff.api.dto.Ruolo> ruoli = new ArrayList<>();
		Date now = new Date();
		
		// ricerco in utente
		List<PslpTUtente> list = PslpTUtente.list("cfUtente", utenteIride.getCfUtente());
		LavoratoreResponse anagrafica = silpapiManager.getAnagraficaLavFull(String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_CF,utenteIride.getCfUtente()));

		if (list != null && list.size()==1) {
			utente = mappers.UTENTE.toModel(list.get(0));

			if(anagrafica!=null &&  anagrafica.getLavoratore()!=null){
				if(utente.getIdSilLavAnagrafica()==null){
					EntityManager entityManager=PslpTUtente.getEntityManager();

					utente.setIdSilLavAnagrafica(anagrafica.getLavoratore().getIdSilLavAnagrafica());
					utente.setCodUserAggiorn(utenteIride.getCfUtente());
					utente.setDAggiorn(now);
					PslpTUtente tmp=mappers.UTENTE.toEntity(utente);
					entityManager.merge(tmp);
					entityManager.flush();
				}

				if(!utente.getCfUtente().equals(anagrafica.getLavoratore().getCodFiscale())
						|| !utente.getIdSilLavAnagrafica().equals(anagrafica.getLavoratore().getIdSilLavAnagrafica())
							|| anagrafica.isIsPresentiPiuDiUnLavoratoreConFlgNonArchiviato()
								|| (anagrafica.isIsPresentiPiuLavoratoriPerCodiceFiscale() && "S".equals(anagrafica.getLavoratore().getFlgArchiviato()))){
					return null;
				}
				if("S".equals(anagrafica.getLavoratore().getFlgArchiviato())){
					silpapiManager.disarchiviaLavoratore(anagrafica.getLavoratore().getIdSilLavAnagrafica(), utenteIride.getCfUtente());
				}
				utente.setCpiComp(anagrafica.getLavoratore().getSilTCpiComp());
				//utente.getCpiComp().setSilTProvincia(anagrafica.getLavoratore().getSilTCpiComp().getSilTProvincia());
				utente.setLavSapSez6(anagrafica.getLavoratore().getSilLavSapSez6s());

			}


			List<PslpRUtenteRuolo> listPslpRUtenteRuolo = list.get(0).getPslpRUtenteRuolos();
			List<PslpDRuolo> listPslpDRuolo = new ArrayList<>();
			if (listPslpRUtenteRuolo != null) {
				for (PslpRUtenteRuolo pslpRUtenteRuolo : listPslpRUtenteRuolo) {
					listPslpDRuolo.add(pslpRUtenteRuolo.getPslpDRuolo());
				}
			}
			ruoli.addAll(mappers.RUOLO.toModels(listPslpDRuolo));
		} else {
			// se non ci sono inserisco l'utente
			
			// utente
			PslpTUtente pslpTUtente = new PslpTUtente();
			pslpTUtente.setCfUtente(utenteIride.getCfUtente());
			if(utenteIride.getCognome()!=null) pslpTUtente.setCognome(utenteIride.getCognome().trim().toUpperCase());
			if(utenteIride.getNome()!=null) pslpTUtente.setNome(utenteIride.getNome().trim().toUpperCase());
			
			
			pslpTUtente.setCodUserAggiorn(utenteIride.getCfUtente());
			pslpTUtente.setDAggiorn(now);
			pslpTUtente.setCodUserInserim(utenteIride.getCfUtente());
			pslpTUtente.setDInserim(now);




			if(anagrafica!=null &&  anagrafica.getLavoratore()!=null) {
				pslpTUtente.setIdSilLavAnagrafica(anagrafica.getLavoratore().getIdSilLavAnagrafica());


					if(anagrafica.isIsPresentiPiuDiUnLavoratoreConFlgNonArchiviato()
							|| (anagrafica.isIsPresentiPiuLavoratoriPerCodiceFiscale() && "S".equals(anagrafica.getLavoratore().getFlgArchiviato()))){
						return null;
					}
					if("S".equals(anagrafica.getLavoratore().getFlgArchiviato())){
						silpapiManager.disarchiviaLavoratore(anagrafica.getLavoratore().getIdSilLavAnagrafica(), utenteIride.getCfUtente());
					}
					//utente.setCpiComp(anagrafica.getLavoratore().getSilTCpiComp());
					//utente.getCpiComp().setSilTProvincia(anagrafica.getLavoratore().getSilTCpiComp().getSilTProvincia());
					//utente.setLavSapSez6(anagrafica.getLavoratore().getSilLavSapSez6s());


			}
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
			
			
			utente = mappers.UTENTE.toModel(PslpTUtente.findById(pslpTUtente.getIdUtente()));
			
			ruoli.add(mappers.RUOLO.toModel(pslpRUtenteRuolo.getPslpDRuolo()));
		}
		// ricerca altri ruoli su silp
		try {
			
			if (utente != null) {
				ListaRuoliResponse listaRuoliResponse = get(silpapiUrl + PslpConstants.SILPAPI_URL_RUOLI + "/" + utenteIride.getCfUtente(), silpapiUser, silpapiPassword, ListaRuoliResponse.class);
				List<PslpDRuolo> ruoliSilp = ruoliSilpApiMapper.toModels(listaRuoliResponse.getRuoli());
				//Per filtrare i ruoli arrivati da SILP in base a quelli presenti su PSLP pslp_d_ruolp
				List<PslpDRuolo> ruoliPresenteSuPslp = PslpDRuolo.listAll();
				Map<Long, PslpDRuolo> mapRuoli = new TreeMap<>();
				ruoliSilp.stream().filter(r -> ruoliPresenteSuPslp.stream().anyMatch(rp -> rp.getIdRuolo().equals(r.getIdRuolo()))).forEach(r -> mapRuoli.put(r.getIdRuolo(), r));

				ruoli.addAll(mappers.RUOLO.toModels(mapRuoli.values()));
			}
			
		}
		catch (Exception err) {
			err.printStackTrace();
		}


		
		for (it.csi.pslp.pslpbff.api.dto.Ruolo ruolo : ruoli) {
			List<PslpRRuoloFunzione> listRuoloFunzioni = PslpRRuoloFunzione.list("pslpDRuolo.idRuolo", ruolo.getIdRuolo());
			if (listRuoloFunzioni != null) {
				List<RuoloFunzione> ruoloFunzioni = new ArrayList<>();
				for(PslpRRuoloFunzione pslpRRuoloFunzione : listRuoloFunzioni) {
					if (!"N".equals(pslpRRuoloFunzione.getPslpDFunzione().getFlgAttiva()))
						ruoloFunzioni.add(mappers.RUOLO_FUNZIONE.toModel(pslpRRuoloFunzione));
				}
				ruolo.setRuoloFunzioni(ruoloFunzioni);
			}
		}
		utente.setRuoli(ruoli);

		return utente;
		
	}

	public PslpMessaggio validaCFUtente(String cfUtente, boolean minorenne, boolean forDelega){
		boolean cfValido = ValidatoreCodiceFiscale.verificaSeFormalmenteValido(cfUtente);
		PslpMessaggio pslpMessaggio = null;
		if(!cfValido) {
			pslpMessaggio = new PslpMessaggio();
			pslpMessaggio.setCodMessaggio("00");
			pslpMessaggio.setDescrMessaggio("CF non valido");
			pslpMessaggio.setTesto("CF non valido");
			return pslpMessaggio;
		}

		String dataNascitaString = ValidatoreCodiceFiscale.getDataDiNascita(cfUtente);
		if(dataNascitaString == null) {
			pslpMessaggio = new PslpMessaggio();
			pslpMessaggio.setCodMessaggio("00");
			pslpMessaggio.setDescrMessaggio("CF non valido");
			pslpMessaggio.setTesto("CF non valido");
			return pslpMessaggio;
		}
		// verifica se il CF corrisponde effettivamente a un minorenne o maggiorenne
		LocalDate dataNascita = LocalDate.parse(dataNascitaString, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
		LocalDate oggi = LocalDate.now();
		Period periodo = Period.between(dataNascita, oggi);
		int anni = periodo.getYears();

		if(forDelega) {


			if (anni > 18 && minorenne) {
				return messaggioManager.getMessaggioByCodice("E5");
			}
			if (anni < 18 && !minorenne) {
				return messaggioManager.getMessaggioByCodice("E6");
			}
		}
			if (anni < 11) {
				PslpMessaggio tmp = new PslpMessaggio();
				tmp.setCodMessaggio("da definire");
				tmp.setDescrMessaggio("Età inferiore ad 11 anni");
				tmp.setTesto("L’età non deve essere inferiore a 11 anni");
				return tmp;
				// TODO
				//  manca il pslpMessaggio di errore
				//return messaggioManager.getMessaggioByCodice("E6");
			}

		return null;
	}

}
