/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnnunciPublicPslpService, AnnunciService, ConsultaAnnunciRequest, Decodifica, DecodificaBlpService, DecodificaPublicPslpService, PslpMessaggio } from '../../pslpapi';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { Observable } from 'rxjs';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'pslpwcl-consulta-profili-ricercati',
  templateUrl: './consulta-profili-ricercati.component.html',
  styleUrls: ['./consulta-profili-ricercati.component.scss']
})
export class ConsultaProfiliRicercatiComponent implements OnInit {

  @ViewChild('anchorRicerca') anchorRicerca: ElementRef;

  messaggio: PslpMessaggio;
  messaggioIntestazione: PslpMessaggio;
  form: FormGroup;
  annunciEURESList: any[] = [];
  nessunRisultato: boolean = false;
  showRicerca: boolean = false;
  comuni: Decodifica[] = [];
  statiEsteri: Decodifica[] = []
  // tuttiCpI: Decodifica[] = [];
  CpIPiemontesi: Decodifica[] = [];

  get f() {
    return this.form.controls as any;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private annunciService: AnnunciService,
    private annunciServicePublic: AnnunciPublicPslpService,
    private logService: LogService,
    private readonly route: ActivatedRoute,
    private decodificaBlpService: DecodificaBlpService,
    private decodificaPublicService: DecodificaPublicPslpService,
    private appUserService: AppUserService,
  ) {
    this.form = this.fb.group(
      {
        soloAnnunciCpi: ['N'],
        comune: this.fb.group({
          id: [null],
          descrizione: [null]
        }),
        stato: this.fb.group({
          id: [null],
          descrizione: [null]
        }),
        paroleRicercate: [null, [Validators.required, Validators.minLength(4)]],
        // tuttiCpI: this.fb.group({
        //   id: [null],
        //   descrizione: [null]
        // }),
        cpiPiemontesi: this.fb.group({
          id: [null],
          descrizione: [null]
        }),
        cpiRadio: ['P'],
        art1: ['T'],
        art18: ['T'],
        tirocinio: ['T'],
        rangeKM: [{ value: null, disabled: true }],
      },
      {
        validators: this.almenoUnoObbligatorioValidator()
      }
    );
  }

  ngOnInit(): void {
    this.loadDecodificheCpiPiemontesi();
    this.loadDecodificheNazione();

    this.form.get('comune.id')?.valueChanges.subscribe((comuneId) => {
      const statoCtrl = this.form.get('stato');
      const rangeCtrl = this.form.get('rangeKM');

      if (comuneId) {
        statoCtrl?.disable({ emitEvent: false });
        rangeCtrl?.enable({ emitEvent: false });
        rangeCtrl?.setValidators(Validators.required);
      } else {
        statoCtrl?.enable({ emitEvent: false });
        rangeCtrl?.disable({ emitEvent: false });
        rangeCtrl?.reset();
        rangeCtrl?.clearValidators();
      }
      rangeCtrl?.updateValueAndValidity({ emitEvent: false });
    });

    this.form.get('stato.id')?.valueChanges.subscribe((statoId) => {
      const comuneCtrl = this.form.get('comune');
      if (statoId) {
        comuneCtrl?.disable({ emitEvent: false });
      } else {
        comuneCtrl?.enable({ emitEvent: false });
      }
    });

    this.form.get('soloAnnunciCpi')?.valueChanges.subscribe(() => {
      this.updateCpiValidators();
    });

    this.form.get('cpiRadio')?.valueChanges.subscribe(() => {
      this.updateCpiValidators();
    });

    this.updateCpiValidators();
    this.decodificaPublicService.findByCodPublic("I56").subscribe(
      (r: any) => this.messaggioIntestazione = r.msg
    );
  }

  almenoUnoObbligatorioValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if (!(formGroup instanceof FormGroup)) {
        return null;
      }

      const parole = formGroup.get('paroleRicercate')?.value;
      const comuneId = formGroup.get('comune.id')?.value;
      const statoId = formGroup.get('stato.id')?.value;

      const isAnyFieldFilled = !!parole || !!comuneId || !!statoId;

      if (!isAnyFieldFilled) {
        return { almenoUnoObbligatorio: true };
      }

