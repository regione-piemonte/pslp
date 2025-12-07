/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.util;

import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.ManyToOne;

public class QueryUtils {

	private final Class<?> entity;
	private final StringBuffer query;
	private final Map<String, Object> params;
	
	private static final SimpleDateFormat sqlNativeDateFormat = new SimpleDateFormat("yyyy-MM-dd");

	public QueryUtils() {
		this(null);
	}
	
	/*
	 * Nel caso non si vuole usare la project di Panashe per utilizzare le left join 
	 */
	public QueryUtils(Class<?> entity) {
		this.entity = entity;
		params = new HashMap<String, Object>();
		query = new StringBuffer();
	}
	
	public void addNativeParameter(String paramName, Object obj) {
		params.put(paramName, obj);
	}

	public QueryUtils openBrackets() {
		query.append(" (");
		return this;
	}

	public QueryUtils closeBrackets() {
		query.append(")");
		return this;
	}
	
	
	public QueryUtils sql(String sql) {
		query.append(sql);
		return this;
	}


	public QueryUtils addInParameterAnd(String name, List<?> values) {
		return addInParameter("and", name, values);
	}

	public QueryUtils addInParameterOr(String name, List<?> values) {
		return addInParameter("or", name, values);
	}
	
	public QueryUtils addNotInParameterAnd(String name, List<?> values) {
		return addNotInParameter("and", name, values);
	}

	public QueryUtils addNotInParameterOr(String name, List<?> values) {
		return addNotInParameter("or", name, values);
	}

	public QueryUtils addParameterAnd(String name, Object value) {
		return addParameterAnd(name, value, Operatore.UGUALE, true);
	}
	
	public QueryUtils addParameterAnd(String name, Object value, boolean upper) {
		return addParameterAnd(name, value, Operatore.UGUALE, upper);
	}
	
	public QueryUtils addParameterAnd(String name, Object value, Operatore operatore) {
		addParameter("and", name, value, operatore, true);
		return this;
	}

	public QueryUtils addParameterAnd(String name, Object value, Operatore operatore, boolean upper) {
		addParameter("and", name, value, operatore, upper);
		return this;
	}


	public QueryUtils addParameterNullAnd(String name) {
		addParameterNull("and", name);
		return this;
	}

	public QueryUtils addParameterOr(String name, Object value) {
		return addParameterAnd(name, value, Operatore.UGUALE, true);
	}
	
	public QueryUtils addParameterOr(String name, Object value, boolean upper) {
		return addParameterAnd(name, value, Operatore.UGUALE, upper);
	}

	public QueryUtils addParameterOr(String name, Object value, Operatore operatore) {
		addParameter("or", name, value, operatore);
		return this;
	}

	public QueryUtils addParameterNullOr(String name) {
		addParameterNull("or", name);
		return this;
	}

	public QueryUtils addDataContitionOrNullAnd(String name, Date value) {
		addDataOrNull("and", name, value, Operatore.UGUALE);
		return this;
	}

	public QueryUtils addDataContitionOrNullAnd(String name, Date value, Operatore operatore) {
		addDataOrNull("and", name, value, operatore);
		return this;
	}

	public QueryUtils addDataContitionOrNullOr(String name, Date value) {
		addDataOrNull("or", name, value, Operatore.UGUALE);
		return this;
	}

	public QueryUtils addDataContitionOrNullOr(String name, Date value, Operatore operatore) {
		addDataOrNull("or", name, value, operatore);
		return this;
	}

	public QueryUtils addValidRangeDateAnd(String dateStartName, String dateEndName, Date value) {
		addValidRangeDate("and", dateStartName, dateEndName, value);
		return this;
	}

	public QueryUtils addValidRangeDateOr(String dateStartName, String dateEndName, Date value) {
		addValidRangeDate("or", dateStartName, dateEndName, value);
		return this;
	}

	public QueryUtils addRangeDateAnd(String dateName, Date startDate, Date endDate) {
		addRangeDate("and", dateName, startDate, endDate);
		return this;
	}

