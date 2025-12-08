/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { DecodificaPslpService, Parametro } from '../modules/pslpapi';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ParametroResponse } from '../modules/pslpapi';

@Injectable({
  providedIn: 'root'
})
export class ParametriSistemaService {
  private static readonly GG_PROFILING_FLG = 'GG_PROFILING_FLG';
  private static readonly RDC_FLG = 'RDC_FLG';
  private static readonly TEMPO_ESPO_MSG = 'TEMPO_ESPO_MSG';
  private static readonly PSLP_ACCESSO_CITT = 'PSLP_ACCESSO_CITT';
  private static readonly MODIF_SEZIONI_FLG = 'MODIF_SEZIONI_FLG';
  private static readonly DOMIC_PIEMONTE_FLG = 'DOMIC_PIEMONTE_FLG';
  private static readonly COMI_FLG = 'COMI_FLG';
  private static readonly MINORE_ETA = 'MINORE_ETA';
  private static readonly MINORE_ETA_ESP_LAV = 'MINORE_ETA_ESP_LAV';
  private static readonly MAX_REDDITO_COLL_MIRATO = 'MAX_REDDITO_COLL_MIR';
  private static readonly URL_SPID = 'URL_SPID';
  private static readonly URL_APL = 'URL_APL';
  private static readonly URL_FESR = 'URL_FESR';
  private static readonly URL_CSI = 'URL_CSI';
  private static readonly URL_LAV_PIEMONTE = 'URL_LAV_PIEMONTE';
  private static readonly URL_REG_PIEMONTE = 'URL_REG_PIEMONTE';
  private static readonly URL_TU_PIEMONTE = 'URL_TU_PIEMONTE';

  private static readonly OPER_CONTO_TERZI_FLG = 'OPER_CONTO_TERZI_FLG';
  private static readonly OPER_CALENDARIO = 'OPER_CALENDARIO';
  private static readonly OPER_CONFIGURAZIONI = 'OPER_CONFIGURAZIONI';
  private static readonly OPER_APPLICA_FLG = 'OPER_APPLICA_FLG';
  private static readonly PSLP_ACCESSO_OPER = 'PSLP_ACCESSO_OPER';
  private static readonly APPUNT_MARGINE_GG = 'APPUNT_MARGINE_GG';

  private static readonly GG_MINORE_ETA = 'GG_MINORE_ETA';
  private static readonly GG_MAGGIORE_ETA = 'GG_MAGGIORE_ETA';

  private static readonly DID_TITOLO_PATTO = 'DID_TITOLO_PATTO';
  private static readonly DID_SOTTOTIT_PATTO = 'DID_SOTTOTIT_PATTO';
  private static readonly DID_SCAD_GG_AGG_PROF  = 'DID_SCAD_GG_AGG_PROF';
  private static readonly DID_AGG_PROF_FLG  = 'DID_AGG_PROF_FLG';

  private static readonly DT_MIN_REV_VER_INV = 'DT_MIN_REV_VER_INV';

  private static readonly COMI_RICH_FLG  = 'COMI_RICH_FLG';


  isProfilingGGEnabled: boolean;
  isRdcEnabled: boolean;
  isAccessoCittadinoEnabled: boolean;
  tempoEspoMsgMs: number;
  isModificabiliSezioni: boolean;
  isObbligoDomicPiemonte: boolean;
  isCoMiEnabled: boolean;
  isCoMiRichiestaEnabled: boolean;
  minoreEta: number;
  minoreEtaEspLav: number;
  maxRedditoCollMirato: string;
  urlSpid: string;
  urlApl: string;
  urlFesr: string;
  urlCsi: string;
  urlLavPiemonte: string;
  urlRegPiemonte: string;
  urlTuPiemonte: string;

  didTitoloPatto: string;
  didSottotitoloPatto: string;
  didScadGGAggProf: number;
  didAggProfFlg: string;



  dataMinRevisioneVerbaleInvCivile: string;

  readonly isOperatoriContoTerziEnabled: boolean;
  readonly isOperatoriCalendarioEnabled: boolean;
  readonly isOperatoriConfigurazioniEnabled: boolean;
  readonly isOperatoriApplicaEnabled: boolean;
  readonly isAccessoOperatoreEnabled: boolean;
  readonly AppuntamentoMargineGiorni: number;

  etaMinGG: number;
  etaMaxGG: number;

