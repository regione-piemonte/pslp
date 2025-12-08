/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionStorageService } from 'src/app/services/storage/session-storage.service';
import { Candidatura } from '../../pslpapi';

@Injectable({
  providedIn: 'root'
})
export class CvitaeService {


  private _isCvModificabile:boolean=true
  private _selectedCv:BehaviorSubject<Candidatura|undefined>=new BehaviorSubject<Candidatura|undefined>(this.cvitaeActual)
  selectedCv=this._selectedCv.asObservable()
  constructor(
    private sessionStorageService:SessionStorageService
  ) { }


  updateSelectedCv(cv:Candidatura){
    //  DEBUG: Decommentare per tracciare il salvataggio in sessionStorage
    // console.log('🔍 DEBUG updateSelectedCv:');
    // console.log('- CV ricevuto:', cv);
    // console.log('- idLavAnagrafica:', cv?.idLavAnagrafica);

    this.cvitaeActual=cv

    // Verifica dopo il salvataggio (solo in caso di problemi)
    // const cvRecuperato = this.cvitaeActual;
    // console.log('- CV dopo salvataggio in sessionStorage:', cvRecuperato);
    // console.log('- idLavAnagrafica dopo salvataggio:', cvRecuperato?.idLavAnagrafica);

    // if (!cvRecuperato?.idLavAnagrafica && cv?.idLavAnagrafica) {
    //   console.error('❌ PROBLEMA: idLavAnagrafica PERSO durante salvataggio in sessionStorage!');
    //   console.error('- Originale aveva:', cv.idLavAnagrafica);
    //   console.error('- Recuperato ha:', cvRecuperato?.idLavAnagrafica);
    // }

    this._selectedCv.next(cv)
  }


  setAzioneActual(testo: string){
    this.sessionStorageService.setItem("azionecv", new String(testo));
  }

  getAzioneActual(): string{
    //console.log(this.sessionStorageService.getItem("azionecv"))
    return this.sessionStorageService.getItem("azionecv");
  }

  setIdAnagraficaBlp(id:number){
    this.sessionStorageService.setItem("idBlpAnagrafica", id);
  }

  getIdBlpAnagrafica():number{
    return this.sessionStorageService.getItem("idBlpAnagrafica");
  }
  set cvitaeActual(cv: Candidatura){
    this.sessionStorageService.setItem("cvitae",JSON.stringify(cv));
    //console.log((this.sessionStorageService.getItem("cvitae") as Candidatura).codStatoCv)
  }

  get cvitaeActual():Candidatura{

    return this.sessionStorageService.getItem("cvitae");
  }

  set isCvModificabile(isCvModificabile:boolean){
    this ._isCvModificabile=isCvModificabile
  }

  get isCvModificabile(){
    return this._isCvModificabile
  }
}
