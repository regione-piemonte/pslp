/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

/**
 * Classe statica contenente metodi di utilita' comune.
 *
 * 
 */
public class CommonUtils {
	
	public final static String DATE_FORMAT = "dd/MM/yyyy";
	
	private static final SimpleDateFormat formatDate = new SimpleDateFormat("dd/MM/yyyy");

	/**
	 * Metodo che permette di verificare se un oggetto in input e' nullo o vuoto
	 * 
	 * @param oIn oggetto generico in input
	 * @return true se e' vera una delle seguenti condizioni: - l'oggetto e' nullo -
	 *         l'oggetto e' una stringa vuota - l'oggetto e' una collection o array
	 *         con 0 elementi
	 */
	public static boolean isVoid(Object oIn) {
		if (oIn == null || oIn.equals("")) {
			return true;
		} else if (oIn instanceof String && ((String) oIn).length() == 0) {
			return true;
		} else if (oIn instanceof Collection && ((Collection<?>) oIn).isEmpty()) {
			return true;
		} else if (oIn instanceof Object[] && ((Object[]) oIn).length == 0) {
			return true;
		}
		return false;
	}

	public static boolean isNotVoid(Object oIn) {
		return !isVoid(oIn);
	}

	public static boolean isNullOrZero(Number n) {
		return n == null || n.intValue() == 0;
	}

	/**
	 * funziona come la nvl di oracle, valuta un oggetto in input, se valorizzato
	 * torna l'oggetto stesso, altrimento un altro valore
	 * 
	 * @param objInput
	 * @param valoreInUscitaSeObjInputNullo ritornato se objInput null
	 * @return
	 */
	public static <T> T nvl(T objInput, T valoreInUscitaSeObjInputNullo) {
		if (objInput == null) {
			return valoreInUscitaSeObjInputNullo;
		} else {
			return objInput;
		}
	}

	public static boolean in(Object oggettoDaConfrontare, Object[] elencoElementi) {
		if (oggettoDaConfrontare == null || elencoElementi == null)
			return false;
		for (int i = 0; i < elencoElementi.length; i++) {
			if (elencoElementi[i].equals(oggettoDaConfrontare)) {
				return true;
			}
		}
		return false;
	}

	public static boolean in(Object oggettoDaConfrontare, Object o1, Object o2) {
		return in(oggettoDaConfrontare, new Object[] { o1, o2 });
	}

	public static boolean in(Object oggettoDaConfrontare, Object o1, Object o2, Object o3) {
		return in(oggettoDaConfrontare, new Object[] { o1, o2, o3 });
	}

	public static boolean in(Object oggettoDaConfrontare, Object o1, Object o2, Object o3, Object o4) {
		return in(oggettoDaConfrontare, new Object[] { o1, o2, o3, o4 });
	}

	public static boolean in(Object oggettoDaConfrontare, Object o1, Object o2, Object o3, Object o4, Object o5) {
		return in(oggettoDaConfrontare, new Object[] { o1, o2, o3, o4, o5 });
	}
	
	public static boolean in(Object oggettoDaConfrontare, Object o1, Object o2, Object o3, Object o4, Object o5, Object o6, Object o7, Object o8) {
		return in(oggettoDaConfrontare, new Object[] { o1, o2, o3, o4, o5, o6, o7, o8 });
	}

	/**
	 * ritorna true se una stringa in input soddisfa una condizione di uguaglianza
	 * scritta come le condizione dei database. Ignora maiuscole e miniscole. In
	 * presenza di \n li rimuove per avere una stringa da confrontare su un'unica
	 * riga % per qualsiasi numero di caratteri _ per un singolo carattere
	 * 
	 * @param s             stringa in input
	 * @param likeCondition condizione like
	 * @return
	 */
	public static boolean likeIgnoreCase(String s, String likeCondition) {
		if (s == null || likeCondition == null)
			throw new IllegalArgumentException(
					"Valorizzare entrambi i parametri: stringa da confrontare e stringa rappresentante la condizione in like");
		likeCondition = likeCondition.replaceAll("%", "(.*)").replaceAll("_", "?");
		return s.replaceAll("\n", "").toLowerCase().matches(likeCondition.toLowerCase());
	}

	/**
	 * Metodo che crea una stringa contenente lo stack trace dell'eccezione passata
	 * in input.
	 * 
	 * @param t Eccezione
	 * @return stringa rappresentante lo stack trace
	 */
	public static String dumpException(Throwable t) {
		StringWriter out = new StringWriter();
		t.printStackTrace(new PrintWriter(out));
		return "cause=" + t.getCause() + "\nstackTrace=" + out.toString();
	}

	public static boolean isStringContenutaIgnoreCase(String strSuCuiCercare, String strDaCercare) {
		if (strSuCuiCercare != null && strDaCercare != null) {
			return strSuCuiCercare.toLowerCase().indexOf(strDaCercare.toLowerCase()) >= 0;
		}
		return false;
	}

	/**
	 * ritorna true se gli oggetti in input sono entrambi nulli o se la loro
	 * rappresentazione stringa e' uguale
	 * 
	 * @param o1
	 * @param o2
	 * @return
	 */
	public static boolean equalsOrBothNull(Object o1, Object o2) {
		if (o1 == null && o2 == null) {
			return true;
		} else if (o1 != null && o2 != null && o1.toString().equals(o2.toString())) {
			return true;
		}
		return false;
	}

	public static boolean isAllVoid(Object... obj) {

		for (Object o : obj) {
			if (isNotVoid(o)) {
				return false;
			}
		}
		return true;
	}