  constructor(
    private readonly decodifica:DecodificaPslpService
  ) {
    // this.decodifica.findParametro(ParametriSistemaService.GG_PROFILING_FLG).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.isProfilingGGEnabled = data[0].parametro.valoreParametro==='S';
    //   },
    //   error: () => this.isProfilingGGEnabled = false
    // });
    // this.decodifica.findParametro(ParametriSistemaService.RDC_FLG).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.isRdcEnabled = data[0].parametro.valoreParametro==='S';
    //   },
    //   error: () => this.isRdcEnabled = false
    // });

    // this.decodifica.findParametro(ParametriSistemaService.TEMPO_ESPO_MSG).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.tempoEspoMsgMs = +data[0].parametro.valoreParametro*1000;
    //   },
    //   error: () => this.tempoEspoMsgMs = 10*1000
    // });

    // this.decodifica.findParametro(ParametriSistemaService.PSLP_ACCESSO_CITT).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.isAccessoCittadinoEnabled = data[0].parametro.valoreParametro==='S';
    //   },
    //   error: () => this.isAccessoCittadinoEnabled = false
    // });

    // this.decodifica.findParametro(ParametriSistemaService.DOMIC_PIEMONTE_FLG).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.isObbligoDomicPiemonte = data[0].parametro.valoreParametro==='S';
    //   },
    //   error: () => this.isObbligoDomicPiemonte = false
    // });

    // this.decodifica.findParametro(ParametriSistemaService.MODIF_SEZIONI_FLG).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.isModificabiliSezioni = data[0].parametro.valoreParametro==='S';
    //   },
    //   error: () => this.isModificabiliSezioni = false
    // });

    // this.decodifica.findParametro(ParametriSistemaService.COMI_FLG).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.isCoMiEnabled = data[0].parametro.valoreParametro==='S';
    //   },
    //   error: () => this.isCoMiEnabled = false
    // });

    // this.decodifica.findParametro(ParametriSistemaService.MINORE_ETA).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.minoreEta = +data[0].parametro.valoreParametro;
    //   },
    //   error: () => this.minoreEta = 0
    // });

    // this.decodifica.findParametro(ParametriSistemaService.MINORE_ETA_ESP_LAV).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.minoreEtaEspLav = +data[0].parametro.valoreParametro;
    //   },
    //   error: () => this.minoreEtaEspLav = 0
    // });

    // this.decodifica.findParametro(ParametriSistemaService.MINORE_ETA_ESP_LAV).subscribe({
    //   next: (data:Array<ParametroResponse>)=> {
    //     this.maxRedditoCollMirato = data[0].parametro.valoreParametro;
    //   },
    //   error: () => this.maxRedditoCollMirato = '999999,99'
    // });
  //   this.AppuntamentoMargineGiorni = this.businessService.getParametro(ParametriSistemaService.APPUNT_MARGINE_GG).pipe(
  //     map( (parametro: Parametro) => +parametro.valore_parametro),
  //     catchError( () => of(0))
  //   ).toPromise();
  //   this.isOperatoriContoTerziEnabled = this.businessService.getParametro(ParametriSistemaService.OPER_CONTO_TERZI_FLG).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro === 'S'),
  //     catchError( () => of(false))
  //   ).toPromise();
  //   this.isOperatoriCalendarioEnabled = this.businessService.getParametro(ParametriSistemaService.OPER_CALENDARIO).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro === 'S'),
  //     catchError( () => of(false))
  //   ).toPromise();
  //   this.isOperatoriConfigurazioniEnabled = this.businessService.getParametro(ParametriSistemaService.OPER_CONFIGURAZIONI).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro === 'S'),
  //     catchError( () => of(false))
  //   ).toPromise();
  //   this.isOperatoriApplicaEnabled = this.businessService.getParametro(ParametriSistemaService.OPER_APPLICA_FLG).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro === 'S'),
  //     catchError( () => of(false))
  //   ).toPromise();
  //   this.isAccessoOperatoreEnabled = this.businessService.getParametro(ParametriSistemaService.PSLP_ACCESSO_OPER).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro === 'S'),
  //     catchError( () => of(false))
  //   ).toPromise();
  //   this.urlSpid = this.businessService.getParametro(ParametriSistemaService.URL_SPID).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.urlApl = this.businessService.getParametro(ParametriSistemaService.URL_APL).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.urlFesr = this.businessService.getParametro(ParametriSistemaService.URL_FESR).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.urlCsi = this.businessService.getParametro(ParametriSistemaService.URL_CSI).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.urlLavPiemonte = this.businessService.getParametro(ParametriSistemaService.URL_LAV_PIEMONTE).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.urlRegPiemonte = this.businessService.getParametro(ParametriSistemaService.URL_REG_PIEMONTE).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.urlTuPiemonte = this.businessService.getParametro(ParametriSistemaService.URL_TU_PIEMONTE).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.etaMinGG = this.businessService.getParametro(ParametriSistemaService.GG_MINORE_ETA).pipe(
  //     map( (parametro: Parametro) => +parametro.valore_parametro),
  //     catchError( () => of(15))
  //   ).toPromise();
  //   this.etaMaxGG = this.businessService.getParametro(ParametriSistemaService.GG_MAGGIORE_ETA).pipe(
  //     map( (parametro: Parametro) => +parametro.valore_parametro),
  //     catchError( () => of(29))
  //   ).toPromise();
  //   this.didTitoloPatto = this.businessService.getParametro(ParametriSistemaService.DID_TITOLO_PATTO).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.didSottotitoloPatto = this.businessService.getParametro(ParametriSistemaService.DID_SOTTOTIT_PATTO).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.dataMinRevisioneVerbaleInvCivile = this.businessService.getParametro(ParametriSistemaService.DT_MIN_REV_VER_INV).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  //   this.isCoMiRichiestaEnabled = this.businessService.getParametro(ParametriSistemaService.COMI_RICH_FLG).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro === 'S'),
  //     catchError( () => of(false))
  //   ).toPromise();
  //   this.didScadGGAggProf = this.businessService.getParametro(ParametriSistemaService.DID_SCAD_GG_AGG_PROF).pipe(
  //     map( (parametro: Parametro) => +parametro.valore_parametro),
  //     catchError( () => of(0))
  //   ).toPromise();
  //   this.didAggProfFlg = this.businessService.getParametro(ParametriSistemaService.DID_AGG_PROF_FLG).pipe(
  //     map( (parametro: Parametro) => parametro.valore_parametro),
  //     catchError( () => of(''))
  //   ).toPromise();
  }
}
