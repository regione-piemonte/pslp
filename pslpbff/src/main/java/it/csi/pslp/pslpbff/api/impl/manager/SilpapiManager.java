/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import it.csi.pslp.pslpbff.api.dto.silpapi.TipoPatenteResponse;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.UltimaDid;
import it.csi.pslp.pslpbff.api.dto.common.ReportResponse;
import it.csi.pslp.pslpbff.api.dto.mappers.silpapi.ApiMessageSilpApiMapper;
import it.csi.pslp.pslpbff.api.dto.response.did.UltimaDidResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.AlboRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.AlboResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.silpapi.CallInfo;
import it.csi.pslp.pslpbff.api.dto.silpapi.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.CondizioneOccupazionaleResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.ControlliFascicoloRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.ControlliFascicoloResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.CorsoFormazioneRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.CorsoFormazioneResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.CurriculumVitaeRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.CurriculumVitaeResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DatiPatenteLavoratore;
import it.csi.pslp.pslpbff.api.dto.silpapi.DatiTitoloStudioLavoratore;
import it.csi.pslp.pslpbff.api.dto.silpapi.DecodificaListResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DecodificaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DettaglioCorsoFormazioneResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DettaglioEsperienzeProfessionaliResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DettaglioFascicoloResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DettaglioTitoloDiStudioResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DidResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.DocumentoRichiestoResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.EsperienzaLavoroRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.EsperienzaLavoroResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormDettaglioDid;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormInserisciDid;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormInviaMsg;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormOrchestratore;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaDid;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaDidInps;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaLavoratore;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaRichiesteDocumenti;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaStatiDidByCo;
import it.csi.pslp.pslpbff.api.dto.silpapi.InfoIscrizioniCollocamentoMiratoLavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.InformaticaRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.InformaticaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.InserisciAggiornaRichiestaDocumentoRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.InserisciDidResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.InserisciPatenteLavResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.InserisciTitoloStudioLavResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagrafica;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.LinguaRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.LinguaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.MsgMulticanaleResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.MsgResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.NotificaRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.NotificaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.OrchestratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.OrderField;
import it.csi.pslp.pslpbff.api.dto.silpapi.PatenteRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.PatenteResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.PresenzaInItaliaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.PresenzaPattiAttivazioneResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.ProfilingQuantitativoResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RapportoDiLavoro;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaDidInpsResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaDidResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaLavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaNotificheRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaNotificheResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaRichiesteDocumentiResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaSediAziendaRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaSediAziendaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaStatiDidByCoResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.StatoSapDid;
import it.csi.pslp.pslpbff.api.dto.silpapi.SuntoLavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.TipoLavoroResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.TitoliStudioLavResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.TitoloStudioLavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.TitoloStudioRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.TitoloStudioResponse;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.exception.BusinessException;
import it.csi.pslp.pslpbff.util.PslpConstants;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.HttpHeaders;

@Dependent
public class SilpapiManager extends BaseApiServiceImpl {

    @ConfigProperty(name = "silpapi.url")
    String silpapiUrl;

    @ConfigProperty(name = "silpapi.user")
    String silpapiUser;

    @ConfigProperty(name = "silpapi.password")
    String silpapiPassword;

    @Inject
    private ApiMessageSilpApiMapper apiMessageSilpApiMapper;

