/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
export class Util {
  static isNullOrUndefined<T>(
    obj: T | null | undefined
  ): obj is null | undefined {
    return typeof obj === 'undefined' || obj === null;
  }

  static isString<T>(obj: T): boolean {
    return typeof obj === 'string';
  }

  static isNumber<T>(value: T): boolean {
    return typeof value === 'number';
  }
  static isBoolean<T>(value: T): boolean {
    return typeof value === 'boolean';
  }
}
