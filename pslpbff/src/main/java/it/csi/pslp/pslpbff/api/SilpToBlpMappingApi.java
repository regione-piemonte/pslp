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
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioAlboDichiaratoResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioAnagraficaResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioConoscenzaInformaticaResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioCorsoFormazioneBlpResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioEsperienzaDiLavoroResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioIstruzioneDichResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioLinguaConosciutaResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioPatentePossedutaResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DettaglioPatentinoPossedutoResponse;
import it.csi.pslp.pslpbff.api.dto.blp.GeneraCvRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpAlbiRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpConoscInformaticaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpEsperienzaLavRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpFormazioneRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpIstruzioneRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpLinguaRequest;
import it.csi.pslp.pslpbff.api.dto.blp.MapSilpToBlpPatenteRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;


@Path("/api/v1/map-silp-to-blp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="mapping", description="servizi inserimento da oggetti silp a blp")
public interface SilpToBlpMappingApi {
    @POST
    @Path("/insert-lingua")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce la lingua dichiarata inserita",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioLinguaConosciutaResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertLinguaDichFromSilp(@NotNull @Valid MapSilpToBlpLinguaRequest mapSilpToBlpRequest, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    @POST
    @Path("/insert-formazione")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce la formazione inserita",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioCorsoFormazioneBlpResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertFormazioneFromSilp(@NotNull @Valid MapSilpToBlpFormazioneRequest mapSilpToBlpFormazioneRequest, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/insert-patente")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce la patente inserita",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioPatentePossedutaResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertPatenteFromSilp(@NotNull @Valid MapSilpToBlpPatenteRequest mapSilpToBlpPatenteRequest, @Context SecurityContext securityContext,
                                   @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    @POST
    @Path("/insert-patentino")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce il patentino inserito",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation =  DettaglioPatentinoPossedutoResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertPatentinoFromSilp(@NotNull @Valid MapSilpToBlpPatenteRequest mapSilpToBlpPatenteRequest, @Context SecurityContext securityContext,
                                     @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/insert-conoscenza-informatica")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce la conoscenza informatica inserito",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioConoscenzaInformaticaResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertConoscenzaInformaticaFromSilp(@NotNull @Valid MapSilpToBlpConoscInformaticaRequest mapSilpToBlpConoscInformaticaRequest, @Context SecurityContext securityContext,
                                                 @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/insert-esperienza-lav")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'esperienza lavorativa inserito",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioEsperienzaDiLavoroResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertEsperienzaLavFromSilp(@NotNull @Valid MapSilpToBlpEsperienzaLavRequest mapSilpToBlpEsperienzaLavRequest, @Context SecurityContext securityContext,
                                         @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/insert-istruzione")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'istruzione dichiarata inserita",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioIstruzioneDichResponse.class) )),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertIstruzioneFromSilp(@NotNull @Valid MapSilpToBlpIstruzioneRequest mapSilpToBlpIstruzioneRequest, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/insert-albo")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'albo inserito",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioAlboDichiaratoResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertAlboFromSilp(@NotNull @Valid MapSilpToBlpAlbiRequest mapSilpToBlpAlbiRequest, @Context SecurityContext securityContext,
                                @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("/blp-lav-anagrafica")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'anagrafica di blp",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioAnagraficaResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getAnagraficaByIdSilpAnag(
            @NotNull @Valid GeneraCvRequest body,
            @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest);



    @PUT
    @Path("/blp-lav-anagrafica/update")
    @Produces({ MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'anagrafica di blp",
            responses = { @ApiResponse(responseCode = "200", description = "cv",content = @Content(schema = @Schema(implementation = DettaglioAnagraficaResponse.class)) ),
                    @ApiResponse(responseCode = "500", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response aggiornaAnagrafica(
            @NotNull @Valid CommonRequest body,
            @QueryParam("idSilTAnagrafica") Long idSilTAnagrafica,
            @QueryParam("idBlpLavAnagrafica") Long idBlpLavAnagrafica,
            @Context SecurityContext securityContext,
            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest);
}