      return null;
    };
  }

  public isRequired(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (!control || !control.validator) {
      return false;
    }

    const validator = control.validator({} as AbstractControl);
    return validator && validator['required'];
  }

  private updateCpiValidators(): void {
    const soloCpi = this.form.get('soloAnnunciCpi')?.value;
    const tipoCpi = this.form.get('cpiRadio')?.value;

    // const tuttiCpiCtrl = this.form.get('tuttiCpI.id');
    const piemontesiCpiCtrl = this.form.get('cpiPiemontesi.id');

    // if (soloCpi === 'S' && tipoCpi === 'T') {
    //   tuttiCpiCtrl?.setValidators(Validators.required);
    // } else {
    //   tuttiCpiCtrl?.clearValidators();
    //   tuttiCpiCtrl?.reset(null, { emitEvent: false });
    // }

    // Gestione del dropdown "CpI piemontesi"
    if (soloCpi === 'S' && tipoCpi === 'P') {
      piemontesiCpiCtrl?.setValidators(Validators.required);
    } else {
      piemontesiCpiCtrl?.clearValidators();
      piemontesiCpiCtrl?.reset(null, { emitEvent: false });
    }

    // tuttiCpiCtrl?.updateValueAndValidity({ emitEvent: false });
    piemontesiCpiCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  onCercaComune(event: any) {
    if (this.isAutenticato) {
      let txt = event.filter
      if (txt.length < 2) { return }
      else {
        this.decodificaBlpService.fill("COMUNE", txt).subscribe({
          next: ris => {
            if (ris.esitoPositivo) {
              this.comuni = ris.list
            }
          }
        })
      }
    } else {
      let txt = event.filter
      if (txt.length < 2) { return }
      else {
        this.decodificaPublicService.fill1("COMUNE", txt).subscribe({
          next: ris => {
            if (ris.esitoPositivo) {
              this.comuni = ris.list
            }
          }
        })
      }
    }
  }

  // onCercaTuttiCpI(event: any) {
  //   if (this.isAutenticato) {
  //     let txt = event.filter
  //     if (txt.length < 2) { return }
  //     else {
  //       this.decodificaBlpService.fill("CPI_ITALIA", txt).subscribe({
  //         next: ris => {
  //           if (ris.esitoPositivo) {
  //             this.tuttiCpI = ris.list
  //           }
  //         }
  //       })
  //     }
  //   } else {
  //     let txt = event.filter
  //     if (txt.length < 2) { return }
  //     else {
  //       this.decodificaPublicService.fill1("CPI_ITALIA", txt).subscribe({
  //         next: ris => {
  //           if (ris.esitoPositivo) {
  //             this.tuttiCpI = ris.list
  //           }
  //         }
  //       })
  //     }
  //   }
  // }

  loadDecodificheNazione() {
    if (this.isAutenticato) {
      this.decodificaBlpService.findDecodificaBlpByTipo('NAZIONE',).subscribe({
        next: (r) => {
          if (r.esitoPositivo) {
            this.statiEsteri = r.list;
          }
        },
        error: err => { },
        complete: () => { }
      })
    } else {
      this.decodificaPublicService.findDecodificaBlpByTipo1('NAZIONE',).subscribe({
        next: (r) => {
          if (r.esitoPositivo) {
            this.statiEsteri = r.list;
          }
        },
        error: err => { },
        complete: () => { }
      })
    }
  }

  loadDecodificheCpiPiemontesi() {
    if (this.isAutenticato) {
      this.decodificaBlpService.findDecodificaBlpByTipo('CPI',).subscribe({
        next: (r) => {
          if (r.esitoPositivo) {
            this.CpIPiemontesi = r.list;
          }
        },
        error: err => { },
        complete: () => { }
      })
    } else {
      this.decodificaPublicService.findDecodificaBlpByTipo1('CPI',).subscribe({
        next: (r) => {
          if (r.esitoPositivo) {
            this.CpIPiemontesi = r.list;
          }
        },
        error: err => { },
        complete: () => { }
      })
    }
  }


  onClickAnnulla() {
    this.router.navigateByUrl('pslpfcweb/consulta-annunci');
  }

  getPubblicatoDa(el: any) {
    if (!el.idIntermediario && !el.descrCpi) {
      return el.azienda
    } else if (el.idIntermediario && el.descrCpi && !el.servizioSpecialistico) {
      return 'CPI DI ' + el.descrCpi
    } else if (el.idIntermediario && el.descrCpi && el.servizioSpecialistico) {
      return el.servizioSpecialistico
    } else if (el.idIntermediario && !el.descrCpi) {
      return 'CPI DI ' + el.dsIntermediario
    }
  }

  onClickCerca() {
    const ricercaTestuale = this.form.get('paroleRicercate').value;
    const comune = this.form?.get('comune.id')?.value;
    const stato = this.form?.get('stato.id')?.value;
    // const cpiPiemontese = this.form.get('tuttiCpI.id').value;
    const cpiPiemontese = this.form.get('cpiPiemontesi.id').value;
    const rangeKM = this.form.get('rangeKM').value
    const request: ConsultaAnnunciRequest = {
      flgL68Art1: this.form.get('art1').value === 'T' ? 'S' : (this.form.get('art1').value === 'S' ? 'S' : 'N'),
      flgL68Art18: this.form.get('art18').value === 'T' ? 'S' : (this.form.get('art18').value === 'S' ? 'S' : 'N'),
      idCpi: cpiPiemontese ? cpiPiemontese : null,
      tirocinio: this.form.get('tirocinio').value,
      campoTestualeRicerca: ricercaTestuale,
      idComune: comune ? comune : null,
      idNazioneEstera: stato ? stato : null,
      rangeKm: rangeKM ? rangeKM : null,
      callInfo: undefined
    };

    if (this.isAutenticato) {
      this.annunciService.consultaAnnunci(0, request, 100).subscribe({
        next: (res: any) => {
          if (res.esitoPositivo && res.list) {
            this.annunciEURESList = res.list;
            this.showRicerca = true;
            this.nessunRisultato = res.list.length === 0;
            setTimeout(() => {
              this.anchorRicerca?.nativeElement.scrollIntoView({ behavior: 'smooth' });
            });
          }
        },
        error: (err) => {
          this.logService.error(JSON.stringify(err), `${this.constructor.name}, caricaDati`);
        }
      });
    } else {
      this.annunciServicePublic.consultaAnnunci1(0, request, 100).subscribe({
        next: (res: any) => {
          if (res.esitoPositivo && res.list) {
            this.annunciEURESList = res.list;
            this.showRicerca = true;
            this.nessunRisultato = res.list.length === 0;
            setTimeout(() => {
              this.anchorRicerca?.nativeElement.scrollIntoView({ behavior: 'smooth' });
            });
          }
        },
        error: (err) => {
          this.logService.error(JSON.stringify(err), `${this.constructor.name}, caricaDati`);
        }
      });
    }
  }

  onGoToAnnuncio(idAnnuncio: number) {
    this.router.navigate(['/pslpfcweb/consulta-annunci/visualizza-annuncio-profili-ric'],
      {
        relativeTo: this.route.parent,
        state: { idAnnuncio: idAnnuncio }
      })
  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }

}
