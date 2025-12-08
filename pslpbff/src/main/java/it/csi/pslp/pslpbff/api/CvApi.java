/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.csi.pslp.pslpbff.api.dto.ApiError;
import it.csi.pslp.pslpbff.api.dto.blp.*;
import it.csi.pslp.pslpbff.api.dto.blp.CorsoFormazioneBlpRequest;
import it.csi.pslp.pslpbff.api.dto.blp.ElencoCVRequest;
import it.csi.pslp.pslpbff.api.dto.common.CommonResponse;
import it.csi.pslp.pslpbff.api.dto.response.ReportResponse;

import it.csi.pslp.pslpbff.api.dto.silpapi.CurriculumVitaeResponse;
import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/v1/cv")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="cv", description="servizi per il cv")
public interface CvApi {
    @POST
    @Path("get-elenco-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'elenco dei cv(candidature) di un soggetto",
            responses = { @ApiResponse(responseCode = "200", description = "elenco cv",content = @Content(schema = @Schema(implementation = ElencoCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getElencoCvForLavAnagrafica(@Valid ElencoCVRequest elencoCVRequest, @Context SecurityContext securityContext,
                                         @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("get-dettaglio-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce il cv con l'id passato",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getCvById(@Valid DettaglioCvRequest dettaglioCVRequest, @Context SecurityContext securityContext,
                       @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("valida-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Valida il cv con l'id passato",
            responses = { @ApiResponse(responseCode = "200", description = "esito operazione",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response validaCv(@Valid ValidaCvRequest dettaglioCVRequest, @Context SecurityContext securityContext,
                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    @POST
    @Path("invia-cv-a-silp")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Valida il cv con l'id passato",
            responses = { @ApiResponse(responseCode = "200", description = "esito operazione",content = @Content(schema = @Schema(implementation = CurriculumVitaeResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inviaDatiCvASilp(@Valid Candidatura candidatura, @Context SecurityContext securityContext,
                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    @POST
    @Path("rinnova-scadenza-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "rinnova scadenza del cv con l'id passato",
            responses = { @ApiResponse(responseCode = "200", description = "esito operazione",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response rinnovaScadenzaCv(@Valid DettaglioCvRequest dettaglioCVRequest, @Context SecurityContext securityContext,
                               @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );



    @POST
    @Path("genera-cv-automatico")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "genera cv automatico a partire dal fascicolo di silp",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response generaCvAutomatico(@Valid GeneraCvRequest generaCvRequest, @Context SecurityContext securityContext,
                                @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("aggiorna-cv-automatico")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiorna cv automatico a partire dal fascicolo di silp",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaCvAutomatico(@Valid DettaglioCvRequest generaCvRequest, @Context SecurityContext securityContext,
                                  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/inserisci-cv")
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "inserisci cv ",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciCv( InserisciAggiornaCandidaturaRequest body,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    @PUT
    @Path("/aggiorna-cv")
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "aggiorna cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaCv( InserisciAggiornaCandidaturaRequest body,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("elimina-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiorna cv automatico a partire dal fascicolo di silp",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response eliminaCvById(@Valid DettaglioCvRequest generaCvRequest, @Context SecurityContext securityContext,
                           @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    @POST
    @Path("copia-cv-valido")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisci un nuovo cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = DettaglioCvResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response copiaCvValidato(@Valid DettaglioCvRequest inserisciAggiornaCandidaturaRequest, @Context SecurityContext securityContext,
                             @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/formazione/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco corsi di formazione associati al cv",
            responses = { @ApiResponse(responseCode = "200", description = "elenco",content = @Content(schema = @Schema(implementation = CorsiFormazioneResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoCorsiByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                               @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/formazione/delete-corso")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "cancellazione corso",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteCorsoById(@Valid CorsoFormazioneBlpRequest corsoFormazioneBlpRequest, @Context SecurityContext securityContext,
                             @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/formazione/insert-corso")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento corso",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioCorsoFormazioneBlpResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciCorso(@Valid InserisciAggiornaCorsoFormazioneRequest corsoFormazioneRequest, @Context SecurityContext securityContext,
                            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @PUT
    @Path("/formazione/update-corso")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiorna cv automatico a partire dal fascicolo di silp",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioCorsoFormazioneBlpResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaCorso(@Valid InserisciAggiornaCorsoFormazioneRequest corsoFormazioneRequest, @Context SecurityContext securityContext,
                           @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    @POST
    @Path("/lingue/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco lingue dichiarate associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = LingueConosciuteResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoLingueIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                              @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/lingue/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione lingua dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteLinguaDichById(@Valid DettaglioLinguaDichRequest dettaglioLinguaDichRequest, @Context SecurityContext securityContext,
                                  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/lingue/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento lingua dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioLinguaConosciutaResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciLinguaDich(@Valid InserisciAggiornaLinguaDichRequest inserisciAggiornaLinguaDichRequest, @Context SecurityContext securityContext,
                                 @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @PUT
    @Path("/lingue/update")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiornamento lingua dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioLinguaConosciutaResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaLinguaDich(@Valid InserisciAggiornaLinguaDichRequest inserisciAggiornaLinguaDichRequest, @Context SecurityContext securityContext,
                                @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/patenti/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco lingue dichiarate associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = PatentiPosseduteResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoPatentiPosseduteByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/patenti/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione lingua dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deletePatentePossedutaById(@Valid InserisciEliminaPatentePossedutaRequest dettaglioPatenteRequest, @Context SecurityContext securityContext,
                                        @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/patenti/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento lingua dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioPatentePossedutaResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciPatentePosseduta(@Valid InserisciEliminaPatentePossedutaRequest dettaglioPatenteRequest, @Context SecurityContext securityContext,
                                       @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );



    @POST
    @Path("/istruzioni-dich/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco istruzione dichiarate associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = IstruzioniDichResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoIstruzioniByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                    @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/istruzioni-dich/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione istruzione dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteIstruzioneDichById(@Valid DettaglioIstruzioneDichRequest dettaglioIstruzioneDichRequest, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/istruzioni-dich/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento istruzione dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioIstruzioneDichResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciIstruzioneDich(@Valid  InserisciAggiornaIstruzioneDichRequest inserisciAggiornaIstruzioneDichRequest, @Context SecurityContext securityContext,
                                     @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @PUT
    @Path("/istruzioni-dich/update")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiornamento istruzione dichiarata",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  DettaglioIstruzioneDichResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaIstruzioneDich(@Valid InserisciAggiornaIstruzioneDichRequest inserisciAggiornaIstruzioneDichRequest, @Context SecurityContext securityContext,
                                    @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/iscrizioni-albi/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco istruzione dichiarate associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = AlbiDichiaratiResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoAlbiDichByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/iscrizioni-albi/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione albo dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteAlboDichById(@Valid DettaglioAlboDichRequest dettaglioAlboDichRequest, @Context SecurityContext securityContext,
                                @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/iscrizioni-albi/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento albo dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioAlboDichiaratoResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciAlboDich(@Valid InserisciEliminaAlboDichRequest aggiornaAlboDichRequest, @Context SecurityContext securityContext,
                               @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );



    @POST
    @Path("/patentini/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco patentini dichiarate associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = PatentiniPossedutiResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoAbilitazioniDichByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/patentini/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione patentino dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteAbilitazioneDichById(@Valid DettaglioAbilitazioneDichRequest dettaglioAbilitazioneDichRequest, @Context SecurityContext securityContext,
                                        @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/patentini/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento patentino dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioPatentinoPossedutoResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciAbilitazioneDich(@Valid InserisciEliminaAbilitazioneRequest inserisciAggiornaAbilitazioneRequest, @Context SecurityContext securityContext,
                                       @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/conoscenze-informatiche/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco patentini dichiarate associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = ConoscenzeInformaticheResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoConoscenzeInfoDichByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/conoscenze-informatiche/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione patentino dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteConoscenzeInfoDichById(@Valid DettaglioConoscenzaInformaticaRequest dettaglioConoscenzaInformaticaRequest, @Context SecurityContext securityContext,
                                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/conoscenze-informatiche/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento patentino dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioConoscenzaInformaticaResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciConoscenzeInfoDich(@Valid InserisciAggiornaConInformaticaRequest inserisciAggiornaConInformaticaRequest, @Context SecurityContext securityContext,
                                         @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @PUT
    @Path("/conoscenze-informatiche/update")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiornamento patentino dichiarato",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  DettaglioConoscenzaInformaticaResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaConoscenzeInfoDich(@Valid InserisciAggiornaConInformaticaRequest inserisciAggiornaConInformaticaRequest, @Context SecurityContext securityContext,
                                        @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    @POST
    @Path("/esperienze-lavoro/get-elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco esperienze di lavoro associate al cv",
            responses = { @ApiResponse(responseCode = "200", description = "cv generato aggiornato",content = @Content(schema = @Schema(implementation = EsperienzeDiLavoroResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoEsperienzeLavoroByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/esperienze-lavoro/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "eliminazione esperienza di lavoro",
            responses = { @ApiResponse(responseCode = "200", description = "eliminazione avvenuta con successo",content = @Content(schema = @Schema(implementation = CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteEsperienzaLavoroById(@Valid DettaglioEsperienzaLavRequest dettaglioEsperienzaLavRequest, @Context SecurityContext securityContext,
                                        @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/esperienze-lavoro/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento esperienza di lavoro",
            responses = { @ApiResponse(responseCode = "200", description = "inserimento avvenuto con successo",content = @Content(schema = @Schema(implementation = DettaglioEsperienzaDiLavoroResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciEsperienzaLavoro(@Valid InserisciAggiornaEsperienzaLavRequest inserisciAggiornaEsperienzaLavRequest, @Context SecurityContext securityContext,
                                       @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @PUT
    @Path("/esperienze-lavoro/update")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiornamento esperienza di lavoro",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  DettaglioEsperienzaDiLavoroResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaEsperienzaLavoro(@Valid InserisciAggiornaEsperienzaLavRequest inserisciAggiornaEsperienzaLavRequest, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    @POST
    @Path("/professione-desiderata/insert")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento professione desiderata",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  DettaglioProfessioneDesiderataResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciProfessioneDesiderata(@Valid InserisciAggiornaProfessioneDesiderataRequest inserisciAggiornaProfessioneDesiderataRequest, @Context SecurityContext securityContext,
                                            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @PUT
    @Path("/professione-desiderata/update")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "aggiorna professione desiderata",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  DettaglioProfessioneDesiderataResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaProfessioneDesiderata(@Valid InserisciAggiornaProfessioneDesiderataRequest inserisciAggiornaProfessioneDesiderataRequest, @Context SecurityContext securityContext,
                                           @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/professione-desiderata/delete")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elimina professione desiderata",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  CommonResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response eliminaProfessioneDesiderataById(@Valid DettaglioProfessioneDesiderataRequest dettaglioProfessioneDesiderataRequest, @Context SecurityContext securityContext,
                                              @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/professione-desiderata/elenco-by-id-cv")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "elenco delle professioni desiderate",
            responses = { @ApiResponse(responseCode = "200", description = "aggiornamento avvenuto con successo",content = @Content(schema = @Schema(implementation =  ElencoProfessioniDesiderateResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoProfessioniDesiderateByIdCv(@Valid DettaglioCvRequest dettaglioCvRequest, @Context SecurityContext securityContext,
                                               @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/stampa-cv")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MimeTypeContainer.MimeType.PDF })
    @Operation(summary = "Restituisce la stampa del CV",
            responses = { @ApiResponse(responseCode = "200", description = "Restituisce la stampa del CV",content = @Content(schema = @Schema(implementation = ReportResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response stampaCv(@NotNull StampaCvRequest stampaCvRequest, @Context SecurityContext securityContext,
                                           @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
}
