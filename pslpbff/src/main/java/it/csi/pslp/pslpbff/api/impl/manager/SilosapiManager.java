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
import it.csi.pslp.pslpbff.api.dto.silos.EsitoMessaggio;
import it.csi.pslp.pslpbff.api.dto.silos.Messaggio;
import it.csi.pslp.pslpbff.api.impl.generic.BaseApiServiceImpl;
import it.csi.pslp.pslpbff.util.PslpConstants;
import jakarta.enterprise.context.RequestScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;



@RequestScoped
public class SilosapiManager extends BaseApiServiceImpl {
    @ConfigProperty(name = "silos.url")
    String silosapiUrl;

    @ConfigProperty(name = "silos.user")
    String silosapiUser;

    @ConfigProperty(name = "silos.password")
    String silosapiPassword;

    public EsitoMessaggio inviaMessaggio(Messaggio body){
        try {
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            EsitoMessaggio esitoMessaggio = post(silosapiUrl + PslpConstants.SILOS_URL_MSG_INVIA_MESSAGIO, ow.writeValueAsString(body),silosapiUser,silosapiPassword, EsitoMessaggio.class);

            if (esitoMessaggio != null) {
                return esitoMessaggio;
            }
        } catch (Exception e) {
            Log.error("Errore chiamata silospapi", e);
        }

        return null;


    }
    public String ping(){
        try {
            String esitoMessaggio = get(silosapiUrl + PslpConstants.SILOS_URL_PING, silosapiUser,silosapiPassword, String.class);
            Log.info(esitoMessaggio);
            return esitoMessaggio;
        } catch (Exception e) {
            Log.error("Errore chiamata silospapi", e);
        }

        return null;

    }
}

