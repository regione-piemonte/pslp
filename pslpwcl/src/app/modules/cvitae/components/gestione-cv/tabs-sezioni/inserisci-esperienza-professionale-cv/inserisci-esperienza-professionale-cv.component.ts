/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */

import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { AziSede, Decodifica, DecodificaBlpService, DecodificaPslpService, EsperienzaLav, EsperienzaProfessionale, InserisciAggiornaEsperienzaLavRequest, ModalitaLavoro, PslpMessaggio } from 'src/app/modules/pslpapi';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { Utils } from 'src/app/utils';
import { LogService } from 'src/app/services/log.service';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { MOD } from 'src/app/constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-inserisci-esperienza-professionale-cv',
  templateUrl: './inserisci-esperienza-professionale-cv.component.html',
  styleUrls: ['./inserisci-esperienza-professionale-cv.component.scss']
})
export class InserisciEsperienzaProfessionaleCvComponent implements OnInit, OnChanges {
  minDate: Date = new Date(1900, 1, 1);
  sysDate: Date = new Date();
  mode = MOD.INS;
  //@Input() idSilLavAnagrafica?: number;
  @Input() esperienzaSelected?: EsperienzaLav;
  @Input() mod: string = 'ins';
  mostraMessagioErrore: boolean = false;

  @Output() caricaEsp: EventEmitter<EsperienzaLav> = new EventEmitter()
  @Output() aggiornaEsp: EventEmitter<EsperienzaLav> = new EventEmitter()
  @Output() annulla: EventEmitter<boolean> = new EventEmitter()
  @ViewChild('nav') nav: NgbNav;


  tipoLavori: Decodifica[] = [];

  modalitaLavori: Decodifica[] = [];

  qualifiche: Decodifica[] = [];

  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;


  comuni: Decodifica[] = [];
  stati: Decodifica[] = [];

  correspondingLivelli: Decodifica[] = [];

  modalitaLavSelected: ModalitaLavoro;

  esperienza: EsperienzaProfessionale;

  form = this.fb.group({
    dataInizio: [null, [Validators.required]],
    dataFine: [null],
    blpTTipoLavoro: this.fb.group({ //tipo
      idblpTTipoLavoro: ["", [Validators.required]],
      descr: [null]
    }),
    blpTQualifica: this.fb.group({
      idblpTQualifica: [null]
    }),
    dsQualifica: [null],
    dsMansione: [null],
    dsDenominazioneDl: [null],
    flgLuogoDl: [null],
    blpTComuneDl: this.fb.group({
      id: [null],
      descr: [null]
    }),
    blpTNazioneDl: this.fb.group({
      idblpTNazione: [null]
    }),
    dsIndirizzoDl: this.fb.control(null),
    flgLavoroAttuale: ["N", Validators.required],

  });


  constructor(
    private decodificaService: DecodificaBlpService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private logService: LogService,
    private promptModalService: PromptModalService,
    private cvService: CvService,
    private cvBagService: CvitaeService,
    private commonService: CommonService
  ) { }

  get f() {
    return this.form.controls as any;
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.form.reset()
    this.form.updateValueAndValidity()
    this.qualifiche = []
    this.patchForm()
  }



