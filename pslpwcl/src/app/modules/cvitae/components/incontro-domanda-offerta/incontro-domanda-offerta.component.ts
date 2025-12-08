/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { PslpMessaggio } from 'src/app/modules/pslpapi';
import { DecodificaPublicPslpService } from 'src/app/modules/pslpapi';

@Component({
  selector: 'pslpwcl-incontro-domanda-offerta',
  templateUrl: './incontro-domanda-offerta.component.html',
  styleUrls: ['./incontro-domanda-offerta.component.scss']
})
export class IncontroDomandaOffertaComponent implements OnInit {

  messaggioI7: PslpMessaggio;
  messaggioI8: PslpMessaggio;

  constructor(
    private readonly router: Router,
    private appUserService: AppUserService,
    private decodificaPublicService: DecodificaPublicPslpService,
  ) { }

  ngOnInit(): void {
    this.decodificaPublicService.findByCodPublic("I7").subscribe(
      (r: any) => this.messaggioI7 = r.msg
    );
    this.decodificaPublicService.findByCodPublic("I8").subscribe(
      (r: any) => this.messaggioI8 = r.msg
    );
    console.log(this.ruoloUtente);
    
  }

  onGotoLink(el: string) {
    if (this.isAutenticato) {
      this.router.navigateByUrl("pslpfcweb/cvitae/" + el);
    } else {
      this.router.navigateByUrl("pslpfcweb/private/home-page");
    }
  }

  onClickAnnulla() {
    this.router.navigateByUrl('');
  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }

  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

  onGoToAnnunci() {
    this.router.navigateByUrl("pslpfcweb/consulta-annunci");
  }

  onGoToCandidature(el: string) {
    if (this.isAutenticato) {
      this.router.navigateByUrl('/pslpfcweb/private/candidature/' + el);
    } else {
      this.router.navigateByUrl('/pslpfcweb/private/home-page');
    }
  }

  onGoToAssistenza(el: string) {
    if (this.isAutenticato) {
      this.router.navigateByUrl('/pslpfcweb/private/assistenza-familiare/' + el);
    } else {
      this.router.navigateByUrl('/pslpfcweb/private/home-page');
    }
  }
}
