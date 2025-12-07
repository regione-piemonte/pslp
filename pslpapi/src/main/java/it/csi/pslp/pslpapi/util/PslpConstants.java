/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

public class PslpConstants
{
	public final static String COMPONENT_NAME = "pslpapi";

	public static final String LOGGER_NAME = "pslpapi";

	public static final String COMPONENT_NAME_CHIAMANTE = "PSLP";
	
	
	public static final String OK = "OK";
	public static final String KO = "KO";
	
	public static final String S = "S";
	public static final String N = "N";

	
	public static final int NUMERO_RECORD_COMMAD_COMPLETATION = 10;

	
	
	// RUOLI UTENTE 

	public static long ID_RUOLO_CITTADINO = 0l;

	//URL SILOS
	public static final String SILOS_URL_PING = "/ping";
	public static final String SILOS_URL_MSG = "/msg";
	public static final String SILOS_URL_MSG_INVIA_MESSAGIO = SILOS_URL_MSG+"/invia_messaggio";

	//URL BLP
	public static final String BLP_URL_DECODIFICA = "/decodifica/";
	public static final String BLP_URL_DECODIFICA_FIND = BLP_URL_DECODIFICA + "find/%s"; // tipo
    public static final String BLP_URL_DECODIFICA_FILL=BLP_URL_DECODIFICA +"fill/%s/%s";
	public static final String BLP_URL_DECODIFICA_FIND_BY_ID=BLP_URL_DECODIFICA +"find/%s/%s";
	// URL SILPAPI
	public static final String SILPAPI_URL_DECODIFICA = "/decodifica/";
	public static final String SILPAPI_URL_DECODIFICA_FIND = SILPAPI_URL_DECODIFICA + "find/%s"; // tipo
	public static final String SILPAPI_URL_DECODIFICA_FIND_TIPO_ID = SILPAPI_URL_DECODIFICA + "find/%s/%s"; // 0: tipo, 1: id per filtro
	public static final String SILPAPI_URL_DECODIFICA_FILL = SILPAPI_URL_DECODIFICA + "fill/%s/%s"; // 0: tipo, 1: txt per filtro
	public static final String SILPAPI_URL_DEDOCIFICA_FIND_COMUNE_BY_PROVINCIA = SILPAPI_URL_DECODIFICA + "find-comuneByIdProvincia/%s";
	public static final String SILPAPI_URL_DEDOCIFICA_FIND_COMUNE_BY_PROVINCIA_FILTRO = SILPAPI_URL_DECODIFICA + "fill-comuneByIdProvincia/%s/%s"; //0: id provincia, 1: txt per filtro
	public static final String SILPAPI_URL_DEDOCIFICA_FIND_INFORMATICADETT_BY_IDINFORMATICA = SILPAPI_URL_DECODIFICA + "find-informaticaDettByIdInformatica/%s";
	public static final String SILPAPI_URL_DEDOCIFICA_FIND_TIPO_LAVORO = SILPAPI_URL_DECODIFICA + "find-tipo-lavoro/%s";
	public static final String SILPAPI_URL_DEDOCIFICA_FIND_TITOLO_STUDIO_BY_ID = SILPAPI_URL_DECODIFICA + "find-titoloStudioById/%s"; //0: id titolo studio
	public static final String SILPAPI_URL_LAVORATORE = "/lavoratore/";

