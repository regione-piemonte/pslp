/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.csi.pslp.pslpapi.api.dto.ApiError;
import it.csi.pslp.pslpapi.api.dto.response.DelegaListResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

@Path("/api/v1/delega")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="delega", description="Gestione deleghe")
public interface DelegaApi {

    //======================================================================
    //  Dato il cf fare tornare tutti i deleganti con una delega attiva
    @GET
    @Path("deleghe-by-cf-delegante/{cfDelegante}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'elenco delle deleghe passando come parametro l'id del delegante",
            responses = { @ApiResponse(responseCode = "200", description = "elenco delle privacy dell'utente collegato",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = DelegaListResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDelegheByDelegante(@PathParam("cfDelegante") String cfDelegante, @Context SecurityContext securityContext,
                                    @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );



}
