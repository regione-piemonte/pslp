/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.common;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PageCommonResponse<L> extends CommonResponse {

	@JsonProperty("currentPage")
	private Integer currentPage;
	
	@JsonProperty("recordOfPage")
	private Integer recordOfPage;
	
	@JsonProperty("recordPage")
	private Integer recordPage;
	
	@JsonProperty("totalResult")
	private Integer totalResult;
	
	@JsonProperty("totalPage")
	private Integer totalPage;
	
	@JsonProperty("list")
	private List<L> list = new ArrayList<L>();
}
