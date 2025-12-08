/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { InjectionToken } from '@angular/core';
import { VersionData } from 'src/app/modules/pslpwcl-common/models/version-data'; 

export const APP_VERSION = new InjectionToken<VersionData>('APP_VERSION');
