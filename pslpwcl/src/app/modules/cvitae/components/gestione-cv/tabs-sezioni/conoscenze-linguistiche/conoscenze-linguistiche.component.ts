/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { LinguaStraniera, Decodifica, SchedaAnagraficaProfessionale, DecodificaBlpService, LinguaDich, Candidatura, PslpMessaggio } from 'src/app/modules/pslpapi';

import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-conoscenze-linguistiche',
  templateUrl: './conoscenze-linguistiche.component.html',
  styleUrls: ['./conoscenze-linguistiche.component.scss']
})
export class ConoscenzeLinguisticheComponent implements OnInit {

  linguaStranieraList: Array<LinguaStraniera>;
  linguaStraniera: LinguaStraniera;
  fascicolo?: SchedaAnagraficaProfessionale
  linguaDecodifiche: Decodifica[];
  linguaDecodificheFiltrate: Decodifica[];
  linguaStranieraCvList: LinguaDich[] = []
  gradoConoscenzaLingua: Decodifica[];
  modalitaAprrendimentoLinguaDecodifica: Decodifica[];
  cvSelected?: Candidatura
  showForm = false;
  inModifica = false;
  linguaStranieraFiltrateList: LinguaStraniera[];
  lingueMadri = ""
  lingueMadriList: LinguaDich[] = []
  linguaSelected: LinguaDich
  showFormLinguaMadre = false
  isEliminaLinguaMadre = false
  formLinguaMadre: FormGroup = this.fb.group({
    lingua: [null, Validators.required],
  })


  form: FormGroup = this.fb.group({
    lingua: [null, Validators.required],
    flgCertificato: [null],
    livello: [null, Validators.required],
    tipoCertificazione: [null]
  })


  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;

  messaggioNonCiSonoDati: PslpMessaggio;
  messaggioConoscenzaLingFasc: PslpMessaggio;
  messaggioConoscenzaLingCv: PslpMessaggio;