	public static final String SILPAPI_RICERCA_LAVORATORE="/ricerca-lavoratore/%s"; //indice pagina
	public static final String SILPAPI_URL_LAVORATORE_FIND_CF =  SILPAPI_URL_LAVORATORE + "find-codice-fiscale/%s"; // codice fiscale a cercare su silp
	public static final String SILPAPI_URL_LAVORATORE_FIND_ID =  SILPAPI_URL_LAVORATORE + "find/%s"; // id_sil_lav_anagrafica
	public static final String SILPAPI_URL_LAVORATORE_FIND_SUNTO =  SILPAPI_URL_LAVORATORE + "find-sunto/%s"; // id_sil_lav_anagrafica
	public static final String SILPAPI_URL_LAVORATORE_ESISTE_PATTI = SILPAPI_URL_LAVORATORE + "esistono-patti-di-attivazione/%s"; //{idSilLavAnagrafica}
	public static final String SILPAPI_URL_LAVORATORE_FIND_GET_RAPPORTI_LAV =  SILPAPI_URL_LAVORATORE + "get-rapporti-lavoro-aperti";
	public static final String SILPAPI_URL_FASCICOLO = "/fascicolo/";
	public static final String SILPAPI_URL_FASCICOLO_DETTAGLIO = SILPAPI_URL_FASCICOLO+"get-dettaglio/%s"; //0: id_sil_lav_anagrafica
	public static final String SILPAPI_URL_FASCICOLO_DETTAGLIO_TITOLO_STUDIO = SILPAPI_URL_FASCICOLO+"get-dettaglio-titolo-di-studio/%s"; //0: idSilLavTitoloStudio_
	public static final String SILPAPI_URL_FASCICOLO_CONTROLLA_SALVA = SILPAPI_URL_FASCICOLO + "controlla-prosegui-salva";
	public static final String SILPAPI_URL_FASCICOLO_INSERISCI_MODIFICA_CITTADINO = SILPAPI_URL_FASCICOLO + "inserisci-modifica-fascicolo-cittadino";
	public static final String SILPAPI_URL_FASCICOLO_ARCHIVIA_DISARCHIVIA = SILPAPI_URL_FASCICOLO + "archivia-disarchivia-lavoratore/%s/%s";
	public static final String SILPAPI_URL_FASCICOLO_DELETE_ESPERIENZA_LAVORO = SILPAPI_URL_FASCICOLO+"delete-esperienza-lavoro";
	public static final String SILPAPI_URL_FASCICOLO_DETTAGLIO_ESPERIENZA_LAVORO = SILPAPI_URL_FASCICOLO+"get-dettaglio-esperienza-professionale/%s"; //0: idSilLavEsperienzaLavoro
	public static final String SILPAPI_URL_FASCICOLO_DETTAGLIO_CORSO_FORMAZIONE = SILPAPI_URL_FASCICOLO+"get-dettaglio-corso-formazione/%s"; //0: idSilLavCorsoForm
	public static final String SILPAPI_URL_FASCICOLO_INSERT_UPDATE_ESPERIENZA_LAVORO = SILPAPI_URL_FASCICOLO + "insert-or-update-esperienza-lavoro";
	public static final String SILPAPI_URL_FASCICOLO_INSERT_UPDATE_CORSO_FORMAZIONE = SILPAPI_URL_FASCICOLO + "insert-or-update-corso-formazione";
	public static final String SILPAPI_URL_FASCICOLO_DELETE_CORSO_FORMAZIONE = SILPAPI_URL_FASCICOLO + "delete-corso-formazione";
	public static final String SILPAPI_URL_FASCICOLO_INSERT_UPDATE_TITOLO_STUDIO = SILPAPI_URL_FASCICOLO + "insert-or-update-titolo-studio";
	public static final String SILPAPI_URL_FASCICOLO_INSERT_UPDATE_LINGUA = SILPAPI_URL_FASCICOLO + "insert-or-update-lingua";
	public static final String SILPAPI_URL_FASCICOLO_INSERT_DELETE_ALBO = SILPAPI_URL_FASCICOLO + "insert-or-delete-albo";
	public static final String SILPAPI_URL_FASCICOLO_INSERT_UPDATE_INFORMATICA = SILPAPI_URL_FASCICOLO + "insert-or-update-informatica";
	public static final String SILPAPI_URL_FASCICOLO_INSERT_DELETE_PATENTE = SILPAPI_URL_FASCICOLO + "insert-or-delete-patente";

	public static final String SILPAPI_URL_FASCICOLO_DELETE_INFORMATICA = SILPAPI_URL_FASCICOLO + "delete-informatica";
	public static final String SILPAPI_URL_FASCICOLO_DELETE_LINGUA = SILPAPI_URL_FASCICOLO + "delete-lingua";
	public static final String SILPAPI_URL_FASCICOLO_DELETE_TITOLO_STUDIO = SILPAPI_URL_FASCICOLO + "delete-titolo-studio";

