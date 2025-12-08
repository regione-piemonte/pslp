/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { NgbTimeStruct, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { COD_TIPO_AGENDE } from 'src/app/constants';
import { AgendaService, AppuntamentiRidotta, Comune, Cpi, Decodifica, DecodificaPslpService, IncServizi, InTipoContatto, LavoratorePslpService, ListaIncServiziResponse, RicercaSlotLiberiPrenotabiliRequest, Ruolo } from 'src/app/modules/pslpapi';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-servizio',
  templateUrl: './servizio.component.html',
  styleUrls: ['./servizio.component.scss']
})
export class ServizioComponent implements OnInit, OnDestroy,AfterViewInit {

  @ViewChild('timePicker') timePicker: NgbTimepicker;
  @ViewChild('timePicker', { read: ElementRef }) timePickerRef: ElementRef;

  @Input() form: FormGroup;
  @Input() categoriaServizi: Decodifica[] = [];
  @Input() elencoCpi: Decodifica[];
  elencoCpiTmp: Decodifica[];

  @Output() readonly ricercaEmitter = new EventEmitter();
  // suntoLavAnag: SuntoLavAnag;

  listaIncServizi: IncServizi[] = [];
  listaOperatori: Decodifica[] = [];
  listaSediCpi: Decodifica[] = [];
  modalitaErogazioneFormArray: FormArray;

  @Input() initialRicercaSlotLiberiPrenotabiliRequest: RicercaSlotLiberiPrenotabiliRequest;
  @Input() ricercaSlotLiberiPrenotabiliRequest: RicercaSlotLiberiPrenotabiliRequest;
  @Input() incontro: AppuntamentiRidotta;
  @Input() listaModalitaErogazionePresenza: Decodifica[] = [];
  @Input() listaModalitaErogazionRemoto: Decodifica[] = [];
  listaModalitaErogazionePresenzaFiltrata: Decodifica[] = [];
  listaModalitaErogazioneRemotoFiltrata: Decodifica[] = [];

  sysDate: Date = new Date();
  ruolo: Ruolo;
  contattiRequired: boolean;

  cognomeLavoratore: string;
  codFiscaleLavoratore: string;
  nomeLavoratore: string;
  mailLavoratore: string;
  telefonoLavoratore: string;
  entePromotoreSAP: string;
  silTCpiComp: Cpi;
  comuneDomicilio: Comune;

  private timepickerSubscription: Subscription;
  @Input() oraMinima: string;
  @Input() oraMassima: string;

  constructor(
    private spinner: NgxSpinnerService,
    private agendeService: AgendaService,
    private logService: LogService,
    private lavoratorePslpService: LavoratorePslpService,
    private readonly appUserService: AppUserService,
    private alertMessageService: AlertMessageService,
    private renderer: Renderer2,
    private decodificaService: DecodificaPslpService
  ) {
    this.sysDate.setHours(0, 0, 0, 0);
  }


  ngAfterViewInit(): void {
    this.blockMinuteInput();
  }

  private blockMinuteInput(): void {
    if (this.timePickerRef) {
      try {
       
        const minuteInput = this.timePickerRef.nativeElement.querySelector('.ngb-tp-minute input');
        if (minuteInput) {
         
          this.renderer.setAttribute(minuteInput, 'readonly', 'true');
          
          this.renderer.setStyle(minuteInput, 'background-color', '#e9ecef');
        }
        
        
        const minutiSpinners = this.timePickerRef.nativeElement.querySelectorAll('.ngb-tp-minute .ngb-tp-chevron');
        minutiSpinners.forEach((spinnerDeiMinuti: HTMLElement) => {
          this.renderer.setStyle(spinnerDeiMinuti, 'display', 'none');
        });

      } catch (e) {
        console.error("Errore su blocco input dei minuti.", e);
      }
    }
  }



  ngOnDestroy(): void {
    this.alertMessageService.emptyMessages();
  }

