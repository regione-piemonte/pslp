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
import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="pslp_t_utente")
public class PslpTUtente extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "seq_pslp_t_utente", sequenceName = "seq_pslp_t_utente", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_pslp_t_utente")
	@Column(name="id_utente")
	private Long idUtente;

	@Column(name="cf_utente")
	private String cfUtente;

	@Column(name="cf_utente_old")
	private String cfUtenteOld;

	@Column(name="cod_user_aggiorn")
	private String codUserAggiorn;

	@Column(name="cod_user_inserim")
	private String codUserInserim;

	private String cognome;

	@Column(name="d_aggiorn")
	private Date dAggiorn;

	@Column(name="d_inserim")
	private Date dInserim;

	@Column(name="id_sil_lav_anagrafica")
	private Long idSilLavAnagrafica;

	@Column(name="identificativo_sap")
	private String identificativoSap;

	private String nome;

	@OneToMany(mappedBy="pslpTUtente1")
	@ToString.Exclude
	private List<PslpRUtentePrivacy> pslpRUtentePrivacies1;

	@OneToMany(mappedBy="pslpTUtente2")
	@ToString.Exclude
	private List<PslpRUtentePrivacy> pslpRUtentePrivacies2;

	@OneToMany(mappedBy="pslpTUtente")
	@ToString.Exclude
	private List<PslpRUtenteRuolo> pslpRUtenteRuolos;

	@OneToMany(mappedBy="pslpTUtente1")
	@ToString.Exclude
	private List<PslpTDelega> pslpTDelegas1;

	@OneToMany(mappedBy="pslpTUtente2")
	@ToString.Exclude
	private List<PslpTDelega> pslpTDelegas2;

}