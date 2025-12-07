/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.integration.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import it.csi.pslp.pslpapi.integration.entity.PslpDPrivacy;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class PslpDPrivacyRepository implements PanacheRepository<PslpDPrivacy> {

    public List<PslpDPrivacy> getPrivacyUtenteCollegato(Long idUtente){
        String sql = "select pdp  from  PslpDPrivacy pdp " +
                "left join PslpDFunzione pdf on pdp.pslpDFunzione.idFunzione = pdf.idFunzione " +
                "left join PslpRUtentePrivacy prup on pdp.idPrivacy = prup.pslpDPrivacy.idPrivacy and prup.pslpTUtente1.idUtente = ?1";

        return find(sql,idUtente.toString()).list();

    }
}
