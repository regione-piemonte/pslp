/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UltimaDid {

    @JsonProperty("statoDid")
    private String statoDid;

    @JsonProperty("eta")
    private Integer eta;

    @JsonProperty("denominazioneCpi")
    private String denominazioneCpi;

    @JsonProperty("numDid")
    private String numDid;

    @JsonProperty("dataDid")
    private Date dataDid;

    @JsonProperty("ultimaVariazioneStato")
    private Date ultimaVariazioneStato;

    @JsonProperty("ultimoProfilingAggiornato")
    private Date ultimoProfilingAggiornato;

    @JsonProperty("numGiorniDisoccupazioneCalcolati")
    private Integer numGiorniDisoccupazioneCalcolati;

    @JsonProperty("iscrizioneCollocamentoMirato")
    private boolean iscrizioneCollocamentoMirato;
}
