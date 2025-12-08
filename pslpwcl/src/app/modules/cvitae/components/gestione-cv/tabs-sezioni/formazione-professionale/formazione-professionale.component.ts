/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { DecodificaBlpService, DecodificaPslpService } from 'src/app/modules/pslpapi';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { AltroCorso, Candidatura, CorsoFormazioneBlpRequest, CorsoFormazioneRequest, Decodifica, Formazione, FormazioneProfessionalePiemontese, InserisciAggiornaCorsoFormazioneRequest, MapSilpToBlpFormazioneRequest, PslpMessaggio, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi/model/models';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-formazione-professionale',
  templateUrl: './formazione-professionale.component.html',
  styleUrls: ['./formazione-professionale.component.scss']
})
export class FormazioneProfessionaleComponent implements OnInit {



  showForm: boolean = false;


  formazioneProfessionaleList: Array<FormazioneProfessionalePiemontese>;
  altriCorsiList: Array<AltroCorso>
  mod: string = "m";

  altriCorsiListFiltrati: Array<AltroCorso>
  formazioneProfessionaleListFiltrati: Array<FormazioneProfessionalePiemontese>;
  formazioneCompletaList: any[] = [];

  fascicoloSelected?: SchedaAnagraficaProfessionale
  formazioneProfessionaleCvList: Formazione[] = []

  sysDate = new Date()
  qualifiche: Decodifica[] = []
  certificazioneProfessionale: Decodifica[] = []
  statiEsteri: Decodifica[] = []
  province: Decodifica[] = []
  comuni: Decodifica[] = []
  tipoDurataDec: Decodifica[] = []
  durataCorsoIsRequired: boolean;
  selectedCv: Candidatura
  selectedFormazione?: Formazione
  form: FormGroup = this.fb.group({
    titoloCorso: ['', [Validators.required]],
    sede: [''],

    indirizzo: [null],
    toponimo: this.fb.group({
      id: [null],
      descr: [null]
    }),
    numeroCivico: [null],
    comune: this.fb.group({
      id: [null],
      descrizione: [null]
    }),
    stato: this.fb.group({
      id: [null, [Validators.required]],
      descrizione: [null]
    }),
    flgLuogoItalia: ['I'],
    durata: [''],
    tipoDurata: this.fb.group({
      id: [null],
      descrizione: [null]
    }),
    certificazioneConseguita: this.fb.group({
      id: [null],
      descrizione: [null]
    }),
    qualificaConseguita: this.fb.group({
      id: [null],
      descrizione: [null]
    }),
    desrizioneQualifica: [''],
    dataInizio: [''],
    dataFine: [''],
    inCorso: ['', Validators.required],
    tirocinioCurriculare: ['', Validators.required]
  })

  formazioneProfessionale: FormazioneProfessionalePiemontese;
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  messaggioNonCiSonoDati: PslpMessaggio;
  messaggioFormazioneFasc: PslpMessaggio;
  messaggioFormazionegCv: PslpMessaggio;

