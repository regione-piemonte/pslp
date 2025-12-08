/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AbilitazionePosseduta, Candidatura, DecodificaBlpService, DettaglioAbilitazioneDichRequest, DettaglioAlboDichRequest, InserisciEliminaPatentePossedutaRequest, IscrizioneAlboDich, LavAnagraficaAlbi, PatentePosseduta, PslpMessaggio, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';

import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Decodifica } from 'src/app/modules/pslpapi';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { Utils } from 'src/app/utils';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';

@Component({
  selector: 'pslpwcl-abilitazione-patenti',
  templateUrl: './abilitazione-patenti.component.html',
  styleUrls: ['./abilitazione-patenti.component.scss']
})
export class AbilitazionePatentiComponent implements OnInit {

  fascicolo: SchedaAnagraficaProfessionale;
  patenti: Decodifica[];
  patentiPossedute: Decodifica[];
  patentiFascicoloFiltrate: Decodifica[] = [];


  patentiFIltrate: Decodifica[] = [];
  patentiniPosseduti: Decodifica[] = [];
  patentiniFascicoloFiltrate: Decodifica[] = []

  albiPosseduti: LavAnagraficaAlbi[] = [];
  albiFascicoloFiltrati: LavAnagraficaAlbi[] = [];


  albi: Decodifica[] = [];
  albiFiltrati: Decodifica[] = [];

  abilitazioni: Decodifica[] = [];
  abilitazioniFiltrate: Decodifica[] = [];

  albiCv: IscrizioneAlboDich[] = [];
  patentiCv: PatentePosseduta[] = [];
  patentiniCv: AbilitazionePosseduta[] = [];



  messagioInserimento: PslpMessaggio;
  messagioAggiornamento: PslpMessaggio;
  messagioEliminazione: PslpMessaggio;


  cv?: Candidatura

  formPatente: FormGroup = this.fb.group({
    id: [null, Validators.required]
  })
  formAbilitazione: FormGroup = this.fb.group({
    id: [null, Validators.required]
  })
  formAlbo: FormGroup = this.fb.group({
    id: [null, Validators.required]
  })
  showFormPatenti: boolean = false;
  showFormAbilitazioni: boolean = false;
  showFormAlbi: boolean = false;

