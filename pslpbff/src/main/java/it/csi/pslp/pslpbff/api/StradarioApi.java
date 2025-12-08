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
import it.csi.pslp.pslpbff.api.dto.request.RicercaIndirizzoStradarioRequest;
import it.csi.pslp.pslpbff.api.dto.response.RicercaIndirizzoStradarioResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;


@Path("/api/v1/stradario")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="stradario", description="Ricerca indirizzi")
public interface StradarioApi {

	@POST
	@Path("find")
	@Produces({ MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Ricerca gli indirizzi per nome via e codice istat comune",
    responses = { @ApiResponse(responseCode = "200", description = "Indirizzi per testo parziale e codice istat comune",content = @Content(schema = @Schema(implementation = RicercaIndirizzoStradarioResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findIndirizzi(RicercaIndirizzoStradarioRequest formRicercaIndirizzo,@Context SecurityContext securityContext, 
			@Context HttpHeaders httpHeaders , @Context  HttpServletRequest httpRequest );

}
