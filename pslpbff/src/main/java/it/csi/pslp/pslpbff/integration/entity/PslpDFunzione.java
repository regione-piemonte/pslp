/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.integration.entity;

import java.io.Serializable;

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
@Table(name="pslp_d_funzione")
public class PslpDFunzione extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="id_funzione")
	private Long idFunzione;

	@Column(name="ds_note_funzione")
	private String dsNoteFunzione;

	@Column(name="icona_funzione")
	private String iconaFunzione;

	@Column(name="sottotitolo_funzione")
	private String sottotitoloFunzione;

	@Column(name="titolo_funzione")
	private String titoloFunzione;
	
	@Column(name="ordinamento")
	private Long ordinamento;
	
	@Column(name="flg_attiva")
	private String flgAttiva;


	

}