	public static final String SILPAPI_URL_DID = "/did/";
	public static final String SILPAPI_URL_FIND_DID = SILPAPI_URL_DID +  "find-did";
	public static final String SILPAPI_URL_RICERCA_DID = SILPAPI_URL_DID +  "ricerca";
	public static final String SILPAPI_URL_RICEVI_SAP = SILPAPI_URL_DID +  "ricevi-sap";
	public static final String SILPAPI_URL_INSERISCI_DID = "/inserisci-did/";
	public static final String SILPAPI_URL_INSERISCI_DID_CONTROLLO = SILPAPI_URL_INSERISCI_DID + "controlli-pre-inserimento/%s"; //idSilLavAnagrafica
	public static final String SILPAPI_URL_INSERISCI_DID_ONCHANGE = SILPAPI_URL_INSERISCI_DID + "on-change-data-did";
	public static final String SILPAPI_URL_INSERISCI_DID_SALVA = SILPAPI_URL_INSERISCI_DID + "salva";
	public static final String SILPAPI_URL_CONTROLLI_STAMPA_DID= SILPAPI_URL_DID + "controlli-stampa-attestato-disoccupazione/%s";
	public static final String SILPAPI_URL_STAMPA_DID= SILPAPI_URL_DID + "stampa-attestato-disoccupazione";


	public static final String SILPAPI_INVIA_DATI_CV="/curriculum/aggiorna-fascicolo-da-curriculum-vitae";

	public static final String  SILPAPI_MULTICANALE_INSERT_MSG_MULTIMEDIALE = "/msg-multicanale/insert-msg-multimediale";


	public static final String SILPAPI_URL_INPS_DID = "/didInps/";
	public static final String SILPAPI_URL_INPS_DID_RICERCA = SILPAPI_URL_INPS_DID +  "ricerca";

	public static final String SILPAPI_ORCHESTATORE = "/orchestratore/";
	public static final String SILPAPI_ORCHESTATORE_SEND_SAP_SILP = SILPAPI_ORCHESTATORE + "send-sap-silp";
	public static final String SILPAPI_PRENOTA_INVIA_SAP = SILPAPI_ORCHESTATORE + "prenota-e-invia-la-sap";

	public static final String SILPAPI_URL_PROFILING_QUANTITATIVO = "/profiling-quantitativo/";
	public static final String SILPAPI_URL_PROFILING_QUANTITATIVO_FIND_TITOLO = SILPAPI_URL_PROFILING_QUANTITATIVO + "find-titoliStudioLav/%s"; //idSilLavAnagrafica
	public static final String SILPAPI_URL_PROFILING_QUANTITATIVO_FINDALL_CONDIZIONE_OCC= SILPAPI_URL_PROFILING_QUANTITATIVO + "findAll-condizioneOccupazionale";
	public static final String SILPAPI_URL_PROFILING_QUANTITATIVO_FINDALL_PRESENZAINITALIA= SILPAPI_URL_PROFILING_QUANTITATIVO + "findAll-presenzaInItalia";
	public static final String SILPAPI_URL_PROFILING_QUANTITATIVO_INSERISCI_PATENTE= SILPAPI_URL_PROFILING_QUANTITATIVO + "inserisciPatente";
	public static final String SILPAPI_URL_PROFILING_QUANTITATIVO_INSERISCI_TITOLO= SILPAPI_URL_PROFILING_QUANTITATIVO + "inserisciTitoloStudio";
	public static final String SILPAPI_URL_FIND_PROFILING_QUANTITATIVO = SILPAPI_URL_PROFILING_QUANTITATIVO + "find-profiling-quantitativo-anpal/%s"; //codice Fiscale da cercare

	public static final String SILPAPI_AZIENDA="/azienda/";
	public static final String SILPAPI_URL_FASCICOLO_RICERCA_SEDI_AZIENDA = SILPAPI_AZIENDA + "ricerca-sedi-azienda?page=%s&recForPage=%s"; //paginazione, recForPage;


	public static final String SILPAPI_URL_RUOLI = "/ruolo/get-ruoli-by-cf";

	public static final String SILPAPI_INFO="/info";
	public static final String SILPAPI_COLLOCAMENTO_MIRATO_LAVORATORE=SILPAPI_INFO+"/get-iscrizioni-collocamento-mirato-lavoratore/%s";
	//codici parametri
	public static final String PARAMETRO_GIORNI_DELEGA_MAGGIORENNE="GG_DELE";
}
