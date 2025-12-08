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
import it.csi.pslp.pslpbff.api.dto.request.FormAnagraficaLav;
import it.csi.pslp.pslpbff.api.dto.response.DelegaListResponse;
import it.csi.pslp.pslpbff.api.dto.response.DelegaResponse;
import it.csi.pslp.pslpbff.api.dto.response.MsgResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
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

@Path("/api/v1/delega")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="delega", description="Gestione deleghe")
public interface DelegaApi {

    //======================================================================
    //  CDU 04 -  5.1
    @GET
    @Path("by-delegato/{idUtenteDelegto}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'elenco dei delegati passando come parametro l'id del deleganti",
            responses = { @ApiResponse(responseCode = "200", description = "elenco delle privacy dell'utente collegato",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = DelegaListResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDelegheByDelegate(@PathParam("idUtenteDelegto") Long idUtenteDelegante, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 04 -  5.2	Deleganti
    @GET
    @Path("by-delegante/{idUtenteDelegante}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce l'elenco dei deleganti passando come parametro l'id del delegati",
            responses = { @ApiResponse(responseCode = "200", description = "elenco delle privacy dell'utente collegato",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = DelegaListResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findDelegheByDelegante(@PathParam("idUtenteDelegante") Long idUtenteDelegato, @Context SecurityContext securityContext,
                                    @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 05 -  	Deleganti invio codice OTP



    //======================================================================
    //  CDU 05 -  	5.6	 e 5.7 Salvataggio delega
    @POST
    @Path("salva-delega")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Salva delega ",
            responses = { @ApiResponse(responseCode = "200", description = "Salva delega",content = @Content(schema = @Schema(implementation = DelegaResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response insertDelega(FormAnagraficaLav formAnagraficaLav, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 05 -  	5.8	Elimina delega

    @DELETE
    @Path("cancella-delega/{idDelega}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Cancella delega ",
            responses = { @ApiResponse(responseCode = "200", description = "Cancella delega",content = @Content(schema = @Schema(implementation = MsgResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response cancellaDelega(@PathParam("idDelega") Long idDelega, @Context SecurityContext securityContext,
                             @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //  CDU 05 -  	5.8	Elimina delega

    @POST
    @Path("attiva-delega/{idDelega}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "attiva delega ",
            responses = { @ApiResponse(responseCode = "200", description = "Attiva delega",content = @Content(schema = @Schema(implementation = MsgResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response attivaDelega(@PathParam("idDelega") Long idDelega, @Context SecurityContext securityContext,
                            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 05 -  	invio codice OTP
    @POST
    @Path("invio-codice-otp/{cf}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Invio codice otp ",
            responses = { @ApiResponse(responseCode = "200", description = "invio codice OTP",content = @Content(schema = @Schema(implementation = MsgResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response invioCodiceOtp(@PathParam("cf") String codiceFiscale, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 05 -  	verifica codice OTP
    @POST
    @Path("verifica-codice-otp/{cf}/{otp}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Verifica codice otp ",
            responses = { @ApiResponse(responseCode = "200", description = "invio codice OTP",content = @Content(schema = @Schema(implementation = MsgResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response verificaCodiceOtp(@PathParam("cf") String codiceFiscale, @PathParam("otp") Long codiceOtp, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

}
