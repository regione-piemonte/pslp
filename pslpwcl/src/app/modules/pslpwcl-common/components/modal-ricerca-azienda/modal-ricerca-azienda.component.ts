/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AziSede, FascicoloPslpService, OrderField, RicercaSediAziendaRequest, RicercaSediAziendaResponse } from 'src/app/modules/pslpapi';
import { PaginationDataChange } from 'src/app/modules/pslpwcl-common/models/pagination-data-change';
import { SortEvent } from 'src/app/modules/pslpwcl-common/models/sort-event';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-modal-ricerca-azienda',
  templateUrl: './modal-ricerca-azienda.component.html',
  styleUrls: ['./modal-ricerca-azienda.component.scss']
})
export class ModalRicercaAziendaComponent implements OnInit {


  @Input() title: string;
  @Input() callback: any;
  @Input() modal: any;

  form: FormGroup;
  formRicercaSediAzienda: FormGroup;

  formRicerca: RicercaSediAziendaRequest;
  pagedResponse: RicercaSediAziendaResponse;
  ricercaPerInvio: RicercaSediAziendaRequest;
  formPristine: RicercaSediAziendaRequest = {
    denominazione: null,
    codiceFiscale: null
    };

  currentPaginationData: PaginationDataChange;
  ricercaEffettuata = false;


  get f() {
    return this.form.controls as any;
  }


  constructor(
    private message: MessageService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    // private alertMessageService: AlertMessageService,
    private fascicoloService: FascicoloPslpService,
    private fb:FormBuilder,
  ) { }


  ngOnInit(): void {
    this.initForm();
  }


  private initForm() {
    this.form = this.fb.group({
      denominazione: [null, [Validators.minLength(3), Validators.required]],
      codiceFiscale: [null, [Validators.minLength(3), Validators.required]]
    });
    this.formRicercaSediAzienda = this.fb.group({
      azienda: [null, Validators.required]
    })
  }



  setValidatorRequired() {
    const controls = this.form.controls;
    const denominazione = controls['denominazione'].value;
    const codiceFiscale = controls['codiceFiscale'].value;
    if ( !Utils.isNullOrUndefinedOrEmptyField(denominazione)
      || !Utils.isNullOrUndefinedOrEmptyField(codiceFiscale))
      Object.keys(controls).forEach((key: string) => {
        controls[key].removeValidators(Validators.required);
        controls[key].updateValueAndValidity();
      });
  }


  onSubmit(){
    const ricercaPerInvio = this.form.getRawValue() as RicercaSediAziendaRequest;
    this.logService.info(this.constructor.name,`onSubmit:: ricercaPerInvio :: ${JSON.stringify(ricercaPerInvio)}`);
    this.cerca(ricercaPerInvio);
  }


  cerca(formRicerca: RicercaSediAziendaRequest){
    this.ricercaEffettuata = false;
    this.logService.info(this.constructor.name, 'onCerca', this.formRicerca);
    this.ricercaPerInvio = Utils.clone(formRicerca);
    // this.alertMessageService.emptyMessages();
    this.currentPaginationData = {
      limit: 20,
      page: 0,
      offset: 0,
      sort: {
        column: '0',
        direction: 'desc'
      }
    }
    this.effettuaRicerca(this.currentPaginationData.page, this.currentPaginationData.limit,this.currentPaginationData.sort);
  }


  private effettuaRicerca(page: number, limit: number, sort?: SortEvent) {
    this.spinner.show();
    this.logService.info(this.constructor.name, `effettuaRicerca: page:${page}, limit: ${limit}`);
    if (sort) {
      const orderFieldPerGianlu: OrderField = {
        columnNumber: Number(sort.column),
        order: sort.direction === 'desc' ? 1 : 0
      }
      this.ricercaPerInvio.ordinamento = orderFieldPerGianlu;
    }
    this.fascicoloService.ricercaSediAzienda(page, this.ricercaPerInvio, limit).subscribe({
      next: (res: any) => {
        this.pagedResponse = res;
        if (!Utils.isNullOrUndefinedOrEmptyField(this.pagedResponse.list)) {
          this.ricercaEffettuata = true;
          if (this.pagedResponse.list.length === 1) {
            this.formRicercaSediAzienda.controls['azienda'].setValue(this.pagedResponse.list[0])
          }
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.logService.error(this.constructor.name, `errore: ${error}`);
        this.spinner.hide();
      }
    });
    this.logService.info(this.constructor.name, `effettuaRicerca: response ${JSON.stringify(this.pagedResponse)}`);
  }


  onChangePaginationData(event: PaginationDataChange) {
    this.formRicercaSediAzienda.controls['azienda'].setValue(null);
    this.currentPaginationData = event;
    this.effettuaRicerca(this.currentPaginationData.page, this.currentPaginationData.limit, this.currentPaginationData.sort);
  }


  onClickOk() {
    const selectedItem = this.formRicercaSediAzienda.getRawValue() as AziSede;
    this.callback(this.modal, selectedItem);
  }

  getMessageByCod(cod: string) {
    // const msg = this.message.getMessage(cod);
    // return msg.desc;
  }


}

