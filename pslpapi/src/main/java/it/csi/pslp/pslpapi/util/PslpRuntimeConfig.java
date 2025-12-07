/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

import org.eclipse.microprofile.config.ConfigProvider;

public class PslpRuntimeConfig {

	/**
	 * Torna il valore a runtime di una property dell'application.properties
	 * @param propertyKey
	 * @return
	 */
	public static String getConfigValue(String propertyKey) {
		return ConfigProvider.getConfig().getValue(propertyKey, String.class);

	}

	/**
	 * Ritorna il valore del profilo di esecuzione dev,tst prod ecc...
	 * @return
	 */
	public static String getProfile() {
		return getConfigValue("quarkus.profile");
	}

	public static String getQuarkusVersion() {
		return "3.X.X";
	}
	
	public static String getComponentVersion() {
		return getConfigValue("quarkus.application.version");
	}
	
	public static String getDb() {
		return getConfigValue("quarkus.datasource.jdbc.url");
	}
	
	public static boolean isProfileDev() {
		return "dev".equals(getProfile());
	}

}
