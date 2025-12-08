/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.csi.pslp.pslpbff.api.dto.ApiError;
import it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse;
import it.csi.pslp.pslpbff.api.dto.response.DecodificaResponse;
import it.csi.pslp.pslpbff.api.dto.response.ParametroResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.TipoLavoroResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.TitoloStudioResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/v1/decodifica-pslp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name = "decodifica-pslp", description = "Servizio decodifiche")
public interface DecodificaApi {

    // ======================================================================
    // TIPO RESPONSABILITA
    @GET
    @Path("find-tipo-responsabilita/{id}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce il tipo responsabilita", responses = {
            @ApiResponse(responseCode = "200", description = "Tipo responsabilita", content = @Content(schema = @Schema(implementation = DecodificaResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTipoResponsabilitaById(@PathParam("id") String id, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    @GET
    @Path("find-tipo-responsabilita")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce tutti i tipi responsabilita", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche tipo responsabilita", content = @Content(array = @ArraySchema(uniqueItems = false, schema = @Schema(implementation = DecodificaResponse.class)))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTipoResponsabilita(@Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    @GET
    @Path("fill-tipo-responsabilita/{txt}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce tutti i tipi responsabilita autocomplete", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche tipo responsabilita autocomplete", content = @Content(array = @ArraySchema(uniqueItems = false, schema = @Schema(implementation = DecodificaResponse.class)))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response fillTipoResponsabilita(@PathParam("txt") String txt, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // PARAMETRO
    @GET
    @Path("find-parametro/{cod}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce il parametro dato il codice", responses = {
            @ApiResponse(responseCode = "200", description = "Parametro", content = @Content(array = @ArraySchema(uniqueItems = false, schema = @Schema(implementation = ParametroResponse.class)))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findParametro(@PathParam("cod") String cod, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    @GET
    @Path("find-parametro")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce tutti i parametri", responses = {
            @ApiResponse(responseCode = "200", description = "Parametri", content = @Content(array = @ArraySchema(uniqueItems = false, schema = @Schema(implementation = ParametroResponse.class)))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTuttiParametro(@Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // Comune by id provincia

    @GET
    @Path("find-comuneByIdProvincia/{idProvincia}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce Elenco comuni per provincia", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco comuni per provincia", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findComuneByIdProvincia(@PathParam("idProvincia") String idProvincia, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // Comune by id provincia e parte del testo del comune per filtrare
    @GET
    @Path("fill-comuneByIdProvincia/{idProvincia}/{txt}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce comuni per provincia autocomplete", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco comuni per provincia autocomplete", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response fillComuneByIdProvincia(@PathParam("idProvincia") String idProvincia, @PathParam("txt") String txt,
            @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // Find Decodifica - per fare tornare le diverse decodifica in base al tipo di codifica passato come parametro

    @GET
    @Path("find/{tipo}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce Elenco decodifica in base al tipo di codifica passato come parametro", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifica in base al tipo di codifica passato come parametro", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDecodificaByTipo(@PathParam("tipo") String tipo, @QueryParam("condizioneData") String condizioneData, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // Fill Decodifica con filtro- per fare tornare le diverse decodifica in base al tipo di codifica passato come parametro con filtro

    @GET
    @Path("fill/{tipo}/{txt}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce elenco decodifiche di tipo autocomplete", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche autocomplete", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response fillDecodificaByTipo(@PathParam("tipo") String tipo, @PathParam("txt") String txt, @QueryParam("conCodice") String conCodice, @QueryParam("condizioneData") String condizioneData,
            @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // Fill Decodifica con filtro- per fare tornare le diverse decodifica in base al tipo di codifica passato come parametro con filtro

    @GET
    @Path("find-informaticaDettByIdInformatica/{idInformatica}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce Elenco competenze informatiche dettagliate per idSilTInformatica", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco competenze informatiche dettagliate per idSilTInformatica", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response fillInformaticaDettByIdInformatica(@PathParam("idInformatica") Long idInformatica, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // ======================================================================
    // Find Decodifica - per fare tornare le diverse decodifica in base al tipo e id di codifica passato come parametro

    @GET
    @Path("find-tipo-id/{tipo}/{id}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce Elenco decodifica in base al tipo e id di codifica passato come parametro", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifica in base al tipo e id di codifica passato come parametro", content = @Content(schema = @Schema(implementation = DecodificaResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDecodificaByTipoEdId(@PathParam("tipo") String tipo, @PathParam("id") String id, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
    // ======================================================================

    // Find Decodifica - per fare tornare le diverse decodifica in base al tipo e id di codifica passato come parametro

    @GET
    @Path("find-titoloStudioById/{id}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce il dettaglio del titolo di studio", responses = {
            @ApiResponse(responseCode = "200", description = "Titolostudio", content = @Content(schema = @Schema(implementation = TitoloStudioResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTitoloStudioById(@PathParam("id") String id, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    @GET
    @Path("find-tipo-lavoro/{id}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce il dettaglio del titolo di studio", responses = {
            @ApiResponse(responseCode = "200", description = "Titolostudio", content = @Content(schema = @Schema(implementation = TipoLavoroResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTipoLavoro(@PathParam("id") String id, @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

}
