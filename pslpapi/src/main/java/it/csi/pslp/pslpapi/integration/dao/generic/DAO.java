/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.integration.dao.generic;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import it.csi.pslp.pslpapi.util.CommonUtils;
import it.csi.pslp.pslpapi.util.reflection.ReflectionUtils;
import jakarta.enterprise.context.Dependent;
import jakarta.persistence.Parameter;
import jakarta.persistence.Query;

@Dependent
public class DAO extends PanacheEntityBase implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * Esegue una query nativa scritta per il database utilizzato. Puo' utilizzare i
	 * placeholder nel formato :nomeCampo che poi verranno sostituiti con
	 * l'effettivo valore del campo corrispondente del bean in input.
	 * 
	 * Il risultato puo' essere mappato in un entity di output che deve avere TANTI
	 * CAMPI QUANTI QUELLI RESTITUITI DALLA QUERY CON ALIAS CORRISPONDENTI La classe
	 * dell'entity in output deve avere necessariamente un campo @Id ma non deve
	 * essere legato ad alcuna tabella. Vedi DecodificaEntity
	 * 
	 * Gestisce anche condizioni del tipo {if(:nomeCampo) AND COLONNA = :nomeCampo}
	 * 
	 * che si attivano nella query solo se il valore di nomeCampo e' !=null
	 * 
	 * @param qryNameOrSql
	 * @param resultCustomEntityClass
	 * @param beanParams
	 * @return
	 */
	public <E> List<E> findNativeQuery(String sql, Class<E> resultCustomEntityClass, Object beanParams) {
		return findNativeQueryPrivate(sql, resultCustomEntityClass, null, beanParams);
	}

	/**
	 * Come sopra ma in input una map di placeholder e valori
	 * 
	 * @param <E>
	 * @param qryNameOrSql
	 * @param resultCustomEntityClass
	 * @param params
	 * @return
	 */
	public <E> List<E> findNativeQuery(String qryNameOrSql, Class<E> resultCustomEntityClass,
			Map<String, Object> params) {
		return findNativeQueryPrivate(qryNameOrSql, resultCustomEntityClass, params, null);
	}

	@SuppressWarnings("unchecked")
	public <E> List<E> findQueryJpql(String qryNameOrSql, Map<String, Object> params, Object beanParams) {
		Query query = loadQueryJpqlAndSetParams(qryNameOrSql, params, beanParams);
		return query.getResultList();
	}

	public int executeUpdateJpql(String qryNameOrSql, Map<String, Object> params, Object beanParams) {
		Query query = loadQueryJpqlAndSetParams(qryNameOrSql, params, beanParams);
		return query.executeUpdate();
	}

	private Query loadQueryJpqlAndSetParams(String qryNameOrSql, Map<String, Object> params, Object beanParams) {
		String sql = loadSqlFromFileIfNecessary(qryNameOrSql);
		sql = replaceConditionalSectionsInStatement(sql, beanParams);
		Query query = getEntityManager().createQuery(sql);
		// Sostituisco eventuali condizioni if valutando il valore del bean
		if (params != null) {
			for (Map.Entry<String, Object> e : params.entrySet()) {
				query.setParameter(e.getKey(), e.getValue());
			}
		} else if (beanParams != null) {
			setProperties(query, beanParams);
		}
		return query;
	}

	/**
	 * Implementazione privata per eseguire una query nativa con input bean o
	 * hashmap e rimappi il risultato in un oggetto di tipo E
	 * 
	 * @param qryNameOrSql
	 * @param resultCustomEntityClass
	 * @param params
	 * @param beanParams
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private <E> List<E> findNativeQueryPrivate(String sql, Class<E> resultCustomEntityClass, Map<String, Object> params,
			Object beanParams) {
		validateQueryParams(params, beanParams);
		sql = loadSqlFromFileIfNecessary(sql);
		sql = replaceConditionalSectionsInStatement(sql, (beanParams != null ? beanParams : params));
		Query query = getEntityManager().createNativeQuery(sql, resultCustomEntityClass);
		// Sostituisco eventuali condizioni if valutando il valore del bean
		if (params != null) {
			for (Map.Entry<String, Object> e : params.entrySet()) {
				query.setParameter(e.getKey(), e.getValue());
			}
		} else if (beanParams != null) {
			setProperties(query, beanParams);
		}
		return query.getResultList();
	}

	/**
	 * Lancia exception nel caso una query riceva parametri sia come map che come
	 * pojo
	 * 
	 * @param params
	 * @param beanParams
	 */
	protected void validateQueryParams(Map<String, Object> params, Object beanParams) {
		if (CommonUtils.isAllNotVoid(params, beanParams)) {
			throw new IllegalArgumentException(
					"i Parametri della query devono essere valorizzati cono come Map<String, Object> o solo come oggetto pojo");
		}
	}

	/**
	 * Sostituisce in uno statement sql le sezioni dinamiche gestite come if
	 * valutando se il valore del placeholder e' diverso da null e sostituendo la
	 * parte successiva dell'if
	 * 
	 * es: condizione nella query: {if(:dataNascita) and trunc(tabella.d_nascita) =
	 * :dataNascita} group(0): {if(:dataNascita) and trunc(tabella.d_nascita) =
	 * :dataNascita} group(1): dataNascita group(2): and trunc(tabella.d_nascita) =
	 * :dataNascita
	 * 
	 *
	 */
	@SuppressWarnings("rawtypes")
	private static String replaceConditionalSectionsInStatement(String sql, Object params) {

		if (sql.indexOf("{if(:") >= 0) {
			Pattern pattern = Pattern.compile("\\{if\\(:([a-zA-Z0-9_]*)\\)(([^{]*))\\}");
			boolean ifConditionExists = true;
			while (ifConditionExists) {
				Matcher matcher = pattern.matcher(sql);
				if (matcher.find()) {
					String ifCondition = matcher.group(0);
					String placeholderName = matcher.group(1);
					String conditionToActivate = matcher.group(2);
					Object fieldValue = null;
					if (params instanceof Map) {
						fieldValue = ((Map) params).get(placeholderName);
					} else {
						fieldValue = ReflectionUtils.getFieldValueByName(params, placeholderName);
					}
					String replacement = (fieldValue == null ? "" : conditionToActivate);
					sql = sql.replace(ifCondition, replacement);
				} else
					ifConditionExists = false;
			}
		}
		return sql;
	}

	/**
	 * Imposta i parametri in una query valutando i field si una classe e
	 * impostandone i valori nei rispettivi placeholders
	 * 
	 * @param query
	 * @param beanParams
	 */
	private static void setProperties(Query query, Object beanParams) {
		for (Parameter<?> p : query.getParameters()) {
			query.setParameter(p.getName(), ReflectionUtils.getFieldValueByName(beanParams, p.getName()));
		}
	}

	/**
	 * Valuta il nome in input, se rappresenta uno statement sql lo ritorna. Se
	 * rappresenta invece il nome file properties e nome query da utilizzare (es:
	 * nomefile.nomequery) carica il file e contenuto della query cercando il file
	 * prima nella posizione della classe chiamante, altrimenti dal path base
	 * 
	 * @param qryNameOrSql
	 * @return
	 */
	private String loadSqlFromFileIfNecessary(String qryNameOrSql) {
		// rappresenta gia' uno statement SQL lo ritorno com'e'
		if (qryNameOrSql.trim().indexOf(' ') > 0)
			return qryNameOrSql;

		// Altrimenti arriva qualcosa tipo: nomefile.nomequery
		String fileName = qryNameOrSql.substring(0, qryNameOrSql.indexOf(".")) + ".properties";

		String queryName = qryNameOrSql.substring(qryNameOrSql.indexOf(".") + 1, qryNameOrSql.length());

		// tentativo 1: cerco il file con le query nella cache
		Properties queryFile = null;

		if (queryFile == null) {
			// tentativo 2: cerco il file nello stesso percorso della classe DAO chiamante
			InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("/sql/" + fileName);

			// tentativo 3: cerco dal path completo passato in ingresso
			if (is == null) {
				is = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
			}

			if (is == null) {
				throw new UnsupportedOperationException(
						"file not found in : /sql/" + fileName + " or (absolute path) " + fileName);
			}

			try {
				queryFile = new Properties();
				queryFile.load(is);
			} catch (IOException e) {
				throw new UnsupportedOperationException(
						"Exception in caricamento file /sql/" + fileName + " or (absolute path) " + fileName, e);
			}
		}
		return queryFile.getProperty(queryName);
	}

	/**
	 * Metodo di utilita' per fornire una mappa in output con key nome field e
	 * valore il valore del field prelevandoli da un generico oggetto. Considera
	 * solo quelli con valori non nulli
	 * 
	 * @param beanParams
	 * @return
	 */
	public static Map<String, Object> beanToParamsMap(Object beanParams) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		for (Field f : ReflectionUtils.getFields(beanParams)) {
			Object fieldValue = ReflectionUtils.getFieldValueByName(beanParams, f.getName());
			if (fieldValue != null) {
				paramMap.put(f.getName(), fieldValue);
			}
		}
		return paramMap;
	}

}
