/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.StringTokenizer;

import javax.xml.datatype.XMLGregorianCalendar;

public class TimeUtils {

  /**
   * Converte un qualsiasi ammontare di minuti in un formato orario del tipo
   * HHH:mm dove le ore possono essere illimitate
   * 
   * @param minuti
   * @return
   */
  public static String convertiMinutiInFormatoOrarioStringa(Long minuti) {
    if (minuti == null || minuti.intValue() < 0) { return null; }
    int minutes = minuti.intValue();
    int mm = minutes % 60;
    int hh = minutes / 60;
    String mmS = (mm < 10) ? "0" + String.valueOf(mm) : String.valueOf(mm);
    String hhS = (hh < 10) ? "0" + String.valueOf(hh) : String.valueOf(hh);
    return hhS + ":" + mmS;
  }

  /**
   * Converte un valore in millisecondi in un corrispondente intervallo di tempo in formato hh:mm:ss
   * @param milliseconds
   * @return
   */
  public static String convertiMillisecondiInFormatoOrarioStringa(Long milliseconds) {
	    if (milliseconds == null || milliseconds.intValue() < 0) { return null; }
	    
	    int hh = (int) (milliseconds / (60 * 60 * 1000));
	    int mm = (int) (milliseconds / (60 * 1000)) % 60;
	    int ss = (int) (milliseconds / 1000) % 60;
	    
	   String hhS = (hh < 10) ? "0" + String.valueOf(hh) : String.valueOf(hh);
	   String mmS = (mm < 10) ? "0" + String.valueOf(mm) : String.valueOf(mm);
	   String ssS = (ss < 10) ? "0" + String.valueOf(ss) : String.valueOf(ss);
	   
	   return hhS + ":" + mmS + ":" + ssS;
  }
 
  
  /**
   * Converte un numero di ore e minuti nel formato HH:MM in minuti complessivi
   * 
   * @param numOre
   *          rappresenta un ammontare di tempo fino a 9999 ore e 59 minuti
   * @return i minuti che rappresentano lo stesso ammontare di tempo
   */
  public static Long convertOreFormatoStringaInMinuti(String orarioFormatoStringa) {
    if (orarioFormatoStringa == null) return null;
    try {
      StringTokenizer st = new StringTokenizer(orarioFormatoStringa, ":");

      String[] arr = new String[2];
      arr[0] = st.nextToken();
      arr[1] = st.nextToken();

      int hh = Integer.parseInt(arr[0]);
      int mm = Integer.parseInt(arr[1]);
      if ((mm < 0) || (mm > 59) || (hh < 0) || (hh > 9999)) { throw new UnsupportedOperationException("Errore nella conversione di formato orario in minuti, range di valori non valido " + orarioFormatoStringa); }
      int minutes = hh * 60;
      minutes += mm;
      return new Long(minutes);

    }
    catch (Exception ex) {
      throw new UnsupportedOperationException("Eccezione nella conversione di formato orario in minuti " + orarioFormatoStringa, ex);
    }
  }
  
  /**
   * Converte ore e minuti passati separatemente nella loro sommatoria rappresentata in minuti
   * @param ore
   * @param minuti
   * @return
   */
  public static Long convertOreEMinutiInMinutiTotali(Long ore,Long minuti)
  {
	  return (ore!=null?ore*60L:0L)+(minuti!=null?minuti:0L);
  }
  
  /*
   * Estrae il numero di ore presenti in un ammontare di minuti
   */
  public static Long getOre(Long minuti) {
	  return minuti!=null?minuti/60:0L;
  }

  /**
   * Estrae il numero di minuti compresi tra 0 e 59  inclusi in un ammontare di minuti escludendo le ore
   * @param minuti
   * @return
   */
  public static Long getMinuti(Long minuti) {
	  return minuti!=null?minuti%60:0L;
  }


  /**
   * Converte una data in una rappresentazione in stringa nel formato dd/mm/yyyy
   * @param data
   * @return
   */
  public static String toString(Date data) {
		return TimeUtils.toString(data, "dd/MM/yyyy");
	}

