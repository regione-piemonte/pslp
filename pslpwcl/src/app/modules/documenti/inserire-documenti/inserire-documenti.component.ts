/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TYPE_ALERT } from 'src/app/constants';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { DecodificaPslpService, DocumentiService, InserisciAggiornaRichiestaDocumentoRequest, LavoratorePslpService, PslpMessaggio, SuntoLavoratore } from '../../pslpapi';
import { DialogModaleMessage } from '../../pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from '../../pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from '../../pslpwcl-common/services/prompt-modal.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { CustomDocumentiService } from '../services/custom-documenti.service';

@Component({
  selector: 'pslpwcl-inserire-documenti',
  templateUrl: './inserire-documenti.component.html',
  styleUrls: ['./inserire-documenti.component.scss']
})
export class InserireDocumentiComponent implements OnInit {

  idSilLavAnagrafica: number;
  richiestaDocumenti: any;
  tipoDocumentoRichiesto: any[];
  actualDate: Date = new Date();
  attestatoDisoccupazioneVisibile: boolean;
  form: FormGroup;
  areaTestoVisibile: boolean;
  messaggiList: string[] = [];
  suntoLavoratore?: SuntoLavoratore;
  erroreE32: PslpMessaggio;
  messaggioI41: PslpMessaggio;
  messaggioAvviso: string | null = null;
  messaggioAvvisoVisibile: boolean;
  cpiDomicilio: string;
  private pendingRequests = 2;

  checkboxLabels: Record<string, string> = {
    flgDidImmDisponib: 'Di essere immediatamente disponibile allo svolgimento di attività lavorativa ed alla partecipazione alle misure di politica attiva del lavoro ai sensi dell\'art. 19, c. 1 del D.Lgs. 150/2015',
    flgDidNoLavora: 'Di non svolgere alcuna attività lavorativa',
    flgDidDipendente: 'Di essere occupato/a in qualità di lavoratore dipendente il cui reddito da lavoro corrisponde a un’imposta lorda pari o inferiore alle detrazioni spettanti ai sensi dell’art. 13 del T.U. delle imposte sui redditi di cui al DPR 917/1986 (8.500 euro lordi annui) come definito da D.lgs 150/15 e D.L. 4/19 conv.',
    flgDidAutonomo: 'Di essere occupato/a in qualità di lavoratore autonomo il cui reddito da lavoro corrisponde ad un\'imposta lorda pari o inferiore alle detrazioni spettanti di sensi dell’art. 13 del T.U. delle imposte sui redditi di cui al Dpr 917/1986 (5.500 euro lordi annui) come definito dal D.Lgs. 150/15 e D.L. 4/2019 conv.;',
    flgDidSospesa: 'Di conoscere che lo stato di disoccupazione è sospeso in caso di rapporto di lavoro subordinato fino a 6 mesi (art. 19, c. 3 del D.Lgs. 150/2015);',
    flgDidRevoca: 'Di conoscere le disposizioni relative alla decadenza dello stato di disoccupazione ai sensi dell’art. 21 del D.Lgs. 150/2015 per i beneficiari di strumenti di sostegno al reddito.'
  };

  checkboxFields: string[] = Object.keys(this.checkboxLabels);


  constructor(
    private documentiService: DocumentiService,
    private customDocumentiService: CustomDocumentiService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private readonly appUserService: AppUserService,
    private decodificaService: DecodificaPslpService,
    private router: Router,
    private promptModalService: PromptModalService,
    private lavoratoreService: LavoratorePslpService,
    private commonService: CommonService,
    private utilitiesService: UtilitiesService
  ) {
    this.form = new FormGroup({
      idSilwebTDocumeRichiesti: new FormControl(null),
      dataRichiesta: new FormControl(this.actualDate),
      cpiDomicilio: new FormControl(null, Validators.required),
      tipoDocumentoRichiesto: new FormGroup({
        idSilwebTTipoDocume: new FormControl(null, Validators.required),
      }),
      silwebTCheckAutocer: new FormGroup({
        flgDidImmDisponib: new FormControl(null, Validators.required),
        flgDidNoLavora: new FormControl(null),
        flgDidDipendente: new FormControl(null),
        flgDidAutonomo: new FormControl(null),
        flgDidSospesa: new FormControl(null, Validators.required),
        flgDidRevoca: new FormControl(null, Validators.required),
      }, this.almenoUnoSelezionato)
    });
  }

