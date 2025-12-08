/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TypeApplicationCard } from '../../models/type-application-card';
import { BaseCard } from '../../models/base-card';
import { SidebarModule } from '../../models/sidebar-module';
import { DialogModaleMessage } from '../../models/dialog-modale-message';
import { TypeDialogMessage } from '../../models/type-dialog-message';
import { PlspshareService } from '../../services/plspshare.service';
import { Router } from '@angular/router';
import { TypeLinkCard } from '../../models/type-link-card';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { SecurityPslpService } from 'src/app/services/security-pslp.service';
import { ENV_AMBIENTE } from 'src/app/services/lib/injection-token/env-ambiente.injection-token';
import { ENV_APPLICATION } from 'src/app/services/lib/injection-token/env-application.injection-token';
import { SpidUserService } from 'src/app/services/storage/spid-user.service';

@Component({
  selector: 'pslpwcl-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})
export class SidebarLeftComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {

  @Input() navburger: boolean;
  @Output() navburgerChange = new EventEmitter<boolean>();
  @Input() subheaderContent: string;
  @Input() typeApplication: TypeApplicationCard;
  @Input() elencoCard: BaseCard[];
  hasUtente: boolean;
  urlUscita: string;
  currentUrl: string;
  // possibleModules = POSSIBLE_SIDEBAR_MODULES.filter(m => !m.ignore);
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly changeDedectionRef: ChangeDetectorRef,
    private readonly pslpshareService: PlspshareService,
    private readonly utilities: UtilitiesService,
    private readonly securityService: SecurityPslpService,
    @Inject(ENV_APPLICATION) @Optional() private envApplication: string,
    @Inject(ENV_AMBIENTE) @Optional() private envAmbiente: string,
    private spidUserService: SpidUserService,

  ) { }

  ngOnInit(): void {
    this.spidUserService.userUpdate.subscribe(
      r => {
        if (r)
          this.hasUtente = true
        else
          this.hasUtente = false
      }
    )
    if (this.typeApplication = TypeApplicationCard.BackOffice)
      this.subheaderContent = "Piattaforma Servizi al Lavoro";
    else
      this.subheaderContent = "I servizi per il cittadino";
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  inSubpath(sm: SidebarModule): boolean {
    return this.currentUrl && (sm.urlSubpaths.some(url => this.currentUrl.indexOf(url) === 0) || (sm.isHome && this.currentUrl === '/'));
  }
  _toggleSidebar() {
    this.navburger = !this.navburger;
    this.navburgerChange.emit(this.navburger);
  }
  /**
   * after content checked
   */
  ngAfterContentChecked(): void {
    this.changeDedectionRef.detectChanges();
  }
  /**
   * after view init
   */
  ngAfterViewInit() {
    this.changeDedectionRef.detectChanges();
  }
  onVisibleChange(field: boolean) {
    if (field) {
      this.navburger = field;
    }
  }
  onHome() {
    const thisPath = window.location.href;
    this._toggleSidebar();
    this.urlUscita = '/pslpfcweb/private/home-page';
    if (this.utilities.isPathModifica(thisPath)) {
      this.openModalHome();
    } else {
      this.doUscita();
    }
  }
  async openModalHome() {
    const data: DialogModaleMessage = {
      titolo: 'Torna alla Home Page',
      messaggio: 'Sei sicuro di voler tornare alla home page?',
      tipo: TypeDialogMessage.YesOrNo,
      messaggioAggiuntivo: 'Eventuali dati non confermati e salvati saranno perduti.'
    };
    const result = await this.pslpshareService.openModal(data);
    if (result === 'SI') {
      this.doUscita();
    }
  }

  doUscita() {
    this.router.navigateByUrl(this.urlUscita);
  }

  onGotoLink(el: BaseCard) {
    // da gestire l'applicazione qui dentro.
    this._toggleSidebar();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';


    switch (el.id) {
      case 1 || "1":
        this.router.navigateByUrl("pslpfcweb/private/privacy/riepilogo-privacy");
        break;
      case 2 || "2":
        this.router.navigateByUrl("pslpfcweb/private/fascicolo/riepilogo-fascicolo");
        break;
      case 3 || "3":
        this.router.navigateByUrl("pslpfcweb/private/did/riepilogo-did");
        break;
      case 4 || "4":
        this.router.navigateByUrl("pslpfcweb/cvitae/riepilogo-cv");
        break;
      case 5 || "5":
        this.router.navigateByUrl("pslpfcweb/private/documenti/riepilogo-documenti");
        break;
      case 6 || "5":
        this.router.navigateByUrl("pslpfcweb/private/incontri/riepilogo-incontri");
        break;
    }
  }

  async openModalLink(el: BaseCard) {
    const data: DialogModaleMessage = {
      titolo: 'Vai a ' + el.titolo,
      tipo: TypeDialogMessage.YesOrNo,
      messaggioAggiuntivo: 'Eventuali dati non confermati e salvati saranno perduti.'
    };
    const result = await this.pslpshareService.openModal(data);
    if (result === 'SI') {
      this.doGoto(el);
    }
  }

  private doGoto(el: BaseCard) {
    if (el.tipoLink === TypeLinkCard.UrlInterno) {
      this.router.navigateByUrl(el.link);
    } else {
      if (el.applicazione === this.envApplication) {
        if (this.envAmbiente === 'dev') {
          //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          //  this.router.onSameUrlNavigation = 'reload';
          this.router.navigateByUrl(el.link);
        } else if (this.envAmbiente !== 'dev' &&
          el.tipoLink === 'E' &&
          el.applicazione === 'H') {

          this.securityService.jumpToURL(el.link, el.applicazione);
        } else {
          this.router.navigateByUrl(el.link);
        }
      } else {

        this.securityService.jumpToURL(el.link, el.applicazione);
      }
    }
  }


}
