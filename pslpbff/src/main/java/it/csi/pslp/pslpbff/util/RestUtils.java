/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util;


import io.quarkus.logging.Log;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.client.*;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;


import java.util.Base64;

@RequestScoped
public class RestUtils {



    public final static String NOME_APPLICATIVO = "PSLP";

    private Client client = ClientBuilder.newClient();

    public Response chiamateGet(UriInfo uriInfo,String endpoint) {
        WebTarget target = commonStuff(uriInfo,endpoint);
        return target.request().get();
    }
    public Response chiamateGet(UriInfo uriInfo,String endpoint,String username,String password) {
        WebTarget target = commonStuff(uriInfo,endpoint);
        return target.request().header("Authorization",
                        "Basic " + Base64.getEncoder()
                                .encodeToString(String.format("%s:%s", username, password).getBytes()))
                .get();
    }

    public Response chiamatePost(UriInfo uriInfo, Object body,String endpoint,String username,String password) {
        WebTarget target = commonStuff(uriInfo,endpoint);

        return target.request().header("Authorization",
                "Basic " + Base64.getEncoder()
                        .encodeToString(String.format("%s:%s", username, password).getBytes()))
                .post(Entity.json(body));
    }

    public Response chiamateDelete(UriInfo uriInfo,String endpoint) {
        WebTarget target = commonStuff(uriInfo,endpoint);
        return target.request().delete();
    }

    public Response chiamatePut(UriInfo uriInfo, Object body,String endpoint,String username,String password) {
        WebTarget target = commonStuff(uriInfo,endpoint);

        return target.request().header("Authorization",
                "Basic " + Base64.getEncoder()
                        .encodeToString(String.format("%s:%s", username, password).getBytes()))
                .put(Entity.json(body));
    }

    public Response chiamatePut(UriInfo uriInfo,String endpoint) {
        WebTarget target = commonStuff(uriInfo,endpoint);

        return target.request().put(Entity.json(null));
    }



    private WebTarget commonStuff(UriInfo uriInfo,String endpoint) {
        MultivaluedMap<String, String> queryParams = uriInfo.getQueryParameters();

        String url = uriInfo.getPath().replace("api/v1/", "");
        if(url.contains("decodifica-blp")){
            url = url.replace("-blp", "");
        }
        if(url.contains("annunci-pslp")){

        	url = url.replace("-public","");
            url = url.replace("-pslp", "");
            url = url.replace("api/v1/", "");
        }
        Log.info(uriInfo.getPath());

        WebTarget target = client.target(endpoint + url);
        Log.info(target);
        if (queryParams != null && !queryParams.isEmpty()) {
            for (String key : queryParams.keySet()) {
                target = target.queryParam(key, queryParams.get(key).toArray()[0]);
            }
        }
        return target;
    }
}
