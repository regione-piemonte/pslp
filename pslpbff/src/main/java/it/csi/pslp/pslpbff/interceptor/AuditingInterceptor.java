/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.interceptor;

import java.io.Serializable;
import java.util.Arrays;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.common.CommonResponse;
import it.csi.pslp.pslpbff.api.impl.generic.CsiLogAuditManager;
import it.csi.pslp.pslpbff.integration.entity.CsiLogAudit;
import it.csi.pslp.pslpbff.util.CommonUtils;
import it.csi.pslp.pslpbff.util.JsonUtils;
import it.csi.pslp.pslpbff.util.PslpConstants;
import it.csi.pslp.pslpbff.util.PslpThreadLocalContainer;
import it.csi.pslp.pslpbff.util.ResponseUtils;
import it.csi.pslp.pslpbff.util.TimeUtils;
import it.csi.util.performance.StopWatch;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import jakarta.ws.rs.core.Response;

@Audited
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class AuditingInterceptor implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Inject
    CsiLogAuditManager csiLogAuditManager;

		
	@AroundInvoke
	public Object logExecution(InvocationContext invocationContext) throws Exception {

		boolean esito = true;
		String methodName = invocationContext.getMethod().getName();
		String classAndMethodInfo = "[" + invocationContext.getMethod().getDeclaringClass().getSimpleName()+"::"+methodName+ "]"; 
		Response response = null;
		
		StopWatch watcher = startStopWatch();
		Log.info(classAndMethodInfo + " START");
		try {
			response = (Response) invocationContext.proceed();
			return response;
		}
		catch (Throwable e) {
			
			esito = false;
			Log.error(classAndMethodInfo + " Exception of type " + e.getClass().getSimpleName(), e);
			e.printStackTrace();
			return Response
					.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ResponseUtils
							.createJSONResponseMessage(Response.Status.INTERNAL_SERVER_ERROR.name(), e.getClass().getSimpleName()))
					.build();

		} finally {
			CommonResponse cr = (response!=null && response.getEntity() instanceof CommonResponse) ?(CommonResponse)response.getEntity():null;
			//Log.info(classAndMethodInfo + " END --> response=" + cr);
			stopStopWatch(watcher, invocationContext);
			String cf = PslpThreadLocalContainer.IDENTITA.get()!=null?PslpThreadLocalContainer.IDENTITA.get().getCodFiscale():null;
			insertCsiLogAudit(esito, methodName, invocationContext.getParameters(),
					cr, cf , PslpThreadLocalContainer.CALLER_IP.get());
		}
	}

	private StopWatch startStopWatch() {
		StopWatch watcher = null;
		//if(!"dev".equals(ProfileManager.getActiveProfile())) {
			watcher = new StopWatch(PslpConstants.LOGGER_NAME);
			watcher.start();
		//}
		return watcher;

	}

	private void stopStopWatch(StopWatch watcher, InvocationContext invocationContext) {
		if (watcher != null) {
			watcher.dumpElapsed(CommonUtils.truncClassName(invocationContext.getMethod().getDeclaringClass()),
					invocationContext.getMethod().getName() + "()",
					"invocazione API " + CommonUtils.truncClassName(invocationContext.getMethod().getDeclaringClass())
							+ "." + invocationContext.getMethod().getName(),
					"");
			watcher.stop();
		}
	}

	

	private <R extends CommonResponse> void insertCsiLogAudit(boolean esito, String operazione, Object[] oggOper, 
															  R result, String codiceFiscale, String ipAddress) {
		try {
			Log.debug("[" + getClass().getSimpleName() + "::insertCsiLogAudit] BEGIN");

			CsiLogAudit log = new CsiLogAudit();
			log.setOperazione(operazione);
			String esitoStr = PslpConstants.OK;
			if (result == null || !result.getEsitoPositivo()) {
				esitoStr = PslpConstants.KO + " - "
						+ (result != null ? ResponseUtils.retrieveErrorsAsString(result) : "Response nulla");
			}
			
			Object[] parameter = null;
			if (oggOper != null && oggOper.length>3)				
				parameter = Arrays.copyOf(oggOper,oggOper.length-3);				
			

			log.setOggOper(CommonUtils.troncaStringa(checkNvlJson(parameter), 3999));
			log.setDataOra(TimeUtils.now());
			log.setIdApp(PslpConstants.COMPONENT_NAME);
			log.setUtente(checkNvl(codiceFiscale)); // cod_fiscale_utente_iride
			log.setIpAddress(checkNvl(ipAddress));
			log.setKeyOper(CommonUtils.troncaStringa(esitoStr, 2000));
			csiLogAuditManager.log(log);
		} finally {
			Log.debug("[" + getClass().getSimpleName() + "::insertCsiLogAudit] END");
		}
	}

	private String checkNvlJson(Object o) {
		return o == null ? "null" :   JsonUtils.toJson(o);
	}
	
	private String checkNvl(Object o) {
		return o == null ? "null" :   o.toString();
	}
	

}