  ngOnInit() {
    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento = messaggio;
    });

    // pslp_d_messaggio modifica generico
    this.commonService.getMessaggioByCode("I16").then(messaggio => {
      this.messagioAggiornamento = messaggio;
    });

    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione = messaggio;
    });

    // CORREZIONE NG0100: Usa setTimeout per evitare ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (!this.canModifica || this.mod != "m") {
        this.form.disable()
      } else {
        this.form.enable()
      }
      this.configDecodifiche()
      this.form.get('dataFine').addValidators([this.dataRangeValidator])
      this.form.get('dataFine').updateValueAndValidity()
      this.form.get('dataInizio').addValidators([this.dataRangeValidator])
      this.form.get('dataInizio').updateValueAndValidity()
    }, 0);
  }
  private dataRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalidDataRangeCessaz = false;
    let invalidDataRangePeriodo = false;
    const dataAssunzione = this.form.get('dataInizio').value;
    const dataCessazione = this.form.get('dataFine').value;
    if (!dataAssunzione || !dataCessazione) {
      return null;
    }

    if (dataCessazione) {
      const dtInizio: Date = new Date(dataAssunzione);
      const dtFine: Date = new Date(dataCessazione);
      dtInizio.setHours(0, 0, 0, 0);
      dtFine.setHours(0, 0, 0, 0);
      invalidDataRangeCessaz = dtInizio.valueOf() > dtFine.valueOf();

    }
    if (!invalidDataRangeCessaz) {
      this.form.get('dataInizio').setErrors(null)
      this.form.get('dataFine').setErrors(null)
    } else {
      this.form.get('dataInizio').setErrors({ invalidDataRangeCessaz: true })
      this.form.get('dataFine').setErrors({ invalidDataRangeCessaz: true })
      return { invalidDataRangeCessaz }
    }
    return invalidDataRangeCessaz || invalidDataRangePeriodo ? { invalidDataRangeCessaz, invalidDataRangePeriodo } : null;
  }
  patchForm() {

    this.form.enable()

    this.form.get("dsDenominazioneDl").setValue(this.esperienzaSelected?.dsDatoreLavoro ?? null)
    this.form.get("flgLuogoDl").setValue(
      !(this.esperienzaSelected?.idComuneDatoreLavoro || this.esperienzaSelected?.idNazioneDatoreLavoro)
        ? null :
        (this.esperienzaSelected?.idComuneDatoreLavoro ? "I" : "E")
    )
    this.setLuogoDlSedeControl()

    this.form.get("dsMansione").setValue(this.esperienzaSelected?.dsMansioniResponsabil)
    this.form.get("dsQualifica").setValue(this.esperienzaSelected?.dsQualifica)
    this.form.get("dsIndirizzoDl").setValue(this.esperienzaSelected?.dsIndirizzoDatoreLavoro)
    this.form.get("dataInizio").setValue(this.esperienzaSelected?.dInizioRapporto ? new Date(this.esperienzaSelected?.dInizioRapporto) : null)
    this.form.get("dataFine").setValue(this.esperienzaSelected?.dFineRapporto ? new Date(this.esperienzaSelected?.dFineRapporto) : null)

    if (this.esperienzaSelected?.idComuneDatoreLavoro?.idComune) {
      this.comuni.push({
        id: this.esperienzaSelected?.idComuneDatoreLavoro?.idComune,
        descr: this.esperienzaSelected?.idComuneDatoreLavoro?.dsComune

      })
    }
    this.form.get("blpTComuneDl.id").setValue(this.esperienzaSelected?.idComuneDatoreLavoro?.idComune?.toString() ?? null)
    this.form.get("blpTNazioneDl.idblpTNazione").setValue(this.esperienzaSelected?.idNazioneDatoreLavoro?.idNazione?.toString() ?? null)
    this.form.get("flgLavoroAttuale").setValue(this.esperienzaSelected?.flgLavoroAttuale)
    this.form.get("blpTTipoLavoro.idblpTTipoLavoro").setValue(this.esperienzaSelected?.idTipoRapportoLavoro?.id.toString())


    if (!this.canModifica || this.mod != "m") {
      this.form.disable()
    }


    if (this.esperienzaSelected?.idQualifica?.descrQualifica) {
      this.qualifiche.push({
        id: this.esperienzaSelected?.idQualifica?.idQualifica,
        descr: this.esperienzaSelected?.idQualifica?.descrQualifica
      })
      this.form.get("blpTQualifica.idblpTQualifica").setValue(this.esperienzaSelected?.idQualifica?.idQualifica.toString())
    }
  }
  async onClickAnnulla() {
    if (this.mod != 'v') {
      const data: DialogModaleMessage = {
        titolo: this.mod === 'ins' ? 'Inserimento esperienza professionale' : 'Modifica esperienza professionale',
        tipo: TypeDialogMessage.YesOrNo,
        messaggio: "Sei sicuro di voler annullare l'operazione? Gli eventuali dati non salvati andranno persi.",
        messaggioAggiuntivo: "",
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result === 'SI') {
        // this.alertMessageService.emptyMessages();
        this.form.reset();
        this.annulla.emit(true);
        return true;
      } else {
        return false;
      }
    }
    this.annulla.emit(true);

    return true;
  }


  onConferma() {
    this.form.markAllAsTouched()
    if (!this.form.valid) {
      this.mostraMessagioErrore = true;
      return;
    }
    let request: any = {
      esperienzaLav: Utils.cleanObject(this.creaEsperienzaLAv())
    }
    if (!this.esperienzaSelected) {
      this.cvService.inserisciEsperienzaLavoro(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            const data: DialogModaleMessage = {
              titolo: "Esperienza professionale",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioInserimento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.annulla.emit(true);
            this.caricaEsp.emit(ris.esperienzaDiLavoro)
          }
        }
      )
    } else {
      this.cvService.aggiornaEsperienzaLavoro(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            const data: DialogModaleMessage = {
              titolo: "Esperienza professionale",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioAggiornamento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.annulla.emit(true);
            this.aggiornaEsp.emit(ris.esperienzaDiLavoro)
          }
        }
      )
    }
  }

  creaEsperienzaLAv(): EsperienzaLav {
    // let esperienza:EsperienzaLav=this.esperienzaSelected
    return {
      id: this.esperienzaSelected?.id,
      idCandidatura: this.cvBagService.cvitaeActual?.id,
      dsDatoreLavoro: this.form.get("dsDenominazioneDl").value,
      dsMansioniResponsabil: this.form.get("dsMansione").value,
      dsQualifica: this.form.get("dsQualifica").value,
      dsIndirizzoDatoreLavoro: this.form.get("dsIndirizzoDl").value,
      dInizioRapporto: this.form.get("dataInizio").value,
      dFineRapporto: this.form.get("dataFine").value,
      idComuneDatoreLavoro: { idComune: this.form.get("blpTComuneDl.id").value },
      idNazioneDatoreLavoro: { idNazione: this.form.get("blpTNazioneDl.idblpTNazione").value },
      flgLavoroAttuale: this.form.get("flgLavoroAttuale").value,
      idTipoRapportoLavoro: {
        id: this.form.get("blpTTipoLavoro.idblpTTipoLavoro").value
      },
      idQualifica: {
        idQualifica: this.form.get("blpTQualifica.idblpTQualifica").value
      },
      flgEsperienzaCo: this.esperienzaSelected ? this.esperienzaSelected.flgEsperienzaCo : "N",
      idSilLAvEsperienzaLavoro: this.esperienzaSelected?.idSilLAvEsperienzaLavoro,
      codUserAggiorn: "",
      codUserInserim: "",
      dAggiorn: new Date(),
      dInserim: new Date(),
    }
  }

  onFilterQualifica(event: any) {
    let txt: string = event?.filter;
    if (txt == null || txt == undefined || txt.length < 2) { return; }
    this.decodificaService.fill("QUALIFICA", txt).subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.qualifiche = [...r.list];

        }
      },
      error: err => { },
      complete: () => { }
    })
  }
  configDecodifiche() {
    let body: any = {}
    this.decodificaService.findDecodificaBlpByTipo('NAZIONE', body).subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.stati = r.list;
        }
      },
      error: err => { },
      complete: () => { }
    })
    this.decodificaService.findDecodificaBlpByTipo('TIPO_RAPPORTO_LAVORO', body).subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.tipoLavori = r.list;
        }
      },
      error: err => { },
      complete: () => { }
    })


  }

  setLuogoDlSedeControl() {
    const flgLuogoDl = this.form.get('flgLuogoDl').value;

    if (flgLuogoDl == 'I') {
      this.form.get('blpTNazioneDl').reset();
      this.form.get('blpTNazioneDl').disable();
      this.form.get('blpTComuneDl').enable();
      this.form.get('dsIndirizzoDl').enable();
    } else if (flgLuogoDl == 'E') {
      this.form.get('blpTComuneDl').reset();
      this.form.get('dsIndirizzoDl').reset();
      this.form.get('blpTNazioneDl').enable();
      this.form.get('blpTComuneDl').disable();
      this.form.get('dsIndirizzoDl').disable();
    } else {
      this.form.get('blpTNazioneDl').disable();
      this.form.get('blpTComuneDl').disable();
      this.form.get('dsIndirizzoDl').disable();
    }
  }

  onFilterComuneDl(event: any, isAzienda: boolean = false) {
    let txt: string = event?.filter;
    if (txt == null || txt == undefined || txt.length < 2) { return; }
    this.decodificaService.fill("COMUNE", txt).subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.comuni = [...r.list];

        }
      },
      error: err => { },
      complete: () => { }
    })
  }
  get canModifica() {
    return this.cvBagService.cvitaeActual?.flgGeneratoDaSistema != "S" && this.cvBagService.getAzioneActual() == "M"
  }

  get altreValidazioneForm() {
    //console.log(this.form.get("blpTQualifica.idblpTQualifica").value || (this.form.get("dsQualifica").value!="" && this.form.get("dsQualifica").value!=undefined))
    return !(this.form.get("blpTQualifica.idblpTQualifica").value || (this.form.get("dsQualifica").value != "" && this.form.get("dsQualifica").value != undefined))
  }

  onChangeForm() {
    if (this.form.valid)
      this.mostraMessagioErrore = false;
    console.log(this.form)
  }
}
