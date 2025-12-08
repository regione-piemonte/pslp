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

import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.blp.TitoloStudio;
import it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse;

import it.csi.pslp.pslpbff.api.dto.response.DecodificaResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

@Path("/api/v1/decodifica-blp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="decodifica-blp", description="servizi per le decodifiche")
public interface DecodificaBlpApi {

    /**
     * summary = Restituisce elenco decodifiche di tipo autocomplete
     * description =
     * @return Response
     * responses:
    <ul>
    <li>
    <p>responseCode = 200, description = Elenco decodifiche autocomplete<br>
    schema implementation = { @see DecodificaListResponse }</p>
    </li>
    <li>
    <p>responseCode = 500, description = Errore sul sistema<br>
    schema implementation = { @see ApiError }</p>
    </li>
    </ul>
     */
    @POST
    @Path("/fill/{tipo}/{txt}")
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce tutte decodifiche per tipo", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response fill(@PathParam("tipo") String tipo, @PathParam("txt") String txt, CommonRequest body, @QueryParam("conCodice") String conCodice, @QueryParam("condizioneData") String condizioneData, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    /**
     * summary = Restituisce tutte decodifiche per tipo
     * description =
     * @return Response
     * responses:
    <ul>
    <li>
    <p>responseCode = 200, description = Elenco decodifiche<br>
    schema implementation = { @see DecodificaListResponse }</p>
    </li>
    <li>
    <p>responseCode = 500, description = Errore sul sistema<br>
    schema implementation = { @see ApiError }</p>
    </li>
    </ul>
     */
    @POST
    @Path("/find/{tipo}")
    @Consumes({ "application/json"  })
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce tutte decodifiche per tipo", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDecodificaBlpByTipo( @PathParam("tipo") String tipo, CommonRequest body, @QueryParam("condizioneData") String condizioneData,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    /**
     * summary = Restituisce la decodifica per tipo e id
     * description =
     * @return Response
     * responses:
    <ul>
    <li>
    <p>responseCode = 200, description = Decodifica<br>
    schema implementation = { @see DecodificaResponse }</p>
    </li>
    <li>
    <p>responseCode = 500, description = Errore sul sistema<br>
    schema implementation = { @see ApiError }</p>
    </li>
    </ul>
     */
    @POST
    @Path("/find/{tipo}/{id}")
    @Consumes({ "application/json"  })
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce la decodifica per tipo e id", responses = {
            @ApiResponse(responseCode = "200", description = "Decodifica", content = @Content(schema = @Schema(implementation = DecodificaResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDecodificaBlpById( @PathParam("tipo") String tipo, @PathParam("id") String id, CommonRequest body,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    /**
     * summary = Restituisce titoli di studio
     * description =Restituisce telenco titoli di studio filtrati per descrizione
     * @return Response
     * responses:
    <ul>
    <li>
    <p>responseCode = 200, description = Decodifica<br>
    schema implementation = { @see DecodificaResponse }</p>
    </li>
    <li>
    <p>responseCode = 500, description = Errore sul sistema<br>
    schema implementation = { @see ApiError }</p>
    </li>
    </ul>
     */
    @GET
    @Path("/titoli-di-studio")
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce elenco titoli di studio filtrati per descrizione", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco titoli di studio", content = @Content(array= @ArraySchema (schema = @Schema(implementation = TitoloStudio.class)))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTitoliDiStudioByDescr( @QueryParam("descr") String descr,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
}