	public QueryUtils addRangeDateOr(String dateName, Date startDate, String dateEndName, Date endDate) {
		addRangeDate("or", dateName, startDate, endDate);
		return this;
	}

	private void addRangeDate(String queryOperator, String dateName, Date startDate, Date endDate) {
		if (startDate == null && endDate == null) {
			return;
		}
		String datePlace = getPlaceholderName(dateName);
		String columnName = getColumnName(dateName);
		if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
			query.append(" " + queryOperator + " ");

		if (startDate != null) {
			query.append(columnName + ">=:" + datePlace + "_start");
			params.put(datePlace + "_start", atStartOfDay(startDate));
		}

		if (endDate != null) {
			
			if (startDate != null)  
				query.append(" and ");
			
			query.append(columnName + "<=:" + datePlace + "_end");
			params.put(datePlace + "_end", atEndOfDay(endDate));
		}
	}

	private void addValidRangeDate(String queryOperator, String dateStartName, String dateEndName, Date value) {
		if (value == null) {
			return;
		}
		
		String dateStartNameColumn = getColumnName(dateStartName);
		String dateEndNameColumn = getColumnName(dateEndName);
		
		String startPlace = getPlaceholderName(dateStartName);
		String endPlace = getPlaceholderName(dateEndName);
		if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
			query.append(" " + queryOperator + " ");
		query.append(dateStartNameColumn + "<=:" + startPlace + " and (" + dateEndNameColumn + ">=:" + endPlace + " or " + endPlace
				+ " is null)");
		params.put(startPlace, atStartOfDay(value));
		params.put(endPlace, atEndOfDay(value));
	}

	private void addParameterNull(String queryOperator, String name) {
		if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
			query.append(" " + queryOperator + " ");
		query.append(getColumnName(name) + " is null ");
	}

	private void addDataOrNull(String queryOperator, String name, Date value, Operatore operatore) {
		if (value == null) {
			return;
		}
		if (!Operatore.UGUALE.equals(operatore) && !Operatore.MAGGIORE_UGUALE_OR_NULL.equals(operatore)
				&& !Operatore.MINORE_UGUALE_OR_NULL.equals(operatore))
			throw new RuntimeException("QueryUtils operatore non valido:" + operatore.name());

		if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
			query.append(" " + queryOperator + " ");

		String namePlace = getPlaceholderName(name);
		String columnName = getColumnName(name);
		params.put(namePlace, atStartOfDay(value));
		query.append("(" + columnName + operatore.getOperatore() + ":" + namePlace + " or " + namePlace + " is null)");
	}
	
	private void addParameter(String queryOperator, String name, Object value, Operatore operatore) {
		addParameter(queryOperator,  name,  value,  operatore, true);
	}

	private void addParameter(String queryOperator, String name, Object value, Operatore operatore, boolean upper) {

		if (Operatore.MAGGIORE_UGUALE_OR_NULL.equals(operatore) || Operatore.MINORE_UGUALE_OR_NULL.equals(operatore)) {
			throw new RuntimeException("QueryUtils operatore non valido:" + operatore.name());
		}

		if (CommonUtils.isNotVoid(value)) {
			if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator)) {
				query.append(" " + queryOperator + " ");
			}

