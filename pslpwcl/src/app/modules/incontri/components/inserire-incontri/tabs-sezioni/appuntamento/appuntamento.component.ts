/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CalendarEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, forkJoin } from 'rxjs';
import { AgendaService, ApiMessage, Decodifica, DettaglioIncontro, InTipoContatto, IncServizi, IncontriAppuntamentiRequest, IncontriAppuntamentiResponse, ListaIncServiziResponse, MsgCanale, PslpMessaggio, RicercaSlotLiberiPrenotabiliRequest, RicercaSlotLiberiPrenotabiliResponse, Ruolo, SlotLiberiMensileRidotta, SlotLiberiRidotta } from 'src/app/modules/pslpapi';
import { MonthViewDay } from 'calendar-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/utils';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { TYPE_ALERT } from 'src/app/constants';
import { LogService } from 'src/app/services/log.service';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { CommonService } from 'src/app/services/common.service';
import { AppUserService } from 'src/app/services/app-user.service';
@Component({
  selector: 'pslpwcl-appuntamento',
  templateUrl: './appuntamento.component.html',
  styleUrls: ['./appuntamento.component.scss']
})
export class AppuntamentoComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  noteInserite: string;

  CalendarView = CalendarView;

  @Input() ricercaSlotLiberiPrenotabiliRequest: RicercaSlotLiberiPrenotabiliRequest;
  @Input() ricercaSlotLiberiPrenotabiliResponse: RicercaSlotLiberiPrenotabiliResponse;

  view: CalendarView = CalendarView.Month;
  calendarView: CalendarView = CalendarView.Month;

  listMensileSlot?: Array<SlotLiberiMensileRidotta>;

  viewDate: Date;
  primaDataDisponibile?: Date;
  ultimaDataUtile?: Date;

  dataMinimaDisponibilita?: Date;
  dataMassimaDisponibilita?: Date;



  listSlot?: Array<SlotLiberiRidotta>;
  modalData: { day: Date; action: string; events: CalendarEvent[]; listSlot?: Array<SlotLiberiRidotta> };

  // CalendarView = CalendarView;
  refresh = new Subject<void>();
  // events: CalendarEvent[] = [];
  // modalData: { day: Date; action: string; events: CalendarEvent[]; listSlot?: Array<SlotLiberiRidotta> };
  ruolo: Ruolo;

  @Output() salvataggioIncontroEmitter: EventEmitter<DettaglioIncontro> = new EventEmitter();

  @Input() listaModalitaErogazionePresenza: Decodifica[] = [];
  @Input() listaModalitaErogazionRemoto: Decodifica[] = [];
  @Input() form: FormGroup;
  @Input() dettaglioIncontro: DettaglioIncontro;

  listaServizi: IncServizi[];

  msgC9: PslpMessaggio;
  msgC11: PslpMessaggio;
  msgI60: PslpMessaggio;

  events: CalendarEvent[] = [];
  selectedSlot: SlotLiberiRidotta = null;

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  constructor(
    private spinner: NgxSpinnerService,
    private agendeService: AgendaService,
    private modal: NgbModal,
    private promptModalService: PromptModalService,
    private logService: LogService,
    private alertMessageService: AlertMessageService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private readonly appUserService: AppUserService,
  ) { }

  ngOnDestroy(): void {
    // this.alertMessageService.emptyMessages();
  }

  ngOnInit(): void {
    this.loadServizi();
    this.loadMessaggi();

    // this.viewDate = new Date(this.ricercaSlotLiberiPrenotabiliResponse.primaDataUtile);
    this.dataMinimaDisponibilita = new Date(this.ricercaSlotLiberiPrenotabiliResponse.dataMinimaDisponibilita);
    this.dataMassimaDisponibilita = new Date(this.ricercaSlotLiberiPrenotabiliResponse.dataMassimaDisponibilita);

    if (this.ricercaSlotLiberiPrenotabiliResponse.listMensileSlot && this.ricercaSlotLiberiPrenotabiliResponse.listMensileSlot.length > 0) {
      this.primaDataDisponibile = new Date(this.ricercaSlotLiberiPrenotabiliResponse.listMensileSlot[0].dataGiorno);
      this.viewDate = this.primaDataDisponibile;
    } else {
      this.primaDataDisponibile = new Date(this.ricercaSlotLiberiPrenotabiliResponse.primaDataUtile);
      this.viewDate = new Date(this.ricercaSlotLiberiPrenotabiliResponse.primaDataUtile);
    }
    // if (this.ricercaSlotLiberiPrenotabiliResponse.primaDataUtile)
    //   this.primaDataDisponibile = new Date(this.ricercaSlotLiberiPrenotabiliResponse.primaDataUtile);
    if (this.ricercaSlotLiberiPrenotabiliResponse.ultimaDataUtile)
      this.ultimaDataUtile = new Date(this.ricercaSlotLiberiPrenotabiliResponse.ultimaDataUtile);
    this.events = this.convertiEventiMensili(this.ricercaSlotLiberiPrenotabiliResponse.listMensileSlot);
  }
  private loadServizi() {
    this.spinner.show();
    const idSilwebTIncServCateg: string = this.form.get('idSilwebTIncServCateg').value;
    if (idSilwebTIncServCateg) {
      this.agendeService.listaIncServizi(idSilwebTIncServCateg).subscribe({
        next: (res: ListaIncServiziResponse) => {
          if (res.esitoPositivo)
            this.listaServizi = res.listaIncServizi;
        },
        error: (error: any) => { this.logService.error(this.constructor.name, `listaIncServizi:: ${JSON.stringify(error)}`) },
        complete: () => { this.spinner.hide(); }
      });
    } else {
      this.spinner.hide();
      return;
    }
  }

  private loadMessaggi() {
    const requests$ = [
      this.commonService.getMessaggioByCode('C9'),
      this.commonService.getMessaggioByCode('C11'),
      this.commonService.getMessaggioByCode('I60')
    ]
    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0])
          this.msgC9 = multiResponse[0];
        if (multiResponse[1])
          this.msgC11 = multiResponse[1];
        if (multiResponse[2])
          this.msgI60 = multiResponse[2];

      },
      error: (error: any) => { this.logService.error(this.constructor.name, `loadDecodifiche:: ${JSON.stringify(error)}`) },
      complete: () => { this.spinner.hide(); }
    });
  }

  dateChange(event: { start: Date; end: Date; view: CalendarView }) {
    const { start, end, view } = event;
    this.ricercaSlotLiberiPrenotabiliRequest.dataInizio = start;
    this.ricerca(this.ricercaSlotLiberiPrenotabiliRequest);
    this.calendarView = event.view;
  }

  private ricerca(request: RicercaSlotLiberiPrenotabiliRequest) {
    this.spinner.show();
    if (!Utils.isNullOrUndefined(this.dataMinimaDisponibilita)) {
      request.dataMinimaDisponibilita = this.dataMinimaDisponibilita;
    }
    if (!Utils.isNullOrUndefined(this.dataMassimaDisponibilita)) {
      request.dataMassimaDisponibilita = this.dataMassimaDisponibilita;
    }
    this.agendeService
      .ricercaSlotLiberiPrenotabili('mensile', request).subscribe({
        next: (res: RicercaSlotLiberiPrenotabiliResponse) => {
          if (res.esitoPositivo) {
            this.primaDataDisponibile = res.primaDataUtile ? new Date(res.primaDataUtile) : undefined;
            this.ultimaDataUtile = res.ultimaDataUtile ? new Date(res.ultimaDataUtile) : undefined;
            if (!Utils.isNullOrUndefined(res.dataMinimaDisponibilita)) {
              this.dataMinimaDisponibilita = res.dataMinimaDisponibilita ? new Date(res.dataMinimaDisponibilita) : undefined;
            }
            if (!Utils.isNullOrUndefined(res.dataMassimaDisponibilita)) {
              this.dataMassimaDisponibilita = res.dataMassimaDisponibilita ? new Date(res.dataMassimaDisponibilita) : undefined;
            }
            this.listMensileSlot = res.listMensileSlot;
            this.events = this.convertiEventiMensili(this.listMensileSlot);
          }
          this.alertMessageService.setApiMessages(res.apiMessages);
          if (res.apiMessages && res.apiMessages.length > 0)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => { },
        complete: () => { this.spinner.hide(); }
      })
  }

  dayClicked(event: { day: CalendarMonthViewDay; sourceEvent: MouseEvent | KeyboardEvent }): void {
    this.spinner.show();
    this.agendeService.ricercaSlotLiberiPrenotabili('giornaliero', { ...this.ricercaSlotLiberiPrenotabiliRequest, dataInizio: event.day.date }).subscribe({
      next: (res: RicercaSlotLiberiPrenotabiliResponse) => {
        if (res.esitoPositivo) this.openModal(event.day, res.listSlot);
        this.alertMessageService.setApiMessages(res.apiMessages);
        if (!res.esitoPositivo && res.apiMessages && res.apiMessages.length > 0)
          window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => { this.logService.error(this.constructor.name, `ricercaSlotLiberiPrenotabili: ${JSON.stringify(err)}`) },
      complete: () => { this.spinner.hide() }
    });
  }

  onSlotSelected(slot: SlotLiberiRidotta) {
    this.selectedSlot = slot;
  }

  async onClickConferma(closeFn: () => void) {
    this.spinner.show();
    let msgParam4: string = '';
    if (this.selectedSlot.indirizzoInPresenza) {
      msgParam4 = Utils.replacePlaceHolder(this.msgC11.testo, { 0: this.selectedSlot.indirizzoInPresenza });
    }
    const servizio: IncServizi = this.listaServizi.find((item: IncServizi) => item.idSilwebTIncServizi == this.selectedSlot.idServizi);
    let msgParam6: string = '';
    servizio.listaMsgCanale.forEach((item: MsgCanale) => {
      msgParam6 = `${msgParam6} ${item.desSilwebDMsgCanale},`
    });
    let idErogazione: number;
    if (this.selectedSlot.flgModalErogazione === 'Da remoto')
      idErogazione = this.form.get('listaModalitaErogazionRemoto').value;
    else
      idErogazione = this.form.get('listaModalitaErogazionePresenza').value;

    const tipoContatto: InTipoContatto = servizio.listaModalitaErogazione.find((item: InTipoContatto) => item.idSilTInTipoContatto == idErogazione);


    const mapParams: any = {
      0: this.selectedSlot.desServizi,
      1: `${this.utente.cognome} ${this.utente.nome}`,
      2: `${this.utente.cfUtente}`,
      3: this.datePipe.transform(this.selectedSlot.dataGiorno, 'dd/MM/yyyy'),
      4: this.selectedSlot.oraInizioFascia,
      5: tipoContatto.dsSilTInTipoContatto,
      6: msgParam4,
      7: '',
      8: msgParam6
    }
    const msgConferma: string = Utils.replacePlaceHolder(this.msgC9.testo, mapParams);
    const data: DialogModaleMessage = {
      titolo: this.msgC9.intestazione,
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msgConferma,
      messaggioAggiuntivo: '',
      size: 'lg',
      tipoTesto: TYPE_ALERT.WARNING,
    };
    this.spinner.hide();
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'NO') return;


    this.spinner.show();
    this.sendRequest(closeFn);
  }

  private sendRequest(closeFn: () => void) {
    const request: IncontriAppuntamentiRequest = {
      dataIncontro: new Date(this.selectedSlot.dataGiorno),
      idOperatore: null,
      idModalitaErogazione: this.selectedSlot.flgModalErogazione === 'In presenza' ? Number(this.form.get('listaModalitaErogazionePresenza').value) : Number(this.form.get('listaModalitaErogazionRemoto').value),
      idSilLavAnagrafica: this.ricercaSlotLiberiPrenotabiliRequest.idSilLavAnagrafica,
      idSilwebTIncServizi: this.selectedSlot.idServizi,
      idSilTCpi: this.selectedSlot.idCpi,
      idSilwebTSedeEnte: this.selectedSlot.idSedeEnte,
      oraIncontro: this.selectedSlot.oraInizioFascia,
      note: this.noteInserite,
      operazione: Utils.isNullOrUndefined(this.dettaglioIncontro) ? 'inserimento' : 'spostamento',
      dettaglioIncontroPrecedente: Utils.isNullOrUndefined(this.dettaglioIncontro) ? null : this.dettaglioIncontro
    };
    this.agendeService.salvaIncontro(request).subscribe({
      next: (res: IncontriAppuntamentiResponse) => {
        const apiMessages: ApiMessage[] = res.apiMessages ? Utils.clone(res.apiMessages) : [];
        if (res.esitoPositivo) {
          
          this.salvataggioIncontroEmitter.emit(res.dettaglio);
          if(this.selectedSlot.idServizi == 4){
            
            apiMessages.push({
              code: this.msgI60.codMessaggio,
              error: false, 
              message: this.msgI60.testo,
              tipo: this.msgI60.pslpDTipoMessaggio.codTipoMessaggio,
              title: this.msgI60.intestazione
            });
          } 
          this.alertMessageService.setApiMessages(apiMessages); 
        }
        if (apiMessages && apiMessages.length > 0)
          window.scrollTo({ top: 0, behavior: 'smooth' });
        closeFn();

      },
      error: (err: any) => { },
      complete: () => { this.spinner.hide(); }
    });
  }

  private convertiEventiMensili(slot: SlotLiberiMensileRidotta[] = []): CalendarEvent[] {
    return slot
      .filter(s => !!s.dataGiorno)
      .map((p, index) => {
        const start: Date = new Date(p.dataGiorno!);
        const end: Date = new Date(p.dataGiorno!);

        return {
          id: p.idQry ?? index,
          start,
          end,
          title: `Disponibilità`,
          color: {
            primary: '#008000',
            secondary: '#ffcdd2'
          },
          meta: {}
        };
      });
  }

  private openModal(day: MonthViewDay<CalendarEvent<any>>, listSlot: Array<SlotLiberiRidotta>) {
    this.modalData = { day: day.date, action: 'action', events: day.events, listSlot: listSlot };
    this.modal.open(this.modalContent, { size: 'xl' });
  }


}
