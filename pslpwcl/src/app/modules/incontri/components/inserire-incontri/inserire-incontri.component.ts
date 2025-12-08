/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbNav, NgbNavChangeEvent, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { TYPE_ALERT } from 'src/app/constants';
import { AgendaService, AppuntamentiRidotta, CommonResponse, Cpi, Decodifica, DecodificaPslpService, DettaglioIncontro, IncServizi, ListaIncServiziResponse, RicercaSlotLiberiPrenotabiliRequest, RicercaSlotLiberiPrenotabiliResponse, Ruolo, PslpMessaggio } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-inserire-incontri',
  templateUrl: './inserire-incontri.component.html',
  styleUrls: ['./inserire-incontri.component.scss']
})
export class InserireIncontriComponent implements OnInit, OnDestroy {

  @ViewChild('nav', { static: false }) nav!: NgbNav;
  active: number = 0;

  form: FormGroup;
  categoriaServizi: any[] = [];
  elencoCpi: Decodifica[] = [];
  ruolo: Ruolo;
  sysDate: Date;
  initialRicercaSlotLiberiPrenotabiliRequest: any;
  ricercaSlotLiberiPrenotabiliRequest: any;
  // suntoLavAnag: SuntoLavAnag;
  primaRicercaSlotLiberiPrenotabiliResponse: RicercaSlotLiberiPrenotabiliResponse;
  incontro: AppuntamentiRidotta;
  listaModalitaErogazionePresenza: Decodifica[];
  listaModalitaErogazionRemoto: Decodifica[];
  idIncontro: number;

  testoBtnTorna: string;
  dettaglioIncontro: DettaglioIncontro;
  silTCpiComp: Cpi;
  msgC12: PslpMessaggio;

  oraMinima: string;
  oraMassima: string;

  constructor(
    private spinner: NgxSpinnerService,
    private logService: LogService,
    private alertMessageService: AlertMessageService,
    private agendeService: AgendaService,
    private route: ActivatedRoute,
    private decodificaService: DecodificaPslpService,
    private promptModalService: PromptModalService,
    private location: Location,
    private readonly appUserService: AppUserService,
    private commonService: CommonService,
  ) {
    this.sysDate = new Date();
    this.sysDate.setHours(0, 0, 0, 0);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.alertMessageService.emptyMessages();
  }

  ngOnInit(): void {
    this.commonService.getMessaggioByCode("C12").then(messaggio => {
      this.msgC12 = messaggio;
    });
    this.loadDecodifiche();
  }



