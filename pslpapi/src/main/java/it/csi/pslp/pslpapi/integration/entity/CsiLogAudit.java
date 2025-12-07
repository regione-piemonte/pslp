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
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name="csi_log_audit")
public class CsiLogAudit extends PanacheEntityBase implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "seq_csi_log_audit", sequenceName = "seq_csi_log_audit", initialValue = 1,
			allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_csi_log_audit")
	@Column(name="id_audit")
	private Long idAudit;

	@Column(name="data_ora")
	private Date dataOra;

	@Column(name="id_app")
	private String idApp;

	@Column(name="ip_address")
	private String ipAddress;

	@Column(name="key_oper")
	private String keyOper;

	@Column(name="ogg_oper")
	private String oggOper;
	
	@Column(name="operazione")
	private String operazione;
	
	@Column(name="utente")
	private String utente;

}