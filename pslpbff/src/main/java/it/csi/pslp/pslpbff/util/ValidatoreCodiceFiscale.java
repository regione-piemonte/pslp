/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;

import io.quarkus.logging.Log;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>Title: </p>
 * <p>Description: Classe che si occupa di validare  e generare il codice fiscale</p>
 * * @author not attributable
 * @version 1.0
 */

public class ValidatoreCodiceFiscale {

  private static final char[] mese =
      new char[] {
      'A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'};

  private static char VOCALE_A = 'A';
  private static char VOCALE_E = 'E';
  private static char VOCALE_I = 'I';
  private static char VOCALE_O = 'O';
  private static char VOCALE_U = 'U';



  private static final Map<String, String> TABELLA_MESI = new HashMap<>();
  static {
    TABELLA_MESI.put("A", "01");
    TABELLA_MESI.put("B", "02");
    TABELLA_MESI.put("C", "03");
    TABELLA_MESI.put("D", "04");
    TABELLA_MESI.put("E", "05");
    TABELLA_MESI.put("H", "06");
    TABELLA_MESI.put("L", "07");
    TABELLA_MESI.put("M", "08");
    TABELLA_MESI.put("P", "09");
    TABELLA_MESI.put("R", "10");
    TABELLA_MESI.put("S", "11");
    TABELLA_MESI.put("T", "12");
  }

  /**
   * Calcola la data di nascita del Codice Fiscale passato come parametro
   * @param codiceFiscale codice fiscale per trovare la data di nascita
   * @return la data di nascita in formato: "gg/mm/yyyy"
   **/
  public static String getDataDiNascita(String codiceFiscale) {
    String aa = codiceFiscale.substring(6,8);
    String mm = codiceFiscale.substring(8,9);
    String gg = codiceFiscale.substring(9,11);
    String dataNascita = null;

    try {
      int anno = Integer.parseInt(aa, 10);
      // Ottiene l'anno attuale
      int annoAttuale = Year.now().getValue() % 100;
      String secolo = (anno < annoAttuale) ? "20" : "19";
      anno = Integer.parseInt(secolo + aa);

      int giorno = Integer.parseInt(gg, 10);
      if ((giorno > 31)) {
        giorno -= 40;
      }

      gg = giorno < 10? "0" + giorno : ""+giorno;


      String mese = mm.toUpperCase();
      mese = TABELLA_MESI.get(mese);

      dataNascita = gg + "/" + mese + "/" + anno;

    }catch(Exception ex) {
      System.err.println("[ValidatoreCodiceFiscale::getDataDiNascita] "+codiceFiscale+":"+ex);

    }

    return dataNascita;

  }
  
  /**
   * Calcola il Codice Fiscale
   * @param cognome cognome della persona  (il case � irrilevante)
   * @param nome nome della persona (il case � irrilevate)
   * @param sesso carattere a scelta tra "M" e "F"
   * @param dataNascita data di nascita nel formato 'dd-mm-aaaa' (i separatori non
   *        devono necessariamente essere '-' !)
   * @param codComune codice del comune per codici fiscali di 4 caratteri.
   * @return il Codice Fiscale calcolato (caratteri alfabetici maiuscoli)
   **/
  public static String generaCodiceFiscale(String cognome, String nome,
                                           String dataNascita, String sesso,
                                           String codComune,
                                           String codStatoEstero) {

    String tmpCodiceFiscale = "";

    if (codComune != null && !codComune.equals("")) {
      tmpCodiceFiscale = (calcolaCognome(cognome)) +
          (calcolaNome(nome)) +
          (calcolaDataNasc(dataNascita, sesso)) +
          codComune;
    }
    else if (codStatoEstero != null && !codStatoEstero.equals("")) {
      tmpCodiceFiscale = (calcolaCognome(cognome)) +
          (calcolaNome(nome)) +
          (calcolaDataNasc(dataNascita, sesso)) +
          codStatoEstero;
    }
    // calcolo del CRC
    tmpCodiceFiscale = tmpCodiceFiscale + (calcolaControlCrt(tmpCodiceFiscale));
    return tmpCodiceFiscale;

  }
  
