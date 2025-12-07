/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.mappers;

import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;

@Dependent
public class PslpMappers {

	@Inject public TipoMessaggioMapper TIPO_MESSAGGIO;
	@Inject public UtenteMapper UTENTE;
	@Inject public FunzioneMapper FUNZIONE;
	@Inject public RuoloFunzioneMapper RUOLO_FUNZIONE;
	@Inject public DelegaMapper DELEGA;
	@Inject public UtenteRuoloMapper UTENTE_RUOLO;
	@Inject public RuoloMapper RUOLO;
	@Inject public MessaggioMapper MESSAGGIO;
	@Inject public ParametroMapper PARAMETRO;
}