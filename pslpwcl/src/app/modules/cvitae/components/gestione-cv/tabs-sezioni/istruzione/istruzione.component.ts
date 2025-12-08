/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import {
  Candidatura,
  Decodifica,
  DecodificaBlpService,
  FascicoloPslpService,
  IstruzioneDich,
  LavTitoloStudioAltro,
  PslpMessaggio,
  SchedaAnagraficaProfessionale,
  TitoloDiStudio,
  TitoloStudio,
} from 'src/app/modules/pslpapi';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';

import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-istruzione',
  templateUrl: './istruzione.component.html',
  styleUrls: ['./istruzione.component.scss'],
})
export class IstruzioneComponent implements OnInit {

  titoliDiStudio: TitoloDiStudio[] = [];
  fascicoloSelected?: SchedaAnagraficaProfessionale;
  cvSelected?: Candidatura;
  titoliDiStudioCv: IstruzioneDich[] = [];
  istruzioneSelected?: IstruzioneDich;

  province: Decodifica[] = [];
  toponimos: Decodifica[] = [];
  comuniIst: Decodifica[] = [];
  comuniAz: Decodifica[] = [];
  nazioniEstere: Decodifica[] = [];
  tipoApprendistati: Decodifica[] = [];
  tipoDurata: Decodifica[] = [];
  statiTitoloStudio: Decodifica[] = [];
  titoliStudios: TitoloStudio[] = [];
  titoloStudioSelected: TitoloStudio;
  livelloTitoloStudio: string;
  form: FormGroup = this.fb.group({
    lavTitoloStudio: this.fb.group({
      blpTStudio: this.fb.group({
        id: [null, [Validators.required]],
      }),
      flgConseguitoInItalia: [null],
      dataInizio: [null, [Validators.required]],
      dataFine: [null],
      dsTitoloStudio: [null],
      flgInCorso: ["N"],
      dsVoto: [null],
      valoreMassimo: [null],
    }),

    lavTitoloStudioAltro: this.fb.group({
      dsDenominazioneIst: [null],
      flgLuogoIstItalia: [null],
      blpTProvinceIst: this.fb.group({
        id: [null],
      }),
      blpTComuneIst: this.fb.group({
        id: [null],
      }),
      blpTNazioneIst: this.fb.group({
        id: [null],
      }),
      indirizzo: [null],
      toponimo: this.fb.group({
        id: [null],
        descr: [null]
      }),
      numeroCivico: [null],
      flgStageFinale: [null, Validators.required],
    }),
  });

  showForm = false;

  showDettaglio = false;
  titoloDiStudio?: TitoloDiStudio;
  titoliDiStudioFiltrati?: TitoloDiStudio[];
  lavTitoloStudioAltro?: LavTitoloStudioAltro;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  messaggioNonCiSonoDati: PslpMessaggio;
  messaggioIstruzioneFasc: PslpMessaggio;
  messaggioIstruzionegCv: PslpMessaggio;


  constructor(
    private spinner: NgxSpinnerService,
    private fascicoloService: FascicoloPslpService,
    private logService: LogService,
    private fb: FormBuilder,
    private decodificaBlpService: DecodificaBlpService,
    private promptModalService: PromptModalService,
    private commonService: CommonService,
    private cvBagService: CvitaeService,
    private cvService: CvService,
    private mapToBlpService: MappingService
  ) { }

