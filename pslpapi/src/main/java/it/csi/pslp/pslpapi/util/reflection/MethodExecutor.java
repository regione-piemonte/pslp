/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util.reflection;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.StringTokenizer;

public class MethodExecutor {
	
	/**
	 * Cerca un metodo su un oggetto 
	 * se lo trova lo chiama e restituisce il risultato
	 * in caso contrario lancia eccezione
	 * 
	 * @param referenceObject oggetto su cui viene invocato il metodo
	 * @param methodName nome del metodo, case insensitive
	 * @param params array di parametri, vuoto se metodo privo di parametri
	 * @return
	 */
	public static
		Object searchAndInvokeMethod(
									 Object referenceObject, 
									 String methodNameToBeInvoked, 
									 Object[] params)
	{
			Method methodToBeInvoked = searchMethodByName(referenceObject, methodNameToBeInvoked);
			return invokeMethod(methodToBeInvoked, referenceObject, params);
	}
	
	/**
 	 * Identifica il getter corrispondente ad un attributo, lo esegue
	 * e restituisce il risultato
	 */
	public static
		Object searchAndInvokeGetterMethod(
										   Object referenceObject, 
										   String attributeKVC)
	{
			StringTokenizer st = new StringTokenizer(attributeKVC,".");
			while (st.hasMoreTokens())
			{
				String attributeName = st.nextToken();
				Method getterMethodToBeInvoked = searchGetterMethodByAttribute(referenceObject, attributeName, attributeKVC);
				referenceObject = invokeMethod(getterMethodToBeInvoked, referenceObject, new Object[] {});
			}
			return referenceObject;
	}
	
	/**
	 * Search a method by name 
	 */
	public  static 
		Method searchMethodByName(	
									Object referenceObject, 
									String searchedMethodName)
	{
			if(referenceObject==null)
			{
				throw new UnsupportedOperationException("Impossibile trovare il metodo: " + searchedMethodName + " su un oggetto nullo");
			}
		
			Method[] methods = referenceObject.getClass().getMethods();
			for (int i = 0; i < methods.length; i++)
			{
				Method currMethod = methods[i];
				if (currMethod.getName().equalsIgnoreCase(searchedMethodName))
				{
					return currMethod;
				}
			}
			throw new UnsupportedOperationException("Impossibile trovare il metodo: " + referenceObject.getClass().getName() + "." + searchedMethodName + "()");
	}
	
	/**
		* Search a getter method by  attribute name 
	 */
	public  static 
		Method searchGetterMethodByAttribute(	
												Object referenceObject, 
												String attributeName,
												String attributeKVC)
	{
			String searchedGetMethodName = "get" + attributeName;
			String searchedIsMethodName = "is" + attributeName;
			
			if (referenceObject == null)
			{
// LE ISTRUZIONI SEGUENTI VANNO BENE PER MIHAI MA SI ROMPE PER ALFREDO (SU METODO ELIMINA IN AZIONI INDIVIDUALI)
// PER ORA CI LIMITIAMO A LOGGARE				
//				throw new UnsupportedOperationException("\nReferenceObject nullo, non posso invocare uno dei metodi seguenti:" +
//						"\n(primo tentativo) null." + searchedGetMethodName + "()" + 
//						"\n(secondo tentativo) null." + searchedIsMethodName + "()");
				String kvcForLogging = attributeKVC.substring(0,attributeKVC.length() - attributeName.length() - 1);
				throw new UnsupportedOperationException("\nReferenceObject nullo, non posso invocare uno dei metodi seguenti:" +
						"\n(primo tentativo) + " + kvcForLogging + "(null)." + searchedGetMethodName + "()" + 
						"\n(secondo tentativo) + " + kvcForLogging + "(null)." + searchedIsMethodName + "()"); 
			}
			
			Method[] methods = referenceObject.getClass().getMethods();
			for (int i = 0; i < methods.length; i++)
			{
				Method currMethod = methods[i];
				if (currMethod.getName().equalsIgnoreCase(searchedGetMethodName) ||
					currMethod.getName().equalsIgnoreCase(searchedIsMethodName))
				{
					return currMethod;
				}
			}
			throw new UnsupportedOperationException("\nImpossibile trovare il metodo getter:"+
													"\n(primo tentativo)" + referenceObject.getClass().getName() + "." + searchedGetMethodName + "()" + 
													"\n(secondo tentativo)" + referenceObject.getClass().getName() + "." + searchedIsMethodName + "()"); 
			
	}
	
	/**
		* Invoke a methods with params
	 */
	public static
		Object invokeMethod(
							Method methodToBeInvoked,
							Object referenceObject, 
							Object[] params)
	{
			try {
				return methodToBeInvoked.invoke(referenceObject, params );
			}
			catch (IllegalArgumentException e) 
		{
			  throw new IllegalArgumentException("[MethodExecutor::invokeMethod] "+methodToBeInvoked.getName()+"("+params+")",e);
		} 
			catch (IllegalAccessException e) 
		{
			  throw new UnsupportedOperationException("IllegalAccessException",e);
		} 
			catch (InvocationTargetException e) 
		{
				throw new UnsupportedOperationException("Errore nell'invocazione del metodo "+ methodToBeInvoked.getName() + " sulla classe " + referenceObject.getClass().getName());
		}
	}
	
	
	/**
		* Cerca un attributo e ne restituisce il tipo
	 */
	