  toponimos: Decodifica[];

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private decodificaBlpService: DecodificaBlpService,
    private cvService: CvService,
    private cvBagService: CvitaeService,
    private mappingService: MappingService,
    private promptModalService: PromptModalService
  ) { }


  ngOnInit(): void {
    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati = messaggio;
    });
    // pslp_d_messaggio corsi fascicolo
    this.commonService.getMessaggioByCode("I24").then(messaggio => {
      this.messaggioFormazioneFasc = messaggio;
    });
    // pslp_d_messaggio  corsi Cv
    this.commonService.getMessaggioByCode("I25").then(messaggio => {
      this.messaggioFormazionegCv = messaggio;
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
    this.fascicoloSelected = this.commonService.fascicoloActual
    this.formazioneProfessionaleList = this.fascicoloSelected.informazioniCurriculari.percorsoFormativo.formazioneProfessionale.formazioneProfessionalePiemontese
    this.altriCorsiList = this.fascicoloSelected.informazioniCurriculari.percorsoFormativo.formazioneProfessionale.altriCorsi
    this.cvBagService.selectedCv.subscribe(
      ris => {
        this.selectedCv = ris
        this.formazioneProfessionaleCvList = this.selectedCv?.formazioneList
        this.altriCorsiListFiltrati = this.altriCorsiList.filter(ac => !this.formazioneProfessionaleCvList.find(f => ac.lavCorsoForm.idSilLavCorsoForm == f.idSilLavCorsoForm))
        this.formazioneProfessionaleListFiltrati = this.formazioneProfessionaleList.filter(ac => !this.formazioneProfessionaleCvList.find(f => ac.lavCorsoForm.idSilLavCorsoForm == f.idSilLavCorsoForm))
        this.formazioneCompletaList = [
          ...this.formazioneProfessionaleListFiltrati.map(item => ({ ...item, isAltroCorso: false })),
          ...this.altriCorsiListFiltrati.map(item => ({ ...item, isAltroCorso: true }))
        ];
      }
    )
    this.loadDecodifiche()
  }

  private dataRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalidDataRangeCessaz = false;
    let invalidDataRangePeriodo = false;
    const dataInizio = this.form.get('dataInizio').value;
    const dataFine = this.form.get('dataFine').value;

    if (!dataInizio || !dataFine) {
      return null;
    }

    if (dataFine) {
      const dtInizio: Date = new Date(dataInizio);
      const dtFine: Date = new Date(dataFine);
      dtInizio.setHours(0, 0, 0, 0);
      dtFine.setHours(0, 0, 0, 0);
      invalidDataRangeCessaz = dtInizio.valueOf() > dtFine.valueOf();
    }
    return invalidDataRangeCessaz || invalidDataRangePeriodo ? { invalidDataRangeCessaz, invalidDataRangePeriodo } : null;
  }

  onNuovoFormazione() {
    this.selectedFormazione = undefined
    this.form.reset()
    this.form.enable()
    this.initForm()
    this.selectLuogoIstituto()
    this.showForm = true
  }

  initForm() {
    this.form.get('dataInizio').addValidators(this.dataRangeValidator)
    this.form.get('dataFine').addValidators(this.dataRangeValidator)
    this.form.get('flgLuogoItalia').setValue("I")
    //this.form.get
  }
  viewFormazione(formazioneProfessionale: FormazioneProfessionalePiemontese) {
    this.promptModalService.openVisualizzaFormazioneProfessionaleFascicolo(formazioneProfessionale);
    console.log(formazioneProfessionale);
  }
  addFormazioneACv(corso: FormazioneProfessionalePiemontese | AltroCorso, isFormazionePiemontese: boolean) {
    let request: any = {
      idCv: this.selectedCv.id,
      altroCorso: !isFormazionePiemontese ? corso : null,
      formazioneProfessionalePiemontese: isFormazionePiemontese ? corso : null
    }
    this.mappingService.insertFormazioneFromSilp(request).subscribe({
      next: ris => {
        if (ris.esitoPositivo) {
          this.formazioneProfessionaleCvList.push(ris.formazione)
          console.log(ris.formazione)
          this.selectedCv.formazioneList = this.formazioneProfessionaleCvList
          this.cvBagService.updateSelectedCv(this.selectedCv)
        }
      }
    })
  }
  onCercaComune(event: any) {
    let txt = event.filter
    if (txt.length < 2) { return }
    else {
      this.decodificaBlpService.fill("COMUNE", txt,).subscribe({
        next: ris => {
          if (ris.esitoPositivo) {
            this.comuni = ris.list
          }
        }
      })
    }
  }

  loadDecodifiche() {

    this.decodificaBlpService.findDecodificaBlpByTipo('ATTESTAZIONE',).subscribe({
      next: ris => {
        if (ris.esitoPositivo) {
          this.certificazioneProfessionale = ris.list
        }
      }
    })
    this.decodificaBlpService.findDecodificaBlpByTipo('NAZIONE',).subscribe({
      next: (r) => {
        if (r.esitoPositivo) {
          this.statiEsteri = r.list;
        }
      },
      error: err => { },
      complete: () => { }
    })

    this.decodificaBlpService.findDecodificaBlpByTipo('UNITA_MISURA_DURATA',).subscribe({
      next: (r) => {
        if (r.esitoPositivo) {
          this.tipoDurataDec = r.list;
        }
      },
      error: err => { },
      complete: () => { }
    })
    this.decodificaBlpService.findDecodificaBlpByTipo('TOPONIMO').subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.toponimos = r.list;
        }
      },
      error: (err) => { },
      complete: () => { },
    })
  }
  filtraQualifica(event: any) {
    let txt = event.filter
    if (txt.length < 2) { return }
    else {
      this.decodificaBlpService.fill("QUALIFICA", txt,).subscribe({
        next: ris => {
          if (ris.esitoPositivo) {
            this.qualifiche = ris.list
          }
        }
      })
    }
  }
  selectLuogoIstituto() {
    if (!this.form.get('flgLuogoItalia').value) {
      this.form.get('stato').disable()
      this.form.get('indirizzo').disable()
      this.form.get('comune').disable()
      this.form.get('toponimo').disable()
      this.form.get('numeroCivico').disable()
    }
    if (this.form.get('flgLuogoItalia').value == "I") {
      this.form.get('stato').reset()
      this.form.get('stato').disable()
      this.form.get('indirizzo').enable()
      this.form.get('toponimo').enable()
      this.form.get('numeroCivico').enable()
      this.form.get('comune').enable()
    }
    if (this.form.get('flgLuogoItalia').value == "E") {
      this.form.get('stato').enable()
      this.form.get('indirizzo').reset()
      this.form.get('indirizzo').disable()
      this.form.get('comune').reset()
      this.form.get('comune').disable()
      this.form.get('toponimo').reset()
      this.form.get('numeroCivico').reset()
      this.form.get('toponimo').disable()
      this.form.get('numeroCivico').disable()
    }
  }

  inserisciAggiornaFormazioneDich() {
    let request: any = {
      corsoFormazione: Utils.cleanObject(this.creaFormazione())
    }

    console.log(request);
    if (this.selectedFormazione) {
      this.cvService.aggiornaCorso(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            this.selectedFormazione = ris.formazione
            this.formazioneProfessionaleCvList.splice(this.formazioneProfessionaleCvList.findIndex(form => form.id == ris.formazione.id), 1, ris.formazione)
            this.selectedCv.formazioneList = this.formazioneProfessionaleCvList
            this.cvBagService.updateSelectedCv(this.selectedCv)
            const data: DialogModaleMessage = {
              titolo: "Formazione professionale",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioAggiornamento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data);
            this.showForm = false;
          }
        }
      )
    } else {
      this.cvService.inserisciCorso(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            this.selectedFormazione = ris.formazione
            this.formazioneProfessionaleCvList.push(ris.formazione)
            this.selectedCv.formazioneList = this.formazioneProfessionaleCvList
            this.cvBagService.updateSelectedCv(this.selectedCv)
            const data: DialogModaleMessage = {
              titolo: "Formazione professionale",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioInserimento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data);
            this.showForm = false;
          }
        }
      )
    }
  }
  onChangeDurataCorso() {
    this.setDurataCorsoRequired();
  }
  findTipologiaDurata(cod: string): string {
    //console.log(this.tipoDurataDec)
    //console.log(cod)
    return this.tipoDurataDec.find(tp => tp.id == cod)?.descr
  }

  private setDurataCorsoRequired() {
    const durataCorso = this.form.get('durata').value;
    const codTipologiaDurataCorso = this.form.get('tipoDurata').value;

    this.form.get('durata').removeValidators(Validators.required);
    this.form.get('tipoDurata').removeValidators(Validators.required);
    this.durataCorsoIsRequired = !(Utils.isNullOrUndefinedOrEmptyField(durataCorso) && Utils.isNullOrUndefinedOrEmptyField(codTipologiaDurataCorso));
    if (this.durataCorsoIsRequired) {
      this.form.get('durata').setValidators(Validators.required);
      this.form.get('tipoDurata').setValidators(Validators.required);
    } else {
      this.form.get('durata').clearValidators()
      this.form.get('tipoDurata').clearValidators()
    }
    this.form.get('durata').updateValueAndValidity();
    this.form.get('tipoDurata').updateValueAndValidity();
  }


  creaFormazione(): Formazione {

    return {
      ...this.selectedFormazione,
      denominazioneAziendaFormazione: this.form.get("sede").value,
      dsCorso: this.form.get("titoloCorso").value,
      idCandidatura: this.selectedCv.id,
      dsQualificaAcquisita: this.form.get("desrizioneQualifica").value,
      idQualificaAcquisita: {
        idQualifica: this.form.get("qualificaConseguita.id").value,
      },
      idAttestazione: {
        idAttestazione: this.form.get("certificazioneConseguita.id").value,
      },
      durata: this.form.get("durata").value,
      idUnitaMisuraDurata: this.form.get("tipoDurata.id").value ? {
        idUnitaMisuraDurata: this.form.get("tipoDurata.id").value,
        descrUnitaMisuraDurata: this.tipoDurataDec.find(ti => ti.id == this.form.get("tipoDurata.id").value).descr
      } : null,
      dInizio: this.form.get("dataInizio").value,
      dFine: this.form.get("dataFine").value,
      flgInCorso: this.form.get("inCorso").value,
      flgTirocinioCurriculare: this.form.get("tirocinioCurriculare").value,

      idToponimoSedeCorso: this.form.get('toponimo').value ? { idToponimo: this.form.get('toponimo.id').value } : null,
      numCivicoSedeCorso: this.form.get('numeroCivico').value,
      idComuneSedeCorso: { idComune: this.form.get("comune.id").value },

      idNazioneSedeCorso: { idNazione: this.form.get("stato.id").value },
      indirizzoSedeCorso: this.form.get("indirizzo").value,
      flgFormazionePiemontese: this.selectedFormazione ? this.selectedFormazione.flgFormazionePiemontese : "N",
      codUserAggiorn: "",
      codUserInserim: this.selectedFormazione ? this.selectedFormazione.codUserInserim : "",
      dAggiorn: new Date(),
      dInserim: this.selectedFormazione ? this.selectedFormazione.dInserim : new Date()
    }
  }

  async eliminaFormazione(formazione: Formazione) {
    const data: DialogModaleMessage = {
      titolo: "Eliminazione formazione professionale",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare la formazione professionale selezionata?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      let request: any = {
        idCorso: formazione.id
      }
      this.cvService.deleteCorsoById(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            const data: DialogModaleMessage = {
              titolo: "Formazione professionale",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioEliminazione.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.showForm = false
            this.promptModalService.openModaleConfirm(data);
            this.formazioneProfessionaleCvList.splice(this.formazioneProfessionaleCvList.findIndex(f => f.id == formazione.id), 1)
            this.selectedCv.formazioneList = this.formazioneProfessionaleCvList
            this.cvBagService.updateSelectedCv(this.selectedCv)
          }
        }
      )
      return true;
    } else {
      return false;
    }
  }


  modificaFormazione(formazione: Formazione) {
    this.showForm = true
    this.form.reset();
    this.selectedFormazione = formazione
    this.patchForm("m")
  }

  visualizzaFormazione(formazione: Formazione) {
    this.showForm = true
    this.selectedFormazione = formazione
    this.patchForm("v")
  }

  patchForm(azione: string) {
    this.mod = azione;

    this.form.get("titoloCorso").patchValue(this.selectedFormazione?.dsCorso)
    this.form.get("sede").patchValue(this.selectedFormazione?.denominazioneAziendaFormazione)
    this.form.get("indirizzo").patchValue(this.selectedFormazione?.indirizzoSedeCorso ? this.selectedFormazione?.indirizzoSedeCorso : "")
    this.form.get("numeroCivico").patchValue(this.selectedFormazione?.numCivicoSedeCorso)
    if (this.selectedFormazione.idToponimoSedeCorso) {
      console.log("toponimo: " + this.selectedFormazione.idToponimoSedeCorso?.idToponimo)
      this.form.get("toponimo.id").patchValue(this.selectedFormazione.idToponimoSedeCorso?.idToponimo)
    }

    if (this.selectedFormazione?.idComuneSedeCorso) {
      this.decodificaBlpService.findDecodificaBlpById("COMUNE", this.selectedFormazione?.idComuneSedeCorso?.idComune.toString(),).subscribe({
        next: ris => {
          if (ris.esitoPositivo) {
            this.comuni.push(ris.decodifica)
            this.form.get("comune.id").patchValue(this.selectedFormazione?.idComuneSedeCorso?.idComune.toString())
          }
        }
      })
    }

    this.form.get("stato").patchValue(this.selectedFormazione?.idNazioneSedeCorso?.idNazione.toString())
    this.form.get("durata").patchValue(isNaN(this.selectedFormazione?.durata) ? "" : this.selectedFormazione?.durata)
    this.form.get("tipoDurata.id").patchValue(this.selectedFormazione?.idUnitaMisuraDurata?.idUnitaMisuraDurata.toString())
    if (this.selectedFormazione?.idQualificaAcquisita?.idQualifica) {
      this.decodificaBlpService.findDecodificaBlpById("QUALIFICA", this.selectedFormazione?.idQualificaAcquisita?.idQualifica).subscribe({
        next: ris => {
          if (ris.esitoPositivo) {
            this.qualifiche.push(ris.decodifica)
            this.form.get("certificazioneConseguita.id").patchValue(this.selectedFormazione?.idAttestazione?.idAttestazione.toString())
            this.form.get("qualificaConseguita.id").patchValue(this.selectedFormazione?.idQualificaAcquisita?.idQualifica.toString())
          }
        }
      })
    }
    if (this.selectedFormazione?.idComuneSedeCorso?.idComune && this.selectedFormazione?.idNazioneSedeCorso?.idNazione) {
      this.selectedFormazione?.idComuneSedeCorso?.idComune ? this.form.get('flgLuogoItalia').setValue('I') : this.form.get('flgLuogoItalia').setValue('E')
    }
    this.form.get("desrizioneQualifica").patchValue(this.selectedFormazione?.dsQualificaAcquisita)
    this.form.get("dataInizio").patchValue(this.selectedFormazione?.dInizio ? new Date(this.selectedFormazione?.dInizio) : null)
    this.form.get("dataFine").patchValue(this.selectedFormazione?.dFine ? new Date(this.selectedFormazione?.dFine) : null)
    this.form.get("inCorso").patchValue(this.selectedFormazione?.flgInCorso)
    this.form.get("tirocinioCurriculare").patchValue(this.selectedFormazione?.flgTirocinioCurriculare)

    if (!this.canModifica || azione != "m") {
      this.form.disable()
    } else {
      this.form.enable()
      this.selectLuogoIstituto()
      this.form.get("titoloCorso").disable()
    }


  }
  get canModifica() {
    return this.selectedCv?.flgGeneratoDaSistema != "S" && this.cvBagService.getAzioneActual() == "M"
  }

  onAnnulla() {
    this.showForm = false;
    this.form.reset();
  }
}
