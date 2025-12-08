/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit } from '@angular/core';
import { DecodificaPublicPslpService, PslpMessaggio } from '../../pslpapi';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'pslpwcl-consulta-annunci',
  templateUrl: './consulta-annunci.component.html',
  styleUrls: ['./consulta-annunci.component.scss']
})
export class ConsultaAnnunciComponent implements OnInit {

  messaggioI7: PslpMessaggio;
  messaggioI8: PslpMessaggio;
  messaggioIntestazione: PslpMessaggio;

  sezione = "Candidature";

  constructor(
    private readonly router: Router,
    private appUserService: AppUserService,
    private decodificaPublicService: DecodificaPublicPslpService,
    private route: ActivatedRoute,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.decodificaPublicService.findByCodPublic("I7").subscribe(
      (r: any) => this.messaggioI7 = r.msg
    );
    this.decodificaPublicService.findByCodPublic("I8").subscribe(
      (r: any) => this.messaggioI8 = r.msg
    );
    this.decodificaPublicService.findByCodPublic("I55").subscribe(
      (r: any) => this.messaggioIntestazione = r.msg
    );
  }

  onGoToEURES() {
    this.router.navigate(['/pslpfcweb/consulta-annunci/EURES']);
  }

  onGoToProfili() {
    this.router.navigate(['/pslpfcweb/consulta-annunci/profili-ricercati']);
  }

  get isAutenticato(): boolean {
    return !!this.appUserService.getUtente()
  }

  onClickAnnulla() {
    this.router.navigateByUrl('pslpfcweb/cvitae/incontro-domanda-offerta');
  }

}
