/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer;
import jakarta.ws.rs.core.Response;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReportResponse extends BaseResponse {

	private byte[] bytes;
	private String fileNameTemplate;
	private MimeTypeContainer mimeTypeContainer;

	public ReportResponse() {
	}

	public ReportResponse(String fileNameTemplate) {
		this.fileNameTemplate = fileNameTemplate;
	}

	public Response composeResponse() {
		return Response.ok(bytes, getMimeTypeContainer().getMimeType())
				.header("Content-Disposition", "attachment; filename=\"" + getFileName() + "\"")
				.header("Content-Type", "application/pdf")
				.build();
	}

	private String getFileName() {
		return fileNameTemplate + "." + getMimeTypeContainer().getExtension();
	}

}
