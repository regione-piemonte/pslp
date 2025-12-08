/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDidComponent } from './components/main-did/main-did.component';
import { InserireDidComponent } from './components/inserire-did/inserire-did.component';

const routes: Routes = [
  {
    path:'did',
    //component: MainDidComponent,
    children:[
      {path:'riepilogo-did', component: MainDidComponent},
      {path:'inserire-did', component: InserireDidComponent},
      { path: '**', redirectTo:'riepilogo-did'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DidRoutingModule { }
