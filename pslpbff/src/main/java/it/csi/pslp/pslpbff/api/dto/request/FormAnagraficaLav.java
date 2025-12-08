/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import it.csi.pslp.pslpbff.api.dto.TipoResponsabilita;
import it.csi.pslp.pslpbff.api.dto.silpapi.LavAnagrafica;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class FormAnagraficaLav {

    @JsonProperty("anagraficaLav")
    private LavAnagrafica anagraficaLav;

    @JsonProperty("tipoResponsabilita")
    private TipoResponsabilita tipoResponsabilita;

    @JsonProperty("isMinorenne")
    private boolean isMinorenne;

}
