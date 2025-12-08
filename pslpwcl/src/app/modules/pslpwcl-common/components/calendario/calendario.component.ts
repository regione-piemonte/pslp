/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { MonthViewDay } from 'calendar-utils';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'pslpwcl-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  @Input() enabledViews: CalendarView[] = [CalendarView.Month, CalendarView.Week, CalendarView.Day];
  @Input() view: CalendarView = CalendarView.Month;
  @Input() viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Input() primaDataUtile?: Date;
  @Input() ultimaDataUtile?: Date;
  @Input() dataMinimaDisponibilita?: Date;
  @Input() dataMassimaDisponibilita?: Date;

  @Output() viewDateChange = new EventEmitter<{ start: Date; end: Date; view: CalendarView }>();
  @Output() dayClicked = new EventEmitter<{ day: CalendarMonthViewDay; sourceEvent: MouseEvent | KeyboardEvent }>();
  refresh = new Subject<void>();

  CalendarView = CalendarView;
  sysDate: Date = new Date();
  isPreviousDisabled(): boolean {
    if (!this.dataMinimaDisponibilita || !this.viewDate) return false;

    const mesePrecedente = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    const meseMinimo = new Date(this.dataMinimaDisponibilita.getFullYear(), this.dataMinimaDisponibilita.getMonth(), 1);

    return mesePrecedente < meseMinimo;
  }

  isNextDisabled(): boolean {
    if (!this.dataMassimaDisponibilita || !this.viewDate) return false;

    const meseSuccessivo = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    const meseMassimo = new Date(this.dataMassimaDisponibilita.getFullYear(), this.dataMassimaDisponibilita.getMonth(), 1);

    return meseSuccessivo > meseMassimo;
  }

  constructor(
    private alertMessageService: AlertMessageService
  ) { }

  ngOnInit(): void {
    if (this.primaDataUtile) this.viewDate = this.primaDataUtile;
  }

  onViewDateChange() {
    this.alertMessageService.emptyMessages();
    const start = this.getStartOfView(this.view, this.viewDate);
    const end = this.getEndOfView(this.view, this.viewDate);
    this.events = [];
    this.viewDateChange.emit({ start, end, view: this.view });
  }

  cambiaView(nuovaVista: CalendarView): void {

  }

  // onClickDay(event: { day: CalendarMonthViewDay; sourceEvent: MouseEvent | KeyboardEvent }): void {
  //   this.dayClicked.emit(event);
  // }

  isViewEnabled(view: CalendarView): boolean {
    return this.enabledViews?.length > 1 && this.enabledViews.includes(view);
  }

  vaiAllaPrimaDataUtile() {
    if (this.primaDataUtile) {
      this.viewDate = new Date(this.primaDataUtile);
      this.onViewDateChange();
    }
  }

  private getStartOfView(view: CalendarView, date: Date): Date {
    switch (view) {
      case CalendarView.Month:
        return new Date(date.getFullYear(), date.getMonth(), 1);
      case CalendarView.Week:
        const diffToMonday = (date.getDay() + 6) % 7;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diffToMonday);
      case CalendarView.Day:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  }

  private getEndOfView(view: CalendarView, date: Date): Date {
    switch (view) {
      case CalendarView.Month:
        return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      case CalendarView.Week:
        const diffToSunday = (7 - date.getDay()) % 7;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffToSunday, 23, 59, 59, 999);
      case CalendarView.Day:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    }
  }

  eventClickedHandler({ event, sourceEvent }: { event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent }): void {

    const clickedDay: Partial<CalendarMonthViewDay> = {
      date: event.start,
      events: [event] // Possiamo includere l'evento cliccato
    };

    this.dayClicked.emit({ day: clickedDay as CalendarMonthViewDay, sourceEvent });
  }

}