    public DecodificaListResponse getDecodificaList(String url) {
        try {
            DecodificaListResponse decodificaListResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, DecodificaListResponse.class);
            return decodificaListResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public TitoloStudioResponse findTitoloStudioById(String id) {
        try {
            TitoloStudioResponse titoloStudioResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_TITOLO_STUDIO_BY_ID, id), silpapiUser, silpapiPassword, TitoloStudioResponse.class);

            return titoloStudioResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public TipoLavoroResponse findTipoLavoroById(String id) {
        try {
            TipoLavoroResponse tipoLavoroResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_DECODIFICA_FIND_TIPO_LAVORO, id), silpapiUser, silpapiPassword, TipoLavoroResponse.class);

            return tipoLavoroResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public DecodificaResponse getDecodifica(String url) {
        try {
            DecodificaResponse decodificaResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, DecodificaResponse.class);
            return decodificaResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public LavoratoreResponse getAnagraficaLavFull(String url) {
        try {
            LavoratoreResponse lavoratoreResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, LavoratoreResponse.class);
            return lavoratoreResponse;
        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public LavoratoreResponse getAnagraficaLav(String url) {
        try {
            LavoratoreResponse lavoratoreResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, LavoratoreResponse.class);
            return lavoratoreResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public List<LavAnagrafica> ricercaPerCf(String codFisc, String url) {
        FormRicercaLavoratore fr = new FormRicercaLavoratore();
        fr.setCodFisc(codFisc);
        try {
            ObjectWriter              ow       = new ObjectMapper().writer().withDefaultPrettyPrinter();
            RicercaLavoratoreResponse response = post(silpapiUrl + url, ow.writeValueAsString(fr), silpapiUser, silpapiPassword, RicercaLavoratoreResponse.class);

            if (response.isEsitoPositivo()) {
                return response.getList();
            } else {
                if (response.getApiMessages() != null) {
                    for (ApiMessage msg : response.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }
                throw new BusinessException("Errore chiamata silpapi");
            }
        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }
    // =========================================================================
    // Fascicolo

    public DettaglioFascicoloResponse getFascicolo(String url, HttpHeaders httpHeaders) {
        try {
            ObjectWriter  ow      = new ObjectMapper().writer().withDefaultPrettyPrinter();
            CommonRequest request = new CommonRequest();
            request.setCallInfo(creaCallInfo());
            DettaglioFascicoloResponse dettaglioFascicoloResponse = post(silpapiUrl + url, ow.writeValueAsString(request), silpapiUser, silpapiPassword, DettaglioFascicoloResponse.class);

            // Log.info(ow.writeValueAsString(dettaglioFascicoloResponse));
            List<RapportoDiLavoro> tmp = dettaglioFascicoloResponse.getFascicolo().getEsperienzeLavorative().getRapporto()
                    .stream()
                    .filter(rapportoDiLavoro -> {
                        Instant tmpData = Instant.parse("2008-03-01T18:35:24.00Z");
                        return rapportoDiLavoro.getDataInizioRapporto().toInstant().isBefore(tmpData) || (rapportoDiLavoro.getComunicazioniObbligatorie().stream()
                                .filter(comunicazioneObbligatoriaXRapporti -> comunicazioneObbligatoriaXRapporti.getComunicazione().getCodComunicazione() != null).count() > 0);
                    }).toList();
            dettaglioFascicoloResponse.getFascicolo().getEsperienzeLavorative().setRapporto(tmp);
            // Log.info("dopo");
            // Log.info(ow.writeValueAsString(dettaglioFascicoloResponse));
            return dettaglioFascicoloResponse;
        } catch (Exception e) {

            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public ControlliFascicoloResponse controllaSalvaFascicolo(String url, ControlliFascicoloRequest controlloFascicoloRequest) {
        controlloFascicoloRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter               ow                         = new ObjectMapper().writer().withDefaultPrettyPrinter();
            ControlliFascicoloResponse controlliFascicoloResponse = post(silpapiUrl + url, ow.writeValueAsString(controlloFascicoloRequest), silpapiUser, silpapiPassword, ControlliFascicoloResponse.class);
            return controlliFascicoloResponse;
        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public RicercaSediAziendaResponse ricercaSediAziendaSilp(String url, RicercaSediAziendaRequest ricercaSediAziendaRequestSilp) {
        ricercaSediAziendaRequestSilp.setCallInfo(creaCallInfo());
        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(ricercaSediAziendaRequestSilp));
            RicercaSediAziendaResponse ricercaSediAziendaResponse = post(silpapiUrl + url, ow.writeValueAsString(ricercaSediAziendaRequestSilp), silpapiUser, silpapiPassword, RicercaSediAziendaResponse.class);
            Log.info(ow.writeValueAsString(ricercaSediAziendaResponse));
            return ricercaSediAziendaResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public PresenzaPattiAttivazioneResponse esistonoPattiDiAttivazioneSilp(String url) {
        try {
            PresenzaPattiAttivazioneResponse presenzaPattiAttivazioneResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, PresenzaPattiAttivazioneResponse.class);

            return presenzaPattiAttivazioneResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public DettaglioEsperienzeProfessionaliResponse getDettaglioEsperienzaProfessionale(String url) {
        try {
            DettaglioEsperienzeProfessionaliResponse dettaglioEsperienzeProfessionaliResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, DettaglioEsperienzeProfessionaliResponse.class);
            return dettaglioEsperienzeProfessionaliResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public DettaglioCorsoFormazioneResponse getDettaglioCorsoFormazione(String url) {
        try {
            DettaglioCorsoFormazioneResponse dettaglioCorsoFormazioneResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, DettaglioCorsoFormazioneResponse.class);
            return dettaglioCorsoFormazioneResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public DettaglioTitoloDiStudioResponse getDettaglioTitoloDiStudio(String url) {
        try {
            DettaglioTitoloDiStudioResponse dettaglioTitoloDiStudioResponse = get(silpapiUrl + url, silpapiUser, silpapiPassword, DettaglioTitoloDiStudioResponse.class);
            return dettaglioTitoloDiStudioResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public EsperienzaLavoroResponse insertOrUpdateEsperienzaLavoroSilp(EsperienzaLavoroRequest request) {
        EsperienzaLavoroRequest esperienzaLavoroRequest = new EsperienzaLavoroRequest();
        // esperienzaLavoroSilpApiMappe
        esperienzaLavoroRequest.setLavEsperienzaLavoro(request.getLavEsperienzaLavoro());
        esperienzaLavoroRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter             ow                         = new ObjectMapper().writer().withDefaultPrettyPrinter();
            EsperienzaLavoroResponse controlliFascicoloResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_UPDATE_ESPERIENZA_LAVORO, ow.writeValueAsString(esperienzaLavoroRequest), silpapiUser,
                    silpapiPassword, EsperienzaLavoroResponse.class);
            return controlliFascicoloResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public CorsoFormazioneResponse insertOrUpdateCorsoFormazione(CorsoFormazioneRequest corsoFormazioneRequest) {
        corsoFormazioneRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter            ow                      = new ObjectMapper().writer().withDefaultPrettyPrinter();
            CorsoFormazioneResponse corsoFormazioneResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_UPDATE_CORSO_FORMAZIONE, ow.writeValueAsString(corsoFormazioneRequest), silpapiUser,
                    silpapiPassword, CorsoFormazioneResponse.class);
            return corsoFormazioneResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public MsgResponse deleteCorsoFormazione(CorsoFormazioneRequest corsoFormazioneRequest) {
        corsoFormazioneRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow          = new ObjectMapper().writer().withDefaultPrettyPrinter();
            MsgResponse  msgResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_DELETE_CORSO_FORMAZIONE, ow.writeValueAsString(corsoFormazioneRequest), silpapiUser, silpapiPassword, MsgResponse.class);
            return msgResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public TitoloStudioLavoratoreResponse insertOrUpdateTitoloStudio(TitoloStudioRequest titoloStudioRequest) {
        titoloStudioRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter                   ow                      = new ObjectMapper().writer().withDefaultPrettyPrinter();
            TitoloStudioLavoratoreResponse titoliStudioLavResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_UPDATE_TITOLO_STUDIO, ow.writeValueAsString(titoloStudioRequest), silpapiUser,
                    silpapiPassword, TitoloStudioLavoratoreResponse.class);
            return titoliStudioLavResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public LinguaResponse insertOrUpdateLingua(LinguaRequest linguaRequest) {
        linguaRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter   ow             = new ObjectMapper().writer().withDefaultPrettyPrinter();
            LinguaResponse linguaResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_UPDATE_LINGUA, ow.writeValueAsString(linguaRequest), silpapiUser, silpapiPassword, LinguaResponse.class);
            return linguaResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public AlboResponse insertOrDeleteAlbo(AlboRequest alboRequest) {
        alboRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow           = new ObjectMapper().writer().withDefaultPrettyPrinter();
            AlboResponse alboResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_DELETE_ALBO, ow.writeValueAsString(alboRequest), silpapiUser, silpapiPassword, AlboResponse.class);
            return alboResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public MsgResponse deleteLingua(LinguaRequest linguaRequest) {
        linguaRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow          = new ObjectMapper().writer().withDefaultPrettyPrinter();
            MsgResponse  msgResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_DELETE_LINGUA, ow.writeValueAsString(linguaRequest), silpapiUser, silpapiPassword, MsgResponse.class);
            return msgResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public MsgResponse deleteTitoloStudio(TitoloStudioRequest titoloStudioRequest) {
        titoloStudioRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow          = new ObjectMapper().writer().withDefaultPrettyPrinter();
            MsgResponse  msgResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_DELETE_TITOLO_STUDIO, ow.writeValueAsString(titoloStudioRequest), silpapiUser, silpapiPassword, MsgResponse.class);
            return msgResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public MsgResponse deleteInformatica(InformaticaRequest informaticaRequest) {
        informaticaRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow          = new ObjectMapper().writer().withDefaultPrettyPrinter();
            MsgResponse  msgResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_DELETE_INFORMATICA, ow.writeValueAsString(informaticaRequest), silpapiUser, silpapiPassword, MsgResponse.class);
            return msgResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public InformaticaResponse insertOrUpdateInformatica(InformaticaRequest informaticaRequest) {
        informaticaRequest.setCallInfo(creaCallInfo());

        try {
            ObjectWriter        ow                  = new ObjectMapper().writer().withDefaultPrettyPrinter();
            InformaticaResponse informaticaResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_UPDATE_INFORMATICA, ow.writeValueAsString(informaticaRequest), silpapiUser, silpapiPassword,
                    InformaticaResponse.class);
            return informaticaResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public PatenteResponse insertOrDeletePatente(PatenteRequest patenteRequest) {
        patenteRequest.setCallInfo(creaCallInfo());
        try {
            ObjectWriter    ow              = new ObjectMapper().writer().withDefaultPrettyPrinter();
            PatenteResponse patenteResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERT_DELETE_PATENTE, ow.writeValueAsString(patenteRequest), silpapiUser, silpapiPassword, PatenteResponse.class);
            return patenteResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public MsgResponse deleteDettaglioEsperienzaProfessionale(Long idSilLavEsperienzaLavoro) {
        try {
            DettaglioEsperienzeProfessionaliResponse dettaglioEsperienzeProfessionaliResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_FASCICOLO_DETTAGLIO_ESPERIENZA_LAVORO, idSilLavEsperienzaLavoro),
                    silpapiUser, silpapiPassword, DettaglioEsperienzeProfessionaliResponse.class);
            if (dettaglioEsperienzeProfessionaliResponse.isEsitoPositivo()) {
                /*
                 * ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
                 * ControlliFascicoloResponse controlliFascicoloResponse = post(silpapiUrl + url,ow.writeValueAsString(controlloFascicoloRequest) , silpapiUser, silpapiPassword,ControlliFascicoloResponse.class);
                 * 
                 */
                ObjectWriter            ow                      = new ObjectMapper().writer().withDefaultPrettyPrinter();
                EsperienzaLavoroRequest esperienzaLavoroRequest = new EsperienzaLavoroRequest();
                esperienzaLavoroRequest.setCallInfo(creaCallInfo());
                esperienzaLavoroRequest.setLavEsperienzaLavoro(dettaglioEsperienzeProfessionaliResponse.getEsperienzaProfessionale());

                MsgResponse msgResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_DELETE_ESPERIENZA_LAVORO, ow.writeValueAsString(esperienzaLavoroRequest), silpapiUser, silpapiPassword, MsgResponse.class);

                // return dettaglioEsperienzeProfessionaliResponseSilpApiMapper.toModel(dettaglioEsperienzeProfessionaliResponse);

                return msgResponse;
            } else {
                Log.error("Errore chiamata silpapi");
                if (dettaglioEsperienzeProfessionaliResponse.getApiMessages() != null) {
                    for (ApiMessage msg : dettaglioEsperienzeProfessionaliResponse.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    // ==================================================================
    // DID

    public UltimaDidResponse getUltimaDid(Long idSilLavAnagrafica, String cf) {
        FormRicercaDid formRicercaDid = new FormRicercaDid();
        formRicercaDid.setCallInfo(creaCallInfo());
        formRicercaDid.setCodFisc(cf);
        formRicercaDid.setIdSilLavAnagrafica(idSilLavAnagrafica);
        // formRicercaDid.setDaAcquisire(true);
        formRicercaDid.setStato(Arrays.asList("I", "C", "S", "R"));
        OrderField orderField = new OrderField();
        orderField.setOrder(0);
        orderField.setColumnNumber(1);
        formRicercaDid.setOrdinamento(orderField);
        UltimaDidResponse ultimaDidResponse = new UltimaDidResponse();
        UltimaDid         ultimaDid         = new UltimaDid();

        try {
            // collocamento mirato

            InfoIscrizioniCollocamentoMiratoLavoratoreResponse infoIscrizioniCollocamentoMiratoLavoratoreResponse = get(
                    String.format(silpapiUrl + PslpConstants.SILPAPI_COLLOCAMENTO_MIRATO_LAVORATORE, idSilLavAnagrafica), silpapiUser, silpapiPassword, InfoIscrizioniCollocamentoMiratoLavoratoreResponse.class);
            if (infoIscrizioniCollocamentoMiratoLavoratoreResponse.isEsitoPositivo()) {
                ultimaDid.setIscrizioneCollocamentoMirato(!infoIscrizioniCollocamentoMiratoLavoratoreResponse.getIscrizioniComi().isEmpty());
                ultimaDidResponse.setUltimaDid(ultimaDid);
            } else {
                if (infoIscrizioniCollocamentoMiratoLavoratoreResponse.getApiMessages() != null) {
                    for (ApiMessage msg : infoIscrizioniCollocamentoMiratoLavoratoreResponse.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }
            }
            ObjectWriter       ow                 = new ObjectMapper().writer().withDefaultPrettyPrinter();
            RicercaDidResponse ricercaDidResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_RICERCA_DID + "?page=0&recForPage=20", ow.writeValueAsString(formRicercaDid), silpapiUser, silpapiPassword,
                    RicercaDidResponse.class);
            if (!ricercaDidResponse.isEsitoPositivo() || ricercaDidResponse.getTotalResult() < 1) {
                Log.error("Errore chiamata silpapi");
                if (ricercaDidResponse.getApiMessages() != null) {
                    for (ApiMessage msg : ricercaDidResponse.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }

                ultimaDidResponse.setEsitoPositivo(ricercaDidResponse.isEsitoPositivo());
                ultimaDidResponse.setApiMessages(apiMessageSilpApiMapper.toModels(ricercaDidResponse.getApiMessages()));
                return ultimaDidResponse;
            }

            FormDettaglioDid formDettaglioDid = new FormDettaglioDid();
            formDettaglioDid.setCallInfo(creaCallInfo());
            formDettaglioDid.getCallInfo().setIdRuolo(1L);// per ora rimane super user poi capiamo cosa ci va messo
            formDettaglioDid.setIdSilLavAnagrafica(idSilLavAnagrafica);
            formDettaglioDid.setCodiceFiscaleLavoratore(cf);
            formDettaglioDid.setIdSilLavSapDid(ricercaDidResponse.getList().get(0).getIdSilLavSapDid());
            Log.info(formDettaglioDid);
            Log.info("----");
            Log.info(ricercaDidResponse.getList().get(0));
            DidResponse didResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FIND_DID, ow.writeValueAsString(formDettaglioDid), silpapiUser, silpapiPassword, DidResponse.class);
            Log.info("----");
            Log.info(didResponse);
            if (!didResponse.isEsitoPositivo()) {
                Log.error("Errore chiamata silpapi");
                if (didResponse.getApiMessages() != null) {
                    for (ApiMessage msg : didResponse.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }
                ultimaDidResponse.setEsitoPositivo(didResponse.isEsitoPositivo());
                ultimaDidResponse.setApiMessages(apiMessageSilpApiMapper.toModels(didResponse.getApiMessages()));
                return ultimaDidResponse;
            }
            PslpMessaggio pslpMessaggio = new PslpMessaggio();
            pslpMessaggio.setCodMessaggio("00");
            pslpMessaggio.setDescrMessaggio(PslpConstants.OK);

            ultimaDidResponse.setEsitoPositivo(true);
            // ultimaDidResponse.setApiMessages((List<it.csi.pslp.pslpbff.api.dto.ApiMessage>) pslpMessaggio);

            if (didResponse.getLavSapDid() == null) {
                ultimaDidResponse.setUltimaDid(ultimaDid);
                return ultimaDidResponse;
            }

            ultimaDid.setEta(didResponse.getLavSapDid().getSilLavAnagrafica().getEta());
            ultimaDid.setNumDid(ricercaDidResponse.getList().get(0).getIdentificativoPolitica() != null ? ricercaDidResponse.getList().get(0).getIdentificativoPolitica()
                    : ricercaDidResponse.getList().get(0).getIdSilLavSapDid().toString());
            ultimaDid.setDataDid(didResponse.getLavSapDid().getDataDid());
            List<StatoSapDid> statoSapDidList = didResponse.getLavSapDid().getListStatoSapDid();
            ultimaDid.setNumGiorniDisoccupazioneCalcolati(didResponse.getNumGiorniDisoccupazioneCalcolati());
            StatoSapDid statoSapDid = null;
            for (StatoSapDid stato : statoSapDidList) {
                if ("S".equals(stato.getFlgCurrentRecord())) {
                    statoSapDid = stato;
                }
            }
            if (statoSapDid != null) {
                ultimaDid.setStatoDid(statoSapDid.getSilTStatoDid().getDescrStatoDid());
                ultimaDid.setUltimaVariazioneStato(statoSapDid.getDataAggiorn());
                ultimaDid.setDenominazioneCpi(statoSapDid.getSilTCpi() != null ? statoSapDid.getSilTCpi().getDsSilTCpi() : null);
                ultimaDid.setUltimoProfilingAggiornato(statoSapDid.getDataRicalcolo());
            }

            // profiling quantitativo
            ultimaDidResponse.setUltimaDid(ultimaDid);
            CommonRequest commonRequestProf = new CommonRequest();
            commonRequestProf.setCallInfo(creaCallInfo());
            ProfilingQuantitativoResponse profilingQuantitativoResponse = post(String.format(silpapiUrl + PslpConstants.SILPAPI_URL_FIND_PROFILING_QUANTITATIVO, cf), ow.writeValueAsString(commonRequestProf), silpapiUser,
                    silpapiPassword, ProfilingQuantitativoResponse.class);
            if (profilingQuantitativoResponse.isEsitoPositivo() && profilingQuantitativoResponse.getProfQuantitativo() != null) {
                ultimaDidResponse.getUltimaDid().setUltimoProfilingAggiornato(profilingQuantitativoResponse.getProfQuantitativo().getDataCalcolo());
            }

            return ultimaDidResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return ultimaDidResponse;
    }

    public InserisciDidResponse controlliPreInserisciDid(Long idSilLavAnagrafica) {

        try {
            InserisciDidResponse inserisciDidResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_INSERISCI_DID_CONTROLLO, idSilLavAnagrafica), silpapiUser, silpapiPassword, InserisciDidResponse.class);
            return inserisciDidResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public InserisciDidResponse onChangeDataDid(FormInserisciDid formInserisciDid) {
        formInserisciDid.setCallInfo(creaCallInfo());

        try {
            ObjectWriter         ow                   = new ObjectMapper().writer().withDefaultPrettyPrinter();
            InserisciDidResponse inserisciDidResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_INSERISCI_DID_ONCHANGE, ow.writeValueAsString(formInserisciDid), silpapiUser, silpapiPassword,
                    InserisciDidResponse.class);
            return inserisciDidResponse;
        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public SuntoLavoratoreResponse findSuntoLavoratore(Long idSilLavAnagrafica) {

        try {
            SuntoLavoratoreResponse suntoLavoratoreResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_LAVORATORE_FIND_SUNTO, idSilLavAnagrafica), silpapiUser, silpapiPassword,
                    SuntoLavoratoreResponse.class);
            return suntoLavoratoreResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public InserisciDidResponse salvaDid(FormInserisciDid formInserisciDid) {
        formInserisciDid.setCallInfo(creaCallInfo());
        // Log.info(formInserisciDid);
        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(formInserisciDid));
            InserisciDidResponse inserisciDidResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_INSERISCI_DID_SALVA, ow.writeValueAsString(formInserisciDid), silpapiUser, silpapiPassword, InserisciDidResponse.class);
            Log.info(inserisciDidResponse);
            return inserisciDidResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public InserisciTitoloStudioLavResponse inserisciTitoloStudioLavoratore(DatiTitoloStudioLavoratore datiTitoloStudioLavoratore) {
        datiTitoloStudioLavoratore.setCallInfo(creaCallInfo());

        try {
            ObjectWriter                     ow                               = new ObjectMapper().writer().withDefaultPrettyPrinter();
            InserisciTitoloStudioLavResponse inserisciTitoloStudioLavResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_PROFILING_QUANTITATIVO_INSERISCI_TITOLO, ow.writeValueAsString(datiTitoloStudioLavoratore),
                    silpapiUser, silpapiPassword, InserisciTitoloStudioLavResponse.class);
            return inserisciTitoloStudioLavResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public RicercaDidInpsResponse ricercaDidInps(FormRicercaDidInps formRicercaDidInps) {
        formRicercaDidInps.setCallInfo(creaCallInfo());

        try {
            ObjectWriter           ow                     = new ObjectMapper().writer().withDefaultPrettyPrinter();
            RicercaDidInpsResponse ricercaDidInpsResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_INPS_DID_RICERCA + "/0/10", ow.writeValueAsString(formRicercaDidInps), silpapiUser, silpapiPassword,
                    RicercaDidInpsResponse.class);
            return ricercaDidInpsResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public TitoliStudioLavResponse findTitoliStudioByIdLav(Long idSilLavAnagrafica) {

        try {
            TitoliStudioLavResponse titoliStudioLavResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_PROFILING_QUANTITATIVO_FIND_TITOLO, idSilLavAnagrafica), silpapiUser, silpapiPassword,
                    TitoliStudioLavResponse.class);
            return titoliStudioLavResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public PresenzaPattiAttivazioneResponse esistonoPattiDiAttivazione(Long idSilLavAnagrafica) {

        try {
            PresenzaPattiAttivazioneResponse presenzaPattiAttivazioneResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_LAVORATORE_ESISTE_PATTI, idSilLavAnagrafica), silpapiUser, silpapiPassword,
                    PresenzaPattiAttivazioneResponse.class);
            return presenzaPattiAttivazioneResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public RicercaStatiDidByCoResponse controlloRapportiLavoroAperti(Long idSilLavAnagrafica) {
        FormRicercaStatiDidByCo formRicercaStatiDidByCo = new FormRicercaStatiDidByCo();
        formRicercaStatiDidByCo.setCallInfo(creaCallInfo());
        formRicercaStatiDidByCo.setIdLavoratore(idSilLavAnagrafica);
        formRicercaStatiDidByCo.setDataRiferimento(new Date());
        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

            RicercaStatiDidByCoResponse ricercaStatiDidByCoResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_LAVORATORE_FIND_GET_RAPPORTI_LAV, ow.writeValueAsString(formRicercaStatiDidByCo), silpapiUser,
                    silpapiPassword, RicercaStatiDidByCoResponse.class);
            return ricercaStatiDidByCoResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public TipoPatenteResponse findTipoPatenteByFlgPossesso(String flgPossesso) {

        try {
            TipoPatenteResponse presenzaInItaliaResponse = get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_PROFILING_QUANTITATIVO_FIND_TIPO_PATENTE, flgPossesso), silpapiUser, silpapiPassword, TipoPatenteResponse.class);
            return presenzaInItaliaResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public PresenzaInItaliaResponse findAllDurataPresenzaItalia() {

        try {
            PresenzaInItaliaResponse presenzaInItaliaResponse = get(silpapiUrl + PslpConstants.SILPAPI_URL_PROFILING_QUANTITATIVO_FINDALL_PRESENZAINITALIA, silpapiUser, silpapiPassword, PresenzaInItaliaResponse.class);
            return presenzaInItaliaResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public CondizioneOccupazionaleResponse findAllCondizioneOccupazionale() {
        // CondizioneOccupazionaleResponse
        try {
            CondizioneOccupazionaleResponse condizioneOccupazionaleResponse = get(silpapiUrl + PslpConstants.SILPAPI_URL_PROFILING_QUANTITATIVO_FINDALL_CONDIZIONE_OCC, silpapiUser, silpapiPassword,
                    CondizioneOccupazionaleResponse.class);
            return condizioneOccupazionaleResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public InserisciPatenteLavResponse inserisciPatenteLavoratore(DatiPatenteLavoratore datiPatenteLavoratore) {
        datiPatenteLavoratore.setCallInfo(creaCallInfo());

        try {
            ObjectWriter                ow                          = new ObjectMapper().writer().withDefaultPrettyPrinter();
            InserisciPatenteLavResponse inserisciPatenteLavResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_PROFILING_QUANTITATIVO_INSERISCI_PATENTE, ow.writeValueAsString(datiPatenteLavoratore), silpapiUser,
                    silpapiPassword, InserisciPatenteLavResponse.class);
            return inserisciPatenteLavResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public OrchestratoreResponse sendSapSilp(FormOrchestratore formOrchestratore) {
        formOrchestratore.setCallInfo(creaCallInfo());
        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(formOrchestratore));
            OrchestratoreResponse orchestratoreResponse = post(silpapiUrl + PslpConstants.SILPAPI_PRENOTA_INVIA_SAP, ow.writeValueAsString(formOrchestratore), silpapiUser, silpapiPassword, OrchestratoreResponse.class);
            Log.info(orchestratoreResponse);
            return orchestratoreResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;
    }

    public ControlliFascicoloResponse inserisciModificaFascicoloCittadino(ControlliFascicoloRequest entity) {
        entity.setCallInfo(creaCallInfo());
        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

            ControlliFascicoloResponse controlliFascicoloResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_FASCICOLO_INSERISCI_MODIFICA_CITTADINO, ow.writeValueAsString(entity), silpapiUser, silpapiPassword,
                    ControlliFascicoloResponse.class);
            Log.info(controlliFascicoloResponse);
            return controlliFascicoloResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public MsgResponse disarchiviaLavoratore(Long idLav, String cfUtente) {
        CallInfo callInfo = new CallInfo();
        callInfo.setIdAppChiamante(PslpConstants.COMPONENT_NAME_CHIAMANTE);
        callInfo.setCodFiscale(cfUtente);
        CommonRequest cr = new CommonRequest();
        cr.setCallInfo(callInfo);
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return post(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_FASCICOLO_ARCHIVIA_DISARCHIVIA, idLav, "D"), ow.writeValueAsString(cr), silpapiUser, silpapiPassword, MsgResponse.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public DidResponse controlliStampaDid(Long idSilLavAnagrafica) {
        try {
            return get(silpapiUrl + String.format(PslpConstants.SILPAPI_URL_CONTROLLI_STAMPA_DID, idSilLavAnagrafica), silpapiUser, silpapiPassword, DidResponse.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public it.csi.pslp.pslpbff.api.dto.response.ReportResponse stampaAttestatoDisoccupazione(FormInserisciDid did) {
        CallInfo callInfo = creaCallInfo();
        did.setCallInfo(callInfo);
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return post(silpapiUrl + PslpConstants.SILPAPI_URL_STAMPA_DID, ow.writeValueAsString(did), silpapiUser, silpapiPassword, it.csi.pslp.pslpbff.api.dto.response.ReportResponse.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public LavoratoreResponse riceviSap(FormOrchestratore formOrchestratore) {
        CallInfo callInfo = creaCallInfo();
        formOrchestratore.setCallInfo(callInfo);
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return post(silpapiUrl + PslpConstants.SILPAPI_URL_RICEVI_SAP, ow.writeValueAsString(formOrchestratore), silpapiUser, silpapiPassword, LavoratoreResponse.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public CurriculumVitaeResponse inviaDatiCvASilp(CurriculumVitaeRequest request) {
        request.setCallInfo(creaCallInfo());
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            Log.info(ow.writeValueAsString(request));
            return post(silpapiUrl + PslpConstants.SILPAPI_INVIA_DATI_CV, ow.writeValueAsString(request), silpapiUser, silpapiPassword, CurriculumVitaeResponse.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public MsgMulticanaleResponse inviaMessaggio(FormInviaMsg body) {
        try {
            ObjectWriter           ow             = new ObjectMapper().writer().withDefaultPrettyPrinter();
            MsgMulticanaleResponse esitoMessaggio = post(silpapiUrl + PslpConstants.SILPAPI_MULTICANALE_INSERT_MSG, ow.writeValueAsString(body), silpapiUser, silpapiPassword, MsgMulticanaleResponse.class);

            if (esitoMessaggio != null) {
                return esitoMessaggio;
            }
        } catch (Exception e) {
            Log.error("Errore chiamata silospapi", e);
        }

        return null;

    }

    // =========================================================================
    // Notifiche

    // pullNotify
    public RicercaNotificheResponse pullNotify(Long idSilLavAnagrafica) {
        RicercaNotificheRequest ricercaNotificheRequest = new RicercaNotificheRequest();
        ricercaNotificheRequest.setCallInfo(creaCallInfo());
        ricercaNotificheRequest.setIdSilLavAnagrafica(idSilLavAnagrafica);

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(ricercaNotificheRequest));
            RicercaNotificheResponse notificheResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_NOTIFICHE_PULLNOTIFY, ow.writeValueAsString(ricercaNotificheRequest), silpapiUser, silpapiPassword,
                    RicercaNotificheResponse.class);
            Log.info(ow.writeValueAsString(notificheResponse));
            return notificheResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    // ricerca Notify
    public RicercaNotificheResponse ricercaNotify(Long idSilLavAnagrafica, String stato, int page, int recForPage) {
        RicercaNotificheRequest ricercaNotificheRequest = new RicercaNotificheRequest();
        ricercaNotificheRequest.setCallInfo(creaCallInfo());
        ricercaNotificheRequest.setIdSilLavAnagrafica(idSilLavAnagrafica);
        ricercaNotificheRequest.setStato(stato);

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(ricercaNotificheRequest));
            Log.info(silpapiUrl + PslpConstants.SILPAPI_URL_NOTIFICHE_RICERCA + "?page=" + page + "&recForPage=" + recForPage);
            RicercaNotificheResponse notificheResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_NOTIFICHE_RICERCA + "?page=" + page + "&recForPage=" + recForPage, ow.writeValueAsString(ricercaNotificheRequest),
                    silpapiUser, silpapiPassword, RicercaNotificheResponse.class);
            Log.info(ow.writeValueAsString(notificheResponse));
            return notificheResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    // Aggiorna Notifica
    public NotificaResponse aggiornaNotifica(Long idSilwebNotiWeb, String operazioneDaEseguire) {
        NotificaRequest ricercaNotificheRequest = new NotificaRequest();
        ricercaNotificheRequest.setCallInfo(creaCallInfo());
        ricercaNotificheRequest.setIdSilwebNotiWeb(idSilwebNotiWeb);
        ricercaNotificheRequest.setOperazioneDaEseguire(operazioneDaEseguire);

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(ricercaNotificheRequest));
            NotificaResponse notificheResponse = post(silpapiUrl + PslpConstants.SILPAPI_URL_NOTIFICHE_AGGIORNA, ow.writeValueAsString(ricercaNotificheRequest), silpapiUser, silpapiPassword, NotificaResponse.class);
            Log.info(ow.writeValueAsString(notificheResponse));
            return notificheResponse;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    // ============================== DOCUMENTI ==============================

    public RicercaRichiesteDocumentiResponse ricercaRichiesteDocumenti(FormRicercaRichiesteDocumenti form, int page, int recForPage) {
        form.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(form));
            RicercaRichiesteDocumentiResponse response = post(silpapiUrl + PslpConstants.SILPAPI_URL_DOCUMENTI + "ricerca-richieste-documenti?page=" + page + "&recForPage=" + recForPage, ow.writeValueAsString(form),
                    silpapiUser, silpapiPassword, RicercaRichiesteDocumentiResponse.class);
            Log.info(ow.writeValueAsString(response));
            return response;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public DocumentoRichiestoResponse visualizzaRichiestaDocumento(Long idRichiestaDocumento) {
        try {
            DocumentoRichiestoResponse response = get(silpapiUrl + PslpConstants.SILPAPI_URL_DOCUMENTI + "visualizza-richiesta-documento/" + idRichiestaDocumento, silpapiUser, silpapiPassword,
                    DocumentoRichiestoResponse.class);
            return response;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public DocumentoRichiestoResponse inserisciRichiestaDocumento(InserisciAggiornaRichiestaDocumentoRequest form) {
        form.setCallInfo(creaCallInfo());

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            Log.info(ow.writeValueAsString(form));
            DocumentoRichiestoResponse response = post(silpapiUrl + PslpConstants.SILPAPI_URL_DOCUMENTI + "inserisci-richiesta-documento", ow.writeValueAsString(form), silpapiUser, silpapiPassword,
                    DocumentoRichiestoResponse.class);
            Log.info(ow.writeValueAsString(response));
            return response;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }

    public ReportResponse stampaDocumentoRichiesto(Long idRichiestaDocumento) {
        try {
            ReportResponse response = get(silpapiUrl + PslpConstants.SILPAPI_URL_DOCUMENTI + "stampa-documento-richiesto/" + idRichiestaDocumento, silpapiUser, silpapiPassword, ReportResponse.class);
            return response;

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }
        return null;
    }
}
