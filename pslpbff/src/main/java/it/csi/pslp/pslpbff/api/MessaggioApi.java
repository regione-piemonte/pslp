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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;



@Path("/api/v1/Messaggio")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="Messaggio", description="Messaggi applicativi")
public interface MessaggioApi  {
	
	
	@GET
	@Path("{cod}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il messaggio",
    responses = { @ApiResponse(responseCode = "200", description = "PslpMessaggio",content = @Content(schema = @Schema(implementation = PslpMessaggio.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findByCod(@PathParam("cod") String cod,@Context SecurityContext securityContext, 
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
	
	
	@GET
	@Path("find/{id}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il messaggio",
    responses = { @ApiResponse(responseCode = "200", description = "PslpMessaggio",content = @Content(schema = @Schema(implementation = PslpMessaggio.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response find(@PathParam("id") Long id,@Context SecurityContext securityContext, 
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
	
	
	@GET
	@Path("findAll")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce tutti i messaggi",
    responses = { @ApiResponse(responseCode = "200", description = "Messaggi registrati sul sistema",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = PslpMessaggio.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON, schema = @Schema(ref = "#/components/schemas/Map"))
                    )})
	Response findAll(@Context SecurityContext securityContext, 
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
	
   
}
