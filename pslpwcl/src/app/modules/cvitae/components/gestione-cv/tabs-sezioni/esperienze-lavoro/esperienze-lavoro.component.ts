/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TYPE_ALERT } from 'src/app/constants';
import { CvitaeService } from 'src/app/modules/cvitae/services/cvitae.service';
import { InserisciEsperienzaLavoroComponent } from 'src/app/modules/fascicolo/components/tabs-stepper/inserisci-esperienza-lavoro/inserisci-esperienza-lavoro.component';
import { RapportoDiLavoro, EsperienzaProfessionale, SchedaAnagraficaProfessionale, FascicoloPslpService, EsperienzaLav, Candidatura, DettaglioCvRequest, InserisciAggiornaEsperienzaLavRequest, MapSilpToBlpEsperienzaLavRequest, DettaglioEsperienzaLavRequest, PslpMessaggio } from 'src/app/modules/pslpapi';
import { CvService } from 'src/app/modules/pslpapi/api/cv.service';
import { MappingService } from 'src/app/modules/pslpapi/api/mapping.service';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'pslpwcl-esperienze-lavoro',
  templateUrl: './esperienze-lavoro.component.html',
  styleUrls: ['./esperienze-lavoro.component.scss']
})
export class EsperienzeLavoroComponent implements OnInit {

  rapportoList?: Array<RapportoDiLavoro>;
  esperienzeProfessionali?: Array<EsperienzaProfessionale>;
  fascicolo?:SchedaAnagraficaProfessionale
  esperienzeCv?:EsperienzaLav[]=[]
  rowDataEsperienze:RowDataEsperienze[]=[]
  rowDataEsperienzeFiltrate:RowDataEsperienze[]=[]
  cv?:Candidatura


  @ViewChild('espLav') espLav:InserisciEsperienzaLavoroComponent;
  showEsperienzeProfessionali = false;

  mod = 'ins';
  esperienzaSelected?:EsperienzaProfessionale;
  esperienzaLavBlpSelected?:EsperienzaLav;
  messagioEliminazione: PslpMessaggio;

  messaggioNonCiSonoDati: PslpMessaggio;
  messaggioEspeLavoroFasc: PslpMessaggio;
  messaggioEspeLavoroCv: PslpMessaggio;

  constructor(
    private commonService:CommonService,
    private promptModalService: PromptModalService,
    private fascicoloService:FascicoloPslpService,
    private logService:LogService,
    private cvBagService:CvitaeService,
    private cvService:CvService,
    private mappingToBlpService:MappingService
  ) {

  }

