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
import it.csi.pslp.pslpbff.api.dto.silpapi.NotificaResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaNotificheResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import jakarta.ws.rs.core.*;



@Path("/api/v1/notifiche-pslp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="notifiche-pslp", description="Gestione notifiche SILP")
public interface NotificheApi {

	@GET
	@Path("pullNotify/{idSilLavAnagrafica}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce il numero delle notifiche e alcune notifiche da silp",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce il numero delle notifiche e alcune notifiche da silp",content = @Content(schema = @Schema(implementation = RicercaNotificheResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response notifichePullNotify(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
						 @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("ricercaNotifiche")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce le notifiche da silp",
			responses = { @ApiResponse(responseCode = "200", description = "Restituisce le notifiche da silp",content = @Content(schema = @Schema(implementation = RicercaNotificheResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response notificheRicerca(@NotNull @QueryParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @QueryParam("stato") String stato, @NotNull @Min(0) @QueryParam("page") int page,
							  @QueryParam("recForPage") int recForPage, @Context SecurityContext securityContext,
							  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

	@GET
	@Path("aggiornaNotifica")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Aggiorna la notifica se eliminata o solamente letta da silp",
			responses = { @ApiResponse(responseCode = "200", description = "Aggiorna la notifica se eliminata o solamente letta da silp",content = @Content(schema = @Schema(implementation = NotificaResponse.class))),
					@ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response aggiornaNotifica(@NotNull @QueryParam("idSilwebNotiWeb") Long idSilwebNotiWeb, @QueryParam("operazioneDaEseguire") String operazioneDaEseguire,
							  @Context SecurityContext securityContext,
							  @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

}
