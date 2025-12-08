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
import it.csi.pslp.pslpbff.api.dto.PslpMessaggio;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.response.DecodificaListResponse;
import it.csi.pslp.pslpbff.api.dto.response.DecodificaResponse;
import jakarta.servlet.http.HttpServletRequest;
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



@Path("/api-public/v1/decodifica-pslp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="decodifica-public-pslp", description="Servizio decodifiche pubbliche")
public interface DecodificaPublicApi  {

	//======================================================================
	// FUNZIONE
	@GET
	@Path("find-funzione")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce tutte le funzioni",
    responses = { @ApiResponse(responseCode = "200", description = "Elenco funzioni",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = DecodificaResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findFunzione(@Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
	//======================================================================


	//======================================================================
	// FUNZIONE
	@GET
	@Path("find-funzione-by-idruolo/{idRuolo}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce tutte le funzioni",
			responses = { @ApiResponse(responseCode = "200", description = "Elenco funzioni",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = DecodificaResponse.class)))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findFunzioneByIdruolo(@PathParam("idRuolo") Long idRuolo,@Context SecurityContext securityContext,
						  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
	//======================================================================

	//======================================================================
	// MESSAGGI

	@GET
	@Path("/messaggio/{cod}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il messaggio",
			responses = { @ApiResponse(responseCode = "200", description = "PslpMessaggio",content = @Content(schema = @Schema(implementation = PslpMessaggio.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findByCodPublic(@PathParam("cod") String cod,@Context SecurityContext securityContext,
					   @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
	//======================================================================
	// DECODIFICHE BLP

    @POST
    @Path("/fill/{tipo}/{txt}")
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce tutte decodifiche per tipo", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response fill(@PathParam("tipo") String tipo, @PathParam("txt") String txt, CommonRequest body, @QueryParam("conCodice") String conCodice, @QueryParam("condizioneData") String condizioneData, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/find/{tipo}")
    @Consumes({ "application/json"  })
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce tutte decodifiche per tipo", responses = {
            @ApiResponse(responseCode = "200", description = "Elenco decodifiche", content = @Content(schema = @Schema(implementation = DecodificaListResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDecodificaBlpByTipo( @PathParam("tipo") String tipo, CommonRequest body, @QueryParam("condizioneData") String condizioneData,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/find/{tipo}/{id}")
    @Consumes({ "application/json"  })
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce la decodifica per tipo e id", responses = {
            @ApiResponse(responseCode = "200", description = "Decodifica", content = @Content(schema = @Schema(implementation = DecodificaResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDecodificaBlpById( @PathParam("tipo") String tipo, @PathParam("id") String id, CommonRequest body,@Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


}
