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
@Table(name="pslp_t_delega")
public class PslpTDelega extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "seq_pslp_t_delega", sequenceName = "seq_pslp_t_delega", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_pslp_t_delega")
	@Column(name="id_delega")
	private Long idDelega;

	@Column(name="cod_user_aggiorn")
	private String codUserAggiorn;

	@Column(name="cod_user_inserim")
	private String codUserInserim;

	@Column(name="d_aggiorn")
	private Date dAggiorn;

	@Column(name="d_fine")
	private Date dFine;

	@Column(name="d_inizio")
	private Date dInizio;

	@Column(name="d_inserim")
	private Date dInserim;

	@Column(name="num_cellulare")
	private String numCellulare;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="cod_tipo_responsabilita")
	private PslpDTipoResponsabilita pslpDTipoResponsabilita;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_utente_delegato")
	private PslpTUtente pslpTUtente1;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_utente_delegante")
	private PslpTUtente pslpTUtente2;

}