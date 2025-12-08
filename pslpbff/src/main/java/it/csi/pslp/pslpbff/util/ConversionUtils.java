/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;


public class ConversionUtils {

	/**
	 * Converte una stringa contenente oggetto boolean corrispondente.
	 * - in caso di stringa nulla ritorna false
	 * - accetta valori in formato S, SI, Y, N, NO
	 * @param stringaInFormatoSoN
	 * @return
	 */
	public static Boolean toBoolean(String stringaInFormatoSoN) 
	{
		if("S".equalsIgnoreCase(stringaInFormatoSoN) || "SI".equalsIgnoreCase(stringaInFormatoSoN) || "Y".equalsIgnoreCase(stringaInFormatoSoN))
		{
			return Boolean.TRUE;
		}
		else if(stringaInFormatoSoN == null || "N".equalsIgnoreCase(stringaInFormatoSoN) || "NO".equalsIgnoreCase(stringaInFormatoSoN))
		{
			return Boolean.FALSE;
		}

		throw new IllegalArgumentException("Impossibile convertire il valore "+ stringaInFormatoSoN + " in Boolean");

	}


	/**
	 * Converte un input generico cercando di interpretare se vale true o false valutandone la rappresentazione in stringa
	 * @param artigiana
	 * @return
	 */
	public static String toStringSoN(Object value) {
		if(value == null) return PslpConstants.N;

		String valueStr =  value.toString().toLowerCase().trim();
		return CommonUtils.in(valueStr, "s","true","1","y") || CommonUtils.in(valueStr, "si", "yes") ? PslpConstants.S : PslpConstants.N;
	}



	public static Long toLong(String in) {
		if(in == null) return null; 
		return new Long(in);
	}

	public static Long toLong(Number in) {
		if(in == null) return null; 
		return toLong(in.toString());

	}

	public static Integer toInteger(Number in) {
		if(in == null) return null; 
		return new Integer(in.intValue());
	}

	public static Integer toInteger(String in) {
		if(in == null || in.length()==0) return null; 
		return new Integer(in);
	}

	public static String toString(Object in ) {
		return in!=null?in.toString():null;
	}

	public static String toStringWithDecimal(Number numberWithDecimal) {
		if(numberWithDecimal == null) return null; 
		String formato = "0.00";
		DecimalFormat fn = new DecimalFormat(formato, new DecimalFormatSymbols(Locale.ITALIAN));
		return fn.format(numberWithDecimal);
	}

	public static String toString(BigDecimal bd) {
		if (bd==null) return null;
		return  getBigDecimalFormatter().format(bd);
	}

	public static BigDecimal toBigDecimal(String n) {
		if(n==null) return null;
		return new BigDecimal(n.replaceAll(",", "."));
	}  

	public static BigDecimal toBigDecimal(Number n) {
		if(n==null) return null;
		return new BigDecimal(toString(n));
	}  

	public static String toStringFromBigDecimalMaskFormat(BigDecimal bd) {
		if (bd ==null) return null; 
		String res = toString(bd);
		return new String(res.replaceAll(",", "."));
	}

	private static DecimalFormat getBigDecimalFormatter() {
		String formato = "###.#########";
		DecimalFormat fn = new DecimalFormat(formato, new DecimalFormatSymbols(Locale.ITALIAN));
		return fn;
	}


	public static Double toDouble(String parteIntera,String parteDecimale) {
		if(parteIntera == null && parteDecimale ==null){
			return null;
		}

		if(parteIntera == null || parteIntera.length()==0){ 
			parteIntera = "0";
		}
		if(parteDecimale==null || parteDecimale.length()==0){
			parteDecimale = "0";
		}
		return new Double(parteIntera + "." + parteDecimale);
	}


	public static Float toFloat(Number n) {
		if(n == null){
			return null;
		}
		return new Float(n.floatValue());
	}


	public static boolean isNumber(String str) {
		boolean isNumber = true;

		try {
			Integer.parseInt(str);
		} catch (NumberFormatException e) {
			isNumber = false;
		}

		return isNumber;
	}

	
}
