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
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.blp.ParametroBlpResponse;
import it.csi.pslp.pslpbff.api.dto.response.DecodificaResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

@Path("/api/v1/parametro")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="parametro-blp", description="servizi per i parametri")
public interface ParametroBlpApi {

    /**
     * summary = Restituisce il parametro passando come parametro il codice a cercare
     * description =
     * @return Response
     * responses:
    <ul>
    <li>
    <p>responseCode = 200, description = Parametro trovato<br>
    schema implementation = { @see ParametroBlpResponse }</p>
    </li>
    <li>
    <p>responseCode = 500, description = Errore sul sistema<br>
    schema implementation = { @see ApiError }</p>
    </li>
    </ul>
     */

    @GET
    @Path("{cod}")
    @Produces({ "application/json" })
    @Operation(summary = "Restituisce la decodifica per tipo e id", responses = {
            @ApiResponse(responseCode = "200", description = "Parametro", content = @Content(schema = @Schema(implementation = ParametroBlpResponse.class))),
            @ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findParametroByCodBlp( @PathParam("cod") String tipo, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
}
