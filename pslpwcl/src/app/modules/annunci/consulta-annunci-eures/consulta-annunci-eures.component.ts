/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { AnnunciPublicPslpService, AnnunciService, ConsultaAnnunciRequest, Decodifica, DecodificaBlpService, DecodificaPublicPslpService, PslpMessaggio } from '../../pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'pslpwcl-consulta-annunci-eures',
  templateUrl: './consulta-annunci-eures.component.html',
  styleUrls: ['./consulta-annunci-eures.component.scss']
})
export class ConsultaAnnunciEURESComponent implements OnInit {

  @ViewChild('anchorRicerca') anchorRicerca: ElementRef;

  messaggio: PslpMessaggio;
  form: FormGroup;
  annunciEURESList: any[] = [];
  nessunRisultato: boolean = false;
  showRicerca: boolean = false;
  comuni: Decodifica[] = [];
  statiEsteri: Decodifica[] = [];
  messaggioIntestazione: PslpMessaggio;

  get f() {
    return this.form.controls as any;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private annunciService: AnnunciService,
    private logService: LogService,
    private decodificaBlpService: DecodificaBlpService,
    private readonly route: ActivatedRoute,
    private decodificaPublicService: DecodificaPublicPslpService,
    private annunciServicePublic: AnnunciPublicPslpService,
    private appUserService: AppUserService,
  ) {
    this.form = this.fb.group(
      {
        comune: this.fb.group({
          id: [null],
          descrizione: [null]
        }),
        stato: this.fb.group({
          id: [null,],
          descrizione: [null]
        }),
        paroleRicercate: [null, [Validators.required, Validators.minLength(4)]]
      },
    );
    this.form.valueChanges.subscribe(() => {
      this.almenoUnoCompilatoValidator();
    });
  }

  ngOnInit(): void {
    this.loadDecodifiche();
    this.form.get('comune.id')?.valueChanges.subscribe((comuneId) => {
      const statoCtrl = this.form.get('stato');
      if (comuneId) {
        statoCtrl?.disable({ emitEvent: false });
      } else {
        statoCtrl?.enable({ emitEvent: false });
      }
    });

    this.form.get('stato.id')?.valueChanges.subscribe((statoId) => {
      const comuneCtrl = this.form.get('comune');
      if (statoId) {
        comuneCtrl?.disable({ emitEvent: false });
      } else {
        comuneCtrl?.enable({ emitEvent: false });
      }
    });
    this.decodificaPublicService.findByCodPublic("I57").subscribe(
      (r: any) => this.messaggioIntestazione = r.msg
    );
  }

  almenoUnoCompilatoValidator() {
    const paroleControl = this.form.get('paroleRicercate');
    const comuneId = this.form.get('comune.id')?.value;
    const statoId = this.form.get('stato.id')?.value;
    const paroleValue = paroleControl?.value;
    const paroleCompilate = !!paroleValue;

    // Se parole è compilato, comune e stato non sono obbligatori
    if (paroleCompilate) {
      this.form.get('comune')?.clearValidators();
      this.form.get('stato')?.clearValidators();
    } else {
      this.form.get('comune')?.setValidators(this.emptyComuneValidator());
      this.form.get('stato')?.setValidators(this.emptyStatoValidator());
    }

    paroleControl?.updateValueAndValidity({ emitEvent: false });
    this.form.get('comune')?.updateValueAndValidity({ emitEvent: false });
    this.form.get('stato')?.updateValueAndValidity({ emitEvent: false });
  }

  emptyComuneValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const id = group.get('id')?.value;
      return id ? null : { required: true };
    };
  }

  emptyStatoValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const id = group.get('id')?.value;
      return id ? null : { required: true };
    };
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

  loadDecodifiche() {
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



  onClickAnnulla() {
    this.router.navigateByUrl('pslpfcweb/consulta-annunci');
  }

  onClickCerca() {
    const ricercaTestuale = this.form.get('paroleRicercate').value;
    const comune = this.form?.get('comune.id')?.value;
    const stato = this.form?.get('stato.id')?.value;
    const request: ConsultaAnnunciRequest = {
      campoTestualeRicerca: ricercaTestuale ? ricercaTestuale : '',
      idComune: comune ? comune : '',
      idNazioneEstera: stato ? stato : '',
      idServizioSpecialistico: 2,
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
    this.router.navigate(['/pslpfcweb/consulta-annunci/visualizza-annuncio'],
      {
        relativeTo: this.route.parent,
        state: { idAnnuncio: idAnnuncio }
      })
  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }


}