  /**
   * Converte una data in una rappresentazione in stringa nel formato passato in input
   * @param data
   * @param formato
   * @return
   */

  public static String toString(Date data, String formato) {
		if (data == null || formato == null || formato.trim().length() == 0)
			return null;
		SimpleDateFormat formatter = new SimpleDateFormat(formato);
		return formatter.format(data);
  }
  
  /**
   * Converte una data in una rappresentazione in stringa nel formato dd/mm/yyyy anche con ore,minuti,secondi
   * @param data
   * @return
   */
  public static String convertDataEOraInStringa(Date data) {
    return TimeUtils.toString(data, "dd/MM/yyyy HH:mm:ss");
  }
  
  public static String convertDataFinoAMillisecondiInStringa(Date data) {
    return TimeUtils.toString(data, "dd/MM/yyyy HH:mm:ss - SSS");
  }
  
  
  public static java.util.Date convertStringaInData(String data, String formato) {
	  if (data == null || data.trim().length() == 0 || formato == null || formato.trim().length() == 0)
        return null;
      SimpleDateFormat formatter = new SimpleDateFormat(formato);
      return formatter.parse(data, new ParsePosition(0));
  }
 /**
  * Converte una stringa in input in una data senza ore minuti secondi
  * @param data stringa rappresentante una data nel formato dd/mm/yyyy
  * @return
  */
  public static java.util.Date toDate(String data) {
    return TimeUtils.convertStringaInData(data, "dd/MM/yyyy");
  }
  
  
  public static java.util.Date convertStringaInDataConOreMinutiSecondi(String data) {
    return TimeUtils.convertStringaInData(data, "dd/MM/yyyy HH:mm:ss");
  }
  
  public static java.util.Date convertToJavaUtilDate(Date d) {
    if(d == null){
      return null;
    }
    
    return new java.util.Date(d.getTime());
    
  }
  
  /**
   * imposta in una data in input le ore minuti secondi dell'istante attuale, lasciando invariati giorno mese anno.
   * creo un calendar dall'istante attuale e poi imposto giorno mese anno della data in input 
   * @param data
   * @return
   */
	public static Date setOreMinutiSecondiAttualiAData(Date data) {
		Calendar cal = getCalendar(now());
		cal.set(Calendar.DAY_OF_MONTH, getGiorno(data));
		cal.set(Calendar.MONTH, getMese(data));
    cal.set(Calendar.YEAR, getAnno(data));
    return cal.getTime();
	}
  
  
  /**
   * Rimuove da una data in input le eventuali informazioni relative a ore minuti secondi, impostandole a mezzanotte
   * @param data
   * @return
   */
  public static Date truncDate(Date data){
    return toDate(toString(data));
  }

  /**
   * Verifica se un una data e' compresa fra dataInizioValidita e
   * dataFineValidita
   * 
   * @param data
   * @param dataInizioValidita
   * @param dataFineValidita
   * @return
   */
  public static boolean isDataCompresa(Date data, Date dataInizioValidita, Date dataFineValidita) {
    if(data==null) return true;
    if(dataInizioValidita!=null &&  isData1MinoreData2(data,dataInizioValidita)) return false;
    if(dataFineValidita!=null && isData1MaggioreData2(data,dataFineValidita)) return false;
    return true;
  }
  
  public static boolean isData1UgualeData2(Date data1,Date data2){
    return confrontaDateSenzaOreMinutiSecondi(data1, data2) == 0;
  }
  
  public static boolean isData1MaggioreOUgualeData2(Date data1,Date data2){
    return confrontaDateSenzaOreMinutiSecondi(data1, data2) >=0;
  }
  
  public static boolean isData1MaggioreData2(Date data1,Date data2){
    return confrontaDateSenzaOreMinutiSecondi(data1, data2) > 0;
  }
  
  public static boolean isData1MinoreOUgualeData2(Date data1,Date data2){
    return confrontaDateSenzaOreMinutiSecondi(data1, data2) <= 0;
  }
  