  ngOnInit(): void {
    // pslp_d_messaggio Non ci sono dati
    this.commonService.getMessaggioByCode("I19").then(messaggio => {
      this.messaggioNonCiSonoDati =  messaggio;
    });
    // pslp_d_messaggio corsi fascicolo
    this.commonService.getMessaggioByCode("I20").then(messaggio => {
      this.messaggioEspeLavoroFasc =  messaggio;
    });
    // pslp_d_messaggio  corsi Cv
    this.commonService.getMessaggioByCode("I21").then(messaggio => {
      this.messaggioEspeLavoroCv=  messaggio;
    });

    // pslp_d_messaggio Eliminazione generico
    this.commonService.getMessaggioByCode("I15").then(messaggio => {
      this.messagioEliminazione =  messaggio;
    });
    this.fascicolo=this.commonService.fascicoloActual
    this.esperienzeProfessionali=this.fascicolo.esperienzeLavorative?.esperienzeProfessionali

    this.rapportoList=this.fascicolo.esperienzeLavorative.rapporto
    this.rowDataEsperienze=this.esperienzeProfessionali.map(esperienza=>{
      return {
        dataInizio:esperienza?.dataAssunzione,
        denominazioneAzienda:esperienza?.lavEsperienzaLavoro?.dsDenominazioneDl?? esperienza?.lavEsperienzaLavoro?.dsDenominazioneAu,
        dataFine: esperienza?.dataCessazione,
        qualifica:esperienza?.lavEsperienzaLavoro?.silTQualifica?.dsSilTQualifica,
        codiceAteco:esperienza?.lavEsperienzaLavoro?.silTAteco02?.descrSilTAteco02 ||
                    esperienza?.lavEsperienzaLavoro?.silTAteco02?.codSilTAteco02 ||
                    'N/D',
        fonte:esperienza?.lavEsperienzaLavoro?.silTFontedato?.dsSilTFontedato ||
              'N/D',
        idEsp:esperienza.lavEsperienzaLavoro.idSilLavEsperienzaLavoro,
        isEsperienza:true
      }
    })

    let tmpRowData:RowDataEsperienze[]= this.rapportoList.map(rapporto=>{
      return {
        dataInizio:rapporto.dataInizioRapporto,
        denominazioneAzienda:rapporto.denominazioneAzienda,
        dataFine:rapporto.dataFine,
        qualifica:rapporto.dettaglioStoricoRapportoDiLavoro.dettaglioComOblQuery.descQualifica,
        codiceAteco:rapporto.dettaglioStoricoRapportoDiLavoro?.aziCoUt?.silTAteco02?.descrSilTAteco02 ||
                    rapporto.dettaglioStoricoRapportoDiLavoro?.aziCoUt?.silTAteco02?.codSilTAteco02 ||
                    'N/D',
        fonte:rapporto.dettaglioStoricoRapportoDiLavoro?.aziCoUt?.silTAteco02?.fontedato?.dsSilTFontedato ||
              'N/D',
        idEsp:rapporto.idSilStoricoRapportoLavoro,
        isEsperienza:false
      }
    })

    this.rowDataEsperienze=this.rowDataEsperienze.concat(tmpRowData)
    this.rowDataEsperienze.sort((a,b)=>{return new Date(a.dataInizio).getTime()-new Date(b.dataInizio).getTime()})
    this.cvBagService.selectedCv.subscribe(
      ris=>{
        this.cv=ris
        this.esperienzeCv=this.cv?.esperienzaLavList
        this.rowDataEsperienzeFiltrate=this.rowDataEsperienze.filter(es=>!this.esperienzeCv?.find(esCv=>es.idEsp==esCv.idSilLAvEsperienzaLavoro))
      }
    )


  }
  get idSilLavAnagrafica(){
    return this.fascicolo.idSilLavAnagrafica;
  }

  hideEsperienzeProfessionali(){
    this.showEsperienzeProfessionali = false;
  }

  openEsperienza(){


    this.mod = "m";
    this.esperienzaLavBlpSelected = undefined;
    this.showEsperienzeProfessionali = true;
    /*this.espLav.mod = 'ins'
    this.espLav.esperienzaSelected = undefined
    this.espLav.setForm();*/
  }

