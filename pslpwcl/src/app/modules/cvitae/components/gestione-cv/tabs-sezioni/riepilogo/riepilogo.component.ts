/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Candidatura,
  CvService,
  Lingua,
  LinguaDich,
  MessaggioService,
  PslpMessaggio,
  SchedaAnagraficaProfessionale,
  StatoCandidatura,
  ValidaCvRequest,
} from 'src/app/modules/pslpapi';
import { CommonService } from 'src/app/services/common.service';
import { Decodifica, Recapito } from 'src/app/modules/pslpapi';
import { Utils } from 'src/app/utils';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { TYPE_ALERT } from 'src/app/constants';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'pslpwcl-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.scss'],
})
export class RiepilogoComponent implements OnInit {
  @Input() colorBg = '#E7E6E6';
  @Input() stampa = false;
  @Input() foto?: any;
  @Input() fotoVisibile = true;

  oggi = new Date();
  appartineCategoria = true;
  fascicolo: SchedaAnagraficaProfessionale;
  cvitae: Candidatura;
  info10: PslpMessaggio;
  titoloCv: string = 'Titolo CV arriva da dati anagrafici?';
  ulterioreInformazione: string =
    'Dato arriva da la sezione Ulteriore Informazione....';
  autorizzo: string =
    'Autorizzo il trattamento dei miei dati personali presenti nel cv ai sensi del \
Decreto Legislativo 30 giugno 2003, n. 196 “Codice in materia di protezione \
dei dati personali” e del GDPR (Regolamento UE 2016/679). ';
  msgAppartieneCategoria =
    'Appartenente alle categorie di persone con disabilità (L.68/99)';

  msgLingueMadri = '';
  patentiPossedute: Decodifica[] = [];
  patentiniPossedute: Decodifica[] = [];
  lingueConosciute: LinguaDich[] = [];
  lingueMadri: LinguaDich[] = [];
  messagioCattProt: PslpMessaggio;
  messaggioValidaCvSenzaProfDess: PslpMessaggio;
  messaggioConfermaValidaCv: PslpMessaggio;
  messagioInserimento: PslpMessaggio;

  constructor(
    private commonService: CommonService,
    private cvBagService: CvitaeService,
    private messaggioService: MessaggioService,
    private cvService: CvService,
    private promptModalService: PromptModalService
  ) {}

  ngOnInit(): void {
    this.fascicolo = this.commonService.fascicolo;

    // pslp_d_messaggio Inserimento generico
    this.commonService.getMessaggioByCode("I14").then(messaggio => {
      this.messagioInserimento =  messaggio;
    });

    // pslp_d_messaggio conferma valida CV
    this.commonService.getMessaggioByCode('C5').then((messaggio) => {
      this.messaggioConfermaValidaCv = messaggio;
    });

    // pslp_d_messaggio Mancanza professione dessiderata
    this.commonService.getMessaggioByCode('I38').then((messaggio) => {
      this.messaggioValidaCvSenzaProfDess = messaggio;
    });

    // pslp_d_messaggio Appartenente alle categorie di persone con disabilità (L.68/99)
    this.commonService.getMessaggioByCode('I17').then((messaggio) => {
      this.messagioCattProt = messaggio;
    });

    // pslp_d_messaggio autorizzo
    this.commonService.getMessaggioByCode('I18').then((messaggio) => {
      this.autorizzo = messaggio.testo;
    });

    // Stampa CV
    this.commonService.getMessaggioByCode('I10').then((messaggio) => {
      this.info10 = messaggio;
    });

    this.cvBagService.selectedCv.subscribe((ris) => (this.cvitae = ris));
    this.appartineCategoria =
      this.cvitae?.flgL68 == 'S' && this.cvitae?.flgStampaL68 ? true : false;

    this.patentiPossedute = this.cvitae?.patentePossedutaList?.map((p) => {
      return {
        id: p.idTipoPatente.idTipoPatente,
        descr: p.idTipoPatente.descrTipoPatente,
      };
    });
    this.patentiniPossedute = this.cvitae?.abilitazionePossedutaList.map(
      (p) => {
        return {
          id: p.idTipoAbilitazione.idTipoAbilitazione,
          descr: p.idTipoAbilitazione.descrTipoAbilitazione,
        };
      }
    );
    this.lingueConosciute = this.cvitae?.linguaDichList.filter(
      (l) => l.idModApprLingua?.idModApprLingua != 'D'
    );
    this.lingueMadri = this.cvitae?.linguaDichList.filter(
      (l) => l.idModApprLingua?.idModApprLingua.trim() == 'D'
    );

    this.lingueMadri
      ?.map((ling) => ling.codLingua.descrLingua + ', ')
      .forEach((str) => (this.msgLingueMadri = this.msgLingueMadri + str));

    this.msgLingueMadri = this.msgLingueMadri.substring(
      0,
      this.msgLingueMadri.length - 2
    );
  }

