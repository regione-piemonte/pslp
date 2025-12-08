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
import it.csi.pslp.pslpbff.api.dto.response.did.UltimaDidResponse;
import it.csi.pslp.pslpbff.api.dto.response.ReportResponse;
import it.csi.pslp.pslpbff.api.dto.silpapi.*;
import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
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

@Path("/api/v1/did-pslp")
@Produces({ MediaType.APPLICATION_JSON })
@Tag(name="did-pslp", description="Dichiarazione immediata disponibilità")
public interface DidApi {


    //======================================================================
    //  CDU 10 -  torna dati dell' ultima did  passando come parametro idSilLavAnagrafica a cercare su SILPAPI
    @GET
    @Path("get-ultima-did/{idSilLavAnagrafica}/{codiceFiscale}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce dettaglio dell'ultima did, passando come parametro idSilLavAnagrafica a cercare su SILPAPI",
            responses = { @ApiResponse(responseCode = "200", description = "dettaglio dell'ultima did trovato",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = UltimaDidResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response getUltimaDid(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica,  @PathParam("codiceFiscale") String codiceFiscale, @Context SecurityContext securityContext,
                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 11 - controlli pre inserimento
    @GET
    @Path("inserisci-did/controlli-pre-inserimento/{idSilLavAnagrafica}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "verifica possibilita' di inserimento",
            responses = { @ApiResponse(responseCode = "200", description = "controlli inserimento Did",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = InserisciDidResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response controlliPreInserisciDid(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    //======================================================================
    //  CDU 11 - controlli pre inserimento
    @GET
    @Path("controlli-stampa-attestato-disoccupazione/{idSilLavAnagrafica}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "verifica possibilita' di stampa",
            responses = { @ApiResponse(responseCode = "200", description = "controlli stampa Did",content = @Content(schema=@Schema(implementation = DidResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response controlliStampaDid(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );
    //======================================================================
    //  CDU 11 - on change data did
    @POST
    @Path("inserisci-did/on-change-data-did")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "controlli data did", responses = {
            @ApiResponse(responseCode = "200", description = "controlli data did", content = @Content(schema = @Schema(implementation = InserisciDidResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response onChangeDataDid(FormInserisciDid formInserisciDid, @Context SecurityContext securityContext,
                             @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 11 - Inserisci Did
    @POST
    @Path("inserisci-did/salva")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Inserisci Did", responses = {
            @ApiResponse(responseCode = "200", description = "Inserisci Did", content = @Content(schema = @Schema(implementation = InserisciDidResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response salvaDid(FormInserisciDid request, @Context SecurityContext securityContext,
                      @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 11 - ricerca DidInps
    @POST
    @Path("inserisci-did/dids-inps/ricerca")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce le did trovate", responses = {
            @ApiResponse(responseCode = "200", description = "Did Inps", content = @Content(schema = @Schema(implementation = RicercaDidInpsResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response ricercaDidInps(FormRicercaDidInps formRicercaDidInps, @Context SecurityContext securityContext,
                            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 11 - find-titoliStudioLav
    @GET
    @Path("profiling-quantitativo/find-titoliStudioLav/{idSilLavAnagrafica}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce elenco degli studi del lavoratore",
            responses = { @ApiResponse(responseCode = "200", description = "Restituisce elenco degli studi del lavoratore",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = TitoliStudioLavResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTitoliStudioByIdLav(@PathParam("idSilLavAnagrafica") Long idSilLavAnagrafica, @Context SecurityContext securityContext,
                                      @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 11 - findAll-condizioneOccupazionale
    @GET
    @Path("profiling-quantitativo/findAll-condizioneOccupazionale")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce elenco delle condizioni occupazionali",
            responses = { @ApiResponse(responseCode = "200", description = "Restituisce elenco delle condizioni occupazionali",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = CondizioneOccupazionaleResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findAllCondizioneOccupazionale(@Context SecurityContext securityContext,
                                     @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    //======================================================================
    //  CDU 11 - findAll-presenzaInItalia
    @GET
    @Path("profiling-quantitativo/findAll-presenzaInItalia")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce elenco delle presenza in italia",
            responses = { @ApiResponse(responseCode = "200", description = "Restituisce elenco delle presenza in italia",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = PresenzaInItaliaResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findAllDurataPresenzaItalia(@Context SecurityContext securityContext,
                                            @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 11 - find-tipoPatenteFlgPossesso
    @GET
    @Path("profiling-quantitativo/find-tipoPatenteFlgPossesso/{flgPossesso}")
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Restituisce elenco delle patenti con flag possesso uguale al parametro flgPossesso e COD_TIPO = P",
            responses = { @ApiResponse(responseCode = "200", description = "Tipo patente",content = @Content(schema = @Schema(implementation = TipoPatenteResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response findTipoPatenteByFlgPossesso(@PathParam("flgPossesso")  String flgPossesso, @Context SecurityContext securityContext,
                                          @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );


    //======================================================================
    //  CDU 11 - inserisce patente/ patentino
    @POST
    @Path("profiling-quantitativo/inserisciPatente")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento patente del lavoratore", responses = {
            @ApiResponse(responseCode = "200", description = "patente del lavoratore", content = @Content(schema = @Schema(implementation = InserisciPatenteLavResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciPatenteLavoratore(DatiPatenteLavoratore formRicercaDidInps, @Context SecurityContext securityContext,
                            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //  CDU 11 - inserisce titolo studio  profiling
    @POST
    @Path("profiling-quantitativo/inserisciTitoloStudio")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "inserimento titolo studio del lavoratore", responses = {
            @ApiResponse(responseCode = "200", description = "inserimento titolo studio del lavoratore", content = @Content(schema = @Schema(implementation = InserisciTitoloStudioLavResponse.class))),
            @ApiResponse(responseCode = "0", description = "Errore sul sistema", content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response inserisciTitoloStudioLavoratore(DatiTitoloStudioLavoratore request, @Context SecurityContext securityContext,
                                             @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //======================================================================
    //
    @POST
    @Path("orchestratore/send-sap-silp")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Inrerire dato del cittadino su sap",
            responses = { @ApiResponse(responseCode = "200", description = "Inrerire dato del cittadino su sap",content = @Content(array = @ArraySchema(uniqueItems = false,schema = @Schema(implementation = TitoliStudioLavResponse.class)))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response sendSapSilp(FormOrchestratore formOrchestratore, @Context SecurityContext securityContext,
                                     @Context HttpHeaders httpHeaders , @Context HttpServletRequest httpRequest );

    @POST
    @Path("stampa-attestato-disoccupazione")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MimeTypeContainer.MimeType.PDF })
    @Operation(summary = "Restituisce la stampa dell'attestato stato di disoccupazione del cittadino",
            responses = { @ApiResponse(responseCode = "200", description = "Stampa dell'attestato stato di disoccupazione del cittadino",content = @Content(schema = @Schema(implementation = ReportResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response stampaAttestatoDisoccupazione(@NotNull FormInserisciDid did, @Context SecurityContext securityContext,
                                                            @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);

    //per riuscire a stampare nel caso sia appena fatto l'inserimento DID
    @POST
    @Path("ricevi-sap")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({ MediaType.APPLICATION_JSON })
    @Operation(summary = "Metodo che richiama la sap COMPRESA l'ACQUISIZIONE su silp",
            responses = { @ApiResponse(responseCode = "200", description = "Metodo che richiama la sap COMPRESA l'ACQUISIZIONE su silp",content = @Content(schema = @Schema(implementation = LavoratoreResponse.class))),
                    @ApiResponse(responseCode = "0", description = "Errore sul sistema",content = @Content(schema = @Schema(implementation = ApiError.class))) })
    Response riceviSap(@NotNull FormOrchestratore formOrchestratore, @Context SecurityContext securityContext,
                                           @Context HttpHeaders httpHeaders, @Context HttpServletRequest httpRequest);
}
