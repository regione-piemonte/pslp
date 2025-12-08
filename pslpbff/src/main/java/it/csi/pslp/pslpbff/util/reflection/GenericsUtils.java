/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util.reflection;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

/**
 * Reflection utilities
 */
public class GenericsUtils {

	/** Prevent instantiation */
	private GenericsUtils() {
		// Prevent instantiation
	}

	/**
	 * Data l'istanza di un classe che nella dichiarzione usa i generics es: public class DAO<T,K>
	 * ritorna la classe specifica di uno dei generics in quel momento di esecuzione in base all'indice es: 0 per T , 1 per K 
	 * 
	 * Se pero' l'istanza specifica non e' ancora definita torno null
	 * @param <T>
	 * @param instanceWithGenerics
	 * @param position
	 * @return
	 */
	public static <T> Class<T> getClassOfGenericAtPosition(Object instanceWithGenerics,int positionZeroBased){
			Type type = instanceWithGenerics.getClass().getGenericSuperclass();
			if(type instanceof ParameterizedType) {
				return (Class<T>) ((ParameterizedType) type).getActualTypeArguments()[positionZeroBased];
			}
			return null;
	}	
	
}
