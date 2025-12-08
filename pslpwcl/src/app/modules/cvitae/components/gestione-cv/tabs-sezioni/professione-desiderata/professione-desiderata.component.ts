/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { Candidatura, Decodifica, DecodificaBlpService, DettaglioProfessioneDesiderataRequest, InserisciAggiornaProfessioneDesiderataRequest, ModalitaLavoro, ProfessioneDesiderata, PslpMessaggio, Qualifica } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { Utils } from 'src/app/utils';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-professione-desiderata',
  templateUrl: './professione-desiderata.component.html',
  styleUrls: ['./professione-desiderata.component.scss']
})
export class ProfessioneDesiderataComponent implements OnInit {




  showForm = false;
  cvSelected: Candidatura
  professioniDesiderate: ProfessioneDesiderata[] = []
  professioneDesiderataSelected: ProfessioneDesiderata
  isModifica: boolean = true
  qualifica: Decodifica[] = []

  modalitaLavoro: Decodifica[] = []
  modalitaLavoroFiltrati: Decodifica[] = []

  tipoContratto: Decodifica[] = []
  tipoContrattoFiltrato: Decodifica[] = []
  modalitaLavSelected: ModalitaLavoro;

  modalitaLavori: Decodifica[] = [];
  modalitaLavoroSel: Decodifica[] = []
  tipoContrattoSel: Decodifica[] = []
  tipoLavori: Decodifica[] = [];
  formaOptions = [
    { descr: 'Determinato', id: 'D' },
    { descr: 'Indeterminato', id: 'I' }
  ];

  isDisabledConfermaInserireModaliitaLavoro = true;
  isDisabledConfermaInserireTipoContrato = true;

  form: FormGroup = this.fb.group({
    qualifica: [null, Validators.required],
    dsQualifica: [null, Validators.required],
    dsProfessioneDesiderata: [null],
    esperienzaSettore: [null],
    dsEsperienzaSettore: [null],
    modalitaLavoro: [null],
    tipoContratto: [null]
  })
  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;
  messaggioProfDesiderata: PslpMessaggio;
  messaggioNonCiSonoDati: PslpMessaggio;


