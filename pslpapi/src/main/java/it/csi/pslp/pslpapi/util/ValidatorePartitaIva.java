/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

/**
 * Classe per il controllo della correttezza della Partita Iva.
 * <br>In particolare questa classe si occupa solamente di stabilire la correttezza
 * di una Partita Iva, non e' detto che questa Partita Iva in realta' esista.<br>
 * Non e' necessario istanziare l'oggetto, poiche' l'unico metodo presente
 * {@link #isValid(String)} e' un metodo statico.<br>
 * Tipicamente si puo' utilizzare in un'istruzione del tipo "if (..." come <br>
 * <pre>
 * if (PI.isValid(<i>stringa con la partita iva</i>)){
 * ...
 * </pre>
 * <br>
     * Un esempio su come utilizzare questa classe e' riportato nell'esempio seguente:
 * <a href="../../ProvingChecks.java">ProvingChecks.java</a>
 */
public class ValidatorePartitaIva {
  /*
   * Metodo di classe, restituisce 'true' se la stringa passata contiene una
   * partita iva corretta, 'false' altrimenti
   */
  /**
   * Metodo di classe che verifica la correttezza della Partita Iva.
   * <br>Restituisce il valore <code>true</code> se la Partita Iva e' corretta,
   * <code>false</code> altrimenti.
   *
       * @return <code>true</code> se la Partita Iva e' corretta<br><code>false</code>
   * se non e' corretta.
   *
   * @param paramPI Stringa contenente la Partita Iva da controllare. Come default se nullo considero INVALIDO
   *
   *
   */
  public static boolean isValid(String paramPI) {
	if(paramPI == null) return false;  
	  
    String piva = paramPI.trim();
    try {
      /*
       * verifica che la partita iva sia composta solo da cifre
       * nel caso non sia composta da sole cifre si verifica l'eccezione
       * NumberFormatException e viene restituito il valore 'false'
       */
      Long.parseLong(piva);
      /*
       * verifica che la partita iva sia composta da 11 caratteri (non tutti zeri)
       * Andrea 21/09/2018 aggiunta condizione anche per scartare quelle che iniziano con 7 zeri,
       * Essendo una sequence dovrebbe avere almeno un valore
       */
      if (piva.length() == 11 && !piva.startsWith("0000000")) {
      	
      	int i = 0;
        int tot = 0;
        /*
         * somma delle cifre dispari, tranne l'ultima
         */
        while (i < 10) {
          tot += Integer.parseInt(piva.substring(i, i + 1));
          i += 2;
        }
        int pari = 0;
        i = 1;
        /*
         * somma (al totale delle cifre dispari) delle cifre pari
         * moltiplicate per 2
         * se la cifra moltiplicata e' maggiore o uguale a 10
         * si sommano separatamente
         * le decine e le unita'
         * esempi
         * 3: rimane 3
         * 13: si somma 1 + 4 = 5
         * 10: si somma 1 + 0 = 1
         */while (i < 11) {
          pari = (Integer.parseInt(piva.substring(i, i + 1))) * 2;
          pari = (pari / 10) + (pari % 10);
          tot += pari;
          i += 2;
        }
        /*
         * ultima cifra della partita iva
         * cifra di controllo
         */
        int control = Integer.parseInt(piva.substring(10, 11));
        /*
         * verifica:
         * (resto(somma) = 0 E cifra di controllo = 0)
         * oppure
         * (10 - resto(somma) = cifra di controllo)
         */
        if ( ( (tot % 10) == 0 && (control == 0))
            || ( (10 - (tot % 10)) == control)) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    catch (NumberFormatException e) {
      return false;
    }
  }
 }
