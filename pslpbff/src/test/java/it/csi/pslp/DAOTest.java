/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;
package it.csi.pslp;

import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import it.csi.pslp.pslpbff.integration.dao.generic.DAO;
import it.csi.pslp.pslpbff.util.QueryFilter;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;


@QuarkusTest
@TestProfile(LocalTestProfile.class)
public class DAOTest {

	
	@Inject
	DAO dao;
	
	@Test
	public void testQueryNativaOracle() {
		try {
			so("testQueryNativaOracle BEGIN");
		
			String sql = 
					"select e.id_sil_lav_anagrafica id,e.cod_fiscale desc1, e.ds_cognome desc2\n" +
							"from\n" + 
							"SIL_LAV_ANAGRAFICA e\n" + 
							"where e.ds_cognome like '%'||:pDescriz||'%'\n" + 
							"{if(:numMaxRecord) and rownum <= :numMaxRecord}";


			
			
			HashMap<String, Object> params = new HashMap<String, Object>();
			params.put("pDescriz","OLD");
			params.put("numMaxRecord",10L);
			List<CustomQueryResultForTest> result = dao.findNativeQuery(sql, CustomQueryResultForTest.class, params);
			
			so("result="+result);
			
			so("testQueryNativaOracle END");
		} catch (Exception e) {
			e.printStackTrace();
			Assertions.fail();
		}
	}
	
	@Test
	public void testQueryNativaOracleFromFile() {
		try {
			so("testQueryNativaOracle BEGIN");
		
			String sql = "query.findOracle";
			QueryFilterForTest params = new QueryFilterForTest();
			params.setpDescriz("PAUTASSO");
			//params.setNumMaxRecord(10L); //Per postgres metto nullo, non esiste il rownum
			List<CustomQueryResultForTest> result = dao.findNativeQuery(sql, CustomQueryResultForTest.class, params);
			
			so("result="+result);
			
			so("testQueryNativaOracle END");
		} catch (Exception e) {
			e.printStackTrace();
			Assertions.fail();
		}
	}
	
	

	protected void so(Object s) {
		System.out.println(s!=null?s.toString():null);
	}
	
	
	
	
}
