/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { COD_TIPO_AGENDE, TYPE_ALERT } from 'src/app/constants';
import { AgendaService, AppuntamentiRidotta, Decodifica, DecodificaPslpService, DettaglioIncontro, IncontriAppuntamentiRequest, IncontriAppuntamentiResponse, LavoratorePslpService, PslpMessaggio, RicercaIncontriAppuntamentiRequest, RicercaIncontriAppuntamentiResponse, SuntoLavoratore, UtenteService } from 'src/app/modules/pslpapi';
import { DialogModaleMessage } from 'src/app/modules/pslpwcl-common/models/dialog-modale-message';
import { TypeDialogMessage } from 'src/app/modules/pslpwcl-common/models/type-dialog-message';
import { PromptModalService } from 'src/app/modules/pslpwcl-common/services/prompt-modal.service';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { CommonService } from 'src/app/services/common.service';
import { LogService } from 'src/app/services/log.service';
import { Utils } from 'src/app/utils';


@Component({
  selector: 'pslpwcl-riepilogo-incontri',
  templateUrl: './riepilogo-incontri.component.html',
  styleUrls: ['./riepilogo-incontri.component.scss']
})
export class RiepilogoIncontriComponent implements OnInit {

  @ViewChild('modalAnnulla') modalAnnulla: any;

  appuntamenti: AppuntamentiRidotta
  appuntamentiList: any;
  nessunRisultato: boolean = false;
  suntoLavoratore?: SuntoLavoratore;
  erroreE42: PslpMessaggio;
  erroreE43: PslpMessaggio;
  erroreE44: PslpMessaggio;
  motivazioneSelezionataId: string;
  msgI50: PslpMessaggio;
  msgC10: PslpMessaggio;
  listaMotivazioni: Decodifica[];
  noteInserite: string;
  idIncontroDaAnnullare: number;
  msagAnnulla: string;
  obbligoFormativoAssolto: boolean;


  constructor(
    private agendeService: AgendaService,
    // private customDocumentiService: CustomDocumentiService,
    private readonly appUserService: AppUserService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private lavoratorePslpService: LavoratorePslpService,
    private promptModalService: PromptModalService,
    private logService: LogService,
    private commonService: CommonService,
    private decodificaService: DecodificaPslpService,
    private alertMessageService: AlertMessageService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private utenteService: UtenteService,

  ) { }

  ngOnInit(): void {
    this.loadDecodifiche();
    this.commonService.getMessaggioByCode("E42").then(messaggio => {
      this.erroreE42 = messaggio;
    });
    this.commonService.getMessaggioByCode("E43").then(messaggio => {
      this.erroreE43 = messaggio;
    });
    this.commonService.getMessaggioByCode("I50").then(messaggio => {
      this.msgI50 = messaggio;
    });
    this.commonService.getMessaggioByCode("C10").then(messaggio => {
      this.msgC10 = messaggio;
    });
    this.commonService.getMessaggioByCode("E44").then(messaggio => {
      this.erroreE44 = messaggio;
    });
    this.elencoRichiesteIncontri();
    this.caricaDati();
    this.obbligoFormativo();
  }

  private loadDecodifiche() {
    this.decodificaService.findDecodificaByTipo('IN-MOTIVAZIONE-AGENDE', '3').subscribe({
      next: (res) => {
        if (res.esitoPositivo) this.listaMotivazioni = res.list;
      },
      error: (err: any) => { this.logService.error(this.constructor.name, `${JSON.stringify(err)}`) }
    });
  }

