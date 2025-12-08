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
import it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.CommonResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.FestivitaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.IncontriAppuntamentiRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.IncontriAppuntamentiResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.ListaIncServiziResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaIncontriAppuntamentiRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaIncontriAppuntamentiResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaSlotLiberiPrenotabiliRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaSlotLiberiPrenotabiliResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Max;
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

@Path("/api/v1/agenda")

@Produces({ MediaType.APPLICATION_JSON })
@Tag(name = "agenda", description = "agenda del cittadino")
public interface AgendaApi {
    // ======================================================================
    @GET
    @Path("/incontri/dettaglio/{idIncontro}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "get dettaglio incontro", responses = {
            @ApiResponse(responseCode = "200", description = "get dettaglio incontro", content = @Content(schema = @Schema(implementation = IncontriAppuntamentiResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getDettaglioIncontro(@PathParam("idIncontro") Long idIncontro, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    // ======================================================================
    @GET
    @Path("/festivita/anno/{anno}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "restituisce le festivita' dell'anno", responses = {
            @ApiResponse(responseCode = "200", description = "festivita' dell'anno", content = @Content(schema = @Schema(implementation = FestivitaResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response festivitaAnno(@NotNull @Min(2000) @Max(2999) @PathParam("anno") int anno, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    // ======================================================================
    @POST
    @Path("/incontri/ricerca")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "ricerca incontro", responses = {
            @ApiResponse(responseCode = "200", description = "elenco incontri", content = @Content(schema = @Schema(implementation = RicercaIncontriAppuntamentiResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response ricercaIncontri(RicercaIncontriAppuntamentiRequest request, @NotNull @Min(-1) @QueryParam("page") int page, @QueryParam("recForPage") int recForPage, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    // ======================================================================
    @POST
    @Path("/incontri/slot-liberi/ricerca/{tipo}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Ricerca Slot Liberi Prenotabili", responses = {
            @ApiResponse(responseCode = "200", description = "Ricerca Slot Liberi Prenotabili", content = @Content(schema = @Schema(implementation = RicercaSlotLiberiPrenotabiliResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response ricercaSlotLiberiPrenotabili(@NotNull @PathParam("tipo") String tipo, RicercaSlotLiberiPrenotabiliRequest request, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest);

    // ======================================================================
    @POST
    @Path("/incontri/salva")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "salvataggio incontro", responses = {
            @ApiResponse(responseCode = "200", description = "salvataggio incontro", content = @Content(schema = @Schema(implementation = IncontriAppuntamentiResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response salvaIncontro(IncontriAppuntamentiRequest request, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    // ======================================================================
    @GET
    @Path("/incontri/verifica-vincoli-servizio-lavoratore")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Verifica vincoli", responses = {
            @ApiResponse(responseCode = "200", description = "verifica della idonenità del lavoratore a prenotazione servizio", content = @Content(schema = @Schema(implementation = CommonResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response verificaVincoliServizioLavoratore(@NotNull @QueryParam("idSilLav") Long idSilLav, @NotNull @QueryParam("idIncServizi") Long idIncServizi, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    // ======================================================================
    @GET
    @Path("lista-inc-servizi/{categoria}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'elenco dei servizi per categoria", responses = {
            @ApiResponse(responseCode = "200", description = "servizi per categoria", content = @Content(schema = @Schema(implementation = ListaIncServiziResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response listaIncServizi(@PathParam("categoria") @NotNull String categoria, @QueryParam("condizioneData") String condizioneData, @QueryParam("ancheBloccati") String ancheBloccati,
            @QueryParam("idOperatore") String idOper, @QueryParam("codTipoAgenda") String codTipoAgenda,
            @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest);
    // ======================================================================

    @GET
    @Path("elenco-sede-ente-del-cpi/{idCpi}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce elenco sede ente del cpi", responses = {
            @ApiResponse(responseCode = "200", description = "elenco sede ente del cpi", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response elencoSedeEnteDelCpi(@PathParam("idCpi") @NotNull Long idCpi, @QueryParam("condizioneData") String condizioneData, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders,
            @Context HttpServletRequest httpRequest);

}
