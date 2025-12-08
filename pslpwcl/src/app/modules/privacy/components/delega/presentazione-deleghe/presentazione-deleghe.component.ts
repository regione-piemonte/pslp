/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { CommonService } from 'src/app/services/common.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pslpwcl-presentazione-deleghe',
  templateUrl: './presentazione-deleghe.component.html',
  styleUrls: ['./presentazione-deleghe.component.scss']
})
export class PresentazioneDelegheComponent implements OnInit {

  constructor(
    private router:Router,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {
    if(!this.delega){
      this.indietro();
    }
  }

  indietro() {
    this.router.navigateByUrl('pslpfcweb/private/deleghe/riepilogo-deleghe');
  }


  get delega(){
    return this.commonService.delegaActual;
  }
  get delegato(){
    return this.delega.pslpTUtente1
  }
  get delegante(){
    return this.delega.pslpTUtente2
  }

}
