/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { TypeLinkCard } from './type-link-card';
import { TypeApplicationCard } from './type-application-card';

export interface BaseCard {
    id?: string;
    titolo?: string;
    link?: string;
    testoCard?: string;
    urlImg?: string;
    icon?: string;
    tipoLink?: TypeLinkCard;
    applicazione?: TypeApplicationCard;
    flgAccessoAutenticato?: boolean;
  }