  public static boolean isData1MinoreData2(Date data1,Date data2){
    return confrontaDateSenzaOreMinutiSecondi(data1, data2) < 0;
  }
  
  /**
   * Ritorna la data minore tra le due, in caso di uguaglianza torna d1, 
   * nel caso una sia nulla ritorna quella valorizzata.
   * @param d1
   * @param d2
   * @return
   */
  public static  Date getDataMinore(Date d1,Date d2){
    if(d1!=null && d2!=null){
      if(isData1MinoreOUgualeData2(d1, d2)){
        return d1;
      }
      else{
        return d2;
      }
    }
    return nvl(d1, d2);
  }
 
  /**
   * Ritorna la data maggiore tra le due, in caso di uguaglianza torna d1, 
   * nel caso una sia nulla ritorna quella valorizzata.
   * @param d1
   * @param d2
   * @return
   */
  public static  Date getDataMaggiore(Date d1,Date d2){
    if(d1!=null && d2!=null){
      if(isData1MaggioreOUgualeData2(d1, d2)){
        return d1;
      }
      else{
        return d2;
      }
    }
    
    return nvl(d1, d2);
  }
  
  public static boolean isConflittoTraIntervalliTemporaliEstremiCompresi(Date dInizioUno,Date dFineUno,Date dInizioDue,Date dFineDue) {
    return isConflittoTraIntervalliTemporali(dInizioUno, dFineUno, dInizioDue, dFineDue, true);
  }
  
  public static boolean isConflittoTraIntervalliTemporaliEstremiEsclusi(Date dInizioUno,Date dFineUno,Date dInizioDue,Date dFineDue) {
    return isConflittoTraIntervalliTemporali(dInizioUno, dFineUno, dInizioDue, dFineDue, false);
  }
    
  /*
   * Dati due intervalli temporali mi restituisce true se sono in conflitto considera anche date inizio e fine nulle.
   */
  private static boolean isConflittoTraIntervalliTemporali(Date dInizioUno,Date dFineUno,Date dInizioDue,Date dFineDue,boolean conflittoSeEstremiUguali) {
    Date dataInfinita = getDate(31, 12, 2200);
    Date dataBassa = getDate(1, 1, 1800);
    if(conflittoSeEstremiUguali){
      return (isData1MinoreOUgualeData2(nvl(dInizioUno,dataBassa), nvl(dFineDue,dataInfinita)) 
              && 
              isData1MaggioreOUgualeData2(nvl(dFineUno,dataInfinita), nvl(dInizioDue,dataBassa)));
    }
    else{
      return (isData1MinoreData2(nvl(dInizioUno,dataBassa), nvl(dFineDue,dataInfinita)) 
            && 
            isData1MaggioreData2(nvl(dFineUno,dataInfinita), nvl(dInizioDue,dataBassa)) );
    }
  }
  
  public static Date nvl(Date dataIn,Date dataSeNulla) {
    if(dataIn==null) {
      return dataSeNulla; 
    }else {
      return  dataIn;
    }
  }
  
  public static String nowString() {
    return TimeUtils.convertDataEOraInStringa(now());
  }
  
  public static Date now() {
    return new Date(System.currentTimeMillis());
  }
  
  public static Date today() {
    return truncDate(new Date(System.currentTimeMillis()));
  }
  public static Date tomorrow() {
	    return aggiungiGiorniAData(today(),1);
  }
  public static Date yesterday() {
	    return aggiungiGiorniAData(today(),-1);
  }

  
  /**
   * Ritorna un numero in base al confronto di due date a cui viene rimossa la parte di ore minuti secondi
   * 
   * 
   * @param data1
   * @param data2
   * @return
   *        -1 se data1 < data2
   *         0 se data1 = data2
   *         1 se data1 > data2
   */
  private static int confrontaDateSenzaOreMinutiSecondi(Date data1,Date data2){
    if(data1==null || data2==null){
      throw new IllegalArgumentException("Impossibile confrontare date in cui una e' nulla: data1="+data1+" data2 ="+data2);
    }
   return truncDate(data1).compareTo(truncDate(data2));
  }
  