  private async inizializzaRequestIniziale() {
    const idIncontro = this.route.snapshot.queryParamMap.get('idPrenotazione');
    if (idIncontro) this.idIncontro = Number(idIncontro);

    this.initialRicercaSlotLiberiPrenotabiliRequest = new Object() as RicercaSlotLiberiPrenotabiliRequest;
    this.initialRicercaSlotLiberiPrenotabiliRequest.dataInizio = this.sysDate;
    this.initialRicercaSlotLiberiPrenotabiliRequest.idSilLavAnagrafica = this.utente.idSilLavAnagrafica;
    if (idIncontro) {
      await this.loadDettaglioIncontro();
      this.initialRicercaSlotLiberiPrenotabiliRequest.idSilwebTIncServCateg = String(this.incontro.idSilwebTIncServCateg);
      this.initialRicercaSlotLiberiPrenotabiliRequest.idSilwebTIncServizi = this.incontro.idSilwebTIncServizi;
      this.initialRicercaSlotLiberiPrenotabiliRequest.listaIdModalitaErogazione = [this.incontro.idSilTInContattoErogaz];
      // this.initialRicercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi = [String(this.incontro.idCpiOperatore)];

      const incServizio: IncServizi = this.dettaglioIncontro.servizio;
      const presenza = this.listaModalitaErogazionePresenza.find((d: Decodifica) => d.id == this.incontro.idSilTInContattoErogaz);
      this.initialRicercaSlotLiberiPrenotabiliRequest.flgPresenza = !Utils.isNullOrUndefinedOrEmptyField(presenza);
      if (this.initialRicercaSlotLiberiPrenotabiliRequest.flgPresenza) this.initialRicercaSlotLiberiPrenotabiliRequest.listaModalitaErogazionePresenza = String(presenza.id);
      const remoto = this.listaModalitaErogazionRemoto.find((d: Decodifica) => d.id == this.incontro.idSilTInContattoErogaz);
      this.initialRicercaSlotLiberiPrenotabiliRequest.flgRemoto = !Utils.isNullOrUndefinedOrEmptyField(remoto);
      if (remoto) this.initialRicercaSlotLiberiPrenotabiliRequest.listaModalitaErogazionRemoto = String(remoto.id);

    } else {
      let idCpi: number;
      if (this.silTCpiComp)
        idCpi = this.elencoCpi.find((item: Decodifica) => item.id == this.utente.cpiComp.idSilTCpi)?.id;
      if (Utils.isNullOrUndefinedOrEmptyField(idCpi))
        idCpi = this.utente.cpiComp ? this.utente.cpiComp.idSilTCpi : 38;
      this.initialRicercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi = [idCpi];
    }


    //this.testoBtnTorna = Utils.isNullOrUndefinedOrEmptyField(this.incontro) ? `TORNA ALL'ELENCO` : `TORNA ALLA PRENOTAZIONE`;
    this.testoBtnTorna = `TORNA INDIETRO`;
    this.initialRicercaSlotLiberiPrenotabiliRequest.orarioIncontro = this.oraMinima;
    this.ricercaSlotLiberiPrenotabiliRequest = Utils.clone(this.initialRicercaSlotLiberiPrenotabiliRequest);
    this.spinner.hide();
  }

