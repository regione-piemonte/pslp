/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */

import { Subject, BehaviorSubject } from 'rxjs';
import { LogService } from '../log.service';

import { filter } from 'rxjs/operators';
import { Utils } from 'src/app/utils';

export abstract class BaseStorageService {

  private storageSubject: Subject<Storage> = new BehaviorSubject(this.storage);
  private keyStorageSubject: Subject<string> = new BehaviorSubject(null);

  get storage$() { return this.storageSubject.asObservable(); }
  get keyStorage$() {
    return this.keyStorageSubject.asObservable()
      .pipe(
        filter(el => !!el)
      );
  }

  constructor(
    protected logService: LogService,
    protected storage: Storage
  ) {}

  public setItem<T>(key: string, value: T): void {
    if (!value) {
      this.clearItems(key);
      return;
    }
    const val: string = this.isObject(value) ? JSON.stringify(value) : String(value);
    this.storage.setItem(key, val);
    this.logService.debug(this.constructor.name, 'setItem', 'Insert (key,value)', key, val);
    this.storageSubject.next(this.storage);
    this.keyStorageSubject.next(key);
  }

  public getItem<T>(key: string, parse: boolean = true): T {
    const item = this.storage.getItem(key);
    if (item === 'undefined') {
      return undefined;
    }
    return parse ? Utils.jsonParse(item) : item;
  }

  public clearItems(...keys: string[]): void {
    keys.forEach(key => this.storage.removeItem(key));
    this.storageSubject.next(this.storage);
    keys.forEach(key => this.keyStorageSubject.next(key));
  }

  public clearStorage(): void {
    this.storage.clear();
    this.storageSubject.next(this.storage);
  }

  private isObject(obj: any): boolean {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }
}
