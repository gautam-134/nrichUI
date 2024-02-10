import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { BillingAddressVO } from '../../../model/BillingAddressVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { CheckoutService } from '../../../services/checkout.service';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionPlanTransactionVO } from '../../../model/subscription-PaymentVOs';


@Component({
  selector: 'app-submit-offline-payment-transaction',
   
  templateUrl: './submit-offline-payment-transaction.component.html',
  styleUrl: './submit-offline-payment-transaction.component.scss'
})
export class SubmitOfflinePaymentTransactionComponent implements OnInit {
  offlineTransactionForm!: FormGroup;
  annualPlans: any[] = [];
  selectedPlanId: number | null = null;
  billingAddressForm!: FormGroup;
  billingAddressVO: BillingAddressVO | undefined;
  states: { id: number; stateName: string }[] = [];
  submitted: boolean = false;
  stateSubscription!: Subscription;
  billingAddressSubscription!: Subscription;
  instituteId!: number;
  instituteName!: string;
  subscriptionPlanTransaction: SubscriptionPlanTransactionVO | undefined;
  showPrices: boolean = false;
  amountReceived: boolean = false;
  isPlanSelectionEnabled: boolean = true;
  @ViewChild('billingAddressFormElement') billingAddressFormElement!: ElementRef;
  getMaxDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return currentDate;
  }

  // @ViewChild('scrollTarget') scrollTarget!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,

    private alertService: SwalAlertService,
    private loader: LoaderService,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.instituteId = params['id'];
      this.instituteName = params['instituteName'];
    });

    
    this.getStates();
    this.getBillingAddress();

    this.offlineTransactionForm = this.fb.group({
      id: [''],
      amount: ['', Validators.required],
      paymentCreatedAt: ['', Validators.required],
      planId: ['', Validators.required],
      instituteId: [this.instituteId],
      userId: [],
      transactionId: [],
    });
    
    this.loader
      .showLoader(this.subscriptionService.getSubscriptionplan())
      .subscribe({
        next: (data: any) => {
          this.annualPlans = data.teacherPricingPlans;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Fetching Active Plans');
        },
      });

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

  handleAmountReceivedChange() {
    this.amountReceived = !this.amountReceived;
  }

  selectPlan(planId: number) {
    this.offlineTransactionForm.get('planId')?.setValue(planId);
    this.selectedPlanId = planId;
  }

  createForm() {
    this.billingAddressForm = this.fb.group({
      id: [this.billingAddressVO?.id],
      name: [this.billingAddressVO?.name, [Validators.required]],
      email: [
        this.billingAddressVO?.email,
        [Validators.required, Validators.email],
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
      companyName: [this.billingAddressVO?.companyName, [Validators.required]],
      companyAddress: [
        this.billingAddressVO?.companyAddress,
        [Validators.required],
      ],
      userId: [this.billingAddressVO?.userId],
    });
  }

  get controls() {
    return this.billingAddressForm.controls;
  }

  get transactionControls() {
    return this.offlineTransactionForm.controls;
  }

  emailvalidate(
    control: AbstractControl
  ): Promise<{ [key: string]: any } | null> {
    return new Promise((resolve) => {
      const regexp = new RegExp(
        '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zAZ0-9-]+)*$'
      );
      if (!regexp.test(control.value)) {
        resolve({ emailvalidate: true });
      } else {
        resolve(null);
      }
    });
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
  payment(scrollTarget: HTMLElement) {
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
      const firstInvalidControl: HTMLElement = this.billingAddressFormElement.nativeElement.querySelector('.ng-invalid');
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
      return;
    }
    if (this.offlineTransactionForm.invalid) {
      return;
    }
    this.billingAddressVO = this.billingAddressForm.value as BillingAddressVO;
    this.saveBillingAddress(this.billingAddressVO, scrollTarget);
  }

  goBack() {
    this.router.navigate(['/master/institute-management']);
  }

  getStates() {
    this.loader.showLoader(this.subscriptionService.getstates()).subscribe({
      next: (data: any) => {
        this.checkoutService.statesSubject$.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error While Fetching States');
      },
    });
  }

  saveBillingAddress(address: BillingAddressVO,scrollTarget:HTMLElement) {
    this.loader
      .showLoader(this.subscriptionService.saveBillingAddress(address))
      .subscribe({
        next: (data: BillingAddressVO) => {
          this.checkoutService.billingAddressSubject$.next(data);
          this.createOrder(scrollTarget);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Updating Billing Address');
        },
      });
  }

  getBillingAddress() {
    this.loader
      .showLoader(
        this.subscriptionService.getBillingAddressOfInstitute(this.instituteId)
      )
      .subscribe({
        next: (data: BillingAddressVO) => {
          this.checkoutService.billingAddressSubject$.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Fetching Billing Address');
        },
      });
  }

  disableFormControls(formGroup: FormGroup) {
    for (const controlName in formGroup.controls) {
      const control = formGroup.get(controlName);
      if (control) {
        control.disable();
      }
    }
  }
  private enableFormControls(form: FormGroup) {
    for (const controlName in form.controls) {
      const control = form.get(controlName);
      if (control) {
        control.enable(); // Enable the control
      }
    }
  }

  createOrder(scrollTarget:HTMLElement) {
    this.offlineTransactionForm
      .get('userId')
      ?.setValue(this.billingAddressVO?.userId);
    if (this.offlineTransactionForm.valid) {
      const formData = this.offlineTransactionForm.value;
      this.loader
        .showLoader(
          this.subscriptionService.saveOfflineTaxCalculationOfInstitute(
            formData
          )
        )
        .subscribe({
          next: (data: any) => {
            this.showPrices = true;
            this.isPlanSelectionEnabled = false;
            this.disableFormControls(this.offlineTransactionForm);
            this.disableFormControls(this.billingAddressForm);
            this.offlineTransactionForm.get('transactionId')?.setValue(data.id);
            this.subscriptionPlanTransaction = data;
            if(this.showPrices)
            this.scrollIntoView(scrollTarget);
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert(
              'Error While fetch offline transaction tax calculations'
            );
          },
        });
    }
  }

  scrollIntoView(el:HTMLElement) {
    setTimeout(() => {
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); 
  }

  paymentRecieved() {
    const formData = this.offlineTransactionForm.value;
    this.loader
      .showLoader(this.subscriptionService.saveOfflinePaymentRecieved(formData))
      .subscribe({
        next: (data: any) => {
          this.goBack();
          this.alertService.successAlert(
            'Plan is Successfully purchased for ' + this.instituteName + '!'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            'Error While fetch offline transaction tax calculations'
          );
        },
      });
  }

  editFunction() {
    this.showPrices = false;
    this.enableFormControls(this.offlineTransactionForm);
    this.enableFormControls(this.billingAddressForm);
    this.subscriptionPlanTransaction = undefined;
    this.amountReceived=false;
    this.isPlanSelectionEnabled = true;
  }
}
