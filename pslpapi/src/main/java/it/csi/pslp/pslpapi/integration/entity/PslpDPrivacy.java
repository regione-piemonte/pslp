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
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="pslp_d_privacy")
public class PslpDPrivacy extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="id_privacy")
	private Long idPrivacy;

	@Column(name="cod_privacy")
	private String codPrivacy;

	@Column(name="d_fine")
	private Date dFine;

	@Column(name="d_inizio")
	private Date dInizio;

	@Column(name="ds_dettaglio")
	private String dsDettaglio;

	@Column(name="desc_privacy")
	private String descPrivacy;

	@Column(name="ds_sunto")
	private String dsSunto;

	@Column(name="ds_testata")
	private String dsTestata;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id_funzione")
	private PslpDFunzione pslpDFunzione;

	@OneToMany(mappedBy="pslpDPrivacy")
	@ToString.Exclude
	private List<PslpRUtentePrivacy> pslpRUtentePrivacies;

}