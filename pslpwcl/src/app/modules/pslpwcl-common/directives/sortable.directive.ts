/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SortEvent } from '../models/sort-event';
import { SortDirection } from '../models/sort-direction';

@Directive({
  selector: '[pslpwclSortable]'
})
export class SortableDirective {

  @Input('pslpwclSortable') sortable: string;
  @Input() direction: SortDirection = '';
  @Output() readonly sort = new EventEmitter<SortEvent>();

  rotate: {[key: string]: SortDirection} = {
    '': 'asc',
    'asc': 'desc',
    'desc': 'asc'
  };

  constructor() { }

  @HostListener('click') rotateDirection() {
    this.direction = this.rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }

}
