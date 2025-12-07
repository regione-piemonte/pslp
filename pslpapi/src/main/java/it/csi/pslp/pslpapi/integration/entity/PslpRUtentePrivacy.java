/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.integration.entity;

import java.io.Serializable;
import java.util.Date;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="pslp_r_utente_privacy")
public class PslpRUtentePrivacy extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "seq_pslp_r_utente_privacy", sequenceName = "seq_pslp_r_utente_privacy", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_pslp_r_utente_privacy")
	@Column(name="id_utente_privacy")
	private Long idUtentePrivacy;

	@Column(name="cod_user_aggiorn")
	private String codUserAggiorn;

	@Column(name="cod_user_inserim")
	private String codUserInserim;

	@Column(name="d_aggiorn")
	private Date dAggiorn;

	@Column(name="d_inserim")
	private Date dInserim;

	@Column(name="d_presa_visione")
	private Date dPresaVisione;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_privacy")
	private PslpDPrivacy pslpDPrivacy;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_utente")
	private PslpTUtente pslpTUtente1;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_utente_delegante")
	private PslpTUtente pslpTUtente2;

}