			String namePlace = getPlaceholderName(name);
			String columnName = getColumnName(name);
			if (value instanceof String) {
				if (upper)
					query.append("upper(" + columnName + ") " + operatore.getOperatore() + ":" + namePlace);
				else query.append(columnName + " " + operatore.getOperatore() + ":" + namePlace);

				if (Operatore.LIKE == operatore) {
					params.put(namePlace, "%" + value.toString().trim().toUpperCase() + "%");
				} else if (Operatore.LIKE_START == operatore) {
					params.put(namePlace, value.toString().trim().toUpperCase() + "%");
				} else if (Operatore.LIKE_END == operatore) {
					params.put(namePlace, "%" + value.toString().trim().toUpperCase());
				} else {
					params.put(namePlace, value.toString().toUpperCase());
				}
			} else {
				query.append(columnName + " " + operatore.getOperatore() + ":" + namePlace);
				params.put(namePlace, value);
			}

		}
	}
	
	
	public String addNativeInParameter(String name, List<?> values) {

		String sql = "in (";
		if (values != null && values.size() > 0) {
			for (int i = 0; i < values.size(); i++) {
				sql += " :" + name + i + " ";
				params.put(name + i, values.get(i));
				if (i<values.size()-1)
					sql += ",";
			}
			sql += ") ";
		}
		return sql;
	}
	
	private QueryUtils addInParameter(String queryOperator, String name, List<?> values) {

		if (values != null && values.size() > 0) {
			if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
				query.append(" " + queryOperator + " ");

			String columnName = getColumnName(name);
			
			query.append(columnName + " in (");

			for (int i = 0; i < values.size(); i++) {
				if (values.get(i) instanceof String)
					query.append("'" + values.get(i) + "'");
				else query.append(values.get(i));
				
				if (i<values.size()-1)
					query.append(",");
			}

			query.append(") ");

		}
		return this;
	}
	
	
	private QueryUtils addNotInParameter(String queryOperator, String name, List<?> values) {

		if (values != null && values.size() > 0) {
			if (query.length() > 0 && !query.toString().toLowerCase().trim().startsWith(queryOperator))
				query.append(" " + queryOperator + " ");

			String columnName = getColumnName(name);
			
			query.append(columnName + " not in (");

			for (int i = 0; i < values.size(); i++) {
				if (values.get(i) instanceof String)
					query.append("'" + values.get(i) + "'");
				else query.append(values.get(i));
				
				if (i<values.size()-1)
					query.append(",");
			}

			query.append(") ");

		}
		return this;
	}

	private String getPlaceholderName(String name) {
		int index = name.lastIndexOf(".");
		if (index > 0)
			return name.replaceAll("\\.","_");
		return name;
	}
	
	
	private String getColumnName(String name) {
		if (entity != null) {
			int index = name.lastIndexOf(".");
			if (index <= 0)
				return "e." + name;
		}
		return name;
	}
	
	public static Date atStartOfDay(Date date) {
	    LocalDateTime localDateTime = dateToLocalDateTime(date);
	    LocalDateTime startOfDay = localDateTime.with(LocalTime.MIN);
	    return localDateTimeToDate(startOfDay);
	}
	
	
	public static String atStartOfDayNative(Date date) {
		return "'" + sqlNativeDateFormat.format(date) + " 00:00'";
	}

	public static Date atEndOfDay(Date date) {
	    LocalDateTime localDateTime = dateToLocalDateTime(date);
	    LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
	    return localDateTimeToDate(endOfDay);
	}
	
	public static String atEndOfDayNative(Date date) {
		return "'" + sqlNativeDateFormat.format(date) + " 23:59'";
	}

	private static LocalDateTime dateToLocalDateTime(Date date) {
	    return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	}

	private static Date localDateTimeToDate(LocalDateTime localDateTime) {
	    return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
	}

	public String getQuery() {
		
		if (entity != null) {
			StringBuffer sql = new StringBuffer();
			sql.append(" select e from " + entity.getSimpleName() + " e\n");
			Field[] fields = entity.getDeclaredFields();
			for (Field field : fields) {
				if (field.getAnnotation(ManyToOne.class) != null)
					sql.append(" left join e." + field.getName() + " " + field.getName() + "\n");
			}
			sql.append(" where ");
			sql.append(this.query.toString());
			return sql.toString();
		}		
		return this.query.toString();
	}

	public Map<String, Object> getParams() {
		return this.params;
	}

	public enum Operatore {

		MAGGIORE(">"), MAGGIORE_UGUALE(">="), MINORE("<"), MINORE_UGUALE("<="), UGUALE("="), LIKE("like"),
		LIKE_START("like"), LIKE_END("like"), MAGGIORE_UGUALE_OR_NULL(">="), MINORE_UGUALE_OR_NULL("<="),  DIVERSO("!=");

		private String operatore;

		Operatore(String operatore) {
			this.operatore = operatore;
		}

		public String getOperatore() {
			return operatore;
		}
	}

}