  public static Date aggiungiGiorniAData(java.util.Date date, int days) {
    Calendar cal = getCalendar(date);
    cal.add(Calendar.DATE, days);
    return cal.getTime();
  }
  
  public static Date aggiungiMesiAData(java.util.Date date, int mesi) {
    Calendar cal = getCalendar(date);
    cal.add(Calendar.MONTH, mesi);
    return cal.getTime();
  }
  

  // aggiunge anni a una data e restituisce la data
  public static Date aggiungiAnniAData(java.util.Date date, int anni) {
    Calendar cal = getCalendar(date);
    cal.add(Calendar.YEAR, anni);
    return cal.getTime();
  }
	
  
  public static Date toDate(XMLGregorianCalendar c) {
    if(c==null) return null;
    return c.toGregorianCalendar().getTime();
  }
  /**
	 *  Restituisce un intero contenente l'eta' calcolata ad una
	 *   certa data di riferimento (per l'eta' al momento corrente
	 *   si passa la sysdate)
	 *  Non lancia eccezioni: se il calcolo fallisce per qualche motivo
	 * l'eta' restituita e' un insensato  -1
	 * @param dataNascita
	 * @param dataRiferimento
	 * @return
	 */
	public static int calcolaEtaAData(Date dataNascita, Date dataRiferimento) {
		int etaCalcolata = 0;
		try
		{
			String sNascita = toString(dataNascita);
			String sRif = toString(dataRiferimento);

			int annoN = Integer.parseInt(sNascita.substring(6,10));
			int annoR = Integer.parseInt(sRif.substring(6,10));
			int meseN = Integer.parseInt(sNascita.substring(3,5));
			int meseR = Integer.parseInt(sRif.substring(3,5));
			int giornoN = Integer.parseInt(sNascita.substring(0,2));
			int giornoR = Integer.parseInt(sRif.substring(0,2));
			if(annoR>=annoN){
				if(meseR>meseN)
				{
					etaCalcolata = annoR - annoN;
				}
				else if(meseR==meseN)
				{
					if(giornoR>=giornoN)
						etaCalcolata=annoR-annoN;
					else
						etaCalcolata=(annoR-annoN)-1;
				}
				else if(meseR<meseN)
				{
					etaCalcolata = (annoR - annoN) - 1;
				}
			}
		}catch(Exception e){
			etaCalcolata = -1;
		}
		return etaCalcolata;
	}

	
	/*
   * Calcola la differenza tra due date in anni
   * */
  public static int getDifferenzaInAnni(Date dMinore ,Date dMaggiore){
    return getAnno(dMaggiore) - getAnno(dMinore);
  }
  
  /*
   * Calcola la differenza tra due date in mesi COMPLETI, cioe' es dal 10/01/2020 al 09/02/2020 non e' ancora passato un mese, scatta solo al 10/02/2020
   */
  public static int getDifferenzaInMesi(Date dMinore ,Date dMaggiore){
	  int months = getDifferenzaInAnni(dMinore,dMaggiore)*12 + getMese(dMaggiore) - getMese(dMinore);
	  if(getGiorno(dMaggiore) < getGiorno(dMinore))     
      {
            months--;
      }
	  return months;
  }
  
  /**
   *   restituisce la DIFFERENZA fra due date in giorni
   */
  public static int getDifferenzaInGiorni(Date dMinore ,Date dMaggiore) {
    int result = -1;
    if (isData1MaggioreOUgualeData2(dMaggiore,dMinore)){
      result = (int) ((dMaggiore.getTime() / 86400000) - (dMinore.getTime() / 86400000));
    }
    return result;
  }
  
	
  public static Date getDate(int giorno,int mese, int anno) {
    return new GregorianCalendar(anno, mese -1, giorno).getTime();
  }
  
  /**
   * ritorna un intero rappresentante l'anno di una data 
   * @param d
   * @return
   */
  public static int getAnno(Date d){
    return getCalendar(d).get(Calendar.YEAR);
  }

  public static int getMese(Date d){
    return getCalendar(d).get(Calendar.MONTH);
  }