  constructor(
    private decodificaBlpService: DecodificaBlpService,
    private logService: LogService,
    private fb: FormBuilder,
    private promptModalService: PromptModalService,
    private commonService: CommonService,
    private cvBagService: CvitaeService,
    private cvService: CvService,
    private mappingServicce: MappingService,
    private appUserService: AppUserService,
  ) { }
  ngOnInit(): void {

    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati = messaggio;
    });
    // pslp_d_messaggio conoscenza linguistiche fascicolo
    this.commonService.getMessaggioByCode("I26").then(messaggio => {
      this.messaggioConoscenzaLingFasc = messaggio;
    });
    // pslp_d_messaggio  conoscenza linguistiche Cv
    this.commonService.getMessaggioByCode("I27").then(messaggio => {
      this.messaggioConoscenzaLingCv = messaggio;
    });

    this.fascicolo = this.commonService.fascicoloActual
    this.linguaStranieraList = this.fascicolo?.informazioniCurriculari?.lingueStraniere;
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

    this.cvBagService.selectedCv.subscribe(
      ris => {
        this.cvSelected = ris
        this.lingueMadri = ""
        this.linguaStranieraFiltrateList = this.linguaStranieraList?.filter(l => !ris.linguaDichList?.find(ll => ll.codLingua.codLingua == l.lingua.id))
        this.linguaStranieraCvList = ris?.linguaDichList?.filter(ling => ling.idModApprLingua?.idModApprLingua != "D")
        this.lingueMadriList = ris?.linguaDichList?.filter(ling => ling.idModApprLingua?.idModApprLingua == "D")
        this.linguaDecodificheFiltrate =
          this.linguaDecodifiche
            ?.filter(dec => (!this.linguaStranieraCvList.find(ling => ling.codLingua?.codLingua == dec.id)))
            .filter(dec => !this.linguaStranieraList.find(ling => ling.lingua?.id == dec.id))
            .filter(dec => (!this.lingueMadriList.find(ling => ling.codLingua?.codLingua == dec.id)))


        //this.lingueMadriList?.map(ling=>ling.codLingua.dsLingua + ", ").forEach(str=>this.lingueMadri=this.lingueMadri+str)
        //this.lingueMadri=this.lingueMadri.substring(0,this.lingueMadri.length-2)

      }
    )
    this.loadDecodifiche();
  }

  toggleFormLinguaMadre(isElimina: boolean) {
    this.isEliminaLinguaMadre = isElimina
    this.showFormLinguaMadre = true

  }
  eliminaLinguaMadre(linguaMadre: LinguaDich) {
    this.onClickEliminaLinguaCv(linguaMadre, true)
  }

  async onClickEliminaLinguaCv(linguaStraniera: LinguaDich, isLinguaMadre: boolean = false) {
    console.log(linguaStraniera);
    const data: DialogModaleMessage = {
      titolo: "Eliminazione lingua",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: "Sei sicuro di voler eliminare la lingua selezionata?",
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      //console.log('Ha risposto SI');


      this.eliminaLinguaDich(linguaStraniera.id, isLinguaMadre);
    } else {
      console.log('Ha risposto NO');
    }
  }

  eliminaLinguaDich(codLingua: number, isLinguaMadre: boolean = false) {
    console.log(codLingua);
    let request: any = {
      idLingua: codLingua
    }
    this.cvService.deleteLinguaDichById(request).subscribe(
      ris => {
        if (ris.esitoPositivo) {
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          isLinguaMadre ? this.lingueMadriList.splice(this.lingueMadriList.findIndex(ling => ling.id == codLingua), 1) : this.linguaStranieraCvList.splice(this.linguaStranieraCvList.findIndex(ling => ling.id == codLingua), 1)
          this.isEliminaLinguaMadre = false
          this.updateCv()
        }
      }
    )
  }
  inserisciEliminaLinguaMadre() {
    let linguaMadre: LinguaDich = {
      codLingua: { codLingua: this.formLinguaMadre.get("lingua").value },
      idCandidatura: this.cvSelected.id,
      codGradoConLingua: { codGradoConLinguaMin: "C2", codGradoConLingua: "V" },
      idModApprLingua: { idModApprLingua: "D" },
      codUserAggiorn: "",
      codUserInserim: "",
      dAggiorn: new Date(),
      dInserim: new Date(),
      flgCertificazioneAcquisita: "N"
    }
    let request: any = {
      linguaDich: linguaMadre,
      idSilLavAnagrafica: this.utente.idSilLavAnagrafica
    }
    this.cvService.inserisciLinguaDich(request).subscribe(
      ris => {
        if (ris.esitoPositivo) {
          this.lingueMadriList.push(ris.linguaDich)
          this.updateCv()
          const data: DialogModaleMessage = {
            titolo: "Lingue",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data);
          this.showForm = false;
          this.formLinguaMadre.reset();
          this.showFormLinguaMadre = false;
          this.form.reset();
        }
      }
    )
  }

  inserisciAggiornaLingua() {
    if (this.linguaSelected) {
      let request: any = {
        linguaDich: Utils.cleanObject(this.creaLinguaDich(this.linguaSelected)),
        idSilLavAnagrafica: this.utente.idSilLavAnagrafica
      }
      this.cvService.aggiornaLinguaDich(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            this.linguaStranieraCvList.splice(this.linguaStranieraCvList.findIndex(lin => lin.id == this.linguaSelected.id), 1, ris.linguaDich)

            this.updateCv()
            const data: DialogModaleMessage = {
              titolo: "Lingue",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioAggiornamento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
          }
          this.showForm = false
        }
      )
    } else {
      let request: any = {
        linguaDich: Utils.cleanObject(this.creaLinguaDich()),
        idSilLavAnagrafica: this.utente.idSilLavAnagrafica
      }
      this.cvService.inserisciLinguaDich(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            this.linguaStranieraCvList.push(ris.linguaDich)
            this.linguaSelected = ris.linguaDich
            this.updateCv()
            const data: DialogModaleMessage = {
              titolo: "Lingue",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioInserimento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data)
          }
          this.showForm = false
        }
      )
    }
  }

  creaLinguaDich(lingua?: LinguaDich): LinguaDich {
    let linguaRis: LinguaDich = {
      ...lingua,
      codLingua: { codLingua: this.form.get("lingua").value },
      idCandidatura: this.cvSelected.id,
      codGradoConLingua: { codGradoConLingua: this.form.get("livello").value },
      //idModApprLingua:{idModApprLingua:"D"},
      codUserAggiorn: "",
      codUserInserim: "",
      dAggiorn: new Date(),
      dInserim: new Date(),
      flgCertificazioneAcquisita: this.form.get("flgCertificato").value ? "S" : "N",
      tipoCertificazione: this.form.get("tipoCertificazione").value
    }
    return linguaRis;
  }

  patchForm(lingua: LinguaDich, azione: string) {
    this.showForm = true
    this.inModifica = true
    this.linguaSelected = lingua
    this.form.get("lingua").patchValue(lingua.codLingua.codLingua)
    this.form.get("flgCertificato").patchValue(lingua.flgCertificazioneAcquisita == "S" ? true : false)
    this.form.get("livello").patchValue(lingua.codGradoConLingua.codGradoConLingua)
    this.form.get("tipoCertificazione").patchValue(lingua.tipoCertificazione)
    if (!this.canModifica || azione != "m") {
      this.form.disable()

    } else {
      this.form.enable()
      this.form.get("lingua").disable()
    }
  }

  onInsertLingua() {
    this.form.reset();
    this.showForm = true;
    this.form.enable();
    this.form.get('flgCertificato')?.setValue(false);
    this.form.get('tipoCertificazione')?.disable();
    this.linguaSelected = null
  }

  toggleForm() {

    this.inModifica = true
    this.showForm = !this.showForm;
    this.linguaSelected = undefined
    this.form.reset()
    let lingueDecodificheConosciute: Decodifica[] = this.linguaStranieraCvList.map(lingua => {
      return {
        id: lingua.codLingua.codLingua
      }
    })
    this.linguaDecodificheFiltrate = this.linguaDecodifiche.filter((lingua) => {
      return !lingueDecodificheConosciute.find(ling => ling.id == lingua.id)
    })
    this.linguaDecodificheFiltrate = this.linguaDecodificheFiltrate.filter((lingua) => {
      return !this.lingueMadriList.find(ling => ling.codLingua.codLingua == lingua.id)
    })


  }

  private loadDecodifiche() {
    const requests$ = [
      this.decodificaBlpService.findDecodificaBlpByTipo('LINGUA',),
      this.decodificaBlpService.findDecodificaBlpByTipo('GRADO_CON_LINGUA',),

    ];

    forkJoin(requests$).subscribe({
      next: (multiResponse: any[]) => {
        if (multiResponse[0].esitoPositivo) {
          this.linguaDecodifiche = multiResponse[0].list
          this.updateCv()

        }
        if (multiResponse[1].esitoPositivo) {
          multiResponse[1].list.forEach((el: Decodifica) => {
            el.descr = `${el.codice} - ${el.descr}`;
          });
          this.gradoConoscenzaLingua = multiResponse[1].list;
        }
        let lingueDecodificheConosciute: Decodifica[] = this.linguaStranieraCvList.map(lingua => {
          return {
            id: lingua.codLingua.codLingua
          }
        })
        this.linguaDecodificheFiltrate = this.linguaDecodifiche.filter((lingua) => {
          return !lingueDecodificheConosciute.find(ling => ling.id == lingua.id)
        })
        this.linguaDecodificheFiltrate = this.linguaDecodificheFiltrate.filter((lingua) => {
          return !this.lingueMadriList.find(ling => ling.codLingua.codLingua == lingua.id)
        })
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, loadDecodifiche`);
      }
    });


  }

  inserisciLinguaDaFascicolo(lingua: LinguaStraniera) {
    let request: any = {
      idCv: this.cvSelected.id,
      linguaDaMappare: lingua
    }
    this.mappingServicce.insertLinguaDichFromSilp(request).subscribe(
      res => {
        if (res.esitoPositivo) {
          this.linguaStranieraCvList.push(res.linguaDich)
          this.updateCv()
        }
      }
    )
  }


  updateCv() {
    this.cvSelected.linguaDichList = this.linguaStranieraCvList.concat(this.lingueMadriList)
    this.cvBagService.updateSelectedCv(this.cvSelected)
  }
  get canModifica() {
    return this.cvSelected?.flgGeneratoDaSistema != "S" && this.cvBagService.getAzioneActual() == "M"
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente()
  }

  visualizzaLinguaStranieraFascicolo(lingua: LinguaStraniera) {
    this.promptModalService.openVisualizzaConoscenzaLinguistica(lingua);
  }

  onCertificatoChange(event: any) {
    console.log(event.target.checked);
    if (!event.target.checked) {
      this.form.get('tipoCertificazione')?.setValue('');
      this.form.get('tipoCertificazione')?.disable();
    } else {
      this.form.get('tipoCertificazione')?.enable();
    }
  }

}
