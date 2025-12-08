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
import it.csi.pslp.pslpbff.api.dto.UtentePrivacy;
import it.csi.pslp.pslpbff.api.dto.request.FormConfermaPrivacy;
import it.csi.pslp.pslpbff.api.dto.response.PrivacyResponse;
import it.csi.pslp.pslpbff.api.dto.response.UtentePrivacyListResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/v1/privacy")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="privacy", description="Gestione privacy")
public interface PrivacyApi {

    //======================================================================
    //  CDU 03 -  5.1	Visualizza Privacy utente collegato
    @GET
    @Path("privacy-utente-collegato/{idUtente}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'elenco delle privacy dell'utente collegato",
            responses = { @ApiResponse(responseCode = "200", description = "elenco delle privacy dell'utente collegato",content = @Content(schema=@Schema(implementation = UtentePrivacyListResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response privacyUtenteCollegato(@PathParam("idUtente") Long idUtente, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 03 -  5.2	Visualizza Privacy
    @GET
    @Path("privacy-visualizza/{codPrivacy}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce la privacy usando il codicePrivacy  passato come parametro",
            responses = { @ApiResponse(responseCode = "200", description = "privacy usando il codicePrivacy  passato come parametro",content = @Content(schema = @Schema(implementation = PrivacyResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response visualizzaPrivacy(@PathParam("codPrivacy") String codPrivacy,@Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 03 -  5.3	Conferma Privacy
    @POST
    @Path("conferma-privacy")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Conferma privacy",
            responses = { @ApiResponse(responseCode = "200", description = "Privacy visualizzata",content = @Content(schema = @Schema(implementation = UtentePrivacy.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response confermaPrivacy(FormConfermaPrivacy formConfermaPrivacy, @Context SecurityContext securityContext,
                             @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 05 -  presa visione privacy
    @GET
    @Path("presa-visione-privay/{idUtente}/{codPrivacy}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Torna true se l'utente ha preso visione della privacy, caso mai torna la privacy",
            responses = { @ApiResponse(responseCode = "200", description = "Torna true se l'utente ha preso visione della privacy, caso mai torna la privacy", content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = PrivacyResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response presaVisionePrivacy(@PathParam("idUtente") Long idUtente, @PathParam("codPrivacy") String codPrivacy, @Context SecurityContext securityContext,
                                    @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
}
