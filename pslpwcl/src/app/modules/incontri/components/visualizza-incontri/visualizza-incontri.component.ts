/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { COD_TIPO_AGENDE, TYPE_ALERT } from 'src/app/constants';
import { AgendaService, AppuntamentiRidotta, Decodifica, DecodificaPslpService, DettaglioIncontro, IncontriAppuntamentiRequest, IncontriAppuntamentiResponse, Msg, PslpMessaggio, Ruolo, Utente } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { LogService } from 'src/app/services/log.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { DatePipe, Location } from '@angular/common';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { CommonService } from 'src/app/services/common.service';
import { Utils } from 'src/app/utils';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'pslpwcl-visualizza-incontri',
  templateUrl: './visualizza-incontri.component.html',
  styleUrls: ['./visualizza-incontri.component.scss']
})
export class VisualizzaIncontriComponent implements OnInit {

  @ViewChild('modalAnnulla') modalAnnulla: any;
  pannelliAttivi: string[] = ['panelPrenotazione', 'panelStoricoSpostamenti'];
  modalRef?: NgbModalRef;

  msgI50: PslpMessaggio;
  msgC10: PslpMessaggio;
  msg102094: Msg;
  msg102096: Msg;
  msgC12: PslpMessaggio;
  idIncontro: number;
  sysDate: Date;
  ruolo: Ruolo;
  utente: Utente;
  listaMotivazioni: Decodifica[];
  motivazioneSelezionataId: string;
  noteInserite: string;
  dettaglioIncontro: DettaglioIncontro;
  msagAnnulla: string;

  get ENABLE_MODIFICA(): boolean {
    return this.dettaglioIncontro?.incontro?.idSilTStatoIncontro === '1';
  }

  get STATO_DA_EROGARE(): boolean {
    return this.dettaglioIncontro?.incontro?.idSilTStatoIncontro === '1';
  }

  get DISABILITA_SPOSTA(): boolean {

    if (this.dettaglioIncontro?.incontro?.idSilTStatoIncontro !== '1') {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.dettaglioIncontro?.incontro?.dataIncontro) {
      return true;
    }

    const dataIncontro = new Date(this.dettaglioIncontro.incontro.dataIncontro);
    dataIncontro.setHours(0, 0, 0, 0);

    const incontroIsPassato = dataIncontro.getTime() < today.getTime();
    if (incontroIsPassato) {
      return true;
    }

    const dataLimiteSpostamento = new Date(this.dettaglioIncontro.incontro.dataLimiteSpostamento);
    dataLimiteSpostamento.setHours(0, 0, 0, 0);

    const superataDataLimite = today.getTime() > dataLimiteSpostamento.getTime();
    const flagNonSpostabile = this.dettaglioIncontro.incontro.flgSpostaServ !== 'S';
    const flgCittadinoNonPrenotabile = this.dettaglioIncontro.incontro.flgPrenotaCittadinoServ !== 'S'
    if (superataDataLimite && flagNonSpostabile && flgCittadinoNonPrenotabile) {
      return true;
    }
    return false;
  }

  get DISABILITA_ANNULLA(): boolean {
    if (this.dettaglioIncontro?.incontro?.idSilTStatoIncontro !== '1') return true;
    else {
      const today = new Date();

      const dataIncontro: Date = new Date(this.dettaglioIncontro?.incontro?.dataIncontro);
      dataIncontro.setHours(0, 0, 0, 0);


      return today.getTime() > dataIncontro.getTime();
    }
  }

  COD_TIPO_AGENDE = COD_TIPO_AGENDE;

