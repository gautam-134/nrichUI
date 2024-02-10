import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BillingAddressVO } from '../../../../model/BillingAddressVO';
import { CheckoutService } from '../../../../services/checkout.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contact-information',
   
  templateUrl: './contact-information.component.html',
  styleUrl: './contact-information.component.scss'
})
export class ContactInformationComponent implements OnInit, OnDestroy {
  billingAddressForm!: FormGroup;
  billingAddressVO: BillingAddressVO | undefined;
  states: { id: number; stateName: string }[] = [];
  submitted: boolean = false;
  stateSubscription!: Subscription;
  billingAddressSubscription!: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private location: Location
  ) {}
  ngOnDestroy(): void {
    if (this.stateSubscription) this.stateSubscription.unsubscribe();
    if (this.billingAddressSubscription)
      this.billingAddressSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();
    this.checkoutService.statesSubject$.subscribe(
      (data: { id: number; stateName: string }[]) => {
        this.states = data;
      }
    );
    this.checkoutService.billingAddressSubject$.subscribe(
      (data: BillingAddressVO | undefined) => {
        this.billingAddressVO = data;
        this.createForm();
      }
    );
  }

  createForm() {
    this.billingAddressForm = this.formBuilder.group({
      id: [this.billingAddressVO?.id],
      name: [this.billingAddressVO?.name, [Validators.required]],
      email: [
        this.billingAddressVO?.email,
        [Validators.required, Validators.email, this.emailvalidate],
      ],
      phoneNumber: [
        this.billingAddressVO?.phoneNumber,
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      country: [this.billingAddressVO?.country, [Validators.required]],
      state: [this.billingAddressVO?.state, [Validators.required]],
      pinCode: [
        this.billingAddressVO?.pinCode,
        [Validators.required, this.validateDigitInput],
      ],
      gstNumber: [this.billingAddressVO?.gstNumber],
      isGST: [false],
      companyName:[this.billingAddressVO?.companyName,[Validators.required]],
      companyAddress:[this.billingAddressVO?.companyAddress,[Validators.required]],
    });
  }

  get controls() {
    return this.billingAddressForm.controls;
  }

  emailvalidate(control: AbstractControl): { [key: string]: any } | null {
    const regexp = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
    );
    if (!regexp.test(control.value)) {
      return { emailvalidate: true };
    } else {
      return null;
    }
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validateDigitInput(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.length != 6) {
      return { validateDigitInput: true };
    }
    return null;
  }
  payment() {
    this.submitted = true;
    if (this.controls['isGST'].value === true) {
      this.controls['gstNumber'].addValidators([
        Validators.required,
        Validators.pattern(
          '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
        ),
      ]);
      this.controls['gstNumber'].updateValueAndValidity();
    } else {
      this.controls['gstNumber'].clearValidators();
      this.controls['gstNumber'].updateValueAndValidity();
    }
    if (this.billingAddressForm.invalid) {
      return;
    }
    this.billingAddressVO = this.billingAddressForm.value as BillingAddressVO;
    this.checkoutService.saveAddressSubject$.next(this.billingAddressVO);
  }

  goBack() {
    this.location.back();
  }
}