  private caricaDati() {
    this.lavoratorePslpService.findSuntoLavoratore(this.utente.idSilLavAnagrafica).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          this.suntoLavoratore = res.suntoEsteso.sunto;
          this.spinner.hide();
        }
      },
      error: (err) => {
        this.logService.error(JSON.stringify(err), `${this.constructor.name}, caricaDati`);
        this.spinner.hide();
      },
    });
  }

  private obbligoFormativo() {
    const isMinorenne = this.suntoLavoratore?.eta < 18
    this.utenteService.cercaCFSilp(this.utente.cfUtente, isMinorenne, false).subscribe(
      {
        next: async ris => {
          if (ris.esitoPositivo) {
            // console.log(ris.anagraficaLav?.silTStatoObblForm)
            this.obbligoFormativoAssolto = ris.anagraficaLav?.silTStatoObblForm?.idSilTStatoObblForm === 2 || ris.anagraficaLav?.silTStatoObblForm?.idSilTStatoObblForm === 3;
          }
        }
      }
    );
  }

  elencoRichiesteIncontri() {
    if (this.utente.idSilLavAnagrafica) {
      let elencoRichiesteRequest: RicercaIncontriAppuntamentiRequest = {
        idSilLavAnagrafica: String(this.utente?.idSilLavAnagrafica)
      };

      this.agendeService.ricercaIncontri(0, elencoRichiesteRequest).subscribe({
        next: res => {
          if (res.esitoPositivo && res.list) {
            this.appuntamentiList = res.list;
            if (res.list.length === 0) {
              this.nessunRisultato = true;
            }
          }
        },
        error: err => {
          console.error("Errore nel caricamento delle richieste documenti:", err);
        }
      });
    }
  }

  gotoVisualizza(idIncontro: number) {
    this.router.navigate(
      ["visualizza-incontri"],
      {
        relativeTo: this.route.parent,
        state: {
          idIncontro: idIncontro
        }
      }
    );
  }

  showAnnulla(el: AppuntamentiRidotta): boolean {
    if (el?.codTipoAgendaIncServizi === COD_TIPO_AGENDE.LABORATORI || !el.dataIncontro || !el.oraIncontro || el.idSilTStatoIncontro !== '1') {
      return false;
    }

    const today = new Date();

    today.setHours(0,0,0,0);

    const [hours, minutes] = el.oraIncontro.split(':').map(Number);
    const dataIncontroCompleta = new Date(el.dataIncontro);
    dataIncontroCompleta.setHours(hours, minutes, 0, 0);



    return today.getTime() <= dataIncontroCompleta.getTime();
  }

  showSposta(el: AppuntamentiRidotta): boolean {
    if (el?.codTipoAgendaIncServizi === COD_TIPO_AGENDE.LABORATORI || el.idSilTStatoIncontro !== '1' || !el.dataLimiteSpostamento) {
      return false;
    }

    const today = new Date();

    const dataLimiteSpostamento: Date = new Date(el.dataLimiteSpostamento);
    dataLimiteSpostamento.setHours(0, 0, 0, 0);



    return today.getTime() <= dataLimiteSpostamento.getTime() && el.flgSpostaServ === 'S' && el.flgPrenotaCittadinoServ === 'S';
   
  }


  async onClickSposta(el: AppuntamentiRidotta) {
    const descrTestoSposta: string = el.desTestoSposta ? `${el.desTestoSposta}<br>` : ''
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
    this.goToNavMain(el.idIncontro);
  }

  private goToNavMain(idIncontro: number) {
    this.spinner.show();
    const queryParams: any = {
      idPrenotazione: idIncontro
    };
    this.router.navigate(
      ['pslpfcweb', 'private', 'incontri', 'inserire-incontri'],
      { queryParams: { idPrenotazione: idIncontro } }
    );
  }

  async gotoInserisci() {
    if (this.suntoLavoratore?.eta < 15) {
      const data: DialogModaleMessage = {
        titolo: this.erroreE43.intestazione,
        tipo: TypeDialogMessage.Confirm,
        messaggio: this.erroreE43.testo,
        size: "lg",
        tipoTesto: TYPE_ALERT.ERROR
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result) {
        return;
      }
    } else if (this.suntoLavoratore?.eta >= 15 && this.suntoLavoratore?.eta < 18) {
      this.obbligoFormativo();
      if (!this.obbligoFormativoAssolto) {
        const data: DialogModaleMessage = {
          titolo: this.erroreE44.intestazione,
          tipo: TypeDialogMessage.Confirm,
          messaggio: this.erroreE44.testo,
          size: "lg",
          tipoTesto: TYPE_ALERT.ERROR
        };
        const result = await this.promptModalService.openModaleConfirm(data);
        if (result) {
          return;
        }
      } else {
        this.router.navigate(
          ["inserire-incontri"],
          {
            relativeTo: this.route.parent,
          });
      }
    }
    else if (this.suntoLavoratore?.idRegioneDomic != "01") {
      const data: DialogModaleMessage = {
        titolo: this.erroreE42.intestazione,
        tipo: TypeDialogMessage.Confirm,
        messaggio: this.erroreE42.testo,
        size: "lg",
        tipoTesto: TYPE_ALERT.ERROR
      };
      const result = await this.promptModalService.openModaleConfirm(data);
      if (result) {
        return;
      }
    } else {
      this.router.navigate(
        ["inserire-incontri"],
        {
          relativeTo: this.route.parent,
        });
    }

  }

  onClickAnnulla(el: AppuntamentiRidotta) {
    this.idIncontroDaAnnullare = el.idIncontro;
    const mapParams = {
      0: el.desSilwebTIncServizi,
      1: this.datePipe.transform(el.dataIncontro, 'dd/MM/yyyy'),
      2: el.oraIncontro,
      3: el.desSilTInContattoErogaz,
      4: this.getIndirizzoCompleto(el)
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

  private getIndirizzoCompleto(el: AppuntamentiRidotta): string {
    const parts = [
      el.desToponimoSedeIncontro,
      el.indirizzoSedeIncontro,
      el.numCivicoSedeIncontro
    ];

    // Filtra null, undefined e stringhe vuote, poi unisce con spazio
    return parts.filter(part => !!part?.trim()).join(' ');
  }

  confermaAnnulla(modal: NgbModalRef): void {
    modal.close();

    this.spinner.show();
    const ruolo = this.appUserService.getRuoloSelezionato();
    this.agendeService.getDettaglioIncontro(this.idIncontroDaAnnullare).subscribe({
      next: (res) => {
        if (res?.esitoPositivo) {
          const dettaglioIncontro: DettaglioIncontro = res.dettaglio;
          const request: IncontriAppuntamentiRequest = {
            dataIncontro: new Date(dettaglioIncontro.incontro.dataIncontro),
            // idOperatore: this.ruolo.operatore.id,
            durataEffettiva: dettaglioIncontro.incontro.durataEffettivaIncontroMinuti,
            idModalitaErogazione: dettaglioIncontro.incontro.idSilTInContattoErogaz,
            idSilLavAnagrafica: dettaglioIncontro.incontro.idSilLavAnagrafica,
            idSilwebTIncServizi: dettaglioIncontro.incontro.idSilwebTIncServizi,
            idSilTCpi: dettaglioIncontro.incontro.idCpiOperatore,
            idSilwebTSedeEnte: dettaglioIncontro.incontro.idSedeCpiIncontro,
            oraIncontro: dettaglioIncontro.incontro.oraIncontro,
            operazione: 'annullamento',
            note: this.noteInserite,
            idMotivazione: Number(this.motivazioneSelezionataId),
            dettaglioIncontroPrecedente: dettaglioIncontro,
            flgOperatore: ruolo.idRuolo !== 0 ? 'S' : null
          }
          this.sendRequest(request);
        }
      },
      error: (err) => {
        this.logService.log(this.constructor.name, "Errore caricaAppuntamento");
      }
    });


  }

  private sendRequest(request: IncontriAppuntamentiRequest) {
    this.agendeService.salvaIncontro(request).subscribe({
      next: (res: IncontriAppuntamentiResponse) => {
        if (res.esitoPositivo) {
          this.motivazioneSelezionataId = null;
          this.noteInserite = null;
          this.idIncontroDaAnnullare = null;
          this.msagAnnulla = null;

          this.elencoRichiesteIncontri();
        }
        this.alertMessageService.setApiMessages(res.apiMessages);
        if (res.apiMessages && res.apiMessages.length > 0){
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err: any) => { },
    });
  }

  get utente() {
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }
  get ruoloUtente() {
    return this.appUserService.getRuoloSelezionato()
      ? this.appUserService.getRuoloSelezionato()
      : null;
  }

}