  public static boolean isOmocodico(String codiceFiscale) {
	  if(codiceFiscale.length()!=16) return false;
    int[] posizioniNumeriche = new int[] {14,13,12,10,9,7,6};
    for(int i=0;i<posizioniNumeriche.length;i++) {
      int pos = posizioniNumeriche[i];
      if(!Character.isDigit(codiceFiscale.charAt(pos))) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Genera tutti i possibili codici fiscali omocodici sostituendo
   * 0=L
   * 1=M
   * 2=N
   * 3=P
   * 4=Q
   * 5=R
   * 6=S
   * 7=T
   * 8=U
   * 9=V
   * @param codiceFiscale
   * @return
   */
  public static String[] generaCodiciFiscaliOmocodici(String codiceFiscale) {
    int[] posizioniNumeriche = new int[] {14,13,12,10,9,7,6};
    String sostituzioni = "LMNPQRSTUV";
    String[] r = new String[7];
    String cf = codiceFiscale.substring(0,codiceFiscale.length()-1);
    for(int i=0;i<posizioniNumeriche.length;i++) {
      try {
        int pos = posizioniNumeriche[i];
        int n = Character.getNumericValue(cf.charAt(pos));
        cf = cf.substring(0,pos)+sostituzioni.charAt(n)+cf.substring(pos+1);
        r[i] = cf+calcolaControlCrt(cf);
      }
      catch(Exception ex) {
        System.err.println("[ValidatoreCodiceFiscale::generaCodiciFiscaliOmocodici] "+codiceFiscale+":"+ex);
        r[i] = "";
      }
    }
    return r;
  }

  /**
   * Calcola il carattere di controllo:
   * La stringa di ritorno sara' costituita da una lettera dell'alfabeto ottenuta dai controlli
   * che devono essere effettuati sul codice fiscale che viene passato.
   * Il calcolo e' realizzato secondo una mappa associativa propria dell'algoritmo di calcolo.
   * @param codFisc Codice Fiscale calcolato con cognome,nome,data di nascita e codice comune
   * @return stringa con il carattere di controllo del CF
   */
  public static char calcolaControlCrt(String codFisc) {
    int counter = 0; // serve per accumulare il codice numerico
    int offset = 0;
    // I primi 8 caratteri dispari...
    for (int i = 0; i < 8; i++, offset += 2) {
      char tmpChar = codFisc.charAt(offset);
      if (tmpChar == 'A' || tmpChar == '0') {
        counter += 1;
      }
      else if (tmpChar == 'B' || tmpChar == '1') {
        counter += 0;
      }
      else if (tmpChar == 'C' || tmpChar == '2') {
        counter += 5;
      }
      else if (tmpChar == 'D' || tmpChar == '3') {
        counter += 7;
      }
      else if (tmpChar == 'E' || tmpChar == '4') {
        counter += 9;
      }
      else if (tmpChar == 'F' || tmpChar == '5') {
        counter += 13;
      }
      else if (tmpChar == 'G' || tmpChar == '6') {
        counter += 15;
      }
      else if (tmpChar == 'H' || tmpChar == '7') {
        counter += 17;
      }
      else if (tmpChar == 'I' || tmpChar == '8') {
        counter += 19;
      }
      else if (tmpChar == 'J' || tmpChar == '9') {
        counter += 21;
      }
      else if (tmpChar == 'K') {
        counter += 2;
      }
      else if (tmpChar == 'L') {
        counter += 4;
      }
      else if (tmpChar == 'M') {
        counter += 18;
      }
      else if (tmpChar == 'N') {
        counter += 20;
      }
      else if (tmpChar == 'O') {
        counter += 11;
      }
      else if (tmpChar == 'P') {
        counter += 3;
      }
      else if (tmpChar == 'Q') {
        counter += 6;
      }
      else if (tmpChar == 'R') {
        counter += 8;
      }
      else if (tmpChar == 'S') {
        counter += 12;
      }
      else if (tmpChar == 'T') {
        counter += 14;
      }
      else if (tmpChar == 'U') {
        counter += 16;
      }
      else if (tmpChar == 'V') {
        counter += 10;
      }
      else if (tmpChar == 'W') {
        counter += 22;
      }
      else if (tmpChar == 'X') {
        counter += 25;
      }
      else if (tmpChar == 'Y') {
        counter += 24;
      }
      else if (tmpChar == 'Z') {
        counter += 23;
      }
    }

    // I primi 7 caratteri pari
    offset = 1;
    for (int j = 0; j < 7; j++, offset += 2) {
      char tmpChar = codFisc.charAt(offset);
      if (Character.isDigit(tmpChar)) {
        counter += tmpChar - '0';

      }
      else if (tmpChar == 'A') {
        counter += 0;
      }
      else if (tmpChar == 'B') {
        counter += 1;
      }
      else if (tmpChar == 'C') {
        counter += 2;
      }
      else if (tmpChar == 'D') {
        counter += 3;
      }
      else if (tmpChar == 'E') {
        counter += 4;
      }
      else if (tmpChar == 'F') {
        counter += 5;
      }
      else if (tmpChar == 'G') {
        counter += 6;
      }
      else if (tmpChar == 'H') {
        counter += 7;
      }
      else if (tmpChar == 'I') {
        counter += 8;
      }
      else if (tmpChar == 'J') {
        counter += 9;
      }
      else if (tmpChar == 'K') {
        counter += 10;
      }
      else if (tmpChar == 'L') {
        counter += 11;
      }
      else if (tmpChar == 'M') {
        counter += 12;
      }
      else if (tmpChar == 'N') {
        counter += 13;
      }
      else if (tmpChar == 'O') {
        counter += 14;
      }
      else if (tmpChar == 'P') {
        counter += 15;
      }
      else if (tmpChar == 'Q') {
        counter += 16;
      }
      else if (tmpChar == 'R') {
        counter += 17;
      }
      else if (tmpChar == 'S') {
        counter += 18;
      }
      else if (tmpChar == 'T') {
        counter += 19;
      }
      else if (tmpChar == 'U') {
        counter += 20;
      }
      else if (tmpChar == 'V') {
        counter += 21;
      }
      else if (tmpChar == 'W') {
        counter += 22;
      }
      else if (tmpChar == 'X') {
        counter += 23;
      }
      else if (tmpChar == 'Y') {
        counter += 24;
      }
      else if (tmpChar == 'Z') {
        counter += 25;
      }
    }
    // il codiceCrt e' un numero tra 0 e 25
    int codiceCrt = counter % 26;

    // il codice risultante e' il (codiceCrt+1)-esimo carattere dell'alfabeto
    return (char) ('A' + codiceCrt);
  }

  /**
   * Calcola i caratteri derivanti dal nome:
   * - tutte le vocali presenti nel nome vengono memorizzate in una variabile
   * - tutte le consonanti presenti nel nome vengono memorizzate in una variabile
   * La stringa di ritorno sara' costituita da:
   * <ul>
   * <li> TRE CONSONANTI (la prima,la terza e la quarta):
   * nel caso in cui le consonanti sono piu' di 3
   * <li> TRE CONSONANTI (la prima,la seconda,la terza)
   * nel caso in cui le consonanti sono 3
   * <li> DUE CONSONANTI E UNA VOCALE :
   * nel caso in cui le consonanti sono 2 ed e' stata trovata almeno 1 vocale
   * <li> DUE CONSONANTI E X :
   * nel caso in cui le consonanti sono 2 e non sono state trovate vocali
   * <li> UNA CONSUNANTE E DUE VOCALI :
   * nel caso in cui c'e' 1 sola consonante e le vocali sono almeno 2
   * <li> UNA CONSONANTE,UNA VOCALE E X:
   * nel caso un cui c'e' 1 sola consonante e 1 sola vocale
   * <li> DUE VOCALI E X
   * nel caso in cui non ci sono consonanti
   * </ul>
   * @param nome Nome da cui devono derivare i secondi 3 caratteri del CF
   * @return stringa con i secondi 3 caratteri del codice fiscale( RIPULITI DA EVENTUALI ACCENTI NELLE VOCALI)
   */

  public static String calcolaNome(String nome) {
    String tmpText = new String();
    String tmpConsonanti = new String();
    String tmpVocali = new String();
    String nomeU = nome.toUpperCase();
    int lungh = nomeU.length();
    char currChar;
    for (int i = 0; i < lungh; i++) {
      currChar = nomeU.charAt(i);
      if (isVocale(currChar)) {
        tmpVocali = tmpVocali + sostituisciCarattereMaiuscoloAccentatoConCorrispondenteSemplice(currChar);

      }
      else if ( (currChar != ' ') && currChar != '\'') {
        tmpConsonanti = tmpConsonanti + (currChar);

      }
    }
    if (tmpConsonanti.length() > 3) {
      tmpText = tmpText + tmpConsonanti.charAt(0) + tmpConsonanti.charAt(2) +
          tmpConsonanti.charAt(3);
    }
    else if (tmpConsonanti.length() == 3) {
      tmpText = tmpText + tmpConsonanti.charAt(0) + tmpConsonanti.charAt(1) +
          tmpConsonanti.charAt(2);
    }
    else if (tmpConsonanti.length() == 2) {
      tmpText = tmpText + tmpConsonanti.charAt(0) + tmpConsonanti.charAt(1);

    }
    else if (tmpConsonanti.length() == 1) {
      tmpText = tmpText + tmpConsonanti.charAt(0);

    }



    //aggiungo la stringa delle vocali + 3 x, troncato al terzo carattere
    tmpText = tmpText + tmpVocali + "XXX";
    tmpText = tmpText.substring(0, 3);
    return tmpText;
  }

  /**
   * Calcola i caratteri derivanti dalla data di nascita e sesso:
   * La stringa di ritorno sara' costituita da:
   * <ul>
   * <li> ANNO : dato dall'ultimo e dal penultimo carattere della data di nascita
   * <li> MESE : si memorizza in una variabile il quarto e il quinto carattere della data di nascita,
   * a seconda del numero trovato si avra' una lettera dell'alfabeto corrispondente
   * <li> GIORNO:
   * nel caso in cui il sesso e' 'M' e' dato dal primo e secondo carattere della data di nascita
   * nel caso in cui il sesso e' 'F' e' dato dal numero prima ricavato + 40
   * </ul>
   * @param dataNascita Data da cui devono derivare i caratteri 7 - 12 del CF
   * @return stringa con i caratteri 7 - 12 del codice fiscale
   */

  private static String calcolaDataNasc(String dataNascita, String sesso) {
    String tmpMese = new String();
    String tmpGiorno = new String();
    String tmpTextGG = new String();
    String tmpText = new String();
    int length = dataNascita.length();

    // calcolo della porzione di codice che descrive la data di nascita a partire
    // da una data nel formato dd-mm-aaaa:
    // Anno: gli ultimi due caratteri
    tmpText = tmpText + dataNascita.charAt(length - 2) +
        dataNascita.charAt(length - 1);

    // Mese: il terzo e il quarto carattere
    tmpMese = tmpMese + dataNascita.charAt(3) + dataNascita.charAt(4);
    tmpText += mese[ ( (Integer.parseInt(tmpMese)) - 1)];

    // Giorno: i primi due caratteri (il numero deve essere aumentato di 40
    // se il sesso e' femminile
    tmpGiorno = tmpGiorno + dataNascita.charAt(0) + dataNascita.charAt(1);
    if (sesso.length()>0 &&  sesso.charAt(0) == 'F') {
      tmpTextGG += ( (Integer.parseInt(tmpGiorno)) + 40);
    }
    else {
      tmpTextGG += tmpGiorno;

      // riempio se necessario con uno zero a sinistra
    }
    if (tmpTextGG.length() == 1) {
      tmpText += '0';

    }
    tmpText += tmpTextGG;
    return tmpText;
  }

  /**
   * Calcola i caratteri derivanti dal cognome:
   * - tutte le vocali presenti nel cognome vengono memorizzate in una variabile
   * - tutte le consonanti presenti nel cognome vengono memorizzate in una variabile
   * La stringa di ritorno sara' costituita da:
   * <ul>
   * <li> TRE CONSONANTI (le prime tre):
   * nel caso in cui le consonanti sono almeno 3
   * <li> DUE CONSONANTI E UNA VOCALE :
   * nel caso in cui le consonanti sono 2 ed e' stata trovata almeno 1 vocale
   * <li> DUE CONSONANTI E X :
   * nel caso in cui le consonanti sono 2 e non sono state trovate vocali
   * <li> UNA CONSUNANTE E DUE VOCALI :
   * nel caso in cui c'e' 1 sola consonante e le vocali sono almeno 2
   * <li> UNA CONSONANTE,UNA VOCALE E X:
   * nel caso un cui c'e' 1 sola consonante e 1 sola vocale
   * <li> DUE VOCALI E X
   * nel caso in cui non ci sono consonanti
   * </ul>
   * @param cognome Cognome da cui devono derivare i primi 3 caratteri del CF
   * @return stringa con i primi 3 caratteri del codice fiscale (RIPULITI DA EVENTUALI ACCENTI NELLE VOCALI)
   *    * 
   */

  public static String calcolaCognome(String cognome) {
    String tmpText = new String();
    String tmpConsonanti = new String();
    String tmpVocali = new String();

    String cognomeU = cognome.toUpperCase();
    char currChar;
    int lungh = cognomeU.length();
    for (int i = 0; i < lungh; i++) {
      currChar = cognomeU.charAt(i);
      if (isVocale(currChar)) {
        tmpVocali = tmpVocali +  sostituisciCarattereMaiuscoloAccentatoConCorrispondenteSemplice(currChar);
      }
      else if ( (currChar != ' ') && currChar != '\'') {
        
        tmpConsonanti = tmpConsonanti + (currChar);
      }

    }

    //concatenazione di tutte le consonanti con le vocali,
    //troncamento al terzo carattere o aggiunta di n X fino ad arrivare a tre
    tmpText = tmpConsonanti + tmpVocali + "XXX";
    tmpText = tmpText.substring(0, 3);

   
    return tmpText;
  }

  
  /**
   * Verifica un carattere in input e nel caso sia una vocale accentata restituisce la corrispondente senza accento.
   *
   * @param c
   * @return
   */
  private static char sostituisciCarattereMaiuscoloAccentatoConCorrispondenteSemplice(char c){
  	char result = c;
  	if(isVocaleA(c)) return VOCALE_A;
  	if(isVocaleE(c)) return VOCALE_E;
  	if(isVocaleI(c)) return VOCALE_I;
  	if(isVocaleO(c)) return VOCALE_O;
  	if(isVocaleU(c)) return VOCALE_U;
  	return result;
  }
  
  private static boolean  isVocale(char c){
  	return isVocaleA(c) || isVocaleE(c) || isVocaleI(c) || isVocaleO(c) || isVocaleU(c);
  }

  private static boolean isVocaleA(char c) {
		return c == VOCALE_A || c =='\u00C0' || c == '\u00C1';
	}
	
  private static boolean isVocaleE(char c) {
		return c == VOCALE_E || c == '\u00C8' || c == '\u00C9';
	}
	  
  private static boolean isVocaleI(char c) {
		return c == VOCALE_I || c == '\u00CC' || c == '\u00CD';
	}
  
  private static boolean isVocaleO(char c) {
		return  c == VOCALE_O || c == '\u00D2' || c == '\u00D3';
	}
	
  private static boolean isVocaleU(char c) {
		return c == VOCALE_U || c == '\u00D9' || c =='\u00DA';
	}
	
  
  /**
   * Verifica se il codice fiscale ha il formato opportuno di 16 caratteri con il codice
   * @param codiceFiscale String
   * @return boolean
   */
  public static boolean verificaSeFormalmenteValido(String codiceFiscale) {
    if (codiceFiscale == null) {
      return false;
    }
    codiceFiscale = codiceFiscale.trim();
    //LUNGHEZZA ERRATA
    if (codiceFiscale.length() != 16 && codiceFiscale.length() != 11) {
      return false;
    }
    //LUNGHEZZA CORRETTA

    /*
    I primi 6 caratteri possono essere anche numerici

    String uno = codiceFiscale.substring(0, 1);
    char unoc = uno.charAt(0);
    String due = codiceFiscale.substring(1, 2);
    char duec = due.charAt(0);
    String tre = codiceFiscale.substring(2, 3);
    char trec = tre.charAt(0);
    String quattro = codiceFiscale.substring(3, 4);
    char quattroc = quattro.charAt(0);
    String cinque = codiceFiscale.substring(4, 5);
    char cinquec = cinque.charAt(0);
    String sei = codiceFiscale.substring(5, 6);
    char seic = sei.charAt(0);
    //CONTROLLO FORMALE
    if (Character.isDigit(unoc) || Character.isDigit(duec) ||
        Character.isDigit(trec) || Character.isDigit(quattroc) ||
        Character.isDigit(cinquec) || Character.isDigit(seic)) {
      return false;
    }
    */
    //Segnalazione 1691 - controllo Cod Fisc. anche per le persone fisiche
    if(codiceFiscale.length() == 16){
	    //Segnalazione 1201 - controllo che l'ultimo carattere sia letterale
	    char lastc = codiceFiscale.charAt(codiceFiscale.length()-1);
	    //CONTROLLO FORMALE
	    if (Character.isDigit(lastc))
	    {
	      return false;
	    }
    }
    if(codiceFiscale.length() == 11){
    	for (int i=0; i<(codiceFiscale.length()); i++){
    		
  		  String valore = codiceFiscale.substring(i,i+1).trim();
  		  if(	valore.equalsIgnoreCase("0")  || valore.equalsIgnoreCase("1") || 
  				valore.equalsIgnoreCase("2") || 
  				valore.equalsIgnoreCase("3") || 
  				valore.equalsIgnoreCase("4") || 
  				valore.equalsIgnoreCase("5") || 
  				valore.equalsIgnoreCase("6") || 
  				valore.equalsIgnoreCase("7") || 
  				valore.equalsIgnoreCase("8") || 
  				valore.equalsIgnoreCase("9")   ){
  		  }else{
  			  return false;
  		  }
    	}
    }

    return true;
  }

  // metodo inserito per segnalazione 1201 - omocodia sui codici fiscali

  /**
   * Traduce il codice fiscale nel formato numerico richiesto, in base ai criteri
   * seguenti:
   * Permettere di poter inserire un codice fiscale lavoratore numerico, in quanto il D.P.R. 606 del 2/09/1973 prevede che:
   quando 2 o piu' soggetti hanno uguali i primi 15 caratteri, i relativi codici vengono differenziati sostituendo 1 o piu' delle 7 cifre a partire da destra secondo la seguente tabella:
   0=L
   1=M
   2=N
   3=P
   4=Q
   5=R
   6=S
   7=T
   8=U
   9=V
   Il controllo sull'ultimo carattere rimane invariato.
   *
   * @param codiceFiscale String
   * @return String
   */
  public static String traduciCodiceFiscale(String codiceFiscale) {

    String codiceFiscaleTradotto="";
    char carattere;
    try
    {
      // segnalazione 1201
      // Devo tradurre tutto tranne l'ultimo carattere
      for (int i = 0; i < codiceFiscale.length() - 1; i++)
      {
        carattere = codiceFiscale.charAt(i);
        if (carattere == 'L')
          carattere='0';
        else if (carattere == 'M')
          carattere='1';
        else if (carattere == 'N')
          carattere='2';
        else if (carattere == 'P')
          carattere='3';
        else if (carattere == 'Q')
          carattere='4';
        else if (carattere == 'R')
          carattere='5';
        else if (carattere == 'S')
          carattere='6';
        else if (carattere == 'T')
          carattere='7';
        else if (carattere == 'U')
          carattere='8';
        else if (carattere == 'V')
          carattere='9';

        codiceFiscaleTradotto += carattere;
      }
      //Ultimo carattere invariato
      codiceFiscaleTradotto += codiceFiscale.charAt(codiceFiscale.length()-1);
    }
    catch (Exception e)
    {
      // Errore nel processo
      codiceFiscaleTradotto="";
    }

     return codiceFiscaleTradotto;
  }
  
  //Controllo del codice fiscale numerico provvisorio delle persone fisiche di undici cifre
  // 
  public static boolean controlloPersoneFisiche (String codiceFiscale){
	  String risultato="";
	  String valore="";
	  int raddoppiapari = 0;
	  int numerodispari = 0;
	  int somma = 0;
	  int conta = 0;
	  String verificapari = "";
	  int sommapari = 0;
	  int cifra1 = 0;
	  int cifra2 = 0;
	  int totPari = 0;
	  String totale="";
	  int controllo=0;
	 
	 
	  for (int i=0; i<(codiceFiscale.length() -1); i++){
		
		  valore = codiceFiscale.substring(i,i+1);
		  conta = Integer.parseInt(valore);
		 		  		  
			if(i %2 != 0){
			//numero pari
			raddoppiapari = conta*2;
			verificapari = String.valueOf(raddoppiapari);
				if(verificapari.length()==2){
					cifra1 = Integer.parseInt(verificapari.substring(0,1));
					cifra2 = Integer.parseInt(verificapari.substring(1));
					sommapari = cifra1+cifra2;	
					raddoppiapari  =sommapari;
				}
				totPari = totPari+raddoppiapari ;
			}
			if(i %2 == 0){
			//numero dispari
			numerodispari = numerodispari+conta;
				
			}
	  }
	  somma = totPari + numerodispari ;
	  totale = String.valueOf(somma);
	  totale = totale.substring(1);
	  controllo = 10 - Integer.parseInt(totale);
	  risultato = String.valueOf(controllo);
	  
	  String ultimoCarattere = codiceFiscale.substring(10); 
	  return risultato.equals(ultimoCarattere);
  }
  
  public static boolean confrontaCodiceFiscaleGeneratoConQuelloInserito(String cognome, String nome,
      String dataNascita, String sesso,
      String codComune,
      String codStatoEstero,String codiceFiscaleInserito){
    
    if(codiceFiscaleInserito.length()==11) {
      return controlloPersoneFisiche(codiceFiscaleInserito);
    }
    
	  String codiceFiscaleCalcolato=generaCodiceFiscale(
		       cognome,
		       nome,
		       dataNascita,
		       sesso,
		       codComune,
		       codStatoEstero
		       );

	  String codiceFiscaleNumerico=traduciCodiceFiscale(codiceFiscaleCalcolato);
	  if (codiceFiscaleCalcolato.equals(codiceFiscaleInserito)||codiceFiscaleNumerico.equalsIgnoreCase(codiceFiscaleInserito)){
        return true;		  
	  }else{
	    if(isOmocodico(codiceFiscaleInserito)) {
	      String s1 = codiceFiscaleInserito.substring(0,6);
	      String s2 = codiceFiscaleCalcolato.substring(0,6);
	      String sp = codiceFiscaleInserito.substring(0,codiceFiscaleInserito.length()-1);
	      char c1 = calcolaControlCrt(sp);
	      char c2 = codiceFiscaleInserito.charAt(codiceFiscaleInserito.length()-1);
	      return s1.equals(s2) && (c1==c2);
	    }
      return false;
	  }
  }
  

  /**
   * Metodo di classe che verifica la correttezza del Codice Fiscale.
       * <br>Restituisce il valore <code>true</code> se il Codice Fiscale e' corretto,
   * <code>false</code> altrimenti.
   *
   * @return <code>true</code> se il Codice Fiscale e' corretto<br><code>false</code>
   * se non e' corretto.
   *
   * @param parCF   Stringa contenente il Codice Fiscale da controllare. Come default se nullo considero INVALIDO
   *
   */
  public static boolean isValid(String parCF) {
	 if(parCF == null) return false;  
	  
    // conversione della stringa in caratteri maiuscoli
    String cf = parCF.toUpperCase();
    /*
     * eliminazione degli eventuali spazi
     */
    //cf = StringMng.removeChars(' ', cf);
    cf = cf.trim();
    /*
     * verifica della lunghezza del codice fiscale
     */
    if (cf.length() == 16) {
      /*
       * creazione della matrice con i caratteri dell'alfabeto
       */
      char[] Carattere = {
          'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
          'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
          'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0',
          '1', '2', '3', '4', '5', '6', '7', '8', '9'};
      /*
       * creazione della matrice con i valori attribuiti ai caratteri
       * dispari, corrispondenti alla matrice di caratteri
       */
      int[] ValoriDispari = {
          1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4,
          18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22,
          25, 24, 23, 1, 0, 5, 7, 9, 13, 15, 17, 19,
          21};
      /*
       * creazione della matrice con i valori attribuiti ai caratteri
       * pari, corrispondenti alla matrice di caratteri
       */
      int[] ValoriPari = new int[36];
      for (int i = 0; i < 26; i++) {
        ValoriPari[i] = i;
      }
      for (int i = 26; i < 36; i++) {
        ValoriPari[i] = i - 26;
      }
      // conversione della stringa da esaminare ad una matrice di caratteri
      char[] caratteriCF = cf.toCharArray();
      int valore = 0;
      for (int i = 0; i < caratteriCF.length - 1; i++) {
        /*
         * somma delle posizioni pari in base ai valori
         * corrispondenti contenuti nell'array ValoriPari
         * (tranne l'ultimo carattere che e' quello di controllo)
         */
        if ( (i + 1) % 2 == 0) {
          for (int j = 0; j < Carattere.length; j++) {

            if (caratteriCF[i] == Carattere[j]) {
              valore += ValoriPari[j];
            }
          }
          /*
           * somma delle posizioni dispari in base ai valori
           * corrispondenti contenuti nell'array ValoriDispari
           */
        }
        else {
          for (int j = 0; j < Carattere.length; j++) {
            if (caratteriCF[i] == Carattere[j]) {
              valore += ValoriDispari[j];
            }
          }
        }
      }
      /*
       * ottenimento del resto della divisione per 26 e
       * valutazione del carattere di controllo (ultimo carattere)
       */
      valore %= 26;
      for (int i = 0; i < 26; i++) {
        /*
         * verifica che il valore dell'ultimo carattere corrisponda
         * al valore ottenuto attraverso l'algoritmo di somma precedente
         */
        if (caratteriCF[caratteriCF.length - 1] == Carattere[i]) {
          if (valore == i) {
            return true;
          }
          else {
            return false;
          }
        }
      }
      return false;

    }
    else {
      return false;
    }

  }
  
  private static void check(String cf, String cognome, String nome, String dataDiNascita, String sesso, String comune, boolean checkAtteso) {
    Log.error(cf+": "+(checkAtteso==ValidatoreCodiceFiscale.confrontaCodiceFiscaleGeneratoConQuelloInserito(cognome, nome, dataDiNascita, sesso, comune, null, cf)));
  }
  
  public static void main(String[] args) {
    check("SHKSHN80A01Z249O", "SHEIKH", "SHAHUN", "01/01/1980", "M", "Z249", true);
    check("SHKSHN80A01Z24VD", "SHEIKH", "SHAHUN", "01/01/1980", "M", "Z249", true); // omocodico
    check("SHKSHN80A01Z249X", "SHEIKH", "SHAHUN", "01/01/1980", "M", "Z249", false); // errore
    check("SHKSHN80A01Z24VE", "SHEIKH", "SHAHUN", "01/01/1980", "M", "Z249", false); // omocodico con errore
    check("12345678912", "XXX ", "YYY", "01/01/1986", "M", "Z249", false); // provvisorio
    check("49273929007", "XXX ", "YYY", "01/01/1986", "M", "Z249", true); // provvisorio
    check("29742929002", "XXX ", "YYY", "01/01/1986", "M", "Z249", true); // provvisorio
    check("32923589009", "XXX ", "YYY", "01/01/1986", "M", "Z249", true); // provvisorio
    
  }
  
}
