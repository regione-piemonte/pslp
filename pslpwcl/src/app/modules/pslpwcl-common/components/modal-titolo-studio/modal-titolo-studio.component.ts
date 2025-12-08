/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { AppUserService } from 'src/app/services/app-user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import {SuntoLavoratore, Decodifica, DecodificaPslpService, DidPslpService, LavAnagrafica, Studio, DatiTitoloStudioLavoratore, InserisciTitoloStudioLavResponse } from 'src/app/modules/pslpapi';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { Utils } from 'src/app/utils';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'pslpwcl-modal-titolo-studio',
  templateUrl: './modal-titolo-studio.component.html',
  styleUrls: ['./modal-titolo-studio.component.scss']
})
export class ModalTitoloStudioComponent implements OnInit {

  @Input() title: string;
  @Input() callback: any;
  @Input() modal: any;
  @Input() sunto: SuntoLavoratore;

  form: FormGroup;
  titoliStudio: Decodifica[] = [];
  titoloStudioSelected: Studio;
  noOptionSelected: boolean = false;
  showAlertMessage: boolean = false;
  datiTitoloStudioLavoratore: DatiTitoloStudioLavoratore;


  get TITOLO_STUDIO_INVALID(): boolean {
    if (!this.form.valid)
      return true;
    else {
      return Utils.isNullOrUndefined(this.titoloStudioSelected) || this.titoloStudioSelected.flgSelezInput === 'N';
    }
  }


  constructor(
    private fb: FormBuilder,
    // private adempimentiProfilingQuantitativoService: AdempimentiProfilingQuantitativoService,
    private didService : DidPslpService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private message: MessageService,
    private decodificaService: DecodificaPslpService,
    private appUserService:AppUserService
  ) { }

  ngOnInit(): void {

    this.initForm();
  }
  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  private valoreValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const valore = this.form.get('valore')?.value;
    const voto = this.form.get('voto')?.value;

    invalid = Number(valore) < Number(voto);

    return invalid ? { valoreMax: { invalid } } : null;
  };

  private initForm() {
    const dtNascita: Date = new Date(this.sunto.dataNascita);
    const annoNascita: number = dtNascita.getFullYear();
    const annoCorrente: number = new Date().getFullYear();
    this.form = this.fb.group({
      idSilTStudio: [null, Validators.required],
      descr: [null],
      completato: [true],
      anno: [null, [Validators.min(annoNascita + 1), Validators.max(annoCorrente)]],
      voto: [null],
      valore: [null],
      laude: [null],
      radioRiconoscimento: ['S'],
      cv: [null]
    });

    this.form.get('voto')?.setValidators(this.valoreValidator);
  }

  onClickCompletato() {
    const completato: boolean = this.form.get('completato')?.value;
   if(completato){
      this.form.get('anno')?.enable();
      this.form.get('voto')?.enable();
      this.form.get('valore')?.enable();
      this.form.get('laude')?.enable();
    }
    else{
      this.form.get('anno')?.disable();
      this.form.get('voto')?.disable();
      this.form.get('valore')?.disable();
      this.form.get('laude')?.disable();
    }
  }

  onClickInserisciTitoloStudio() {
    this.showAlertMessage = true;
    this.spinner.show();
    const datiTitoloStudioLavoratore: DatiTitoloStudioLavoratore = {
      codFiscaleLav: this.utente.cfUtente,
      dsAnnoCompletato: this.form.get('anno')?.value,
      dsCognomeLav: this.utente.cognome,
      dsNomeLav: this.utente.nome,
      dsVoto: this.form.get('voto')?.value + "/" + this.form.get('valore')?.value,
      flgCompletato: this.form.get('completato')?.value ? "S" : "N",
      flgCumLaude: this.form.get('laude')?.value ? "S" : "N",
      flgRiconosciutoItalia: this.form.get('radioRiconoscimento')?.value,
      idSilLav: this.utente.idSilLavAnagrafica,
      idSilTStudio: this.form.get('idSilTStudio')?.value,
      flgPubblicazione: this.form.get('cv')?.value ? "S" : "N",
      dsTitoloStudioSap: this.form.get('descr')?.value
    }
    this.didService.inserisciTitoloStudioLavoratore(datiTitoloStudioLavoratore).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          this.callback(this.modal, res.titoloStudioLav);
        } else {
          //this.alertMessageService.setApiMessages(res.apiMessages);
          this.spinner.hide();
        }
      },
      error: (error) => {

        this.spinner.hide();
      }
    });
  }






  onFilter(event:any){
    let txt:string = event?.filter;
    if(txt == null || txt == undefined || txt.length<2){return;}
    if(txt.length>2 && this.titoliStudio.length < 600 ){return;}
    this.decodificaService.fillDecodificaByTipo("titolo-Studio",txt).pipe(debounceTime(3000)).subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.titoliStudio = [...r.list];
          this.titoliStudio.forEach(t=> t.descr = t.descr + " - " + t.special)
        }
      },
      error: err => {},
      complete: ()=>{}
    })
  }


  onChangeFormControl() {
    const flgRiconosciutoItalia = this.form.get('radioRiconoscimento')?.value;
    if (flgRiconosciutoItalia === 'N') {
      this.noOptionSelected = true;
    } else {
      this.noOptionSelected = false;
    }
  }


  onChangeTitoloStudio() {
    const idStitoloStudio = this.form.get('idSilTStudio')?.value;
    this.decodificaService.findTitoloStudioById(idStitoloStudio).subscribe({
      next: (res: any) => {
        if (res.esitoPositivo) {
          this.titoloStudioSelected = res.titoloStudio;
        }
      },
      error: (error) => {
        this.spinner.hide();
      }
    });
    if (Utils.isNullOrUndefinedOrEmptyField(idStitoloStudio)) {
      this.titoloStudioSelected = null;
      return;
    }
    //this.spinner.show();
    // this.decodificaService.findTitoloStudioById(idStitoloStudio).subscribe({
    //   next: (value: any) => {
    //     this.titoloStudioSelected = value.titoloStudio;
    //     this.form.get('radioRiconoscimento').patchValue(value.titoloStudio.flgSelezInput);
    //     this.noOptionSelected = false;
    //     this.spinner.hide();
    //   },
    //   error: (error) => {
    //     const status = error.status;
    //     console.error(`searchFn error:: ${JSON.stringify(error)}`);
    //     this.spinner.hide();
    //   },
    //   complete() {
    //   }
    // });
  }

  votoValoreRequired() {
    const votoControl = this.form.get('voto');
    const valoreControl = this.form.get('valore');

    if (
      !Utils.isNullOrUndefinedOrEmptyField(votoControl?.value) ||
      !Utils.isNullOrUndefinedOrEmptyField(valoreControl?.value)) {
      votoControl?.addValidators(Validators.required);
      valoreControl?.addValidators(Validators.required);
    } else {
      votoControl?.removeValidators(Validators.required);
      valoreControl?.removeValidators(Validators.required);
    }

    votoControl?.updateValueAndValidity();
    valoreControl?.updateValueAndValidity();

  }


}


interface TitoloStudioWrapper {
  id: string;
  descr: string;
}
