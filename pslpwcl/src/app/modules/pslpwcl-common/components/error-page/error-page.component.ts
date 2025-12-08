/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { PslpMessaggio } from 'src/app/modules/pslpapi';
import { MessaggioService } from 'src/app/modules/pslpapi';
import { DecodificaPublicPslpService } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  apiMessage: any;
  messaggio26: PslpMessaggio;
  constructor(
    private router: Router,
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    if(state)
      this.apiMessage = state['error'];
  }

  ngOnInit(): void {
   /* if(sessionStorage.getItem("utentelogato")){
      this.decodificaPublicService.findByCodPublic("E26").subscribe({
        next: (res:any) => {
          console.log(res);
          if(res.esitoPositivo){
            this.messaggio26 = res.msg;
          }
        }
      });
    }*/
    window.scrollTo({ top: 0, behavior: 'smooth' });

   // this.spinner.hide();
  }


}