  ngOnInit(): void {
    this.spinner.show();

    this.loadDecodifiche();

    this.commonService.getMessaggioByCode("E36").then(messaggio => {
      this.erroreE32 = messaggio;
    });
    this.commonService.getMessaggioByCode("I41").then(messaggio => {
      this.messaggioI41 = messaggio;
    });

    const checkGroup = this.form.get('silwebTCheckAutocer') as FormGroup;
    this.setupCheckboxValueChanges(checkGroup);

    this.form.get('tipoDocumentoRichiesto.idSilwebTTipoDocume')?.valueChanges.subscribe(value => {
      this.attestatoDisoccupazioneVisibile = value === 1 || value === '1';
      this.updateValidators(checkGroup, this.attestatoDisoccupazioneVisibile);
      this.messaggioAvvisoVisibile = true;
      this.messaggioAvviso = "La pratica verrà presa in carico da un operatore che verificherà la posizione amministrativa al fine del rilascio della documentazione richiesta";
    });
  }

  private setupCheckboxValueChanges(checkGroup: FormGroup): void {
    ['flgDidImmDisponib', 'flgDidSospesa', 'flgDidRevoca', 'flgDidNoLavora', 'flgDidDipendente', 'flgDidAutonomo'].forEach(field => {
      checkGroup.get(field)?.valueChanges.subscribe(value => {
        checkGroup.get(field)?.setValue(value ? 'S' : null, { emitEvent: false });
      });
    });
  }

  private updateValidators(checkGroup: FormGroup, isVisible: boolean): void {
    if (isVisible) {
      checkGroup.get('flgDidImmDisponib')?.setValidators(Validators.required);
      checkGroup.get('flgDidSospesa')?.setValidators(Validators.required);
      checkGroup.get('flgDidRevoca')?.setValidators(Validators.required);
    } else {
      checkGroup.get('flgDidImmDisponib')?.clearValidators();
      checkGroup.get('flgDidSospesa')?.clearValidators();
      checkGroup.get('flgDidRevoca')?.clearValidators();
    }

    checkGroup.get('flgDidImmDisponib')?.updateValueAndValidity();
    checkGroup.get('flgDidSospesa')?.updateValueAndValidity();
    checkGroup.get('flgDidRevoca')?.updateValueAndValidity();
    checkGroup.updateValueAndValidity();
  }

  almenoUnoSelezionato(group: AbstractControl): ValidationErrors | null {
    if (!group || typeof group !== 'object') return null;

    const tipoDocumentoId = group.parent?.get('tipoDocumentoRichiesto.idSilwebTTipoDocume')?.value;

    if (tipoDocumentoId !== "1" && tipoDocumentoId !== 1) return null;

    const almenoUnaCheckata = !!(
      group.get('flgDidNoLavora')?.value ||
      group.get('flgDidDipendente')?.value ||
      group.get('flgDidAutonomo')?.value
    );

    return almenoUnaCheckata ? null : { almenoUnoRichiesto: true };
  }



  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

