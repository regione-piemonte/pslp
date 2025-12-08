/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PslpMessaggio, MessaggioService, Privacy } from 'src/app/modules/pslpapi';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'pslpwcl-privacy-template',
  templateUrl: './privacy-template.component.html',
  styleUrls: ['./privacy-template.component.scss']
})
export class PrivacyTemplateComponent implements OnInit {
  @Output() loaded = new EventEmitter();
  @Output() privacyDefinita = new EventEmitter<boolean>();
  @Input() isReady: boolean;


  @Input()privacy:Privacy;
  constructor(
    // private commonService:CommonService
    private messaggioService:MessaggioService,
    private logService: LogService
  ) { }

  messaggio: PslpMessaggio
  ngOnInit(): void {
    this.messaggioService.find(2).subscribe({
      next: (res:any) => {
        if(res.esitoPositivo){
          this.messaggio = res.msg;
        }
      },
      error: (err) =>{
       this.logService.error(this.constructor.name,`pingService: ${this.constructor.name}: ${JSON.stringify(err)}`)
      },
      complete: () =>{
      //  this.spinner.hide();
      }

    })
    // this.privacy = this.commonService.privacyActual;
    this.loaded.emit();
  }

  onCheckInformativaPrivacy() {
    this.isReady = !this.isReady;
    // this.appUserService.setPrivacy(this.commonPslpService.AMBITO, this.checkInformativaPrivacy);
    this.privacyDefinita.emit(this.isReady);
  }

}
