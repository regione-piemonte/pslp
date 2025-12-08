/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Directive({
  selector: '[silplibwclOnlyStrings]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OnlyStringsDirective),
      multi: true
    }
  ]
})
export class OnlyStringsDirective implements ControlValueAccessor {
  private onChange: (value: any) => void;
  private onTouched: () => void;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  
  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string): void {
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    this.writeValue(sanitizedValue);
    this.onChange(sanitizedValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }


  writeValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }



}



