/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util.reflection;

import java.lang.annotation.Annotation;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;

/**
 * Reflection utilities
 */
public class ReflectionUtils {

	/** Prevent instantiation */
	private ReflectionUtils() {
		// Prevent instantiation
	}

	/**
	 * crea una istanza di un oggetto la cui classe e' passata in input
	 * @param <R>
	 * @param clazz
	 * @return
	 */
	public static <R> R instantiate(Class<R> clazz) {
		//@SuppressWarnings("unchecked")
		//Class<R> responseClass = (Class<R>) GenericTypeResolver.resolveActualTypeArgs(getClass(), BaseService.class)[1];
		try {
			// Refactored for Java 11
			Constructor<R> constructor = clazz.getDeclaredConstructor();
			constructor.setAccessible(true);
			return constructor.newInstance();
		} catch (RuntimeException | InstantiationException | IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
			throw new IllegalStateException("Cannot initialize clazz"+clazz.getName(), e);
		}
	}
	
	/**
	 * Retrieves a field by its annotation
	 * @param <A> the annotation type
	 * @param clazz the class
	 * @param annotationClass the annotation
	 * @return the field
	 */
	public static <A extends Annotation> Field getFieldByAnnotation(Class<?> clazz, Class<A> annotationClass) {
		if(clazz == null) {
			return null;
		}
		Field[] fields = clazz.getDeclaredFields();
		for(Field field : fields) {
			A annotation = field.getAnnotation(annotationClass);
			if(annotation != null) {
				return field;
			}
		}
		return getFieldByAnnotation(clazz.getSuperclass(), annotationClass);
	}
	
	
	public static <A extends Annotation> List<Field> getFieldsByAnnotation(Class<?> clazz, Class<A> annotationClass) {
		if(clazz == null) {
			return null;
		}
		List<Field> listFields = new ArrayList<Field>();
		for(Field field : clazz.getDeclaredFields()) {
			A annotation = field.getAnnotation(annotationClass);
			if(annotation != null) {
				listFields.add(field);
			}
		}
		if(clazz.getSuperclass()!=null) {
			listFields.addAll(getFieldsByAnnotation(clazz.getSuperclass(), annotationClass));
		}
		return listFields;
	}
	
	

	public static List<Field> getFields(Object o) {
		if(o == null) {
			return null;
		}
		return getFields(o.getClass());
	}
	
	public static List<Field> getFields(Class<?> clazz) {
		if(clazz == null) {
			return null;
		}
		List<Field> listFields = new ArrayList<Field>();
		for(Field field : clazz.getDeclaredFields()) {
				listFields.add(field);
		}
		if(clazz.getSuperclass()!=null) {
			listFields.addAll(getFields(clazz.getSuperclass()));
		}
		return listFields;
	}
	
	
	
	public static Object getFieldValueByName(Object o, String fieldName) {
		 try {
			Field field = o.getClass().getDeclaredField(fieldName);
			 field.setAccessible(true);
			 return field.get(o);
		} catch (Exception e) {
			throw new UnsupportedOperationException("Exception nel recupero del valore del field "+fieldName
					+" su oggetto " + o + " di tipo " + (o!=null?o.getClass().getName():"nullo"), e);
		}
	}
	
	public static void toUpperCaseFields(Object o){
		if(o==null) return;
		try {
			for(Field f: getFields(o)) {            
				if(f.getType().equals(String.class)) { 
					f.setAccessible(true);
					String actualValue = (String) f.get(o);
					if(actualValue!=null) {
						f.set(o, actualValue.toUpperCase());
					}
				}           
			}
		} catch (Exception e) {
			throw new UnsupportedOperationException("Exception nella conversione in uppercase su oggetto " + o + " di tipo " + (o!=null?o.getClass().getName():"nullo"), e);
		}
	}

}
