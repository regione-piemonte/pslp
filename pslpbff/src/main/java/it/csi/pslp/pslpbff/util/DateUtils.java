/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.Date;

import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.commons.lang3.time.FastDateFormat;

import lombok.experimental.UtilityClass;

@UtilityClass
public class DateUtils {

	private static final FastDateFormat SDF = FastDateFormat.getInstance("yyyyMMddHHmmssSSS");
	private static final FastDateFormat ONLY_DATA = FastDateFormat.getInstance("dd/MM/yyyy");
	private static final FastDateFormat ONLY_TIME = FastDateFormat.getInstance("HH:mm");
	private static final FastDateFormat EXCEL_DATA = FastDateFormat.getInstance("dd/MM/yyyy HH:mm");
	private static final FastDateFormat NAME_FILE_DATA = FastDateFormat.getInstance("yyyyMMdd-HHmm");

	public static Date stringToDate(String dataString){
		Date date = null;
		if (dataString != null) {
			try {
				date = ONLY_DATA.parse(dataString);
			} catch (ParseException e) {
				throw new RuntimeException(e);
			}
		}
		return date;
	}
	public static Date calendarToDate(XMLGregorianCalendar calendar) {
		Date date = null;
		if (calendar != null) {
			date = calendar.toGregorianCalendar().getTime();
		}
		return date;
	}

	public static String getTimeStamp() {
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());
		return SDF.format(timestamp);

	}

	public static String excelDataToString(Date date) {
		if (date==null) return null;
		return EXCEL_DATA.format(date);

	}

	public static String nameFileDataToString(Date date) {
		if (date==null) return null;
		return NAME_FILE_DATA.format(date);

	}

	public static String dateToString(Date date) {
		if (date==null) return "";
		return ONLY_DATA.format(date);

	}

	public static String timeToString(Date date) {
		if (date==null) return "";
		return ONLY_TIME.format(date);

	}

	public static Date getDataSistema() {
		return new Date(System.currentTimeMillis());
	}

	public static boolean equals(Date date1, Date date2) {
		if (date1==null && date2==null)
			return true;
		if (date1!=null && date2!= null)
			return date1.equals(date2);

		return false;
	}


}
