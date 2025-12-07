/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpapi.api.dto.mappers;

import java.util.Collection;
import java.util.List;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.MappingTarget;

import it.csi.pslp.pslpapi.api.dto.Decodifica;

/**
 * Basic interface for model to entity Bean mapping
 * @param <M> the model class
 * @param <E> the entity class
 */
public interface BaseMapperInterface<M, E> {

	/**
	 * Converts to model
	 * @param entity the entity to convert
	 * @return the model
	 */
	M toModel(E entity);
	/**
	 * Converts to model
	 * @param entity the entity to convert
	 * @param model the model to populate
	 * @return the model
	 */
	@InheritConfiguration(name = "toModel")
	M toModelExisting(E entity, @MappingTarget M model);
	/**
	 * Converts to models
	 * @param entities the entities to convert
	 * @return the models
	 */
	List<M> toModels(Collection<E> entities);

	/**
	 * Converts to entity
	 * @param model the model to convert
	 * @return the entity
	 */
	@InheritInverseConfiguration(name = "toModel")
	E toEntity(M model);
	/**
	 * Converts to entity
	 * @param model the model to convert
	 * @param entity the entity to populate
	 * @return the entity
	 */
	@InheritConfiguration
	E toEntityExisting(M model, @MappingTarget E entity);
	/**
	 * Converts to entities
	 * @param models the models to convert
	 * @return the entities
	 */
	List<E> toEntities(Collection<M> models);
	
	/**
	 * Converte un codice e descrizione in un oggetto decodifica
	 * @param cod
	 * @param desc
	 * @return
	 */
	default Decodifica toDecodifica(String cod,String desc) {
		Decodifica d = new Decodifica();
		d.setCodice(cod);
		d.setDescr(desc);
		return d;
	}

}
