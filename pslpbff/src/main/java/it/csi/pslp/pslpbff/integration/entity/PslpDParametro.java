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
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="pslp_d_parametro")
public class PslpDParametro extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="id_parametro")
	private Long idParametro;

	@Column(name="cod_parametro")
	private String codParametro;

	@Column(name="d_fine")
	private Date dFine;

	@Column(name="d_inizio")
	private Date dInizio;

	@Column(name="descr_parametro")
	private String descrParametro;

	@Column(name="valore_parametro")
	private String valoreParametro;

	@Column(name="valore_parametro_ext")
	private String valoreParametroExt;

}