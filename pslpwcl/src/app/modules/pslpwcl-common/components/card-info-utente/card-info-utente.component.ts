/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppUserService } from 'src/app/services/app-user.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'pslpwcl-card-info-utente',
  templateUrl: './card-info-utente.component.html',
  styleUrls: ['./card-info-utente.component.scss']
})
export class CardInfoUtenteComponent implements OnInit {
  @Input() sezione: string;


  items: MenuItem[] = [{label: 'Privacy', url:'privacy', visible:true},
    {label: 'Deleghe', url:'deleghe', visible:true},
    {label: 'Fascicolo', url:'fascicolo', visible:true},
    {label: 'DID', url:'did', visible:true},
    {label: 'Incontro Domanda Offerta', url:'cvitae', visible:true},
    {label: 'Documenti', url:'documenti', visible:true},
    {label: 'Appuntamenti', url:'incontri', visible:true},
    {label: 'Elenco CV', url:'riepilogo-cv', visible:false}
  ];

  constructor(
    private readonly appUserService:AppUserService,
    private router: Router,
  ) { }

ngOnInit(): void {
    const ruolo = this.appUserService.getRuoloSelezionato();
    console.log("card-info-utente", ruolo);
    console.log("card-info-utente prima", this.items);

    this.items.map((item: MenuItem) => {
      if (ruolo.idRuolo == 7) {
        if (item.label === 'Appuntamenti' || item.label === 'Incontro Domanda Offerta') {
          item.visible = true;
        } else {
          item.visible = false;
        }
      }
      if (item.label == "Deleghe" && ruolo.idRuolo != 0) {
        item.visible = false;
      }

      if (item.label == this.sezione) {
        item.visible = false;
      }
      
      if (item.label == "Elenco CV" && this.router.url.includes('private/gestione-cv')) {
        item.visible = true;
      }

      if(item.label == "Incontro Domanda Offerta"&& this.router.url.includes('cvitae/incontro-domanda-offerta')){
        item.visible = false;
      }

      return item;
    });

    console.log("card-info-utente dopo", this.items);
  }

  get utente(){
    return this.appUserService.getUtenteOperateFor() || this.appUserService.getUtente();
  }

  navigateTo(url:string){
    if(url=="riepilogo-cv"){
      this.router.navigateByUrl("/pslpfcweb/cvitae/private/riepilogo-cv");
      return
    }
    if(url=="cvitae"){
      this.router.navigateByUrl("/pslpfcweb/cvitae/incontro-domanda-oferta");
    }else{
       this.router.navigateByUrl("/pslpfcweb/private/"+url);
    }
   
  }

}