  ngOnInit(): void {
    this.salvaDatiLavoratore();

    this.elencoCpiTmp = Utils.clone(this.elencoCpi);
    // this.suntoLavAnag = this.localStorageService.getItem(STORAGE_KEY.SUNTO_LAV_ANAG);
    this.modalitaErogazioneFormArray = this.form.controls['listaIdModalitaErogazione'] as FormArray;
    // this.ruolo = this.authService.ruolo;

    this.patchValueInForm(this.ricercaSlotLiberiPrenotabiliRequest);
    this.loadServizi();
    // this.loadDecodificheByIdCpi(this.ricercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi[0]);
    this.setFormControlsState();


    const timeControl = this.form.get('orarioIncontro');
    this.timepickerSubscription = timeControl.valueChanges.subscribe((value: NgbTimeStruct | null) => {

      if (value === null) {
        
        
        if (this.timePicker && this.timePicker.model) {
          
          
          const internalHour = this.timePicker.model.hour; 
  
          
          if (typeof internalHour === 'number' && !isNaN(internalHour)) {
           
            timeControl.patchValue({
              hour: internalHour,
              minute: 0
            }, { emitEvent: false });
          }
        }
        
  
      } else if (value.minute !== 0) {
        
        timeControl.patchValue({
          hour: value.hour,
          minute: 0
        }, { emitEvent: false }); 
      }
    });
  }

  private salvaDatiLavoratore() {
    this.lavoratorePslpService.findLavoratore(this.utente.idSilLavAnagrafica).subscribe(
      {
        next: async ris => {
          if (ris.esitoPositivo) {
            this.codFiscaleLavoratore = ris.lavoratore.codFiscale;
            this.cognomeLavoratore = ris.lavoratore.dsCognome;
            this.nomeLavoratore = ris.lavoratore.dsNome;
            this.mailLavoratore = ris.lavoratore.dsMail;
            this.telefonoLavoratore = ris.lavoratore.dsTelefonoCell;
            this.silTCpiComp = ris.lavoratore.silTCpiComp;
            this.comuneDomicilio = ris.lavoratore.comuneDomicilio;
            this.entePromotoreSAP = ris.lavoratore.silTCpiComp.dsSilTCpi
          }
        }
      }
    );
  }

  private setFormControlsState() {
    this.setIdSilwebTIncServCategControlState();
    this.setIdSilwebTIncServiziControlState();
    this.setFlgModalitaErogazioneControlState();
    this.setListaModalitaErogazionePresenzaControlState();
    this.setListaModalitaErogazioneRemotoControlState();
    this.setIdSilwebTSedeEnteControlState();
    // this.setIdOperatoreControlState();
  }

  setIdSilwebTIncServCategControlState() {
    if (this.incontro) {
      this.form.get('idSilwebTIncServCateg').disable();
      return;
    }
  }

  setListaModalitaErogazioneRemotoControlState() {

    const flgRemoto = this.form.get('flgRemoto').value;
    if (flgRemoto) this.form.get('listaModalitaErogazionRemoto').enable();
    else this.form.get('listaModalitaErogazionRemoto').disable();
  }
  setListaModalitaErogazionePresenzaControlState() {
    const flgPresenza = this.form.get('flgPresenza').value;
    if (flgPresenza) this.form.get('listaModalitaErogazionePresenza').enable();
    else this.form.get('listaModalitaErogazionePresenza').disable();
  }

  private setIdSilwebTIncServiziControlState() {
    if (!Utils.isNullOrUndefined(this.incontro)) {
      this.form.get('idSilwebTIncServizi').disable();
      return;
    }
    const idSilwebTIncServCateg = this.form.get('idSilwebTIncServCateg').value;
    if (Utils.isNullOrUndefinedOrEmptyField(idSilwebTIncServCateg))
      this.form.get('idSilwebTIncServizi').disable();
    else
      this.form.get('idSilwebTIncServizi').enable();
  }

  private setFlgModalitaErogazioneControlState() {
    const idSilwebTIncServizi: number = this.form.get('idSilwebTIncServizi').value;
    this.listaModalitaErogazionePresenzaFiltrata = [];
    this.listaModalitaErogazioneRemotoFiltrata = [];
    if (!Utils.isNullOrUndefinedOrEmptyField(idSilwebTIncServizi)) {
      const incServizio: IncServizi = this.listaIncServizi.find((servizio: IncServizi) => servizio.idSilwebTIncServizi == idSilwebTIncServizi);
      if (incServizio) {

        this.listaModalitaErogazionePresenzaFiltrata = this.listaModalitaErogazionePresenza.filter(presenza =>
          incServizio.listaModalitaErogazione.some(inc =>
            inc.idSilTInTipoContatto == presenza.id
          )
        );

        this.listaModalitaErogazioneRemotoFiltrata = this.listaModalitaErogazionRemoto.filter(remoto =>
          incServizio.listaModalitaErogazione.some(inc =>
            inc.idSilTInTipoContatto == remoto.id
          )
        );
        const modPresenza = incServizio.listaModalitaErogazione.filter((item: InTipoContatto) => this.listaModalitaErogazionePresenza.some((d: Decodifica) => d.id == item.idSilTInTipoContatto))
        if (modPresenza.length === 0) {
          this.form.get('flgPresenza').reset();
          this.form.get('flgPresenza').disable();
        } else {
          this.form.get('flgPresenza').enable();
        }
        const modRemoto = incServizio.listaModalitaErogazione.filter((item: InTipoContatto) => this.listaModalitaErogazionRemoto.some((d: Decodifica) => d.id == item.idSilTInTipoContatto))
        if (modRemoto.length === 0) {
          this.form.get('flgRemoto').reset();
          this.form.get('flgRemoto').disable();
        } else {
          this.form.get('flgRemoto').enable();
        }
      }
    } else {
      this.form.get('flgRemoto').reset();
      this.form.get('flgPresenza').reset();
    }
  }

