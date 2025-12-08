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
import it.csi.pslp.pslpbff.api.dto.response.PresenzaPattiAttivazioneResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavoratoreResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaStatiDidByCoResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.SuntoLavoratoreResponse;
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


@Path("/api/v1/lavoratore-pslp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="Lavoratore-pslp", description="Gestione lavoratore SILP")
public interface LavoratoreApi {

	@GET
	@Path("esistono-patti-di-attivazione/{idSilLavAnagrafica}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce un boolean che identifica se esistono dei patti di attivazione per il lavoratore",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce un boolean che identifica se esistono dei patti di attivazione per il lavoratore",content = @Content(schema = @Schema(implementation = PresenzaPattiAttivazioneResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response esistonoPattiDiAttivazione(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
						 @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );



	@GET
	@Path("controllo-rapporti-lavoro-aperti/{idSilLavAnagrafica}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce ...",
	responses = { @ApiResponse(responseCode = "200", description = "elenco ...",content = @Content(schema = @Schema(implementation = RicercaStatiDidByCoResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response controlloRapportiLavoroAperti(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("find/{idSilLavAnagrafica}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il lavoratore",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce il lavoratore",content = @Content(schema = @Schema(implementation = LavoratoreResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findLavoratore(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
										@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("find-codice-fiscale/{cf}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il lavoratore",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce il lavoratore",content = @Content(schema = @Schema(implementation = LavoratoreResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findLavoratoreByCodiceFiscale(@PathParam("cf") String cf, @Context SecurityContext securityContext,
							@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("find-sunto/{idSilLavAnagrafica}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il sunto del lavoratore",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce il sunto del lavoratore",content = @Content(schema = @Schema(implementation = SuntoLavoratoreResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response findSuntoLavoratore(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
							@Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

}
