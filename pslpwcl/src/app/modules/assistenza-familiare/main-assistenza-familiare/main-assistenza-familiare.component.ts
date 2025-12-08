/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { MessaggioService, PslpMessaggio } from '../../pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'pslpwcl-main-assistenza-familiare',
  templateUrl: './main-assistenza-familiare.component.html',
  styleUrls: ['./main-assistenza-familiare.component.scss']
})
export class MainAssistenzaFamiliareComponent implements OnInit {

  sezione = "Ricerca personale per assistenza familiare";
  loaded = false;
  messaggioIntestazione: PslpMessaggio;
  messaggio: PslpMessaggio;
  erroreE37: PslpMessaggio;

  constructor(
    private readonly appUserService: AppUserService,
    private messagioService: MessaggioService,
  ) { }

  ngOnInit(): void {
    this.messagioService.findByCod("I59").subscribe({
      next: (res: any) => {
        this.messaggioIntestazione = res.msg;
      }
    });
  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  // navigateTo(url: string) {
  //   this.router.navigateByUrl("/pslpfcweb/private/" + url);
  // }

  get miniTitolo() {
    return "Ricerca personale per assistenza familiare";
  }

}
