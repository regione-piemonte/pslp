/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.exception;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import it.csi.pslp.pslpapi.api.dto.ApiMessage;

public class BusinessException extends ServiceException {

	/** For serialization */
	private static final long serialVersionUID = 4398533896440369883L;
	// private final ApiError error;
	private final List<ApiMessage> listApiMessage;

	/**
	 * @see RuntimeException#RuntimeException(String)
	 */
	public BusinessException(String message) {
		super(message);
		this.listApiMessage = null;
	}

	public static BusinessException createError(String message) {
		return new BusinessException(new ApiMessage.Builder().setError(true).setTipo("E").setMessage(message).build());
	}
	
	public static BusinessException createWarning(String message) {
		return new BusinessException(new ApiMessage.Builder().setError(false).setTipo("W").setMessage(message).build());
	}

	/**
	 * @see RuntimeException#RuntimeException(String, Throwable)
	 */
	public BusinessException(String message, Throwable cause) {
		super(message, cause);
		this.listApiMessage = null;
	}

	/**
	 * @param apiError the api error
	 * @see RuntimeException#RuntimeException(String)
	 */
	public BusinessException(ApiMessage listApiMessage) {
		super(listApiMessage.getMessage());
		List<ApiMessage> tmp = new ArrayList<>();
		tmp.add(listApiMessage);
		this.listApiMessage = Collections.unmodifiableList(tmp);
	}

	/**
	 * @param message   the message
	 * @param apiErrors the api errors
	 */
	public BusinessException(String message, List<ApiMessage> apiErrors) {
		super(message);
		this.listApiMessage = Collections.unmodifiableList(new ArrayList<>(apiErrors));
	}

	/**
	 * @param apiError the api error
	 * @param cause    the cause
	 * @see RuntimeException#RuntimeException(String, Throwable)
	 */
	public BusinessException(ApiMessage listApiMessage, Throwable cause) {
		super(listApiMessage.getMessage(), cause);
		List<ApiMessage> tmp = new ArrayList<>();
		tmp.add(listApiMessage);
		this.listApiMessage = Collections.unmodifiableList(tmp);
	}

	/**
	 * @param message  the message
	 * @param apiError the api error
	 * @see RuntimeException#RuntimeException(String)
	 */
	public BusinessException(String message, ApiMessage listApiMessage) {
		super(message);
		List<ApiMessage> tmp = new ArrayList<>();
		tmp.add(listApiMessage);
		this.listApiMessage = Collections.unmodifiableList(tmp);
	}

	/**
	 * @param message  the message
	 * @param apiError the api error
	 * @param cause    the cause
	 * @see RuntimeException#RuntimeException(String, Throwable)
	 */
	public BusinessException(String message, ApiMessage apiError, Throwable cause) {
		super(message, cause);
		List<ApiMessage> tmp = new ArrayList<>();
		tmp.add(apiError);
		this.listApiMessage = Collections.unmodifiableList(tmp);
	}

	/**
	 * @param message   the message
	 * @param apiErrors the api errors
	 * @param cause     the cause
	 */
	public BusinessException(String message, List<ApiMessage> apiErrors, Throwable cause) {
		super(message, cause);
		this.listApiMessage = Collections.unmodifiableList(new ArrayList<>(apiErrors));
	}

	/**
	 * @return the error
	 */
	public List<ApiMessage> getMessages() {
		return listApiMessage;
	}

}
