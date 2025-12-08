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
import it.csi.pslp.pslpbff.api.dto.Utente;
import it.csi.pslp.pslpbff.api.dto.request.UtenteRequest;
import it.csi.pslp.pslpbff.api.dto.response.AnagraficaLavSilpapiResponse;
import it.csi.pslp.pslpbff.api.dto.response.UtenteResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;



@Path("/api/v1/utente")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="utente", description="Gestione utente applicativo")
public interface UtenteApi  {
	
	
	@GET
	@Path("self")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce l'utente per l'operatore",
    responses = { @ApiResponse(responseCode = "200", description = "Utente",content = @Content(schema = @Schema(implementation = Utente.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response self(@Context SecurityContext securityContext, 
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("utente-by-codice-fiscale/{codiceFiscale}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce l'utente passando il codice fiscale come parametro",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce l'utente passando il codice fiscale come parametro",content = @Content(schema = @Schema(implementation = UtenteResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response utenteByCodiceFiscale(@PathParam("codiceFiscale") String codiceFiscale, @Context SecurityContext securityContext,
				  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("cerca-cf-silp/{cf}/{isMinorenne}/{forDelega}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce l'utente trovato su silp passando come parametro il CF ed un boolean se è minorenne",
			responses = { @ApiResponse(responseCode = "200", description = "Utente trovato su silp",content = @Content(schema = @Schema(implementation = AnagraficaLavSilpapiResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response cercaCFSilp(@PathParam("cf") String codiceFiscale, @PathParam("isMinorenne") boolean minorenne, @PathParam("forDelega") boolean forDelega, @Context SecurityContext securityContext,
						 @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	//======================================================================
	//  Insert dati utente

	@POST
	@Path("insert-utente")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "inserisce dati nuovo utente (non presente ne su SILP ne su MLPS)", responses = {
			@ApiResponse(responseCode = "200", description = "inserisce dati nuovo utente", content = @Content(schema = @Schema(implementation = UtenteResponse.class))),
			@ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response insertUtente(UtenteRequest request, @Context SecurityContext securityContext,
								   @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
	
	
}