  messaggioNonCiSonoDati: PslpMessaggio;
  messaggioAlbiFasc: PslpMessaggio;
  messaggioAlbiCv: PslpMessaggio;
  messaggioPatentiFasc: PslpMessaggio;
  messaggioPatentiCv: PslpMessaggio;
  messaggioPatentiniFasc: PslpMessaggio;
  messaggioPatentiniCv: PslpMessaggio;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private promptModalService: PromptModalService,
    private cvBagService: CvitaeService,
    private cvService: CvService,
    private decodificaBlpService: DecodificaBlpService,
    private mappingService: MappingService
  ) { }


  ngOnInit(): void {

    // pslp_d_messaggio albi fascicolo
    this.commonService.getMessaggioByCode("I33").then(messaggio => {
      this.messaggioAlbiFasc = messaggio;
    });

    // pslp_d_messaggio albi cv
    this.commonService.getMessaggioByCode("I34").then(messaggio => {
      this.messaggioAlbiCv = messaggio;
    });

    // pslp_d_messaggio patente fascicolo
    this.commonService.getMessaggioByCode("I30").then(messaggio => {
      this.messaggioPatentiFasc = messaggio;
    });

    // pslp_d_messaggio patente cv
    this.commonService.getMessaggioByCode("I31").then(messaggio => {
      this.messaggioPatentiCv = messaggio;
    });
    // pslp_d_messaggio patentino fascicolo
    this.commonService.getMessaggioByCode("I32").then(messaggio => {
      this.messaggioPatentiniFasc = messaggio;
    });
    // pslp_d_messaggio patentino cv
    this.commonService.getMessaggioByCode("I37").then(messaggio => {
      this.messaggioPatentiniCv = messaggio;
    });

    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati = messaggio;
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
    /*

    !!!!!!!!!!! IMPORTANTE NEL CV ABILITAZIONE E PATENTINO SI EQUIVALGONO  !!!!!

    */
    this.fascicolo = this.commonService.fascicolo;
    this.patenti = this.fascicolo.informazioniCurriculari?.patenti;
    this.albiPosseduti = this.fascicolo.informazioniCurriculari?.altreInformazioni?.albi

    if (this.patenti) {
      this.patentiPossedute = this.patenti.filter(patente => patente.special == "P");
    }
    if (this.patenti) {
      this.patentiniPosseduti = this.patenti.filter(patente => patente.special == "A");
    }

    this.decodificaBlpService.findDecodificaBlpByTipo("ALBO",).subscribe({
      next: ris => {
        if (ris.esitoPositivo) {
          this.albi = ris.list
          this.albi = this.albi.filter(albo => !this.albiPosseduti.find(al => al?.id.silTAlbi.id == albo.id))
          this.albiFiltrati = this.albi.filter((albo) => !this.albiCv.find(al => al?.idAlbo?.id == albo.id))
        }
      }
    })
    this.decodificaBlpService.findDecodificaBlpByTipo("TIPO_PATENTE",).subscribe({
      next: ris => {
        if (ris.esitoPositivo) {
          this.patenti = ris.list
          this.patenti = this.patenti.filter((patente) => !this.patentiPossedute.find(pt => pt.id == patente.id))
          this.patentiFIltrate = this.patenti.filter((patente) => !this.patentiCv.find(pt => pt.idTipoPatente?.idTipoPatente == patente.id))
        }
      }
    })
    this.decodificaBlpService.findDecodificaBlpByTipo("TIPO_ABILITAZIONE",).subscribe({
      next: ris => {
        if (ris.esitoPositivo) {
          this.abilitazioni = ris.list
          this.abilitazioni = this.abilitazioni.filter((abilitazione) => !this.patentiniPosseduti.find(pt => pt.id == abilitazione.id))
          this.abilitazioniFiltrate = this.abilitazioni.filter((abilitazione) => !this.patentiniCv.find(pt => pt.idTipoAbilitazione?.idTipoAbilitazione == abilitazione.id))
        }
      }
    })


    this.cvBagService.selectedCv.subscribe(
      ris => {
        this.cv = ris

        this.albiCv = ris.iscrizioneAlboDichList
        this.patentiCv = ris.patentePossedutaList
        this.patentiniCv = ris.abilitazionePossedutaList


        this.albiFascicoloFiltrati = this.albiPosseduti.filter(al => !this.albiCv.find(alCv => al.id.silTAlbi.id == alCv.idAlbo.id))
        this.patentiFascicoloFiltrate = this.patentiPossedute.filter(pt => !this.patentiCv.find(ptCv => pt.id == ptCv.idTipoPatente.idTipoPatente))
        this.patentiniFascicoloFiltrate = this.patentiniPosseduti.filter(pt => !this.patentiniCv.find(ptCv => pt.id == ptCv.idTipoAbilitazione.idTipoAbilitazione))

      }
    )
  }

  onAnnulla(tipo: string) {
    switch (tipo) {
      case 'patente':
        this.showFormPatenti = false;
        this.formPatente.reset();
        break;
      case 'abilitazione':
        this.showFormAbilitazioni = false;
        this.formAbilitazione.reset();
        break;
      case 'albo':
        this.showFormAlbi = false;
        this.formAlbo.reset();
        break;
    }

  }

  onClickConferma(tipo: string) {

    switch (tipo) {
      case 'patente':
        let requestPat: any = {
          idCv: this.cv.id,
          idTipoPatente: this.formPatente.get("id").value
        }
        this.cvService.inserisciPatentePosseduta(requestPat).subscribe(
          ris => {
            if (ris.esitoPositivo) {
              this.patentiCv.push(ris.patentePosseduta);
              this.updateCv();
              this.formPatente.reset();
              this.showFormPatenti = false;
              const data: DialogModaleMessage = {
                titolo: "Gestione CV",
                tipo: TypeDialogMessage.Confirm,
                messaggio: this.messagioInserimento.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.SUCCESS
              };
              this.promptModalService.openModaleConfirm(data)
            }
          }
        )
        break;
      case 'abilitazione':
        let requestAbi: any = {
          idCv: this.cv.id,
          idAbilitazione: this.formAbilitazione.get("id").value
        }
        this.cvService.inserisciAbilitazioneDich(requestAbi).subscribe(
          ris => {
            if (ris.esitoPositivo) {
              this.patentiniCv.push(ris.abilitazionePosseduta);
              this.updateCv();
              this.showFormAbilitazioni = false;
              this.formAbilitazione.reset();
              const data: DialogModaleMessage = {
                titolo: "Gestione CV",
                tipo: TypeDialogMessage.Confirm,
                messaggio: this.messagioInserimento.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.SUCCESS
              };
              this.promptModalService.openModaleConfirm(data)
            }
          }
        )
        break;
      case 'albo':
        let requestAlbo: any = {
          idCv: this.cv.id,
          idAlbo: this.formAlbo.get("id").value
        }
        this.cvService.inserisciAlboDich(requestAlbo).subscribe(
          ris => {
            if (ris.esitoPositivo) {
              this.albiCv.push(ris.blpDIscrAlboDich);
              this.updateCv();
              this.showFormAlbi = false;
              this.formAlbo.reset();
              const data: DialogModaleMessage = {
                titolo: "Gestione CV",
                tipo: TypeDialogMessage.Confirm,
                messaggio: this.messagioInserimento.testo,
                size: "lg",
                tipoTesto: TYPE_ALERT.SUCCESS
              };
              this.promptModalService.openModaleConfirm(data)
            }
          }
        )
        break;
    }
  }
  async onClickEliminaInfoCv(id: any, tipo: string) {
    let msg = ""
    switch (tipo) {
      case 'patente':
        msg = "Sei sicuro di voler eliminare la patente selezionata?"
        break;
      case 'abilitazione':
        msg = "Sei sicuro di voler eliminare l'abilitazione selezionata?"
        break;
      case 'albo':
        msg = "Sei sicuro di voler eliminare l'albo selezionato?"
        break;
    }
    const data: DialogModaleMessage = {
      titolo: "Eliminazione " + tipo,
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: msg,
      messaggioAggiuntivo: "",
      size: "lg",
      tipoTesto: TYPE_ALERT.WARNING
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'SI') {
      console.log('Ha risposto SI');
      // this.alertMessageService.emptyMessages();
      this.onConfermaElimina(id, tipo);
    } else {
      console.log('Ha risposto NO');
    }
  }

  onConfermaElimina(id: any, tipo: string) {
    switch (tipo) {
      case 'patente':
        let requestPat: any = {
          idPatentePosseduta: id
        }
        this.cvService.deletePatentePossedutaById(requestPat).subscribe(
          ris => {
            if (ris.esitoPositivo) {
              const indexToRemove = this.patentiCv.findIndex(p => p.id === id);
              if (indexToRemove !== -1) {
                this.patentiCv.splice(indexToRemove, 1)
              }
              this.updateCv();
              this.onAnnulla(tipo);

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
        break;
      case 'abilitazione':
        let requestAbi: any = {
          idAbilitazioneDich: id
        }
        this.cvService.deleteAbilitazioneDichById(requestAbi).subscribe(
          ris => {
            if (ris.esitoPositivo) {
              this.patentiniCv.splice(this.patentiniCv.findIndex(p => p.id === id), 1)
              this.updateCv();
              this.onAnnulla(tipo);
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
        break;
      case 'albo':
        let requestAlbo: any = {
          idAlboDIch: id
        }
        this.cvService.deleteAlboDichById(requestAlbo).subscribe(
          ris => {
            if (ris.esitoPositivo) {
              this.albiCv.splice(this.albiCv.findIndex(a => a.id === id), 1)
              this.updateCv();
              this.onAnnulla(tipo);
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
        break;
    }
  }

  aggiungiPatenteDaFascicolo(patente: Decodifica) {
    let request: any = {
      idCv: this.cv.id,
      patente: patente
    }
    this.mappingService.insertPatenteFromSilp(request).subscribe(
      ris => {
        if (ris.esitoPositivo) {
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.patentiCv.push(ris.patentePosseduta)
          this.updateCv()
        }
      }
    )
  }
  aggiungiAbilitazioneDaFascicolo(patente: Decodifica) {
    let request: any = {
      idCv: this.cv.id,
      patente: patente
    }
    this.mappingService.insertPatentinoFromSilp(request).subscribe(
      ris => {
        if (ris.esitoPositivo) {
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.patentiniCv.push(ris.abilitazionePosseduta)
          this.updateCv()
        }
      }
    )
  }
  aggiungiAlboDaFascicolo(lavAnagraficaAlbi: LavAnagraficaAlbi) {
    let request: any = {
      idCv: this.cv.id,
      lavAnagraficaAlbi: lavAnagraficaAlbi
    }
    this.mappingService.insertAlboFromSilp(request).subscribe(
      ris => {
        if (ris.esitoPositivo) {
          const data: DialogModaleMessage = {
            titolo: "Gestione CV",
            tipo: TypeDialogMessage.Confirm,
            messaggio: this.messagioInserimento.testo,
            size: "lg",
            tipoTesto: TYPE_ALERT.SUCCESS
          };
          this.promptModalService.openModaleConfirm(data)
          this.albiCv.push(ris.blpDIscrAlboDich)
          this.updateCv()
        }
      }
    )
  }

  updateCv() {
    this.cv.iscrizioneAlboDichList = this.albiCv
    this.cv.patentePossedutaList = this.patentiCv
    this.cv.abilitazionePossedutaList = this.patentiniCv
    this.cvBagService.updateSelectedCv(this.cv);
    this.abilitazioniFiltrate = this.abilitazioni.filter((abilitazione) => !this.patentiniCv.find(pt => pt.idTipoAbilitazione?.idTipoAbilitazione == abilitazione.id))
    this.albiFiltrati = this.albi.filter((albo) => !this.albiCv.find(al => al?.idAlbo?.id == albo.id))
    this.patentiFIltrate = this.patenti.filter((patente) => !this.patentiCv.find(pt => pt.idTipoPatente?.idTipoPatente == patente.id))

  }
  get canModifica() {
    return this.cv?.flgGeneratoDaSistema != "S" && this.cvBagService.getAzioneActual() == "M"
  }
}



