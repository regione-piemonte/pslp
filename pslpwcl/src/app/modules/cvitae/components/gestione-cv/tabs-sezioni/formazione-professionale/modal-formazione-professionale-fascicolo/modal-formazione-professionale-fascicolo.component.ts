/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AltroCorso, Decodifica, FormazioneProfessionalePiemontese, Toponimo, DecodificaPslpService } from 'src/app/modules/pslpapi';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'pslpwcl-modal-formazione-professionale-fascicolo',
  templateUrl: './modal-formazione-professionale-fascicolo.component.html',
  styleUrls: ['./modal-formazione-professionale-fascicolo.component.scss']
})
export class ModalFormazioneProfessionaleFascicoloComponent implements OnInit {
  @Input() formazione: FormazioneProfessionalePiemontese | AltroCorso;
  @Input() isAltroCorso = false;

  formazioneProfessionale: FormazioneProfessionalePiemontese;
  altriCorso: AltroCorso;

  
  comuni: Decodifica[] = [];
  toponimos: Toponimo[] = [];
  comuniIst: Decodifica[] = [];
  comuniAz: Decodifica[] = [];
  nazioniEstere: Decodifica[] = [];
  nazioniEstereAzi: Decodifica[] = [];
  
  tipoApprendistati: Decodifica[] = [];

  
  tipoDurata: Decodifica[] = [];

  form = new FormGroup({
    denominazioneCorso: new FormControl(null),
    annoGestione: new FormControl(null),
    lavCorsoForm: new FormGroup({
      idSilLavCorsoForm: new FormControl(),
      idSilLavAnagrafica: new FormControl(),
      dInizioCorso: new FormControl(),
      flgPubblicazione: new FormControl(),
      dFineCorso: new FormControl(),
      numEsitoFinale: new FormControl(),
      silTTipoApprendistato: new FormGroup({
        idSilTTipoApprendistato: new FormControl()
      })
    }),
    lavCorsoFormAltro: new FormGroup({
      codTipologiaDurataCorso: new FormControl(),
      codTipologiaDurata: new FormControl(),
      idSilLavCorsoForm: new FormControl(),
      durataCorso: new FormControl(),
      flgStageFinale: new FormControl(),
      dsDenominazioneEnteErog: new FormControl(),
      dsDenominazioneAziStage: new FormControl(),
      durataStage: new FormControl(),
      silTComuneEnteErog: new FormGroup({
        id: new FormControl(null)
      }),
      flgLuogoEnteErog: new FormControl(null),
      silTNazioneEnteErog: new FormGroup({
        idSilTNazione: new FormControl(null)
      }),
      silTToponimoEnteErog: new FormGroup({
        idSilTToponimo: new FormControl(null),
        dsSilTToponimo: new FormControl(null)
      }),
      dsNumCivicoEnteErog: new FormControl(null),
      dsIndirizzoEnteErog: new FormControl(null),
      silTComuneAziStage: new FormGroup({
        id: new FormControl(null)
      }),
      flgLuogoAziStage: new FormControl(null),
      silTNazioneAgiStage: new FormGroup({
        idSilTNazione: new FormControl(null)
      }),
      silTToponimoAziStage: new FormGroup({
        idSilTToponimo: new FormControl(null),
        dsSilTToponimo: new FormControl(null)
      }),
      dsNumCivicoAziStage: new FormControl(null),
      dsIndirizzoAziStage: new FormControl(null)

    })
  });

  constructor(
    public activeModal: NgbActiveModal,
    public decodificaService: DecodificaPslpService
  ) { }

  ngOnInit(): void {
    this.caricaDecodifiche();
    this.patchValueInform(this.formazione);
    this.form.disable();
  }

  caricaDecodifiche(){
    this.decodificaService.findDecodificaByTipo('TOPONIMO').subscribe({
      next: (res:any) => {
        if(res.esitoPositivo){
          this.toponimos = res.list.map((r:any)=>{return{ idSilTToponimo: r.id, dsSilTToponimo: r.descr } });
          
        }
      },
      error: err => {},
      complete: ()=>{}
    });
    this.decodificaService.findDecodificaByTipo('NAZIONE').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.nazioniEstere = r.list;
          this.nazioniEstereAzi = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    });

    this.decodificaService.findDecodificaByTipo('TIPOLOGIA-DURATA').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoDurata = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    });
    this.decodificaService.findDecodificaByTipo('TIPO-APPRENDISTATO').subscribe({
      next: (r:any) => {
        if(r.esitoPositivo){
          this.tipoApprendistati = r.list;
        }
      },
      error: err => {},
      complete: ()=>{}
    });
  }

  private patchValueInform(el: AltroCorso) {

    if (el.lavCorsoForm) {

      if (!(el.lavCorsoForm.dInizioCorso instanceof Date)){
        const dateTmp = new Date(el.lavCorsoForm.dInizioCorso);
        if(!isNaN(dateTmp.getTime()))
          el.lavCorsoForm.dInizioCorso = dateTmp;

      }
      if (!(el.lavCorsoForm.dFineCorso instanceof Date)){
        const dateTmp = new Date(el.lavCorsoForm.dFineCorso);
        if(!isNaN(dateTmp.getTime()))
          el.lavCorsoForm.dFineCorso = dateTmp;
      }

      if(el.lavCorsoFormAltro.silTComuneEnteErog)
        this.comuniIst.push((el.lavCorsoFormAltro.silTComuneEnteErog as Decodifica));
      if(el.lavCorsoFormAltro.silTComuneAziStage)
        this.comuniAz.push((el.lavCorsoFormAltro.silTComuneAziStage as Decodifica));
      if(el.lavCorsoFormAltro.silTNazioneEnteErog)
        this.nazioniEstere.push((el.lavCorsoFormAltro.silTNazioneEnteErog as Decodifica));
      if(el.lavCorsoFormAltro.silTNazioneAgiStage)
        this.nazioniEstereAzi.push((el.lavCorsoFormAltro.silTNazioneAgiStage as Decodifica));

    }


    if(el.lavCorsoFormAltro){

      let constComuniTmp: Decodifica[] = [];

      if(el.lavCorsoFormAltro.silTComuneEnteErog){
        constComuniTmp.push({
          id: el.lavCorsoFormAltro.silTComuneEnteErog.id,
          descr: el.lavCorsoFormAltro.silTComuneEnteErog.descr
        });
      }

      if(el.lavCorsoFormAltro.silTComuneAziStage){
        constComuniTmp.push({
          id:  el.lavCorsoFormAltro.silTComuneAziStage.id,
          descr: el.lavCorsoFormAltro.silTComuneAziStage.descr
        });
      }

      if(constComuniTmp.length > 0)
        this.comuni = Utils.clone(constComuniTmp);
      
    }
    if(el.numDurataOre){
      this.form.get("lavCorsoFormAltro.codTipologiaDurata").setValue("1")
    }

    this.form.patchValue(el);

    console.log(el);
    console.log(this.form);
}

}
