/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;
package it.csi.pslp;

import java.util.HashMap;
import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

public class LocalTestProfile implements QuarkusTestProfile { 

/**
 * imposta il profilo di lancio del test.
 * IN tal modo usera' il puntamento a db devinito in application.prperties alla voce %dev.quarkus.datasource.jdbc.url
 * a meno che venga ridefinito nel metodo getConfigOverrides
 */
	@Override
	public String getConfigProfile() {
		return "dev";
	}
	
	/**
     * Returns additional config to be applied to the test. This
     * will override any existing config (including in application.properties),
     * however existing config will be merged with this (i.e. application.properties
     * config will still take effect, unless a specific config key has been overridden).
     *
     * Considera comunque quelle definite in application-dev.properties che aggiungono o sostituiscono quelle di default in application.properties
     * per profilo dev
     */
    @Override
    public Map<String, String> getConfigOverrides() {
        Map<String, String> m = new HashMap<String, String>();
        
        
        
        /*
        m.put("quarkus.datasource.jdbc.driver","net.sf.log4jdbc.DriverSpy");
        
        //Per oracle
        m.put("quarkus.datasource.jdbc.url", "jdbc:log4jdbc:oracle:thin:@//tst-ordb12c.organizzazione.it:1521/ORCLPDB1");
        */
        //Per postgres
//        m.put("quarkus.datasource.jdbc.url", "jdbc:log4jdbc:postgresql://host.organizzazione.it:5432/PostgresqlDB");
//        m.put("quarkus.datasource.username", "username");
//        m.put("quarkus.datasource.password", "");
        
//        m.put("quarkus.log.level","INFO");
//        
//        m.put("quarkus.log.category.\"jdbc.connection\".level","WARN");
//        m.put("quarkus.log.category.\"jdbc.audit\".level","WARN");
//        m.put("quarkus.log.category.\"jdbc.resultset\".level","WARN");
//        m.put("quarkus.log.category.\"jdbc.sqlonly\".level","INFO");   //attivare questo a INFO per log query
//        m.put("quarkus.log.category.\"jdbc.sqltiming\".level","WARN"); //attivare questo a INFO per log query con tempo esecuzione
//        m.put("quarkus.hibernate-orm.dialect","org.hibernate.dialect.Oracle10gDialect");

        		
        return m;
    }

    
}
