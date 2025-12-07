/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.integration.entity;

import java.io.Serializable;
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="pslp_d_ruolo")
public class PslpDRuolo extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="id_ruolo")
	private Long idRuolo;

	@Column(name="ds_ruolo")
	private String dsRuolo;

	@Column(name="nome_ruolo")
	private String nomeRuolo;

	@OneToMany(mappedBy="pslpDRuolo")
	@ToString.Exclude
	private List<PslpRRuoloFunzione> pslpRRuoloFunziones;

	@OneToMany(mappedBy="pslpDRuolo")
	@ToString.Exclude
	private List<PslpRUtenteRuolo> pslpRUtenteRuolos;

}