  async validareCv() {
    if(!this.isCvCompleto){
      const data: DialogModaleMessage = {
        titolo: 'Validazione',
        tipo: TypeDialogMessage.Confirm,
        messaggio: this.messaggioValidaCvSenzaProfDess?.testo,
        size: 'lg',
        tipoTesto: TYPE_ALERT.WARNING,
      };
      this.promptModalService.openModaleConfirm(data);
      return;
    }
    const data: DialogModaleMessage = {
      titolo: 'Validazione del Curriculum',
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: this.messaggioConfermaValidaCv?.testo,
      messaggioAggiuntivo: '',
      size: 'lg',
      tipoTesto: TYPE_ALERT.WARNING,
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result == 'SI') {

      //  DEBUG: Decommentare per tracciare la validazione
      // console.log('🔍 DEBUG VALIDAZIONE CV - PRIMA DI INVIARE');
      // console.log('- this.cvitae:', JSON.parse(JSON.stringify(this.cvitae)));
      // console.log('- this.cvitae.idLavAnagrafica:', this.cvitae?.idLavAnagrafica);

      //  Verifica che cvitae abbia idLavAnagrafica
      if (!this.cvitae?.idLavAnagrafica) {
        console.error('❌ ERRORE CRITICO: this.cvitae.idLavAnagrafica è null!');
        console.error('- Provo a recuperare dal fascicolo...');

        // Popola da fascicolo
        if (this.fascicolo?.idSilLavAnagrafica) {
          this.cvitae.idLavAnagrafica = {
            id: this.fascicolo.idSilLavAnagrafica,
            idSilLavAnagrafica: this.fascicolo.idSilLavAnagrafica,
            codiceFiscale: this.fascicolo.datiAnagrafici.datiGenerali.datiPersonali.codiceFiscale,
            dNascita: this.fascicolo.datiAnagrafici.datiGenerali.datiPersonali.dataDiNascita,
            dsCognome: this.fascicolo.datiAnagrafici.datiGenerali.datiPersonali.cognome,
            dsNome: this.fascicolo.datiAnagrafici.datiGenerali.datiPersonali.nome,
            eMail: this.fascicolo.datiAnagrafici.reperibilitaRecapiti.recapito.email,
            genere: this.fascicolo.datiAnagrafici.datiGenerali.datiPersonali.genere.id,
          };
          console.log(' idLavAnagrafica popolato da fascicolo:', this.cvitae.idLavAnagrafica);
        } else {
          console.error('❌ Impossibile popolare idLavAnagrafica - fascicolo non disponibile');
          const errorData: DialogModaleMessage = {
            titolo: 'Errore Validazione',
            tipo: TypeDialogMessage.Confirm,
            messaggio: 'Errore: Dati anagrafica non disponibili. Impossibile validare il CV.',
            size: 'lg',
            tipoTesto: TYPE_ALERT.ERROR,
          };
          this.promptModalService.openModaleConfirm(errorData);
          return;
        }
      }

      // console.log('📤 Invio dati CV a SILP...');
      // console.log('- candidatura.idLavAnagrafica:', this.cvitae.idLavAnagrafica);

      this.cvService.inviaDatiCvASilp(this.cvitae).subscribe({
        next: (ris) => {
          // console.log('📥 Risposta inviaDatiCvASilp:', ris);

          if (ris !=null && (ris.esitoPositivo || ris.esitoPositivo == null)) {
            //  Usa id o fallback a idSilLavAnagrafica
            const idBlpAnagrafica = this.cvitae.idLavAnagrafica?.id ||
                                    this.cvitae.idLavAnagrafica?.idSilLavAnagrafica;

            // console.log('- idBlpAnagrafica per validaCv:', idBlpAnagrafica);

            if (!idBlpAnagrafica) {
              console.error('❌ ERRORE: idBlpAnagrafica non disponibile!');
              const errorData: DialogModaleMessage = {
                titolo: 'Errore Validazione',
                tipo: TypeDialogMessage.Confirm,
                messaggio: 'Errore: ID anagrafica non disponibile dopo inviaDatiCvASilp.',
                size: 'lg',
                tipoTesto: TYPE_ALERT.ERROR,
              };
              this.promptModalService.openModaleConfirm(errorData);
              return;
            }

            let req: any = {
              idBlpAnagrafica: idBlpAnagrafica,
              idCv: this.cvitae.id,
              isGeneratoDaSistema: this.cvitae.flgGeneratoDaSistema,
              curriculumVitae: ris.curriculumVitae,
            };

            // console.log('📤 Chiamata validaCv con request:', req);

            this.cvService.validaCv(req).subscribe({
              next: (ris) => {
                // console.log('📥 Risposta validaCv:', ris);

                if (ris.esitoPositivo) {
                  // console.log(' Validazione CV completata con successo!');
                  const data: DialogModaleMessage = {
                    titolo: 'Validazione',
                    tipo: TypeDialogMessage.Confirm,
                    messaggio: this.messagioInserimento.testo,
                    size: 'lg',
                    tipoTesto: TYPE_ALERT.SUCCESS,
                  };
                  this.promptModalService.openModaleConfirm(data);
                  this.updateCv();
                } else {
                  console.error('❌ validaCv: esitoPositivo = false');
                  console.error('- Messaggi API:', ris.apiMessages);

                  const errorData: DialogModaleMessage = {
                    titolo: 'Errore Validazione',
                    tipo: TypeDialogMessage.Confirm,
                    messaggio: ris.apiMessages?.[0]?.message || 'Errore durante la validazione del CV',
                    size: 'lg',
                    tipoTesto: TYPE_ALERT.ERROR,
                  };
                  this.promptModalService.openModaleConfirm(errorData);
                }
              },
              error: (err) => {
                console.error('❌ Errore chiamata validaCv:', err);

                const errorData: DialogModaleMessage = {
                  titolo: 'Errore Validazione',
                  tipo: TypeDialogMessage.Confirm,
                  messaggio: 'Errore durante la chiamata di validazione del CV',
                  size: 'lg',
                  tipoTesto: TYPE_ALERT.ERROR,
                };
                this.promptModalService.openModaleConfirm(errorData);
              }
            });
          } else {
            const data: DialogModaleMessage = {
              titolo: 'Validazione',
              tipo: TypeDialogMessage.Confirm,
              messaggio: 'Errore durante la validazione',
              size: 'lg',
              tipoTesto: TYPE_ALERT.ERROR,
            };
            this.promptModalService.openModaleConfirm(data);
          }
        },
      });
    }
  }

  updateCv() {
    let stato = {
      codStatoCandidatura: 'V',
      descrStatoCandidatura: 'Valido',
      dInizio: new Date(),
    };
    this.cvitae.codStatoCandidatura = stato;

    this.cvBagService.updateSelectedCv(this.cvitae);
    this.cvBagService.setAzioneActual('V');
  }

  get isCvCompleto(){
    return this.cvitae.professioneDesiderataList.length>0
  }
  get canModifica(){
    //console.log(this.cvBagService.getAzioneActual())
    return this.cvBagService.getAzioneActual()=="M"
  }
}
