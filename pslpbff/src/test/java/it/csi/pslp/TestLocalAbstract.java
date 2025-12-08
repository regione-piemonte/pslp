/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;
package it.csi.pslp;

import java.util.Date;

import org.junit.jupiter.api.Assertions;

import it.csi.pslp.pslpbff.api.dto.common.CommonResponse;
import it.csi.pslp.pslpbff.util.JsonUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Response;


public abstract class TestLocalAbstract  {



	protected void so(Object s) {
	    	System.out.println(s!=null?s.toString():null);
	    }

	    protected void printJson(Object s) {
	    	so(JsonUtils.toJson(s));
		}


	    protected HttpServletRequest getMockRequest() {
			return null; //In quarkus... per ora non serve
		}

	  

	

	    
	    

	    
	    protected CommonResponse getEntity(Response r){
			return (CommonResponse) r.getEntity();
		}

	    protected void assertTrue(boolean b) {
	    	Assertions.assertTrue(b);

		}




	    protected void assertNotNull(Object s) {
			Assertions.assertNotNull(s);
		}

	    protected void assertNull(Object s) {
			Assertions.assertNull(s);
		}


	    protected void assertEquals(String s, String s2) {
	    	Assertions.assertEquals(s,s2);
		}

	    protected void assertEquals(Long s, Long s2) {
	    	Assertions.assertEquals(s,s2);
		}

	    protected void assertEquals(int s, int s2) {
	    	Assertions.assertEquals(s,s2);
		}

	    protected void assertEquals(Date d, Date d2) {
	    	Assertions.assertEquals(d,d2);
		}

}
