/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import it.csi.pslp.pslpapi.api.dto.common.CommonResponse;
import it.csi.pslp.pslpapi.util.mime.MimeTypeContainer;
import jakarta.ws.rs.core.Response;


import java.util.Arrays;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(
        ignoreUnknown = true
)
public class ReportResponse extends CommonResponse {
    private byte[] bytes;
    private String fileNameTemplate;
    private MimeTypeContainer mimeTypeContainer;

    public ReportResponse() {
    }

    public ReportResponse(String fileNameTemplate) {
        this.fileNameTemplate = fileNameTemplate;
    }

    public Response composeResponse() {
        return Response.ok(this.bytes, this.getMimeTypeContainer().getMimeType()).header("Content-Disposition", "attachment; filename=\"" + this.getFileName() + "\"").header("Content-Type", "application/pdf").build();
    }

    private String getFileName() {
        String var10000 = this.fileNameTemplate;
        return var10000 + "." + this.getMimeTypeContainer().getExtension();
    }

    public byte[] getBytes() {
        return this.bytes;
    }

    public String getFileNameTemplate() {
        return this.fileNameTemplate;
    }

    public MimeTypeContainer getMimeTypeContainer() {
        return this.mimeTypeContainer;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public void setFileNameTemplate(String fileNameTemplate) {
        this.fileNameTemplate = fileNameTemplate;
    }

    public void setMimeTypeContainer(MimeTypeContainer mimeTypeContainer) {
        this.mimeTypeContainer = mimeTypeContainer;
    }

    public String toString() {
        String var10000 = Arrays.toString(this.getBytes());
        return "ReportResponse(bytes=" + var10000 + ", fileNameTemplate=" + this.getFileNameTemplate() + ", mimeTypeContainer=" + this.getMimeTypeContainer() + ")";
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof ReportResponse)) {
            return false;
        } else {
            ReportResponse other = (ReportResponse)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (!Arrays.equals(this.getBytes(), other.getBytes())) {
                return false;
            } else {
                Object this$fileNameTemplate = this.getFileNameTemplate();
                Object other$fileNameTemplate = other.getFileNameTemplate();
                if (this$fileNameTemplate == null) {
                    if (other$fileNameTemplate != null) {
                        return false;
                    }
                } else if (!this$fileNameTemplate.equals(other$fileNameTemplate)) {
                    return false;
                }

                Object this$mimeTypeContainer = this.getMimeTypeContainer();
                Object other$mimeTypeContainer = other.getMimeTypeContainer();
                if (this$mimeTypeContainer == null) {
                    if (other$mimeTypeContainer != null) {
                        return false;
                    }
                } else if (!this$mimeTypeContainer.equals(other$mimeTypeContainer)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReportResponse;
    }

    public int hashCode() {
        //boolean PRIME = true;
        int result = 1;
        result = result * 59 + Arrays.hashCode(this.getBytes());
        Object $fileNameTemplate = this.getFileNameTemplate();
        result = result * 59 + ($fileNameTemplate == null ? 43 : $fileNameTemplate.hashCode());
        Object $mimeTypeContainer = this.getMimeTypeContainer();
        result = result * 59 + ($mimeTypeContainer == null ? 43 : $mimeTypeContainer.hashCode());
        return result;
    }
}