	/**
	 * Identifica il getter corrispondente ad un attributo, lo esegue
	 * e restituisce il risultato
	 */
	public static
		Class returnAttributeType (
								   Object referenceObject, 
								   String attributeKVC)
	{
			Class result = null;
			Method getterMethodToBeInvoked = null;
			StringTokenizer st = new StringTokenizer(attributeKVC,".");
			while (st.hasMoreTokens())
			{
				String attributeName = st.nextToken();
				getterMethodToBeInvoked = searchGetterMethodByAttribute(referenceObject, attributeName, attributeKVC);
				result = getterMethodToBeInvoked.getReturnType();
				referenceObject = invokeMethod(getterMethodToBeInvoked, referenceObject, new Object[] {});
				// se la chiamata precedente restiuisce un valore null
				// non saremmo in grado di determinare il tipo di oggetto nell'iterazione successive
				// e' possibile che sia necessario catturare questa situazione
				// e ritornare null, oppure trovare una tecnica differente per analizzare la classe
				// senza utilizzare un referenceObject, ma direttamente una classe, e analizzando i metodi della classe
				// poi ci penseremo
				
			}
			return result; 
	}
	
	/** Metodo utilizzato per rimappare tutti i campi di un oggetto sui campi corrispondento di un altro oggetto. 
	 * 	Per ogni metodo getter dell'oggetto in input  cerca ed invoca il metodo setter corrispondente 
	 * (per nome e tipo di paramtro passato in ingresso)sull'oggetto di output 
	 * 
	 * @param input  Oggetto in ingresso su cui vengono richiamate le get  
	 * @param output Oggetto in uscita su cui vengono chiamate le set
	 */
	
	public static void remap(Object input, Object output) {
	    
		   if(input == null){
		    throw new UnsupportedOperationException("Attenzione, l'oggetto sorgente da rimappare e' nullo");
		   }
		   if(output == null){
		    throw new UnsupportedOperationException("Attenzione, l'oggetto destinazione del remapper rimappare e' nullo");
		   }
		   
		    Method[] methods = input.getClass().getMethods();
		    Method sourceMethod = null;
		    Method destMethod = null;
		    String sourceMethodName = "";
		    String destMethodName = "";
		    Object sourceMethodReturn = null;
		    boolean invocatoAlmenoUnSetter = false;
		    int numSetterNonEsistenti = 0;
		    
		    for (int i = 0; i < methods.length; i++) {
		      try {
		        sourceMethod = methods[i];
		        //leggo un metodi dell'oggetto in ingresso
		        sourceMethodName = sourceMethod.getName();
		        //se il metodo inizia per is o get
		        if (sourceMethodName.startsWith("get") || sourceMethodName.startsWith("is")) {
		          if (sourceMethodName.startsWith("get")) {
		           
		        	  destMethodName = "set" + sourceMethodName.substring(3);
		           } 
		           else if (sourceMethodName.startsWith("is")) {
		            destMethodName = "set" + sourceMethodName.substring(2);
		           }
		          sourceMethodReturn = sourceMethod.invoke(input, new Object[] {});
		          destMethod = output.getClass().getMethod(destMethodName, new Class[] {sourceMethod.getReturnType()});
		          destMethod.invoke(output, new Object[] { sourceMethodReturn });
		          invocatoAlmenoUnSetter = true;
		        }
		      }
		      catch (NoSuchMethodException nsme) {
		        numSetterNonEsistenti++;
		        //log.debug("===>> Il metodo " + destMethodName + " non esiste nella classe " + output.getClass().getName());
		      }
		      catch (IllegalAccessException iae) {
		        numSetterNonEsistenti++;
		        //log.debug("===>> IllegalAccessException");
		      }
		      catch (InvocationTargetException ite) {
		        numSetterNonEsistenti++;
		        //log.debug("===>> InvocationTargetException");
		      }
		    }   
		    //Se non ho invocato almeno un metodo setter mi sembra che ci sia qualcosa di strano, gli oggetti sono troppo diversi
		    if(!invocatoAlmenoUnSetter){
		       throw new UnsupportedOperationException("Nessun metodo sull'oggetto destinazione "+output.getClass().getName()+" e' stato invocato");
		    }
		    
		    if(numSetterNonEsistenti > 10){
		      throw new UnsupportedOperationException("Piu' di 10 metodi setter non esistenti sull'oggetto output "+output.getClass().getName()+" rispetto all'input"+input.getClass().getName()+ " sicuri che il remapping sia corretto?");
		    }
		  }
}
