/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff;package it.csi.pslp;

import io.quarkus.test.junit.QuarkusTestProfile;

public class ApplicationTestProfile implements QuarkusTestProfile { 

    

    @Override
    public String getConfigProfile() {
        return "dev";
    }

    
}