  constructor(
    private router: Router,
    private agendeService: AgendaService,
    private promptModalService: PromptModalService,
    private location: Location,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private utilitiesService: UtilitiesService,
    private modalService: NgbModal,
    private decodificaService: DecodificaPslpService,
    private alertMessageService: AlertMessageService,
    private commonService: CommonService,
    private readonly route: ActivatedRoute,
    private datePipe: DatePipe,
    private readonly appUserService: AppUserService,
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      this.idIncontro = state['idIncontro']
    }
  }

  ngOnInit(): void {
    this.commonService.getMessaggioByCode("I50").then(messaggio => {
      this.msgI50 = messaggio;
    });
    this.commonService.getMessaggioByCode("C10").then(messaggio => {
      this.msgC10 = messaggio;
    });
    this.commonService.getMessaggioByCode("C12").then(messaggio => {
      this.msgC12 = messaggio;
    });
    this.caricAppuntamento();
    this.loadDecodifiche();
  }

  private loadDecodifiche() {
    this.decodificaService.findDecodificaByTipo('IN-MOTIVAZIONE-AGENDE', '3').subscribe({
      next: (res) => {
        if (res.esitoPositivo) this.listaMotivazioni = res.list;
      },
      error: (err: any) => { this.logService.error(this.constructor.name, `${JSON.stringify(err)}`) }
    });
  }

  private caricAppuntamento() {
    this.agendeService.getDettaglioIncontro(this.idIncontro).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          this.dettaglioIncontro = res.dettaglio;

        }
      },
      error: (err) => {
        this.logService.log(this.constructor.name, "Errore caricaAppuntamento");
      }
    });
  }

  private getIndirizzoCompleto(el: AppuntamentiRidotta): string {
    const parts = [
      el.desToponimoSedeIncontro,
      el.indirizzoSedeIncontro,
      el.numCivicoSedeIncontro
    ];

    return parts.filter(part => !!part?.trim()).join(' ');
  }


  onClickTornaElenco() {
    this.location.back();
  }

  async onClickSposta() {
    const descrTestoSposta: string = this.dettaglioIncontro.servizio.descrTestoSposta ? `${this.dettaglioIncontro.servizio.descrTestoSposta}<br>` : ''
    const data: DialogModaleMessage = {
      titolo: this.msgC10.intestazione,
      tipo: TypeDialogMessage.YesOrNo,
      messaggio: `${descrTestoSposta} ${this.msgC10.testo}`,
      messaggioAggiuntivo: '',
      size: 'lg',
      tipoTesto: TYPE_ALERT.WARNING,
    };
    const result = await this.promptModalService.openModaleConfirm(data);
    if (result === 'NO') return;
    this.goToNavMain();
  }


  private goToNavMain() {
    this.spinner.show();
    const queryParams: any = {
      idPrenotazione: this.idIncontro
    };
    this.router.navigate(
      ['pslpfcweb', 'private', 'incontri', 'inserire-incontri'],
      { queryParams: { idPrenotazione: this.idIncontro } }
    );
  }

  async onClickAnnulla() {
    const mapParams = {
      0: this.dettaglioIncontro.incontro.desSilwebTIncServizi,
      1: this.datePipe.transform(this.dettaglioIncontro.incontro.dataIncontro, 'dd/MM/yyyy'),
      2: this.dettaglioIncontro.incontro.oraIncontro,
      3: this.dettaglioIncontro.incontro.desSilTInContattoErogaz,
      4: this.getIndirizzoCompleto(this.dettaglioIncontro.incontro)
    }
    const testoTmp: string = Utils.clone(this.msgI50.testo);
    this.msagAnnulla = Utils.replacePlaceHolder(testoTmp, mapParams);
    const modalRef: NgbModalRef = this.modalService.open(this.modalAnnulla, {
      size: 'xl',
      backdrop: 'static',
      centered: true
    });


    modalRef.result.then(
      result => {
        console.log('Modale chiusa con:', result);
      },
      reason => {
        console.log('Modale dismessa:', reason);
      }
    );
  }

  confermaSelezione(modal: NgbModalRef): void {
    modal.close();

    this.spinner.show();
    const ruolo = this.appUserService.getRuoloSelezionato();
    const request: IncontriAppuntamentiRequest = {
      dataIncontro: new Date(this.dettaglioIncontro.incontro.dataIncontro),
      // idOperatore: this.ruolo.operatore.id,
      durataEffettiva: this.dettaglioIncontro.incontro.durataEffettivaIncontroMinuti,
      idModalitaErogazione: this.dettaglioIncontro.incontro.idSilTInContattoErogaz,
      idSilLavAnagrafica: this.dettaglioIncontro.incontro.idSilLavAnagrafica,
      idSilwebTIncServizi: this.dettaglioIncontro.incontro.idSilwebTIncServizi,
      idSilTCpi: this.dettaglioIncontro.incontro.idCpiOperatore,
      idSilwebTSedeEnte: this.dettaglioIncontro.incontro.idSedeCpiIncontro,
      oraIncontro: this.dettaglioIncontro.incontro.oraIncontro,
      operazione: 'annullamento',
      note: this.noteInserite,
      idMotivazione: Number(this.motivazioneSelezionataId),
      dettaglioIncontroPrecedente: this.dettaglioIncontro,
      flgOperatore: ruolo.idRuolo !== 0 ? 'S' : null
    }
    this.sendRequest(request);
    this.motivazioneSelezionataId = null;
    this.noteInserite = null;
  }

  sendRequest(request: IncontriAppuntamentiRequest) {
    request.dettaglioIncontroPrecedente = this.dettaglioIncontro;
    this.agendeService.salvaIncontro(request).subscribe({
      next: (res: IncontriAppuntamentiResponse) => {
        if (res.esitoPositivo) {
          this.dettaglioIncontro = res.dettaglio;
        }
        this.alertMessageService.setApiMessages(res.apiMessages);
        if (res.apiMessages && res.apiMessages.length > 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

      },
      error: (err: any) => { },
      //complete: ()=> {this.spinner.hide();}
    });
  }

}