  constructor(
    private fb: FormBuilder,
    private cvService: CvService,
    private cvBagService: CvitaeService,
    private decodificaBlpService: DecodificaBlpService,
    private promptModalService: PromptModalService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati = messaggio;
    });

    // pslp_d_messaggio Proffesioni desiderata
    this.commonService.getMessaggioByCode("I36").then(messaggio => {
      this.messaggioProfDesiderata = messaggio;
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
    this.cvBagService.selectedCv.subscribe(
      ris => {
        this.cvSelected = ris
        this.professioniDesiderate = ris.professioneDesiderataList
      }
    )

    // this.decodificaBlpService.findDecodificaBlpByTipo("QUALIFICA").subscribe(
    //   ris=>this.qualifica=ris.list
    // )
    this.decodificaBlpService.findDecodificaBlpByTipo("TIPO_RAPPORTO_LAVORO",).subscribe(
      ris => {
        this.tipoContratto = ris.list;
        this.tipoContrattoFiltrato = ris.list;
      }
    )
    this.decodificaBlpService.findDecodificaBlpByTipo("MODALITA_LAVORO",).subscribe(
      ris => {
        this.modalitaLavoro = ris.list;
        this.modalitaLavoroFiltrati = ris.list;
      }
    )

  }
  onInserisciNuovaProfessione() {
    this.showForm = true
    this.form.reset()
    this.professioneDesiderataSelected = null;
    this.form.enable();
    this.isModifica = true;
  }
  addModalitaLavoro() {
    this.modalitaLavoroSel.push(this.form.get('modalitaLavoro').value as Decodifica);
    this.filtraModalitaLavoro();
    this.isDisabledConfermaInserireModaliitaLavoro = true
  }

  removeModalitaLavoro(decodifica: Decodifica) {
    this.modalitaLavoroSel.splice(this.modalitaLavoroSel.findIndex(tp => tp.id == decodifica.id), 1);
    this.filtraModalitaLavoro();
  }

  filtraModalitaLavoro() {
    this.modalitaLavoroFiltrati = this.modalitaLavoro.filter(m => { return !this.modalitaLavoroSel.find(mm => mm.id == m.id) });
  }
  onchangeModalitaLavoro(event: any) {
    if (event.value)
      this.isDisabledConfermaInserireModaliitaLavoro = false;
  }


  addTipoContratto() {
    this.tipoContrattoSel.push(this.form.get('tipoContratto').value as Decodifica);
    this.filtraTipoContratto();
    this.isDisabledConfermaInserireTipoContrato = true
  }
  removeTipoContratto(decodifica: Decodifica) {
    this.tipoContrattoSel.splice(this.tipoContrattoSel.findIndex(tp => tp.id == decodifica.id), 1);
    this.filtraTipoContratto();
  }
  filtraTipoContratto() {
    this.tipoContrattoFiltrato = this.tipoContratto.filter(m => { return !this.tipoContrattoSel.find(mm => mm.id == m.id) });
  }
  onchangeTipoContrato(event: any) {
    if (event.value)
      this.isDisabledConfermaInserireTipoContrato = false;
  }

  onFilterQualifica(event: any) {
    let txt: string = event?.filter;
    if (txt == null || txt == undefined || txt.length < 2) { return; }
    this.decodificaBlpService.fill("QUALIFICA", txt).subscribe({
      next: (r: any) => {
        if (r.esitoPositivo) {
          this.qualifica = r.list;

        }
      },
      error: err => { },
      complete: () => { }
    })
  }



  inserisciAggiornaProfDesiderata() {
    let request: any = {
      modalitaLavoroList: this.modalitaLavoroSel.map(m => {
        return {
          id: m.id,
          descrModalitaLavoro: m.descr
        }
      }),
      professioneDesiderata: Utils.cleanObject(this.creaProfessioneDesiderata()),
      tipoCOntrattoList: this.tipoContrattoSel.map(t => {
        return {
          id: t.id,
          descrTipoRapportoLavoro: t.descr
        }
      })
    }
    if (this.professioneDesiderataSelected) {

      this.cvService.aggiornaProfessioneDesiderata(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            this.professioniDesiderate.splice(this.professioniDesiderate.findIndex(pr => pr.id == ris.professioneDesiderata.id), 1, ris.professioneDesiderata)
            const data: DialogModaleMessage = {
              titolo: "Professioni desiderate",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioAggiornamento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.promptModalService.openModaleConfirm(data);
            this.updateCv();
            this.showForm = false;
          }
        }
      )
    } else {
      let esisteProfessioneDesiderata = this.professioniDesiderate.find(pr => pr.idQualifica.idQualifica == this.form.get("qualifica").value)
      if (esisteProfessioneDesiderata) {
        this.form.setErrors({ professioneDesiderataEsistente: true })
        const data: DialogModaleMessage = {
          titolo: "Professioni desiderate",
          tipo: TypeDialogMessage.Confirm,
          messaggio: "Profilo professionale di interesse già inserito",
          size: "lg",
          tipoTesto: TYPE_ALERT.ERROR
        };
        this.promptModalService.openModaleConfirm(data);
        return;
      }
      this.cvService.inserisciProfessioneDesiderata(request).subscribe(
        ris => {
          if (ris.esitoPositivo) {
            this.professioniDesiderate.push(ris.professioneDesiderata)
            const data: DialogModaleMessage = {
              titolo: "Professioni desiderate",
              tipo: TypeDialogMessage.Confirm,
              messaggio: this.messagioInserimento.testo,
              size: "lg",
              tipoTesto: TYPE_ALERT.SUCCESS
            };
            this.professioneDesiderataSelected = ris.professioneDesiderata
            this.promptModalService.openModaleConfirm(data)
            this.updateCv();
            this.showForm = false;
          }
        }
      )
    }
  }

  modificaProfessione(professioneDesiderata: ProfessioneDesiderata) {
    this.professioneDesiderataSelected = professioneDesiderata
    this.isModifica = true
    this.patchForm('m')
  }
  visualizzaProfessione(professioneDesiderata: ProfessioneDesiderata) {
    this.professioneDesiderataSelected = professioneDesiderata
    this.isModifica = false
    this.patchForm('v')
  }
  patchForm(azione: string) {
    this.showForm = true;
    this.qualifica.push(...[{
      id: this.professioneDesiderataSelected.idQualifica.idQualifica,
      descr: this.professioneDesiderataSelected.idQualifica.descrQualifica,

    }]);
    this.form.get("qualifica").setValue(this.professioneDesiderataSelected.idQualifica.idQualifica || null);


    this.form.get("dsProfessioneDesiderata").patchValue(this.professioneDesiderataSelected.dsProfessioneDesiderata)
    //this.form.get("flgTrasferta").patchValue(this.professioneDesiderataSelected.flgTrasferte)
    //this.form.get("flgMezzoProprio").patchValue(this.professioneDesiderataSelected.flgMezzoProprio)
    this.form.get("dsQualifica").patchValue(this.professioneDesiderataSelected.dsQualifica)
    this.form.get("esperienzaSettore").patchValue(this.professioneDesiderataSelected.dsEsperienzaNelSettore)
    this.form.get("dsEsperienzaSettore").patchValue(this.professioneDesiderataSelected.dsDescrizDurataEsperienza)
    this.modalitaLavoroSel = this.professioneDesiderataSelected.modalitaList.map(prof => {
      return {
        id: prof.idModalitaLavoro.id,
        codice: prof.idModalitaLavoro.codModalitaLavoroMin,
        descr: prof.idModalitaLavoro.descrModalitaLavoro
      }
    });
    this.tipoContrattoSel = this.professioneDesiderataSelected.tipoContrattoList.map(tip => {
      return {
        id: tip.idTipoRapportoLavoro.id,
        codice: tip.idTipoRapportoLavoro.codTipoRapportoLavoroMin,
        descr: tip.idTipoRapportoLavoro.descrTipoRapportoLavoro
      }
    });

    this.filtraModalitaLavoro();
    this.filtraTipoContratto();

    if (!this.canModifica || azione != 'm') {
      this.form.disable()
    } else {
      this.form.enable()
    }


  }
  eliminaProfessione(professioneDesiderata: ProfessioneDesiderata) {
    let request: any = {
      idProfessioneDesiderata: professioneDesiderata.id
    }
    this.cvService.eliminaProfessioneDesiderataById(request).subscribe(
      ris => {
        if (ris.esitoPositivo) {
          this.professioniDesiderate.splice(this.professioniDesiderate.findIndex(pd => pd.id == professioneDesiderata.id), 1)
          this.updateCv();
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioEliminazione.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
        }
      }
    )
  }
  async onClickEliminaTitolo(professioneDesiderata: ProfessioneDesiderata) {
    const data: DialogModaleMessage = {
      titolo: "Eliminare professione desiderata",
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: `Si conferma l'eliminazione della professione desiderata?`,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {

      this.eliminaProfessione(professioneDesiderata);
    }
  }
  creaProfessioneDesiderata(): ProfessioneDesiderata {
    return {
      ...this.professioneDesiderataSelected,
      idCandidatura: this.cvSelected.id,
      //dsDescrizDurataEsperienza:this.form.get(""),
      dsProfessioneDesiderata: this.form.get("dsProfessioneDesiderata").value,
      //flgTrasferte:this.form.get("flgTrasferta").value,
      //flgMezzoProprio:this.form.get("flgMezzoProprio").value,
      dsQualifica: this.form.get("dsQualifica").value,
      idQualifica: { idQualifica: this.form.get("qualifica").value },
      dsEsperienzaNelSettore: this.form.get("esperienzaSettore").value,
      dsDescrizDurataEsperienza: this.form.get("dsEsperienzaSettore").value,
      codUserInserim: this.professioneDesiderataSelected?.codUserInserim ?? "",
      dInserim: this.professioneDesiderataSelected?.dInserim ?? new Date(),
      codUserAggiorn: "",
      dAggiorn: new Date(),
      modalitaList: null,
      tipoContrattoList: null
    }
  }
  updateCv() {
    this.cvSelected.professioneDesiderataList = this.professioniDesiderate
    this.cvBagService.updateSelectedCv(this.cvSelected)
  }
  get canModifica() {
    return this.cvBagService.getAzioneActual() == "M"
  }

  onClickAnnulla() {
    this.form.reset();
    this.modalitaLavoroSel = [];
    this.tipoContrattoSel = [];
    this.showForm = false;
    this.isModifica = true
  }
}
