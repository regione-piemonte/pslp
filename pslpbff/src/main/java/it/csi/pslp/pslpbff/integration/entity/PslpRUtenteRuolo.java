/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.integration.entity;

import java.io.Serializable;
import java.util.Date;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="pslp_r_utente_ruolo")
public class PslpRUtenteRuolo extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;


	@Id
	@ManyToOne
	@JoinColumn(name = "id_utente")
	private PslpTUtente pslpTUtente;
	
	@Id
	@ManyToOne
	@JoinColumn(name = "id_ruolo")
	private PslpDRuolo pslpDRuolo;
	

	@Column(name="d_fine")
	private Date dFine;

	@Column(name="d_inizio")
	private Date dInizio;

	private String email;

	@Column(name="flg_operatore_silp")
	private String flgOperatoreSilp;

}