  public static int getGiorno(Date d){
    return getCalendar(d).get(Calendar.DAY_OF_MONTH);
  }

  public static int getOra(Date d){
	    return getCalendar(d).get(Calendar.HOUR_OF_DAY);
  }

  public static int getMinuto(Date d){
	    return getCalendar(d).get(Calendar.MINUTE);
  }
  
  public static int getSecondo(Date d){
	    return getCalendar(d).get(Calendar.SECOND);
  }
  
  public static int getGiornoDellaSettimana(Date d){
    return getCalendar(d).get(Calendar.DAY_OF_WEEK);
  }
  
  public static Calendar getCalendar(Date d) {
    if(d==null) return null;
  	Calendar cal = Calendar.getInstance(Locale.ITALIAN);
    cal.setTime(d);
    return cal;
  }
  
  /**
   * restituisce un oggetto calendar impostando la data in input troncata e ore minuti secondi in input
   */
  public static Calendar getCalendar(Date d,int ore,int minuti, int secondi) {
    if(d==null) return null;
    Calendar cal = Calendar.getInstance(Locale.ITALIAN);
    cal.setTime(d);
    //cal.add(Calendar.MONTH, 1);
    cal.set(Calendar.HOUR_OF_DAY, ore);
    cal.set(Calendar.MINUTE, minuti);
    cal.set(Calendar.SECOND, secondi);
    return cal;
  }
  
  public static Long calcolaDifferenzaTraDueDateInMesi (Date dtMaggiore, Date dtMinore) {
	  Long mesi = null;
		
		if (dtMinore.getTime() > dtMaggiore.getTime()) {
			return null;
		}
		Calendar calendarDa = Calendar.getInstance();
		Calendar calendarA = Calendar.getInstance();
		calendarDa.setTime(dtMinore);
		calendarA.setTime(dtMaggiore);

		int annoDa = calendarDa.get(Calendar.YEAR);
		int meseDa = calendarDa.get(Calendar.MONTH);
		int annoA = calendarA.get(Calendar.YEAR);
		int meseA = calendarA.get(Calendar.MONTH);

		int diffAnni = annoA - annoDa;
		int diffMesi = 0;
		if (meseDa <= meseA) {
			diffMesi = meseA - meseDa;
		} 
		else{
			int tempDiff = 12 - meseDa;
			diffMesi = tempDiff + meseA;
			if (diffAnni != 0) {
				diffAnni -= 1;
			}
		}
		if (diffMesi != 0) {
			mesi = new Long(diffAnni * 12 + diffMesi);
		}
		else{
			if (diffAnni != 0) {
				mesi =  new Long(diffAnni * 12);
			}
		}

		return mesi;

  }

  public static Date aggiungiUnAnnoADataConGiornoMeseFissi (Date dataRif, int gg, int mm) {
	  return getDate(gg,mm,getAnno(dataRif) + 1);
  }
  
  public static boolean isAnno1MaggioreAnno2(Integer anno1, Integer anno2) {
	  if (anno1 == null || anno2 == null)  {
		  return false;
	  }
	  if (anno1.intValue() > anno2.intValue()) {
		  return true;
	  }
	  return false;
  }
  public static  Date getDataCorrenteMenoUnAnno() {
		return aggiungiAnniAData(now(), -1);

	}

  public static Calendar toCalendar(Date data) {
		Calendar result = null;
		try {
			String strData = null;
			if (data != null) {
				result = Calendar.getInstance();
				strData = TimeUtils.toString(data);
				result.setTime(TimeUtils.toDate(strData));
			}
		} catch (Exception e) {

		      throw new UnsupportedOperationException("Eccezione nella conversione di formato date toCalendat", e);
		}
		return result;
	}
  
  public static boolean isDateValid(Date dateToValidate){
	  if(dateToValidate == null){
		  return false;
	  }
	  Calendar c = GregorianCalendar.getInstance();
	  try {
		  c.setTime(dateToValidate);
	  } catch (Exception e) {
		  return false;
	  }
	  return true;
  }
  
}
