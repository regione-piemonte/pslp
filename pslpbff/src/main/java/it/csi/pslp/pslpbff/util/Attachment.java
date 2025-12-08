/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

public class Attachment {

	private final byte[] bytes;
	private final String mediaType;
	private final String fileName;
	/**
	 * Constuctor
	 * @param bytes the bytes of the attachment
	 * @param mediaType the media type for the attachment
	 * @param fileName the file name
	 */
	public Attachment(byte[] bytes, String mediaType, String fileName) {
		this.bytes = bytes;
		this.mediaType = mediaType;
		this.fileName = fileName;
	}
	/**
	 * @return the bytes
	 */
	public byte[] getBytes() {
		return bytes;
	}
	/**
	 * @return the mediaType
	 */
	public String getMediaType() {
		return mediaType;
	}
	/**
	 * @return the fileName
	 */
	public String getFileName() {
		return fileName;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Attachment [bytes=[...], mediaType=").append(mediaType).append(", fileName=").append(fileName).append("]");
		return builder.toString();
	}


}