  onChangeidSilwebTIncServCateg() {
    this.alertMessageService.emptyMessages();
    this.form.get('idSilwebTIncServizi').reset();
    this.form.get('flgPresenza').reset();
    this.form.get('flgRemoto').reset();
    this.form.get('listaModalitaErogazionePresenza').reset();
    this.form.get('listaModalitaErogazionRemoto').reset();
    this.form.get('listaIdSilTCpi').reset();

    this.loadServizi();
    this.setIdSilwebTIncServiziControlState();
    this.setFlgModalitaErogazioneControlState();
  }

  onClickFlgPresenza() {
    this.form.get('listaModalitaErogazionePresenza').reset();
    if (this.form.get('flgPresenza').value && this.listaModalitaErogazionePresenzaFiltrata.length === 1) this.form.get('listaModalitaErogazionePresenza').patchValue(this.listaModalitaErogazionePresenzaFiltrata[0].id);
    this.setListaModalitaErogazionePresenzaControlState();
  }

  onClickFlgRemoto() {
    this.form.get('listaModalitaErogazionRemoto').reset();
    if (this.form.get('flgRemoto').value && this.listaModalitaErogazioneRemotoFiltrata.length === 1) this.form.get('listaModalitaErogazionRemoto').patchValue(this.listaModalitaErogazioneRemotoFiltrata[0].id);
    this.setListaModalitaErogazioneRemotoControlState();
  }

  onChangeidCpi() {
    // if (this.ruolo.operatore.flgIncPrenotaOper === FLG.SI){
    //   this.form.get('idOperatore').reset();
    // }
    this.form.get('idSilwebTSedeEnte').reset();
    const listaIdSilTCpiFormArray: FormArray = this.getListaIdSilTCpiFormArray();
    const idSilTCpi: number = listaIdSilTCpiFormArray.at(0).value;
    // this.loadDecodificheByIdCpi(idSilTCpi);
    this.setIdSilwebTSedeEnteControlState();
  }

  onChangeServizio() {
    this.form.get('flgPresenza').reset();
    this.form.get('flgRemoto').reset();
    this.form.get('listaModalitaErogazionePresenza').reset();
    this.form.get('listaModalitaErogazionRemoto').reset();
    this.form.get('listaIdSilTCpi').reset();
    this.filtraCpi();
    this.setFlgModalitaErogazioneControlState();
    this.setListaModalitaErogazionePresenzaControlState();
    this.setListaModalitaErogazioneRemotoControlState();
    this.alertMessageService.emptyMessages();
  }

  private filtraCpi() {
    const idSilwebTIncServizi: number = this.form.get('idSilwebTIncServizi').value;
    this.elencoCpiTmp = Utils.clone(this.elencoCpi);
    if (!Utils.isNullOrUndefinedOrEmptyField(idSilwebTIncServizi)) {
      const incServizio: IncServizi = this.listaIncServizi.find((servizio: IncServizi) => servizio.idSilwebTIncServizi == idSilwebTIncServizi);
      // if (incServizio && incServizio.flgProvincia === FLG.SI) {
      //   this.elencoCpiTmp = this.elencoCpi.filter((item: Decodifica) => item.special == this.suntoLavAnag?.lavAnagrafica?.silTCpiProp?.silTProvincia?.idSilTProvincia);
      // }
    }

  }

  private loadServizi() {
    this.spinner.show();
    const idSilwebTIncServCateg: string = this.form.get('idSilwebTIncServCateg').value;
    if (!Utils.isNullOrUndefinedOrEmptyField(idSilwebTIncServCateg)) {
      this.agendeService.listaIncServizi(String(idSilwebTIncServCateg), 'validiFuturo', null,null,COD_TIPO_AGENDE.AGENDE).subscribe({
        next: (res: ListaIncServiziResponse) => {
          if (res.esitoPositivo)
            this.listaIncServizi = res.listaIncServizi;
          this.setFlgModalitaErogazioneControlState();
        },
        error: (error: any) => { this.logService.error(this.constructor.name, `listaIncServizi:: ${JSON.stringify(error)}`) },
        complete: () => { this.spinner.hide(); }
      });
    } else {
      this.spinner.hide();
      return;
    }
  }

