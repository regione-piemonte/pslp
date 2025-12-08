/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LavAnagrafica, TipoPatente, DidPslpService, DecodificaPslpService, FascicoloPslpService, SchedaAnagraficaProfessionale } from 'src/app/modules/pslpapi';
import { LocalStorageService } from 'src/app/services/storage/local-storage.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-modal-patente',
  templateUrl: './modal-patente.component.html',
  styleUrls: ['./modal-patente.component.scss']
})
export class ModalPatenteComponent implements OnInit {

  @Input() title: string;
  @Input() callback: any;
  @Input() modal: any;
  @Input() flgPatente: string;
  @Input() flgDid: boolean;
  fascicolo:SchedaAnagraficaProfessionale
  form: FormGroup;
  patenti: TipoPatente[] = [];
  showAlertMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private didService: DidPslpService,
    private decodificaService: DecodificaPslpService,
    private readonly appUserService:AppUserService,
    private commonService:CommonService,
    // private alertMessageService: AlertMessageService,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    // const suntoLavAnagrafica: SuntoLavAnag = this.localeStorageService.getItem(STORAGE_KEY.SUNTO_LAV_ANAG);
    // this.lavAnagrafica = suntoLavAnagrafica.lavAnagrafica;
    this.fascicolo=this.commonService.fascicoloActual
    this.initForm();
    this.loadPatenti()
  }

  private loadPatenti() {
    if(this.flgDid){
      this.didService.findTipoPatenteByFlgPossesso("S").subscribe({
        next: (res) => {
          if(res?.esitoPositivo){
            this.patenti = res.list;
          }
        }
      });
    }else{
    let tipoPatente = this.flgPatente == "Patente" ? "TIPO-PATENTE-P" : "TIPO-PATENTE-A";
    this.decodificaService.findDecodificaByTipo(tipoPatente).subscribe({
      next: (res) => {
        if(res?.esitoPositivo){
          let list=res.list.filter((p)=> !this.fascicolo?.informazioniCurriculari?.patenti?.find(p1=>p1.codice==p.codice)).sort()
          this.patenti = list?.map((dato: any) => {
            dato.descr = dato.descr.toUpperCase();
            return dato;
          });
        }else{
          this.spinner.hide();
        }
      },
      error: (error:any) => {
        this.spinner.hide();
      }
    });
    }
  }


  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }


  private initForm() {
    this.form = this.fb.group({
      patente: [null,Validators.required]
    });
  }




  onClickInserisciPatente() {
    this.showAlertMessage = true;
    this.spinner.show();
    const datiPatenteLavoratore: any = {
      idTipoPatente: this.form.controls['patente'].value,
      codFiscaleLav: this.utente.cfUtente,
      dsNomeLav: this.utente.nome,
      dsCognomeLav: this.utente.cognome,
      idSilLav: this.utente.idSilLavAnagrafica
    };
    this.didService.inserisciPatenteLavoratore(datiPatenteLavoratore).subscribe({
      next: (res: any) => {
        if(res?.esitoPositivo){
          this.spinner.hide();

          this.callback(this.modal, this.patenti.find(p=>p.id==this.form.controls['patente'].value));
        }else{
          this.spinner.hide();
        }
      },
      error: (error:any) => {
        this.spinner.hide();
      }
    });
  }

}
