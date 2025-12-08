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
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/v1/fascicolo-pslp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="fascicolo-pslp", description="Gestione fascicolo")
public interface FascicoloApi  {


    //======================================================================
    //  CDU 08 -  torna il fascicolo  mediante getDettaglioFascicolo del servizio SILPAPI
    @GET
    @Path("get-dettaglio/{idSilLavAnagrafica}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce dettaglio scheda anagrafica professionale",
            responses = { @ApiResponse(responseCode = "200", description = "dettaglio scheda anagrafica professionale",content = @Content(schema = @Schema(implementation = DettaglioFascicoloResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getDettaglioFascicolo(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
                                   @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 09 -  salva il fascicolo

    @POST
    @Path("controlla-prosegui-salva")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "controlli inserimento modifica e salvataggio", responses = {
            @ApiResponse(responseCode = "200", description = "controlli inserimento modifica e salvataggio", content = @Content(schema = @Schema(implementation = ControlliFascicoloResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response controllaProseguiSalva(ControlliFascicoloRequest request, @Context SecurityContext securityContext,
                                         @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);




    //======================================================================
    //  CDU 09 -  ricerca sedi azienda

    @POST
    @Path("ricerca-sedi-azienda")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Ricerca azienda con sede", responses = {
            @ApiResponse(responseCode = "200", description = "Restituisce elenco aziende con sede", content = @Content(schema = @Schema(implementation = RicercaSediAziendaResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response ricercaSediAzienda(RicercaSediAziendaRequest request, @Min(0) @QueryParam("page") @NotNull int page, @QueryParam("recForPage") int recForPage, @Context SecurityContext securityContext,
                                @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);


    // =====================================================================================
    //  CDU 09 -  dettaglio esperienza professionale
    //
    @GET
    @Path("get-dettaglio-esperienza-professionale/{idSilLavEsperienzaLavoro}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "dettaglio esperienza professionale", responses = {
            @ApiResponse(responseCode = "200", description = "dettaglio esperienza professionale", content = @Content(schema = @Schema(implementation = DettaglioEsperienzeProfessionaliResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getDettaglioEsperienzaProfessionale(@PathParam("idSilLavEsperienzaLavoro") @NotNull Long idSilLavEsperienzaLavoro,
                                                                  @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
                                                                  @Context HttpServletRequest httpRequest);

    // =====================================================================================
    //  CDU 09 -  dettaglio corso formazione
    //
    @GET
    @Path("get-dettaglio-corso-formazione/{idSilLavCorsoForm}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "dettaglio corso formazione", responses = {
            @ApiResponse(responseCode = "200", description = "dettaglio corso formazione", content = @Content(schema = @Schema(implementation = DettaglioCorsoFormazioneResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getDettaglioCorsoFormazione(@PathParam("idSilLavCorsoForm") @NotNull Long idSilLavCorsoForm,
                                                 @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
                                                 @Context HttpServletRequest httpRequest);


    // =====================================================================================
    //  CDU 09 -  dettaglio titolo di studio
    //
    @GET
    @Path("get-dettaglio-titolo-di-studio/{idSilLavTitoloStudio}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "dettaglio titolo di studio", responses = {
            @ApiResponse(responseCode = "200", description = "dettaglio titolo di studio", content = @Content(schema = @Schema(implementation = DettaglioTitoloDiStudioResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getDettaglioTitoloDiStudio(@PathParam("idSilLavTitoloStudio") @NotNull Long idSilLavTitoloStudio,
                                                 @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
                                                 @Context HttpServletRequest httpRequest);

    // =====================================================================================
    //  CDU 09 -  delete esperienza professionale
    //
    @GET
    @Path("delete-esperienza-lavoro/{idSilLavEsperienzaLavoro}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Cancella l'esperienza lavorativa", responses = {
            @ApiResponse(responseCode = "200", description = "Cancella l'esperienza lavorativa", content = @Content(schema = @Schema(implementation = MsgResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteEsperienzaProfessionale(@PathParam("idSilLavEsperienzaLavoro") @NotNull Long idSilLavEsperienzaLavoro,
                                                 @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
                                                 @Context HttpServletRequest httpRequest);


    //======================================================================
    //  CDU 09 -  insert or update esperienza lavoro

    @POST
    @Path("insert-or-update-esperienza-lavoro")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o aggiorna l'esperienza lavorativa", responses = {
            @ApiResponse(responseCode = "200", description = "inserisce o aggiorna l'esperienza lavorativa", content = @Content(schema = @Schema(implementation = EsperienzaLavoroResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrUpdateEsperienzaLavoro(EsperienzaLavoroRequest request, @Context SecurityContext securityContext,
                                    @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  insert or update titolo di studio

    @POST
    @Path("insert-or-update-titolo-studio")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o aggiorna il titolo di studio", responses = {
            @ApiResponse(responseCode = "200", description = "inserisce o aggiorna il titolo di studio", content = @Content(schema = @Schema(implementation = TitoloStudioLavoratoreResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrUpdateTitoloStudio(TitoloStudioRequest request, @Context SecurityContext securityContext,
                                        @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  insert or update corso formazione

    @POST
    @Path("insert-or-update-corso-formazione")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o aggiorna il corso di formazione o qualifica", responses = {
            @ApiResponse(responseCode = "200", description = "inserisce o aggiorna il corso di formazione o qualifica", content = @Content(schema = @Schema(implementation = CorsoFormazioneResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrUpdateCorsoFormazione(CorsoFormazioneRequest request, @Context SecurityContext securityContext,
                                           @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  elimina corso formazione

    @POST
    @Path("delete-corso-formazione")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Cancella il corso o la qualifica selezionato", responses = {
            @ApiResponse(responseCode = "200", description = "Cancella il corso o la qualifica selezionato", content = @Content(schema = @Schema(implementation = it.csi.pslp.pslpbff.api.dto.silpapi.MsgResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteCorsoFormazione(CorsoFormazioneRequest request, @Context SecurityContext securityContext,
                                           @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  insert or update lingua

    @POST
    @Path("insert-or-update-lingua")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o aggiorna la lingua", responses = {
            @ApiResponse(responseCode = "200", description = "inserisce o aggiorna la lingua", content = @Content(schema = @Schema(implementation = LinguaResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrUpdateLingua(LinguaRequest request, @Context SecurityContext securityContext,
                                           @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  insert or delete albo

    @POST
    @Path("insert-or-delete-albo")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o cancella l'albo", responses = {
            @ApiResponse(responseCode = "200", description = "inserisce o cancella l'albo", content = @Content(schema = @Schema(implementation = AlboResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrDeleteAlbo(AlboRequest request, @Context SecurityContext securityContext,
                                  @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  insert or update informatica

    @POST
    @Path("insert-or-update-informatica")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o aggiorna la tabella informatica", responses = {
            @ApiResponse(responseCode = "200", description = "inserisce o aggiorna la tabella informatica", content = @Content(schema = @Schema(implementation = InformaticaResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrUpdateInformatica(InformaticaRequest request, @Context SecurityContext securityContext,
                                @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  insert or update patente

    @POST
    @Path("insert-or-delete-patente")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserisce o aggiorna la tabella patenti", responses = {
        @ApiResponse(responseCode = "200", description = "inserisce o aggiorna la tabella patenti", content = @Content(schema = @Schema(implementation = PatenteResponse.class))),
        @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertOrDeletePatente(PatenteRequest request, @Context SecurityContext securityContext,
                                   @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  delete informatica

    @POST
    @Path("delete-informatica")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Cancella la informatica selezionata", responses = {
            @ApiResponse(responseCode = "200", description = "Cancella la informatica selezionata", content = @Content(schema = @Schema(implementation = MsgResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteInformatica(InformaticaRequest request, @Context SecurityContext securityContext,
                                   @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  delete informatica

    @POST
    @Path("delete-lingua")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Cancella la lingua selezionata", responses = {
            @ApiResponse(responseCode = "200", description = "Cancella la lingua selezionata", content = @Content(schema = @Schema(implementation = MsgResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteLingua(LinguaRequest request, @Context SecurityContext securityContext,
                               @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 09 -  delete titolo studio

    @POST
    @Path("delete-titolo-studio")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Cancella il titolo di studio", responses = {
            @ApiResponse(responseCode = "200", description = "Cancella il titolo di studio", content = @Content(schema = @Schema(implementation = MsgResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response deleteTitoloStudio(TitoloStudioRequest request, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    @POST
    @Path("inserisci-modifica-fascicolo-cittadino")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "controlli inserimento e modifica e salvataggio tutto in uno", responses = {
            @ApiResponse(responseCode = "200", description = "controlli inserimento e modifica e salvataggio tutto in uno", content = @Content(schema = @Schema(implementation = ControlliFascicoloResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciModificaFascicoloCittadino(ControlliFascicoloRequest request, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
                                                                  @Context HttpServletRequest httpRequest);

}
