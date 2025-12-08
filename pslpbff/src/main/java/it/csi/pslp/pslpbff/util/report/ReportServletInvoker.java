/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util.report;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;

/**
 * Invoker for the report servlet
 */
public class ReportServletInvoker {
	
	/**
	 * Invoca la servlet di birt
	 * 
	 * @param endpoint the endpoint
	 * @param reportName the report name
	 * @param formatFile the file format
	 * @param formData the data
	 * @return the received bytes
	 * @throws ClientProtocolException in case of an exception from the HTTP client
	 * @throws IOException in case of an IO exception
	 */
	public byte[] invoke(String endpoint, String reportName, String formatFile, Map<String, String> formData) throws ClientProtocolException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();

		String urlpost = endpoint + "?__report=" + reportName + "&__format=" + formatFile + "&__asattachment=true";
		HttpPost httpPost = new HttpPost(urlpost);
		List<NameValuePair> params = new ArrayList<>();
		for (Entry<String, String> entry : formData.entrySet()) {
			params.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
		}
		httpPost.setEntity(new UrlEncodedFormEntity(params));
		try (CloseableHttpResponse httpResponse = httpclient.execute(httpPost)) {
			httpResponse.getFirstHeader("Content-Disposition");
			httpResponse.getStatusLine().getStatusCode();
			//return IOUtils.toByteArray(httpResponse.getEntity().getContent());

		    return httpResponse.getEntity().getContent().readAllBytes();
		    
		}
	}
}
