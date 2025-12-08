/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[pslpwclPaginationBody]'
})
export class PaginationBodyDirective<T> {

  constructor(
    public templateRef: TemplateRef<{$implicit: T}>
  ) { }

}
