/*
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
import { Component, OnInit, Input, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DelegaService } from 'src/app/modules/pslpapi';
import { AppUserService } from 'src/app/services/app-user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'pslpwcl-modal-codice-otp',
  templateUrl: './modal-codice-otp.component.html',
  styleUrls: ['./modal-codice-otp.component.scss']
})
export class ModalCodiceOtpComponent implements OnInit {
  @Input() title: string;
  @Input() callback: any;
  @Input() modal: any;
  @Input() cf: string;

  formOtp: FormGroup;

  constructor(
    private delegaService: DelegaService,
    private fb: FormBuilder,
    private readonly appUserService:AppUserService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formOtp = this.fb.group({
      n1: [null,Validators.required],
      n2: [null,Validators.required],
      n3: [null,Validators.required],
      n4: [null,Validators.required],
      n5: [null,Validators.required],
      n6: [null,Validators.required],
    });
  }


  onClickVerificaOtp(){
    this.spinner.show();
    let codiceOtp = this.formOtp.controls['n1'].value + this.formOtp.controls['n2'].value + this.formOtp.controls['n3'].value + this.formOtp.controls['n4'].value + this.formOtp.controls['n5'].value + this.formOtp.controls['n6'].value;

    this.delegaService.verificaCodiceOtp(this.cf,codiceOtp).subscribe({
      next: (res: any) => {
        if(res.esitoPositivo){
          this.spinner.hide();
          this.callback(this.modal, res);
        }else{
          this.spinner.hide();
          //mostrare messagio d'errore
        }
      },
      error: (error:any) => {
        this.spinner.hide();
      }
    });
  }

  onKeyUp(index: number) {
    if (this.formOtp.get(`n${index}`).value.length === 1){
      const nextInput: HTMLElement = document.querySelector(`input[formControlName="n${index + 1}"]`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onClickRinviaOtp(){
    this.delegaService.invioCodiceOtp(this.cf).subscribe({
      next: (res: any) => {
        if(res.esitoPositivo){
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      },
      error: (error:any) => {
        this.spinner.hide();
      }
    });
  }

}