  ngOnInit(): void {
    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati = messaggio;
    });
    // pslp_d_messaggio corsi fascicolo
    this.commonService.getMessaggioByCode("I22").then(messaggio => {
      this.messaggioIstruzioneFasc = messaggio;
    });
    // pslp_d_messaggio  corsi Cv
    this.commonService.getMessaggioByCode("I23").then(messaggio => {
      this.messaggioIstruzionegCv = messaggio;
    });

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
    this.fascicoloSelected = this.commonService.fascicoloActual;
    this.titoliDiStudio = this.fascicoloSelected?.informazioniCurriculari?.percorsoFormativo?.titoliDiStudio;

    this.cvBagService.selectedCv.subscribe((ris) => {
      this.cvSelected = ris;
      this.titoliDiStudioCv = this.cvSelected?.istruzioneDichList;
      this.titoliDiStudioFiltrati = this.titoliDiStudio.filter(tit => !this.titoliDiStudioCv?.find(titCv => tit.codice == titCv.idTitoloStudio?.codTitoloStudioMin))
    });
    this.loadDecodifiche();
    this.initForm();
    this.onChangeInCorso(this.form.get('lavTitoloStudio.flgInCorso').value);
    this.setControlStatesIstituto();

  }

  private votoValoreValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {

    let invalid = false;
    const valore = this.form.controls['lavTitoloStudio'].get('valoreMassimo').value;
    const voto = this.form.controls['lavTitoloStudio'].get('dsVoto').value;
    if (!valore && !voto) return null;
    if ((!Utils.isNullOrUndefinedOrEmptyField(voto) && !isNaN(voto)) && (!Utils.isNullOrUndefinedOrEmptyField(valore) && !isNaN(valore)))
      invalid = Number(valore) < Number(voto);
    return invalid ? { valoreMax: { invalid } } : null;
  };
  initForm() {
    this.form.get('lavTitoloStudio.dataInizio').addValidators([this.dataRangeValidator]);
    this.form.get('lavTitoloStudio.dataFine').addValidators([this.dataRangeValidator]);
    this.form.get('lavTitoloStudio.flgInCorso').setValue("N");
    this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').setValue("I");
    this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').updateValueAndValidity()

  }

  onModificaIstruzione(istruzioneDich: IstruzioneDich) {
    this.istruzioneSelected = istruzioneDich;
    this.patchForm("m");
  }
  onChangeInCorso(flgInCorso: string) {


    if (flgInCorso == "S") {
      this.form.get('lavTitoloStudio.dsVoto').disable()
      this.form.get('lavTitoloStudio.dsVoto').reset()
      this.form.get('lavTitoloStudio.valoreMassimo').disable()
      this.form.get('lavTitoloStudio.valoreMassimo').reset()
    } else {
      this.form.get('lavTitoloStudio.dsVoto').enable()
      this.form.get('lavTitoloStudio.dsVoto').reset()
      //this.form.get('lavTitoloStudio.dsVoto').setValidators(Validators.required)
      this.form.get('lavTitoloStudio.valoreMassimo').enable()
      this.form.get('lavTitoloStudio.valoreMassimo').reset()
      //this.form.get('lavTitoloStudio.valoreMassimo').setValidators(Validators.required)
    }
  }
  onVisualizzaIstruzione(istruzioneDich: IstruzioneDich) {
    this.istruzioneSelected = istruzioneDich;
    this.patchForm("v");
  }
  onNuovoTitolo() {
    this.showForm = true
    this.istruzioneSelected = undefined
    this.titoloStudioSelected = undefined
    this.livelloTitoloStudio = undefined
    this.form.reset()
    this.form.enable()
    this.initForm();
    this.onChangeInCorso(this.form.get('lavTitoloStudio.flgInCorso').value);
    this.setControlStatesIstituto();
  }


  patchForm(azione: string) {
    this.showForm = true;
    this.titoliStudios.push(this.istruzioneSelected.idTitoloStudio)
    this.titoliStudios = this.titoliStudios.map(t => {
      return {
        ...t,
        descr: (t?.descrTitoloStudio + "-" + t?.idLivelloStudio?.descrLivelloStudio)
      }
    })
    if (this.istruzioneSelected?.idComuneSedeIstituto?.idComune) {
      this.decodificaBlpService
        .findDecodificaBlpById('COMUNE', this.istruzioneSelected?.idComuneSedeIstituto?.idComune?.toString()).subscribe(
          (ris) => {
            this.comuniIst.push(ris.decodifica);
            this.form.controls['lavTitoloStudioAltro'].get('blpTComuneIst.id').patchValue(this.istruzioneSelected?.idComuneSedeIstituto?.idComune?.toString());
          });
    } else if (this.istruzioneSelected?.idNazioneSedeIstituto?.idNazione) {
      this.decodificaBlpService.findDecodificaBlpById('NAZIONE', this.istruzioneSelected?.idNazioneSedeIstituto?.idNazione?.toString())
        .subscribe((ris) => {
          this.nazioniEstere.push(ris.decodifica);

          this.form.controls['lavTitoloStudioAltro'].get('blpTNazioneIst.id').patchValue(this.istruzioneSelected?.idNazioneSedeIstituto?.idNazione?.toString());
        });
    }

    this.livelloTitoloStudio = this.istruzioneSelected?.idLivelloStudio?.descrLivelloStudio;
    this.form.controls['lavTitoloStudio'].get('flgConseguitoInItalia').patchValue(this.istruzioneSelected.flgConseguitoInItalia);
    this.form.controls['lavTitoloStudio'].get('dataInizio').patchValue(
      this.istruzioneSelected?.dInizio
        ? new Date(this.istruzioneSelected?.dInizio)
        : undefined
    );
    this.form.controls['lavTitoloStudio'].get('dataFine').patchValue(this.istruzioneSelected?.dFine
      ? new Date(this.istruzioneSelected?.dFine)
      : undefined
    );
    this.form.controls['lavTitoloStudio'].get('dsTitoloStudio').patchValue(this.istruzioneSelected?.descrizioneTitolo);
    this.form.controls['lavTitoloStudio'].get('flgInCorso').patchValue(this.istruzioneSelected.flgInCorso);
    let dsVoto = this.istruzioneSelected?.votazioneConseguita?.split('/')[0];
    let votoMassimo = this.istruzioneSelected?.votazioneConseguita?.split('/')[1];

    this.form.controls['lavTitoloStudio'].get('dsVoto').patchValue(dsVoto);
    this.form.controls['lavTitoloStudio'].get('valoreMassimo').patchValue(votoMassimo ? votoMassimo : "");

    this.form.controls['lavTitoloStudioAltro'].get('dsDenominazioneIst').patchValue(this.istruzioneSelected?.nomeIstituto);
    if (this.istruzioneSelected.idComuneSedeIstituto)
      this.form.controls['lavTitoloStudioAltro'].get('flgLuogoIstItalia').setValue('I');
    if (this.istruzioneSelected.idNazioneSedeIstituto)
      this.form.controls['lavTitoloStudioAltro'].get('flgLuogoIstItalia').setValue('E');

    this.form.controls['lavTitoloStudioAltro'].get('indirizzo').patchValue(this.istruzioneSelected?.indirizzoIstituto ?? "");

    this.form.controls['lavTitoloStudioAltro'].get('flgStageFinale').setValue(this.istruzioneSelected?.flgStagePcto.trim());//non so perchè arriva sporco

    this.form.get("lavTitoloStudio.blpTStudio.id").patchValue(this.istruzioneSelected.idTitoloStudio.idTitoloStudio)
    this.titoloStudioSelected = this.istruzioneSelected.idTitoloStudio
    this.form.get('lavTitoloStudioAltro.toponimo.id').setValue(this.istruzioneSelected.idToponimoIstituto?.idToponimo)
    this.form.get('lavTitoloStudioAltro.numeroCivico').setValue(this.istruzioneSelected.numCivicoIstituto)

    if (!this.canModifica || azione != "m") {
      this.form.disable();
    } else {
      this.form.enable();
      this.setControlStatesIstituto();
      if (this.titoloStudioSelected) {
        this.form.get("lavTitoloStudio.blpTStudio").disable()
      }
    }
  }
  loadDecodifiche() {
    this.decodificaBlpService.findDecodificaBlpByTipo('NAZIONE').subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.nazioniEstere = r.list;
        }
      },
      error: (err) => { },
      complete: () => { },
    });
    this.decodificaBlpService.findDecodificaBlpByTipo('TOPONIMO').subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.toponimos = r.list;
        }
      },
      error: (err) => { },
      complete: () => { },
    })
    this.decodificaBlpService.findDecodificaBlpByTipo('PROVINCIA').subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.province = r.list;
        }
      },
      error: (err) => { },
      complete: () => { },
    });
  }

  addTitoloACv(titoloDiStudio: TitoloDiStudio) {
    this.fascicoloService
      .getDettaglioTitoloDiStudio(titoloDiStudio.lavTitoloStudio.idSilLavStudio)
      .subscribe({
        next: (ris) => {
          if (ris.esitoPositivo) {
            let request: any = {
              idCv: this.cvSelected.id,
              lavTitoloStudio: ris.lavTitoloStudio,
              lavTitoloStudioAltro: ris.lavTitoloStudioAltro,
            };
            this.mapToBlpService
              .insertIstruzioneFromSilp(request)
              .subscribe((ris) => {
                if (ris.esitoPositivo) {
                  this.titoliDiStudioCv.push(ris.istruzioneDich);
                  this.updateCv();
                  this.form.reset();
                  this.showForm = false;
                }
              });
          }
        },
      });
  }
  inserisciAggiornaIstruzioneDich() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    let istruzioneDich: IstruzioneDich = this.creaIstruzione();
    console.log(istruzioneDich)
    let request: any = {
      istruzioneDich: Utils.cleanObject(istruzioneDich),
    };
    if (istruzioneDich?.id)
      this.cvService.aggiornaIstruzioneDich(request).subscribe((ris) => {
        if (ris.esitoPositivo) {
          this.titoliDiStudioCv.splice(this.titoliDiStudioCv.findIndex((istr) => istr.id == istruzioneDich.id), 1, ris.istruzioneDich);
          const data: DialogModaleMessage = {
            titolo: "Istruzione",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioAggiornamento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data);
          this.form.reset();
          this.showForm = false;
          this.updateCv()
        }
      });
    else
      this.cvService.inserisciIstruzioneDich(request).subscribe((ris) => {
        if (ris.esitoPositivo) {
          this.titoliDiStudioCv.push(ris.istruzioneDich);
          this.istruzioneSelected = ris.istruzioneDich
          this.form.get("lavTitoloStudio.blpTStudio").disable()
          const data: DialogModaleMessage = {
            titolo: "Istruzione",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.form.reset();
          this.showForm = false;
          this.updateCv()
        }
      });
  }
  creaIstruzione(): IstruzioneDich {

    return {
      ...this.istruzioneSelected,
      idCandidatura: this.cvSelected.id,
      descrizioneTitolo: this.form.get('lavTitoloStudio.dsTitoloStudio')
        .value,
      flgInCorso: this.form.get('lavTitoloStudio.flgInCorso').value,
      flgStagePcto: this.form.get('lavTitoloStudioAltro.flgStageFinale').value,
      dInizio: this.form.get('lavTitoloStudio.dataInizio').value,
      idLivelloStudio: {
        id: Number(this.titoloStudioSelected?.idLivelloStudio.id)
      },
      dFine: this.form.get('lavTitoloStudio.dataFine').value,
      flgConseguitoInItalia: this.form.get('lavTitoloStudio.flgConseguitoInItalia').value,
      idComuneSedeIstituto: this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').value === 'I' && this.form.get('lavTitoloStudioAltro.blpTComuneIst.id').value ? {
        idComune: this.form.get('lavTitoloStudioAltro.blpTComuneIst.id').value,
      } : undefined,
      idNazioneSedeIstituto: this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').value === 'E' && this.form.get('lavTitoloStudioAltro.blpTNazioneIst.id').value ? {
        idNazione: this.form.get('lavTitoloStudioAltro.blpTNazioneIst.id').value,
      } : undefined,
      idTitoloStudio: {
        idTitoloStudio: this.titoloStudioSelected?.idTitoloStudio,
      },
      idToponimoIstituto: this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').value === 'I' && this.form.get('lavTitoloStudioAltro.toponimo.id').value ? {
        idToponimo: this.form.get('lavTitoloStudioAltro.toponimo.id').value
      } : undefined,
      numCivicoIstituto: this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').value === 'I' && this.form.get('lavTitoloStudioAltro.numeroCivico').value
        ? this.form.get('lavTitoloStudioAltro.numeroCivico').value
        : undefined,
      indirizzoIstituto: this.form.get('lavTitoloStudioAltro.flgLuogoIstItalia').value === 'I' && this.form.get('lavTitoloStudioAltro.indirizzo').value
        ? this.form.get('lavTitoloStudioAltro.indirizzo').value
        : undefined,
      nomeIstituto: this.form.get('lavTitoloStudioAltro.dsDenominazioneIst').value,
      annoCompletamento: this.form.get('lavTitoloStudio.dataFine').value
        ? new Date(
          this.form.get('lavTitoloStudio.dataFine').value
        ).getFullYear()
        : undefined,
      votazioneConseguita: this.form.get('lavTitoloStudio.dsVoto').value
        ? this.form.get('lavTitoloStudio.dsVoto').value +
        '/' +
        this.form.get('lavTitoloStudio.valoreMassimo').value
        : undefined,
      codUserAggiorn: '',
      codUserInserim: '',
      dAggiorn: new Date(),
      dInserim: new Date(),
    };
  }
  sysDate = new Date();
  numCivicoRegex: RegExp = /^\d+[A-Za-z\d/]*$/;
  VotoValoreRequired: boolean = false;

  durataStageIsRequired: boolean = false;
  wrapperSelectedTitoloStudio: any;
  formMode = 'ins';

  onFilterComune(event?: any) {
    let txt: string = event?.filter;
    if (txt == null || txt == undefined || txt.length < 3) {
      return;
    }
    this.decodificaBlpService.fill('COMUNE', txt,).subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.comuniIst = [...r.list];
        }
      },
      error: (err) => { },
      complete: () => { },
    });
  }

  viewTitolo(titolo: TitoloDiStudio) {
    this.showDettaglio = true;
    this.titoloDiStudio = titolo;

    this.fascicoloService
      .getDettaglioTitoloDiStudio(titolo.lavTitoloStudio.idSilLavStudio)
      .subscribe({
        next: (res: any) => {
          if (res.esitoPositivo) {
            this.lavTitoloStudioAltro = res.lavTitoloStudioAltro;
            this.promptModalService.openVisualizzaTitoloStudioFascicolo(titolo, this.lavTitoloStudioAltro);

          }
        },
        error: (err) => {
          this.logService.error(
            this.constructor.name,
            `titolo studio : ${this.constructor.name}: ${JSON.stringify(err)}`
          );
        },
        complete: () => { },
      });
  }

  onChangeLuogoIstituto() {
    this.setControlStatesIstituto();
  }
  private setControlStatesIstituto() {
    const flgLuogo = this.form.get(
      'lavTitoloStudioAltro.flgLuogoIstItalia'
    ).value;

    if (flgLuogo === 'I') {
      this.form.get('lavTitoloStudioAltro.blpTNazioneIst').reset();
      this.form.get('lavTitoloStudioAltro.blpTNazioneIst').disable();
      this.form.get('lavTitoloStudioAltro.blpTProvinceIst').enable();
      this.form.get('lavTitoloStudioAltro.blpTComuneIst').enable();
      this.form.get('lavTitoloStudioAltro.indirizzo').enable();
      this.form.get('lavTitoloStudioAltro.toponimo').enable();
      this.form.get('lavTitoloStudioAltro.numeroCivico').enable();
    } else if (flgLuogo === 'E') {
      this.form.get('lavTitoloStudioAltro.blpTComuneIst').reset();
      this.form.get('lavTitoloStudioAltro.blpTProvinceIst').reset();
      this.form.get('lavTitoloStudioAltro.blpTNazioneIst').enable();
      this.form.get('lavTitoloStudioAltro.blpTProvinceIst').disable();
      this.form.get('lavTitoloStudioAltro.blpTComuneIst').disable();
      this.form.get('lavTitoloStudioAltro.indirizzo').reset();
      this.form.get('lavTitoloStudioAltro.indirizzo').disable();
      this.form.get('lavTitoloStudioAltro.toponimo').reset();
      this.form.get('lavTitoloStudioAltro.toponimo').disable();
      this.form.get('lavTitoloStudioAltro.numeroCivico').reset();
      this.form.get('lavTitoloStudioAltro.numeroCivico').disable();
    }
  }
  private dataRangeValidator: ValidatorFn = (): { [key: string]: any; } | null => {
    let invalidDataRange = false;

    const dataInizio = this.form.get('lavTitoloStudio.dataInizio').value;
    const dataFine = this.form.get('lavTitoloStudio.dataFine').value;

    if (!dataInizio || !dataFine) {
      return null;
    }

    if (dataFine) {
      const dtInizio: Date = new Date(dataInizio);
      const dtFine: Date = new Date(dataFine);
      dtInizio.setHours(0, 0, 0, 0);
      dtFine.setHours(0, 0, 0, 0);
      invalidDataRange = dtInizio.valueOf() > dtFine.valueOf();

    }
    if (invalidDataRange) {
      this.form.get('lavTitoloStudio.dataInizio').setErrors({ invalidDataRange })
      this.form.get('lavTitoloStudio.dataFine').setErrors({ invalidDataRange })

    } else {
      this.form.get('lavTitoloStudio.dataInizio').setErrors(null)
      this.form.get('lavTitoloStudio.dataFine').setErrors(null)
    }
    return invalidDataRange ? { invalidDataRange } : null;
  }
  votoValoreRequired() {
    const votoControl = this.form.controls['lavTitoloStudio'].get('dsVoto');
    const valoreControl = this.form.controls['lavTitoloStudio'].get('valoreMassimo');

    votoControl.clearValidators();
    valoreControl.clearValidators();

    const flgInCorso: string = this.form.get('lavTitoloStudio.flgInCorso').value;

    this.VotoValoreRequired = false;
    if (flgInCorso == 'N'
      && ((votoControl.value && !isNaN(votoControl.value)) || (valoreControl.value && !isNaN(valoreControl.value)))) {
      this.VotoValoreRequired = true;
      valoreControl.enable();
      votoControl.setValidators([Validators.required, this.votoValoreValidator]);
      valoreControl.setValidators([Validators.required, this.votoValoreValidator]);
    }
    votoControl.updateValueAndValidity();
    valoreControl.updateValueAndValidity();
  }

  async onClickEliminaTitolo(titoloDiStudio: IstruzioneDich) {
    const data: DialogModaleMessage = {
      titolo: 'Eliminare titolo di studio',
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: `Si conferma l'eliminazione del titolo di studio?`,
      messaggioAggiuntivo: '',
      size: 'lg',
      tipoTesto: TYPE_ALERT.WARNING,
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {

      this.eliminaTitoloStudio(titoloDiStudio);
    }
  }
  eliminaTitoloStudio(titoloDiStudio: IstruzioneDich) {
    let request: any = {
      idIstruzioneDIch: titoloDiStudio.id,
    };

    this.cvService.deleteIstruzioneDichById(request).subscribe((ris) => {
      if (ris.esitoPositivo) {
        this.titoliDiStudioCv.splice(
          this.titoliDiStudioCv.findIndex((t) => t.id == titoloDiStudio.id),
          1
        );
        this.updateCv();
        const data: DialogModaleMessage = {
          titolo: "Gestione CV",
          tipo: TypeDialogMessage.Confirm,
          messaggio: this.messagioEliminazione.testo,
          size: "lg",
          tipoTesto: TYPE_ALERT.SUCCESS
        };
        this.promptModalService.openModaleConfirm(data);
      }
    });
  }

  onFilter(event: any) {
    let txt: string = event?.filter;
    if (txt == null || txt == undefined || txt.length < 2) {
      return;
    }
    this.decodificaBlpService.findTitoliDiStudioByDescr(txt).subscribe({
      next: (r) => {
        if (r) {
          this.titoliStudios = r.filter((dec) => !this.titoliDiStudioCv?.find(tit => tit.idTitoloStudio?.codTitoloStudioMin == dec.codTitoloStudioMin))
          this.titoliStudios = this.titoliStudios.map(t => {
            return {
              ...t,
              descr: (t.descrTitoloStudio + "-" + t.idLivelloStudio.descrLivelloStudio)
            }
          })

        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { },
    });
  }
  onChangeTitoloStudio(event: any) {
    this.titoloStudioSelected = this.titoliStudios.find(
      (t) => t.idTitoloStudio == event.value
    );
    this.decodificaBlpService
      .findDecodificaBlpById(
        'LIVELLO_STUDIO',
        this.titoloStudioSelected?.idLivelloStudio.descrLivelloStudio,

      )
      .subscribe((ris) => {
        if (ris.esitoPositivo) {
          this.livelloTitoloStudio = ris.decodifica?.descr;
        }
      });
  }


  get canModifica() {
    return (
      this.cvSelected?.flgGeneratoDaSistema != 'S' &&
      this.cvBagService.getAzioneActual() == 'M'
    );
  }


  updateCv() {
    this.cvSelected.istruzioneDichList = this.titoliDiStudioCv
    this.cvBagService.updateSelectedCv(this.cvSelected)
  }

  onAnnulla() {
    this.form.reset();
    this.showForm = false;
  }
}
