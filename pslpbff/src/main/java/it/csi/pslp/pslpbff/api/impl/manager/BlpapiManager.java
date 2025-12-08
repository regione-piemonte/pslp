/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.impl.manager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.Decodifica;
import it.csi.pslp.pslpbff.api.dto.blp.ApiMessage;
import it.csi.pslp.pslpbff.api.dto.blp.CommonRequest;
import it.csi.pslp.pslpbff.api.dto.blp.DecodificaListResponse;
import it.csi.pslp.pslpbff.api.dto.blp.DecodificaResponse;
import it.csi.pslp.pslpbff.api.dto.mappers.blp.DecodificaBlpMapper;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@RequestScoped
public class BlpapiManager extends BaseApiServiceImpl {
    @ConfigProperty(name = "blpapi.url")
    String blpapiUrl;

    @ConfigProperty(name = "blpapi.user")
    String blpapiUser;

    @ConfigProperty(name = "blpapi.password")
    String blpapiPassword;

    @Inject
    DecodificaBlpMapper decodificaBlpMapper;
    public List<Decodifica> getDecodificaList(String url, CommonRequest body){

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            DecodificaListResponse decodificaListResponse = post(url, ow.writeValueAsString(body),blpapiUser,blpapiPassword, it.csi.pslp.pslpbff.api.dto.blp.DecodificaListResponse.class);

            if (decodificaListResponse.isEsitoPositivo()) {

                return decodificaBlpMapper.toModels(decodificaListResponse.getList());

            }
            else {
                Log.error("Errore chiamata blpapi");
                if (decodificaListResponse.getApiMessages() != null) {
                    for(ApiMessage msg : decodificaListResponse.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }
            }

        } catch (Exception e) {
            Log.error("Errore chiamata silpapi", e);
        }

        return null;

    }

    public Decodifica getDecodifica(String url, CommonRequest body){

        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            DecodificaResponse decodificaResponse = post(url, ow.writeValueAsString(body),blpapiUser,blpapiPassword, it.csi.pslp.pslpbff.api.dto.blp.DecodificaResponse.class);

            if (decodificaResponse.isEsitoPositivo()) {

                return decodificaBlpMapper.toModel(decodificaResponse.getDecodifica());

            }
            else {
                Log.error("Errore chiamata blpapi");
                if (decodificaResponse.getApiMessages() != null) {
                    for(ApiMessage msg : decodificaResponse.getApiMessages()) {
                        Log.error(msg.getMessage());
                    }
                }
            }

        } catch (Exception e) {
            Log.error("Errore chiamata blpapi", e);
        }

        return null;

    }
}