  async findServizio(idSilwebTIncServCateg: string): Promise<IncServizi[]> {
    return new Promise((resolve) => {
      this.agendeService.listaIncServizi(String(idSilwebTIncServCateg)).subscribe({
        next: (res: ListaIncServiziResponse) => {
          if (res.esitoPositivo) {
            resolve(res.listaIncServizi);
          } else {
            this.logService.error(this.constructor.name, 'listaIncServizi:: risposta negativa');
            resolve([]); // Risposta negativa, ma evitiamo di lasciare la Promise in sospeso
          }
        },
        error: (error: any) => {
          this.logService.error(this.constructor.name, `listaIncServizi:: ${JSON.stringify(error)}`);
          resolve([]); // Anche in caso di errore risolviamo la Promise per evitare stalli
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    });
  }

  async loadDettaglioIncontro(): Promise<void> {
    try {
      const res = await this.agendeService.getDettaglioIncontro(this.idIncontro).toPromise();
      if (res?.esitoPositivo) {
        this.dettaglioIncontro = res.dettaglio;
        this.incontro = res.dettaglio.incontro;
      }
      this.alertMessageService.setApiMessages(res.apiMessages);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      this.logService.error(this.constructor.name, `dettaglioIncontro:: ${JSON.stringify(err)}`);
    }
  }


  initForm() {
    this.form = new FormGroup({
      idSilwebTIncServCateg: new FormControl(null, [Validators.required]),
      idSilwebTIncServizi: new FormControl(null, [Validators.required]),
      listaIdSilTCpi: new FormArray([
        new FormControl(null)
      ]),
      flgPresenza: new FormControl(null),
      dsMail: new FormControl(null),
      dsTelefonoCell: new FormControl(null),
      flgRemoto: new FormControl(null),
      listaModalitaErogazionePresenza: new FormControl(null, [Validators.required]),
      listaModalitaErogazionRemoto: new FormControl(null, [Validators.required]),
      idSilwebTSedeEnte: new FormControl(null),
      // idOperatore: new FormControl(null),
      idSilLavAnagrafica: new FormControl(null),
      dataInizio: new FormControl(new Date),
      orarioIncontro: new FormControl(null),
    }, { validators: almenoUnaCheckboxSelezionataValidator });
  }


  private loadDecodifiche() {
    const requestCpi$ = this.decodificaService.findDecodificaByTipo('CPI');
    const requests$: any[] = [
      this.decodificaService.findDecodificaByTipo('INC-SERV-CATEG-CONSERVIZI', 'validiFuturo'),
      requestCpi$,
      this.decodificaService.findDecodificaByTipo('TIPO-CONTATTO-AGENDE', 'inpresenza'),
      this.decodificaService.findDecodificaByTipo('TIPO-CONTATTO-AGENDE', 'daremoto'),
      this.decodificaService.findParametro("AGENDE_ORA_INIZIO"),
      this.decodificaService.findParametro("AGENDE_ORA_FINE")
    ];
    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo) {
          multiResponse[0].list.forEach((item: any) => item.id = String(item.id));
          this.categoriaServizi = multiResponse[0].list;
        }

        if (multiResponse[1].esitoPositivo) {
          this.elencoCpi = multiResponse[1].list;
        }

        if (multiResponse[2].esitoPositivo) {
          this.listaModalitaErogazionePresenza = multiResponse[2].list;
        }

        if (multiResponse[3].esitoPositivo) {
          this.listaModalitaErogazionRemoto = multiResponse[3].list;
        }

        if (multiResponse[4]?.esitoPositivo){
          this.oraMinima = multiResponse[4].parametro.valoreParametro;
        }
        if (multiResponse[5]?.esitoPositivo){
          this.oraMassima = multiResponse[5].parametro.valoreParametro;
        }

        this.inizializzaRequestIniziale();
        this.form.addValidators([
          oraRangeValidator(
            Utils.convertTimeStringToNgbTimeStruct(this.oraMinima),
            Utils.convertTimeStringToNgbTimeStruct(this.oraMassima),
          ),
        ]);

      },
      error: (error: any) => { this.logService.error(this.constructor.name, `loadDecodifiche:: ${JSON.stringify(error)}`) },
    });

  }



  async onClickNavChange($event: NgbNavChangeEvent) {
    $event.preventDefault();
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return
    }
    else if ($event.nextId === 1) {
      this.prosegui();
    } else this.active = $event.nextId;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }


  verificaVincoliServizio() {
    this.spinner.show();
    const idSilLavAnagrafica = this.form.get('idSilLavAnagrafica').value;
    const idSilwebTIncServizi = Number(this.form.get('idSilwebTIncServizi').value);

    this.agendeService.verificaVincoliServizioLavoratore(idSilLavAnagrafica, idSilwebTIncServizi).subscribe({
      next: (res: CommonResponse) => {
        if (res.esitoPositivo) {
          this.prosegui();
        } else {
          this.spinner.hide();
          this.alertMessageService.setApiMessages(res.apiMessages);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      // --- AGGIUNGI QUESTO BLOCCO ---
      error: (err) => {
        this.spinner.hide();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // -----------------------------
    });
  }

  async prosegui() {
    this.spinner.show();
    this.componiRequest();

    let prosegui: boolean = !Utils.isNullOrUndefined(this.incontro);
    if (!prosegui) {

      try {
        const res: RicercaSlotLiberiPrenotabiliResponse = await this.agendeService
          .ricercaSlotLiberiPrenotabili('presenzaIncontroServizio', this.ricercaSlotLiberiPrenotabiliRequest).toPromise();

        prosegui = res.esitoPositivo;
        if (!prosegui) {
          this.alertMessageService.setApiMessages(res.apiMessages);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();

      }

    }

    if (prosegui)
      this.ricerca(this.ricercaSlotLiberiPrenotabiliRequest);


  }


  private componiRequest() {
    const formRawValue = this.form.getRawValue();
    this.ricercaSlotLiberiPrenotabiliRequest.idSilwebTIncServCateg = formRawValue.idSilwebTIncServCateg;
    this.ricercaSlotLiberiPrenotabiliRequest.idSilwebTIncServizi = formRawValue.idSilwebTIncServizi;
    this.ricercaSlotLiberiPrenotabiliRequest.idSilwebTSedeEnte = formRawValue.idSilwebTSedeEnte;
    // this.ricercaSlotLiberiPrenotabiliRequest.idOperatore = formRawValue.idOperatore;
    //this.ricercaSlotLiberiPrenotabiliRequest.listaIdSilTCpi = formRawValue.listaIdSilTCpi;
    this.ricercaSlotLiberiPrenotabiliRequest.idSilLavAnagrafica = this.utente.idSilLavAnagrafica;
    this.ricercaSlotLiberiPrenotabiliRequest.dataInizio = formRawValue.dataInizio;
    const listaIdModalitaErogazione: number[] = [];
    if (formRawValue.listaModalitaErogazionePresenza) listaIdModalitaErogazione.push(Number(formRawValue.listaModalitaErogazionePresenza))
    if (formRawValue.listaModalitaErogazionRemoto) listaIdModalitaErogazione.push(Number(formRawValue.listaModalitaErogazionRemoto))
    this.ricercaSlotLiberiPrenotabiliRequest.listaIdModalitaErogazione = listaIdModalitaErogazione;

    if(formRawValue.orarioIncontro && formRawValue.orarioIncontro.hour)
      this.ricercaSlotLiberiPrenotabiliRequest.orarioIncontro = Utils.convertNgbTimeStructToString(formRawValue.orarioIncontro);
    else
      this.ricercaSlotLiberiPrenotabiliRequest.orarioIncontro = null;
  

  }

  ricerca(request: RicercaSlotLiberiPrenotabiliRequest) {
    this.spinner.show();
    this.agendeService.ricercaSlotLiberiPrenotabili('mensile', request).subscribe({
      next: (res: RicercaSlotLiberiPrenotabiliResponse) => {
        if (res.esitoPositivo) {
          this.primaRicercaSlotLiberiPrenotabiliResponse = res;
          if (this.primaRicercaSlotLiberiPrenotabiliResponse.listMensileSlot && this.primaRicercaSlotLiberiPrenotabiliResponse.listMensileSlot.length > 0) {
            this.goToStepAppuntamento();
          } else this.alertMessageService.setSingleWarningMessage('Nessun risultato trovato.');

        } else this.alertMessageService.setApiMessages(res.apiMessages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => { },
      complete: () => { this.spinner.hide(); }
    });
  }

  private goToStepAppuntamento() {
    const current = Number(this.active);
    let next: number = 1;
    if (current === 0)
      next = current + 1;
    else if (current === 2)
      next = current - 1;
    this.active = next;
  }

  async onClickTornaElenco() {
    if(this.active < 2){
      const data: DialogModaleMessage = {
        titolo: this.msgC12.intestazione,
        tipo: TypeDialogMessage.YesOrNo,
        messaggio: this.msgC12.testo,
        messaggioAggiuntivo: "",
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result === 'NO')
        return;
    }
    

    this.spinner.show();
    this.location.back();
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

}
export function almenoUnaCheckboxSelezionataValidator(control: AbstractControl): ValidationErrors | null {
  const flgPresenza = control.get('flgPresenza')?.value;
  const flgRemoto = control.get('flgRemoto')?.value;

  if (!flgPresenza && !flgRemoto) {
    return { almenoUnaModalitaObbligatoria: true };
  }

  return null;
}

function oraRangeValidator(
  min: NgbTimeStruct,
  max: NgbTimeStruct,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const oraInizio = group.get('orarioIncontro')?.value;
   

    const errors: any = {};
   
    const minMinuti = Utils.timeToMinutes(min);
    const maxMinuti = Utils.timeToMinutes(max);
    const minutiInizio = Utils.timeToMinutes(oraInizio || 0);

    if (oraInizio && oraInizio.hour &&  minutiInizio < minMinuti) {
      errors.oraInizioMin = true;
    }

    if (oraInizio && oraInizio.hour && minutiInizio > maxMinuti) {
      errors.oraInizioMax = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}