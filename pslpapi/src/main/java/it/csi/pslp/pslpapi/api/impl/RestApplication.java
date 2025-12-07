/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.impl;


import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import io.swagger.v3.jaxrs2.integration.JaxrsOpenApiContextBuilder;
import io.swagger.v3.oas.integration.OpenApiConfigurationException;
import io.swagger.v3.oas.integration.SwaggerConfiguration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.ext.Provider;


@ApplicationPath("/")
@Provider
public class RestApplication extends Application {

	
	@SuppressWarnings("rawtypes")
	public RestApplication() {
        super();
        OpenAPI oas = new OpenAPI();
        
        oas.components(new Components().addSchemas("Map", new Schema<Map<String, Object>>().addProperty("< * >", new ObjectSchema())));
        
        Info info = new Info()
            .title("pslpapi")
            .description("API per pslpapi")
            .version("1.0.0");
        oas.info(info);
        
        
        Set<String> resourcePackages = new HashSet<String>();
        resourcePackages.add("it.csi.pslp.pslpapi.api");
        
        SwaggerConfiguration oasConfig = new SwaggerConfiguration()
            .openAPI(oas)
            .prettyPrint(true)
            .resourcePackages(resourcePackages);    
        

        try {
            new JaxrsOpenApiContextBuilder()
                .application(this)
                .openApiConfiguration(oasConfig)
                .buildContext(true);
        } catch (OpenApiConfigurationException e) {
            throw new RuntimeException(e.getMessage(), e);
        }

    }
	
}