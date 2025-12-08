/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api;


import java.io.File;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.csi.pslp.pslpbff.api.dto.ApiError;
import it.csi.pslp.pslpbff.api.dto.silpapi.DocumentoRichiestoResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.FormRicercaRichiesteDocumenti;
import it.csi.pslp.pslpbff.api.dto.silpapi.InserisciAggiornaRichiestaDocumentoRequest;
import it.csi.pslp.pslpbff.api.dto.silpapi.RicercaRichiesteDocumentiResponse;
import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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



@Path("/api/v1/documenti")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="documenti", description="Servizio documenti")
public interface DocumentiApi  {

	@POST
	@Path("ricerca-richieste-documenti")
	@Produces({ MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce l'elenco delle richieste documenti", responses = {
			@ApiResponse(responseCode = "200", description = "Incontri da erogare", content = @Content(schema = @Schema(implementation = RicercaRichiesteDocumentiResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response ricercaRichiesteDocumenti(FormRicercaRichiesteDocumenti form,@NotNull @Min(0) @QueryParam("page") int page,
			@QueryParam("recForPage") int recForPage, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);


	@GET
	@Path("visualizza-richiesta-documento/{idRichiestaDocumento}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Visualizza richiesta documento", responses = {
			@ApiResponse(responseCode = "200", description = "Visualizza richiesta documento", content = @Content(schema = @Schema(implementation = DocumentoRichiestoResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response visualizzaRichiestaDocumento(@PathParam("idRichiestaDocumento") Long idRichiestaDocumento, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);


	@POST
	@Path("inserisci-richiesta-documento")
	@Produces({ MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Aggiorna stato richiesta documento", responses = {
			@ApiResponse(responseCode = "200", description = "Aggiorna stato richiesta documento", content = @Content(schema = @Schema(implementation = DocumentoRichiestoResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response inserisciRichiestaDocumento(InserisciAggiornaRichiestaDocumentoRequest form, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

	@GET
	@Path("stampa-documento-richiesto/{idRichiestaDocumento}")
	@Produces({ MimeTypeContainer.MimeType.PDF })
	@Operation(summary = "Stampa documento richiesto", responses = {
			@ApiResponse(responseCode = "200", description = "Stampa documento richiesto", content = @Content(schema = @Schema(implementation = File.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response stampaDocumentoRichiesto(@PathParam("idRichiestaDocumento") Long idRichiestaDocumento, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);


}
