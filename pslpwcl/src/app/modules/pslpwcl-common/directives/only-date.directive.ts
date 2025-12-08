/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar } from 'primeng/calendar';

@Directive({
  selector: '[pslpwclOnlyDate]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OnlyDateDirective),
    multi: true
  }]
})
export class OnlyDateDirective {
  private onChange: (val: string) => void;
  constructor(private el:ElementRef,
    private renderer: Renderer2,
    private primeCalendar: Calendar) { }

  @HostListener('input',  ['$event.target.value']) onInputChange(value: string) {
    value = value.replace(/[^0-9\/]/g, ''); // Rimuove tutti i caratteri non numerici e le barre
    this.writeValue(value);
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.renderer.setProperty(this.el.nativeElement, 'value', value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }



  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }




  getHTMLInput(): HTMLInputElement {
    return this.primeCalendar.el.nativeElement.querySelector('input');
  }
}
