/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util.mime;

/**
 * Non-exhaustive container for user MIME types
 */
public enum MimeTypeContainer {

	/** Mime type for Excel .xlsx type */
	EXCEL_WORKBOOK(MimeType.EXCEL_WORKBOOK, Extension.EXCEL_WORKBOOK),
	/** Mime type for Excel .xls type */
	EXCEL_SPREADSHEET(MimeType.EXCEL_SPREADSHEET, Extension.EXCEL_SPREADSHEET),
	/** Mime type for .pdf type */
	PDF(MimeType.PDF, Extension.PDF),
	
	;
	private final String mimeType;
	private final String extension;
	/**
	 * Constructor
	 * @param mimeType the MIME type
	 * @param extension the extension
	 */
	private MimeTypeContainer(String mimeType, String extension) {
		this.mimeType = mimeType;
		this.extension = extension;
	}
	/**
	 * @return the mimeType
	 */
	public String getMimeType() {
		return mimeType;
	}
	/**
	 * @return the extension
	 */
	public String getExtension() {
		return extension;
	}
	
	/**
	 * Retrieves the container by the extension
	 * @param extension the extension
	 * @return the container
	 */
	public static MimeTypeContainer byExtension(String extension) {
		for(MimeTypeContainer mtc : values()) {
			if(mtc.extension.equals(extension)) {
				return mtc;
			}
		}
		return null;
	}
	
	/**
	 * MIME type utility values
	 */
	@SuppressWarnings("hiding")
	public static final class MimeType {
		/** Mime type for Excel .xlsx type */
		public static final String EXCEL_WORKBOOK = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		/** Mime type for Excel .xls type */
		public static final String EXCEL_SPREADSHEET = "application/vnd.ms-excel";
		/** Mime type for .pdf type */
		public static final String PDF = "application/pdf";
	}
	/**
	 * MIME extensions utility values
	 */
	@SuppressWarnings("hiding")
	public static final class Extension {
		/** .xlsx */
		public static final String EXCEL_WORKBOOK = "xlsx";
		/** .xls */
		public static final String EXCEL_SPREADSHEET = "xls";
		/** .pdf */
		public static final String PDF = "pdf";
	}
}