  private loadDecodifiche() {
    this.decodificaService.findDecodificaByTipo('tipo-docume').subscribe({
      next: res => {
        if (res?.esitoPositivo) {
          this.tipoDocumentoRichiesto = res.list.filter(documento => documento.special === 'S');
        }
      },
      error: err => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      },
      complete: () => {
        this.caricaDati();
        this.checkLoadingComplete();
      }
    });
  }

  private caricaDati() {
    this.lavoratoreService.findSuntoLavoratore(this.utente.idSilLavAnagrafica).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          this.suntoLavoratore = res.suntoEsteso.sunto;
          this.cpiDomicilio = res?.suntoEsteso?.sunto?.dsCpi;

          this.form.get('cpiDomicilio')?.patchValue(this.cpiDomicilio);
        }
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, caricaDati`);
      },
      complete: () => {
        this.controlloMessaggi();
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete() {
    this.pendingRequests--;
    if (this.pendingRequests === 0) {
      this.spinner.hide();
    }
  }

  controlloMessaggi() {
    let perTest = false;

    if (this.suntoLavoratore?.idRegioneDomic != "01" || perTest) {
      this.messaggiList.push(this.erroreE32?.testo);
      this.attestatoDisoccupazioneVisibile = false;
      this.areaTestoVisibile = true;
    }

    if (this.messaggiList.length == 0) {
      this.areaTestoVisibile = false;
    }

  }

  async onClickInserisciRichiesta() {
    const msg = 'Si vuole procedere con l\'invio della richiesta?';
    const data: DialogModaleMessage = {
      titolo: "Inserisci e conferma Richiesta",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "La pratica verra' presa in carico da un operatore che verifichera' la posizione amministrativa, al fine del rilascio della documentazione richiesta.",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };

    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.salvaRichiesta();
    }
  }

  async onClickConferma() {
    const msg = 'Si conferma la richiesta di stampa?';
    const data: DialogModaleMessage = {
      titolo: "CONFERMA INVIO RICHIESTA",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "Il documento e' di natura informativa e non costituisce certificazione ai fini dell'accesso a benefici normativi, previdenziali o assistenziali. Questo documento potrebbe non essere esaustivo e potrebbe non riportare la totalita' dei periodi lavorativi.",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      this.spinner.show;
      this.salvaRichiesta();
    }
  }

  salvaRichiesta() {
    const objectForm = this.form.getRawValue();
    let inserisciRichiestaRequest: InserisciAggiornaRichiestaDocumentoRequest = {
      documeRichiesto: {
        silLavAnagrafica: {
          idSilLavAnagrafica: this.utente.idSilLavAnagrafica
        },
        silwebTTipoDocume: {
          idSilwebTTipoDocume: Number(objectForm.tipoDocumentoRichiesto.idSilwebTTipoDocume)
        },
        silTCpiEntePromotore: {
          idSilTCpi: this.utente.cpiComp.idSilTCpi
        }
      }
    };

    if (objectForm.tipoDocumentoRichiesto.idSilwebTTipoDocume === 1 || objectForm.tipoDocumentoRichiesto.idSilwebTTipoDocume === "1") {
      inserisciRichiestaRequest.documeRichiesto["silwebTCheckAutocer"] = {
        flgDidImmDisponib: objectForm.silwebTCheckAutocer.flgDidImmDisponib,
        flgDidNoLavora: objectForm.silwebTCheckAutocer.flgDidNoLavora,
        flgDidDipendente: objectForm.silwebTCheckAutocer.flgDidDipendente,
        flgDidAutonomo: objectForm.silwebTCheckAutocer.flgDidAutonomo,
        flgDidSospesa: objectForm.silwebTCheckAutocer.flgDidSospesa,
        flgDidRevoca: objectForm.silwebTCheckAutocer.flgDidRevoca
      };
    }


    this.spinner.show();
    this.documentiService.inserisciRichiestaDocumento(inserisciRichiestaRequest).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          if (res.documentazioneRichiesta.silwebTTipoDocume.flgIstruttoria === 'S') {
            const data: DialogModaleMessage = {
              titolo: "Richiesta inserita",
              tipo: TypeDialogMessage.Confirm,
              messaggio: "La tua richiesta è stata inserita con successo",
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
            this.router.navigateByUrl('pslpfcweb/private/documenti/riepilogo-documenti');
          } else {
            this.stampaRichiesta(res.documentazioneRichiesta.idSilwebTDocumeRichiesti);
          }
        } else {

          const data: DialogModaleMessage = {
            titolo: "Richiesta non inserita",
            tipo: TypeDialogMessage.Confirm,
            messaggio: res.apiMessages[0].code === '106090' ? res.apiMessages[0].message : '',
            size: "lg",
            tipoTesto: TYPE_ALERT.ERROR
          };
          this.promptModalService.openModaleConfirm(data)
          this.router.navigateByUrl('pslpfcweb/private/documenti/riepilogo-documenti');
        }
      },
      error: (err) => {
        this.logService.log(this.constructor.name, "Errore salvaRichiesta");
      }
    });
  }


  onChangeTipoDocumento() {
    const tipoDocumentoId = this.form.get('tipoDocumentoRichiesto.idSilwebTTipoDocume')?.value;


    if (tipoDocumentoId === 1 || tipoDocumentoId === '1') {
      this.messaggioAvviso = "La pratica verrà presa in carico da un operatore che verificherà la posizione amministrativa al fine del rilascio della documentazione richiesta";
      this.messaggioAvvisoVisibile = true;
    } else {
      this.messaggioAvviso = null;
      this.messaggioAvvisoVisibile = false;
    }
  }

  onClickAnnulla() {
    this.router.navigateByUrl('pslpfcweb/private/documenti/riepilogo-documenti');
  }

  private stampaRichiesta(idSilwebTDocumeRichiesti: number) {
    this.spinner.show();
    this.customDocumentiService.stampaDocumentoRichiesto(idSilwebTDocumeRichiesti, 'response').subscribe({
      next: (res: any) => {
        this.utilitiesService.downloadBlobFile(`stampa-richiesta`, res.body);
        const data: DialogModaleMessage = {
          titolo: "Richiesta inserita",
          tipo: TypeDialogMessage.Confirm,
          messaggio: this.messaggioI41?.testo,
          size: "lg",
          tipoTesto: TYPE_ALERT.SUCCESS
        };
        this.promptModalService.openModaleConfirm(data)
        this.router.navigateByUrl('pslpfcweb/private/documenti/riepilogo-documenti');
        this.spinner.hide();
      },
      error: (error) => {
        console.log(this.constructor.name, `errore onClickStampaRichiesta: ${JSON.stringify(error)}`);
        this.spinner.hide();
      },
      complete: ()=>{
        this.spinner.hide();
      }
    });
  }

}
