/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util.reflection;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * Un comparator generico che consente di ordinare una lista generica passando l'elenco dei campi su cui agire
 * 
 * es: 
 *  ReflectionComparator comparatorIncontri = new ReflectionComparator("DIncontro", "DsCognome","DsSoggetto");
    comparatorIncontri.setColonnaConOrdinamentoDescrescente("DIncontro");
    
    Collections.sort(incontriTotali,comparatorIncontri);
 * 
 * @author 1871
 *
 */
public class ReflectionComparator implements Comparator{
	List<String> colonne = null;
	List<String> colonneDisc = null;
	
	public ReflectionComparator(String colonnaUno){
		
		this(new String[] {colonnaUno});
	}
	
	public ReflectionComparator(String colonnaUno, String colonnaDue){
		
		this(new String[] {colonnaUno,colonnaDue});
	}
	
	public ReflectionComparator(String colonnaUno, String colonnaDue, String colonnaTre){
		
		this(new String[] {colonnaUno,colonnaDue,colonnaTre});
	}
	
	public ReflectionComparator(String colonnaUno, String colonnaDue, String colonnaTre,String colonnaQuattro){
		
		this(new String[] {colonnaUno,colonnaDue,colonnaTre,colonnaQuattro});
	}
	
	public void setColonnaConOrdinamentoDescrescente(String colonna) {
		colonneDisc.add(colonna);
	}
	
	private ReflectionComparator(String[] colonneDaOrdinare) {
		super();
		colonne = Arrays.asList(colonneDaOrdinare);
		colonneDisc = new ArrayList<String>();
	}
	
	public int compare(Object o1, Object o2) {
		int confrontoLocal = 0;
		for (Iterator<String> iter = colonne.iterator(); iter.hasNext();) {
			String colonna = (String)iter.next();
			Object val =   MethodExecutor.searchAndInvokeGetterMethod(o1, colonna);
			Object val2 = MethodExecutor.searchAndInvokeGetterMethod(o2, colonna);
			confrontoLocal = compareValues(val,val2,colonneDisc.contains(colonna));
			if(confrontoLocal!=0)
			{
				break;
			}
		}
		
		return  confrontoLocal;
		
	}

	private int compareValues(Object v1, Object v2,boolean ordinamentoDiscendente) {
		//considero il null minore di ogni altro valore
		int confrontoLocale = 0;
		if(v1==null && v2==null) {
		  confrontoLocale = 0;
		}
		else if(v1 == null) 
		{
			confrontoLocale = -1;
		}
		else if(v2 == null)
		{
			confrontoLocale = 1;
		}
		else if(v1 instanceof Date)
		{
			confrontoLocale = ((Date)v1).compareTo((Date)v2); 
		}
		else if(v1 instanceof Long)
		{
			confrontoLocale =  ((Long)v1).compareTo((Long)v2); 
		}
		else if(v1 instanceof Double)
		{
			confrontoLocale =  ((Double)v1).compareTo((Double)v2); 
		}
		else if(v1 instanceof BigDecimal)
		{
			confrontoLocale =  ((BigDecimal)v1).compareTo((BigDecimal)v2); 
		}
		else if(v1 instanceof Float)
		{
			confrontoLocale =  ((Float)v1).compareTo((Float)v2); 
		}
		else
		{
			confrontoLocale = v1.toString().compareTo(v2.toString());
		}
		
		if (ordinamentoDiscendente)
		{
			confrontoLocale = -confrontoLocale; 
		}
		return  confrontoLocale;
	}
}
