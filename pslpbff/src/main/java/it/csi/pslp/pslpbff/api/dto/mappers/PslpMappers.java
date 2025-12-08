/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.api.dto.mappers;

import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;

@Dependent
public class PslpMappers {

	@Inject public TipoResponsabilitaMapper TIPO_RESPONSABILITA;
	@Inject public TipoMessaggioMapper TIPO_MESSAGGIO;
	@Inject public UtentePrivacyMapper UTENTE_PRIVACY;
	@Inject public UtenteMapper UTENTE;
	@Inject public FunzioneMapper FUNZIONE;
	@Inject public RuoloFunzioneMapper RUOLO_FUNZIONE;
	@Inject public DelegaMapper DELEGA;
	@Inject public ParametroMapper PARAMETRO;
	@Inject public UtenteRuoloMapper UTENTE_RUOLO;
	@Inject public RuoloMapper RUOLO;
	@Inject public PrivacyMapper PRIVACY;
	@Inject public MessaggioMapper MESSAGGIO;
}