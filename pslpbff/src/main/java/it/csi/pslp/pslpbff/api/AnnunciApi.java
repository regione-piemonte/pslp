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
import it.csi.pslp.pslpbff.api.dto.blp.CollegamentoAnnuncioCandidaturaListRequest;
import it.csi.pslp.pslpbff.api.dto.blp.CollegamentoAnnuncioCandidaturaListResponse;
import it.csi.pslp.pslpbff.api.dto.blp.CollegamentoAnnuncioCandidaturaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.CollegamentoAnnuncioCandidaturaResponse;
import it.csi.pslp.pslpbff.api.dto.blp.CommonResponse;
import it.csi.pslp.pslpbff.api.dto.blp.ConsultaAnnunciRequest;
import it.csi.pslp.pslpbff.api.dto.blp.ConsultaAnnunciResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioAnnuncioResponse;
import it.csi.pslp.pslpbff.api.dto.blp.RicercaAnnunciRequest;
import it.csi.pslp.pslpbff.api.dto.blp.RicercaAnnunciResponse;
import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
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

@Path("/api/v1/annunci")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="annunci", description="servizi per annunci")
public interface AnnunciApi {

	@POST
	@Path("insert-collegamento-annuncio-candidatura")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "inserisce collegamento tra annuncio e candidatura", responses = {
			@ApiResponse(responseCode = "200", description = "inserisce collegamento tra annuncio e candidatura", content = @Content(schema = @Schema(implementation = CollegamentoAnnuncioCandidaturaResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response insertCollegamentoAnnuncioCandidatura(CollegamentoAnnuncioCandidaturaRequest request, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

	@POST
	@Path("elenco-collegamento-annuncio-candidatura")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "restituisce elenco collegamento tra annuncio e candidatura", responses = {
			@ApiResponse(responseCode = "200", description = "restituisce elenco collegamento tra annuncio e candidatura", content = @Content(schema = @Schema(implementation = CollegamentoAnnuncioCandidaturaListResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response elencoCollegamentoAnnuncioCandidatura(CollegamentoAnnuncioCandidaturaListRequest request, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

	@POST
	@Path("update-stato-collegamento-annuncio-candidatura")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "aggiorna stato collegamento tra annuncio e candidatura", responses = {
			@ApiResponse(responseCode = "200", description = "aggiorna stato collegamento tra annuncio e candidatura", content = @Content(schema = @Schema(implementation = CommonResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response aggiornaStatoCollegamentoAnnuncioCandidatura(CollegamentoAnnuncioCandidaturaRequest request, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);


	@POST
	@Path("consulta-annunci")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce gli annunci cercati", responses = { @ApiResponse(responseCode = "200", description = "Annunci", content = @Content(schema = @Schema(implementation = ConsultaAnnunciResponse.class))),
			@ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response consultaAnnunci(ConsultaAnnunciRequest consultaAnnunciRequest, @Min(-1) @QueryParam("page") @NotNull int page, @QueryParam("recForPage") int recForPage, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

	@POST
	@Path("get-dettaglio/{idAnnuncio}")
	@Produces({ MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_JSON })
	@Operation(summary = "dettaglio annuncio", responses = { @ApiResponse(responseCode = "200", description = "annuncio", content = @Content(schema = @Schema(implementation = DettaglioAnnuncioResponse.class))),
			@ApiResponse(responseCode = "500", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response getDettaglioAnnuncio(@PathParam("idAnnuncio") @NotNull Long idAnnuncio, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
			@Context HttpServletRequest httpRequest);

	@POST
	@Path("stampa-elenco-collegamento-annuncio-candidatura")
	@Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MimeTypeContainer.MimeType.PDF })
	@Operation(summary = "Restituisce la stampa dell'elenco collegamento annuncio candidature", responses = {
			@ApiResponse(responseCode = "200", description = "Restituisce la stampa dell'elenco collegamento annuncio candidature", content = @Content(schema = @Schema(implementation = File.class))),
			@ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response stampaElencoVacancyCandid(CollegamentoAnnuncioCandidaturaListRequest request, @QueryParam("format") String format, @Context SecurityContext securityContext, @Context HttpHeaders httpHeaders,
			@Context HttpServletRequest httpRequest);


	@POST
	@Path("ricerca-annunci")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	@Operation(summary = "Restituisce gli annunci cercati", responses = { @ApiResponse(responseCode = "200", description = "Annunci", content = @Content(schema = @Schema(implementation = RicercaAnnunciResponse.class))),
			@ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
	Response ricercaAnnunci(RicercaAnnunciRequest ricercaAnnunciRequest, @Min(-1) @QueryParam("page") @NotNull int page, @QueryParam("recForPage") int recForPage, @Context SecurityContext securityContext,
			@Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
}
