/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;
package it.csi.pslp.nonregressione;

import org.junit.jupiter.api.Test;

import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.quarkus.test.security.TestSecurity;
import it.csi.pslp.LocalTestProfile;
import it.csi.pslp.TestLocalAbstract;
import it.csi.pslp.pslpbff.api.PingApi;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

/**
 * Classe di test per provare i metodi delle API service con gestione connessioni locale
 * questo in particolare per i metodi relativi alle aziende
 * @author 1871
 *
 */
@QuarkusTest
@TestProfile(LocalTestProfile.class)
@TestTransaction
//@TestSecurity(authorizationEnabled = false) //attivando questa non vengono effettuti i controlli di sicurezza sui metodi
@TestSecurity(user = "admin", roles = {"user"}) // attivando questi anche sullo specifico metodo si testa un ruolo specifico
public class TestNonRegressioneLocalApiPing extends TestLocalAbstract {

	//lasciare le interfacce e non gli impl. Nei test con transazioni vengono proxate 
	@Inject
	protected PingApi pingApi;
	

	/**
	 * Verifica il blocco in caso di codice applicativo chaimante non censito
	 */
	@Test
	public void testPing() {
		Response r = pingApi.ping( null, null, getMockRequest());
		String cr = (String) r.getEntity();
		printJson(cr);
		assertTrue(cr.startsWith("PING OK - PROFILO=dev, QUARKUS=3."));
		so("testPing done");
	}
	

}
