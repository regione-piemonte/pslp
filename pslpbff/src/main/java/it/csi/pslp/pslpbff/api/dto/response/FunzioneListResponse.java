/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import it.csi.pslp.pslpbff.api.dto.Funzione;
import it.csi.pslp.pslpbff.api.dto.common.CommonResponse;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.experimental.Accessors;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FunzioneListResponse extends CommonResponse {

	@JsonProperty("list")
	private List<Funzione> list = new ArrayList<Funzione>();
	
	
	@Setter
	@Accessors(chain = true)
	public static final class Builder {

		private List<Funzione> list;

		public FunzioneListResponse build() {
			FunzioneListResponse result = new FunzioneListResponse();
			result.setList(list);
			return result;
		}

	}
}