  private getListaIdSilTCpiFormArray(): FormArray {
    const listaIdSilTCpiFormArray: FormArray = this.form.get('listaIdSilTCpi') as FormArray;
    return listaIdSilTCpiFormArray;
  }


  // loadDecodificheByIdCpi(idCpi: number) {
  //   this.spinner.show();
  //   const requests$: Observable<DecodificaListResponse>[] = [this.agendeService.elencoSedeEnteDelCpi(idCpi)];
  //   forkJoin(requests$).subscribe({
  //     next: (multiResponse: DecodificaListResponse[]) => {
  //       if (multiResponse[0].esitoPositivo) { this.listaSediCpi = multiResponse[0].list; }
  //     },
  //     error: (error: any) => { this.logService.error(this.constructor.name, `loadOperatoriByIdCpi:: ${JSON.stringify(error)}`) },
  //     complete: () => { this.spinner.hide(); }
  //   });
  // }

  onClickReset() {

    this.elencoCpiTmp = Utils.clone(this.elencoCpi);
    this.form.reset();
    this.patchValueInForm(this.initialRicercaSlotLiberiPrenotabiliRequest);
    // this.loadDecodificheByIdCpi(this.initialRicercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi[0]);
    this.setFormControlsState();
  }

  private patchValueInForm(request: RicercaSlotLiberiPrenotabiliRequest) {
    request.dataInizio = this.sysDate;
    this.form.patchValue(request);
    this.form.get('dsMail').patchValue(this.mailLavoratore);
    this.form.get('dsTelefonoCell').patchValue(this.telefonoLavoratore);
    if (
      Utils.isNullOrUndefinedOrEmptyField(this.mailLavoratore) &&
      Utils.isNullOrUndefinedOrEmptyField(this.telefonoLavoratore)) {
      this.contattiRequired = true;
      // this.form.get('dsMail').setValidators([Validators.required]);
      // this.form.get('dsTelefonoCell').setValidators([Validators.required]);
    }
    if(request.orarioIncontro)
      this.form.get('orarioIncontro').patchValue(Utils.convertTimeStringToNgbTimeStruct(request.orarioIncontro));

    this.form.get('dsMail').updateValueAndValidity();
    this.form.get('dsTelefonoCell').updateValueAndValidity();
  }

  private setIdSilwebTSedeEnteControlState() {
    const listaIdSilTCpiFormArray: FormArray = this.getListaIdSilTCpiFormArray();
    const idSilTCpi: number = listaIdSilTCpiFormArray.at(0).value;
    const idSilwebTSedeEnte: AbstractControl = this.form.get('idSilwebTSedeEnte');
    if (Utils.isNullOrUndefinedOrEmptyField(idSilTCpi)) idSilwebTSedeEnte.disable();
    else idSilwebTSedeEnte.enable();
  }

  getIncServiziById(id: number): IncServizi {
    return this.listaIncServizi.find((item: IncServizi) => id === item.idSilwebTIncServizi);
  }


  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  onClickDispCpi() {
    this.alertMessageService.emptyMessages();
    this.ricercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi = [this.silTCpiComp.idSilTCpi];
    this.ricercaSlotLiberiPrenotabiliRequest.dataMinimaDisponibilita = null;
    this.ricercaSlotLiberiPrenotabiliRequest.dataMassimaDisponibilita = null;
    this.ricercaEmitter.emit();
  }

  onClickEstendiProvincia() {
    this.alertMessageService.emptyMessages();
    this.ricercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi = [];
    this.ricercaSlotLiberiPrenotabiliRequest.dataMinimaDisponibilita = null;
    this.ricercaSlotLiberiPrenotabiliRequest.dataMassimaDisponibilita = null;
    this.elencoCpi.forEach((item: Decodifica) => {
      if (item.special === this.comuneDomicilio.silTProvincia.idSilTProvincia) this.ricercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi.push(item.id);
    });
    this.ricercaEmitter.emit();
  }

  onClickEstendiRegione() {
    this.alertMessageService.emptyMessages();
    this.ricercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi = [];
    this.ricercaSlotLiberiPrenotabiliRequest.dataMinimaDisponibilita = null;
    this.ricercaSlotLiberiPrenotabiliRequest.dataMassimaDisponibilita = null;
    this.ricercaEmitter.emit();
  }

}