  visualizzaModificaEsp(esp:EsperienzaLav,mod:string){
    this.showEsperienzeProfessionali = true;
    this.esperienzaLavBlpSelected=esp
    this.mod=mod
  }
  async getFormFlow(mode: string, el?: EsperienzaProfessionale): Promise<boolean> {
    if (!this.showEsperienzeProfessionali || this.mod === 'view')
      return true;
    if (this.esperienzaSelected !== el || (this.esperienzaSelected === el && this.espLav.form.dirty)) {
      const data: DialogModaleMessage = {
        titolo: this.mod === 'ins' ? "Inserimento esperienza professionale" : "Modifica esperienza professionale",
        tipo: TypeDialogMessage.YesOrNo,
        messaggio: "Sei sicuro di voler continuare? Gli eventuali dati non salvati andranno persi.",
        messaggioAggiuntivo: "",
        size: "lg",
        tipoTesto: TYPE_ALERT.WARNING
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result === 'SI') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }



  /*ngOnChanges(changes: SimpleChanges){
    if(changes['fascicolo']){
      this.rapportoList = [...this.fascicolo?.esperienzeLavorative?.rapporto];
      this.esperienzeProfessionali = [...this.fascicolo?.esperienzeLavorative?.esperienzeProfessionali];
    }
  }*/

async eliminaEsp(esp:EsperienzaLav){
  const data: DialogModaleMessage = {
    titolo: "Eliminare rapporto di lavoro",
    tipo: TypeDialogMessage.YesOrNo,
    messaggio: `Si conferma l'eliminazione del rapporto di lavoro?`,
    messaggioAggiuntivo: "",
    size: "lg",
    tipoTesto: TYPE_ALERT.WARNING
  };
  const result = await this.promptModalService.openModaleConfirm(data);
  if (result === 'SI') {
    let request:any={
      iDesperienzaLav:esp.id
    }
    this.cvService.deleteEsperienzaLavoroById(request).subscribe(
      ris=>{
        if(ris.esitoPositivo){
          this.esperienzeCv.splice(this.esperienzeCv.findIndex(es=>es.id==esp.id),1)
          this.showEsperienzeProfessionali = false;
          this.updateCv();
        }
      }
    )
  }
}
  async addRapportoEsperienzaToCv(esp:RowDataEsperienze){
    let request:any={
      idCv:this.cv?.id,
      esperienzaProfessionale:esp.isEsperienza?this.esperienzeProfessionali.find(es=>es.lavEsperienzaLavoro.idSilLavEsperienzaLavoro==esp.idEsp):undefined,
      rapportoDiLavoro:!esp.isEsperienza?this.rapportoList.find(rap=>rap.idSilStoricoRapportoLavoro==esp.idEsp):undefined
    }
    this.mappingToBlpService.insertEsperienzaLavFromSilp(request).subscribe({
      next:ris=>{
        if(ris.esitoPositivo){
          this.esperienzeCv.push(ris.esperienzaDiLavoro)

          this.updateCv()
        }
      }
    })
  }

  dettaglioEsperienzeProfessionali(esp?: RowDataEsperienze){
    if(esp.isEsperienza){
      const esperienzaProfessionaleSelected = this.esperienzeProfessionali.find(es=>es.lavEsperienzaLavoro.idSilLavEsperienzaLavoro == esp.idEsp)
      console.log(esperienzaProfessionaleSelected)
      this.promptModalService.openVisualizzaEsperienzaLavoroFascicolo(this.idSilLavAnagrafica,esperienzaProfessionaleSelected);

    }else{

    }


  }

  async toggleDettaglioEsperienzeProfessionali(mode:string, esp?: RowDataEsperienze) {
    if(!esp.isEsperienza){
      return;
    }

    let esperienza: EsperienzaProfessionale = this.esperienzeProfessionali.find(es=>es.lavEsperienzaLavoro.idSilLavEsperienzaLavoro==esp.idEsp)

    if (!await this.getFormFlow(mode, esperienza))
      return;
    this.mod = mode;
    this.esperienzaSelected = esperienza;
    this.showEsperienzeProfessionali = true;

    this.espLav.mod = mode
    this.espLav.esperienzaSelected = this.esperienzaSelected

    this.espLav.setForm();
    if (this.esperienzaSelected && this.esperienzaSelected.lavEsperienzaLavoro) {
      this.espLav.patchValueInform();
    }
  }


  caricaEsp(esp:EsperienzaLav){
    this.esperienzeCv.push(esp)
    this.updateCv()
  }

  aggiornaEsp(esp:EsperienzaLav){
    this.esperienzeCv.splice(this.esperienzeCv.findIndex(es=>es.id==esp.id),1)
    this.esperienzeCv.push(esp)
    this.updateCv()
  }

  updateCv(){
    this.cv.esperienzaLavList=this.esperienzeCv
    this.cvBagService.updateSelectedCv(this.cv)
  }
  get canModifica(){
    return this.cv?.flgGeneratoDaSistema!="S" && this.cvBagService.getAzioneActual()=="M"
  }



}
interface RowDataEsperienze{
  dataInizio:Date,
  denominazioneAzienda:string,
  dataFine:Date,
  qualifica:string
  codiceAteco:string,
  fonte:string
  idEsp:number,
  isEsperienza:boolean
}