	public static boolean isAllNotVoid(Object... obj) {

		for (Object o : obj) {
			if (isVoid(o)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Metodo per troncare una stringa ad una certa lunghezza nel caso fosse piu'
	 * lunga
	 * 
	 * @param dsIndirizzoResidenza
	 * @param i
	 * @return
	 */
	public static String troncaStringa(String strDaTroncare, int len) {
		if (strDaTroncare != null && strDaTroncare.length() > len) {
			strDaTroncare = strDaTroncare.substring(0, len);
		}
		return strDaTroncare;
	}

	public static String getPrimiNCaratteri(String strSuCuiCercare, int numCaratteri) {
		if (strSuCuiCercare == null || numCaratteri < 0 || strSuCuiCercare.length() < numCaratteri) {
			return strSuCuiCercare;
		} else {
			return strSuCuiCercare.substring(0, numCaratteri);
		}
	}

	public static String getUltimiNCaratteri(String strSuCuiCercare, int numCaratteri) {
		if (strSuCuiCercare == null || numCaratteri < 0 || strSuCuiCercare.length() < numCaratteri) {
			return strSuCuiCercare;
		} else {
			return strSuCuiCercare.substring(strSuCuiCercare.length() - numCaratteri);
		}
	}

	public static boolean isNumeric(String s) {
		if (s == null)
			return true;
		for (int i = 0; i < s.length(); i++) {
			if (!Character.isDigit(s.charAt(i)))
				return false;
		}
		return true;
	}

	public static String truncClassName(Class<?> clazz) {
		return clazz.getName().substring(clazz.getPackage().getName().length() + 1);
	}

	public static void addIfNotNull(Map<String, Object> map, String key, String value) {
		if (value != null) {
			map.put(key, value);
		}
	}

	public static Object[] formatTextMessage(Object... values) {
		if (values != null) {
			Object[] ret = new Object[values.length];
			for (int i = 0; i<values.length;i++) {
				if (values[i] instanceof Date) 
					ret[i] = formatDate.format(values[i]);
				else if (values[i] instanceof Long) 
//					ret[i] = "" + ((int)values[i]);
					ret[i] = String.format("%d",values[i]);
				else ret[i] = values[i]; 
			}
			return ret;
		}
		return values;
	}
	
	public static int getYearFromDate(Date d) {
		if (d == null)
			return 0;
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(d);
		return calendar.get(Calendar.YEAR);
	}
	
	private static String formatDate(Date date, String dateFormat) {
		if (date == null)
			return "";

		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(dateFormat);

		return sdf.format(date);
	}
	
	/**
	 * Data ora corrente
	 * 
	 * @return
	 */
	public static Date getCurrentDate() {
		return new Date(System.currentTimeMillis());
	}
	/**
	 * Data ora corrente
	 * 
	 * @return
	 */
	public static String getCurrentDateGGMMAAAA() {
		return formatDate(getCurrentDate(), DATE_FORMAT);
	}
	public static java.util.Date convertiStringaInData(String data) {
		if (data == null || data.equals(""))
			return null;
		java.util.Date date = null;
		StringBuilder newDate = new StringBuilder();
		java.text.SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT, java.util.Locale.ITALY);
		java.text.ParsePosition pos = new ParsePosition(0);
		try {
			String[] dataParts = data.split("/");
			for (int i = 0; i < dataParts.length; i++) {
				dataParts[i] = StringUtils.leftPad(dataParts[i], 2, "0");
			}
			newDate.append(dataParts[0]);
			newDate.append("/");
			newDate.append(dataParts[1]);
			newDate.append("/");
			newDate.append(dataParts[2]);

			date = formatter.parse(newDate.toString(), pos);
		} catch (Exception ex) {
			ex.printStackTrace();
			date = null;
		}
		return date;
	}
	public static boolean confrontaData1MaggioreData2(String data1, String data2) {

		Date d1 = convertiStringaInData(data1);
		Date d2 = convertiStringaInData(data2);
		if (isNotVoid(d2)) {
			return (d2.before(d1));
		}
		return false;
	}

	/***************************************************************************
	 * 
	 * metodi generici confronto tra date
	 * 
	 ***************************************************************************/
	
	private static int confrontaDate(Date data1, Date data2) {
		return data1.compareTo(data2);
	}

	public static boolean isData1UgualeData2(Date data1, Date data2) {
		return confrontaDate(data1, data2) == 0;
	}

	public static boolean isData1MaggioreOUgualeData2(Date data1, Date data2) {
		return confrontaDate(data1, data2) >= 0;
	}

	public static boolean isData1MaggioreData2(Date data1, Date data2) {
		return confrontaDate(data1, data2) > 0;
	}
	
	public static boolean isData1MinoreOUgualeData2(Date data1,Date data2){
		return confrontaDate(data1, data2) <= 0;
	}
     
	/**
	 * verifica se la data è compresa nel periodo
	 * 
	 * @param data      
	 * @param dataInizio
	 * @param dataFine
	 * @return true quando la data è compresa tra data Inizio e data fine  estremi compresi
	 */
	public static boolean isDataCompresa(Date data, Date dataInizio, Date dataFine) {
		if(data==null) return true;
		if(dataInizio!=null && isData1MinoreOUgualeData2(data,dataInizio)) return false;
		if(dataFine!=null && isData1MaggioreOUgualeData2(data,dataFine)) return false;
		return true;
	}
	
	/**
	 *   aggiunge giorni alla data 
	 * 
	 * @param data
	 * @param giorni
	 * @return
	 */
	public static Date aggiungiGiorniAData(Date data, int giorni) {
		Calendar c = Calendar.getInstance();
		c.setTime(data); 
		c.add(Calendar.DATE, giorni); // aggiunge giorni alla data
		return c.getTime();
	}
}
