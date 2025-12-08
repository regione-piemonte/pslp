/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
// import { Directive, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
// import { NgControl } from '@angular/forms';
// import { Subscription } from 'rxjs';
// import { UtilitiesService } from '../services/utilities.service';
// import { UtilsSilpLibWcl } from '../utilsSilpLibWcl';

// @Directive({
//   selector: '[silplibwclIsRequiredClass]'
// })
// export class IsRequiredClassDirective implements OnInit, OnDestroy {

//   private readonly subscriptions: Subscription[] = [];

//   constructor(
//     private elementRef: ElementRef,
//     private renderer: Renderer2,
//     private control: NgControl,
//     private utilitiesService: UtilitiesService
//   ) { }


//   ngOnInit() {
//     this.subscriptions.push(
//       // Observable in ascolto, se scatetano l'evento è invocato il metoto
//       this.utilitiesService.uiUpdate$.subscribe(() => this.handleChange()),
//       this.utilitiesService.uiUpdate$.subscribe(() => this.handleKeyUp())
//     );
//     this.handleChange();
//     this.handleKeyUp();
//   }

//   ngOnDestroy() {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }

//   @HostListener('change') handleChange(): void {
//     if (!this.control.disabled && UtilsSilpLibWcl.isNullOrUndefinedOrEmpty(this.control.value)) {
//       this.renderer.addClass(this.elementRef.nativeElement, '.is-required');
//     } else {
//       this.renderer.removeClass(this.elementRef.nativeElement, '.is-required');
//     }
//   }

//   @HostListener('keyup') handleKeyUp(): void {
//     if (!this.control.disabled &&  UtilsSilpLibWcl.isNullOrUndefinedOrEmpty(this.control.value)) {
//       this.renderer.addClass(this.elementRef.nativeElement, '.is-required');
//     } else {
//       this.renderer.removeClass(this.elementRef.nativeElement, '.is-required');
//     }
//   }
// }

