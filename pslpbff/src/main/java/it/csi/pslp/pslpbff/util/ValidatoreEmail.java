/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidatoreEmail {
  
  
  private static final String EMAIL_PATTERN =
			"^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
			+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  
  public static boolean isValid (String input) {
	  Pattern pattern = Pattern.compile(EMAIL_PATTERN);
	  if (CommonUtils.isNotVoid(input)) {
		  input = input.trim();
		  Matcher matcher = pattern.matcher(input);
		  return matcher.matches();
	  }
	  return true;
  }
  
 }
