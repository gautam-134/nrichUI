import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from 'src/app/loader.service';
import { couponVO, RoleModel } from 'src/app/model/coupon.model';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';

@Component({
  selector: 'app-add-edit-coupon',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-coupon.component.html',
  styleUrl: './add-edit-coupon.component.scss'
})
export class AddEditCouponComponent implements OnInit {
  form!: FormGroup;
  roles: RoleModel[] = [];
  users!: any[];
  Coupen1!: boolean;
  coupen3!: boolean;
  customInput!: boolean;
  subscriptionplan!: any[];
  submitted!: boolean;
  disabledField: boolean = true;
  CouponVO: couponVO = new couponVO();
  minDate = new Date();
  now: any;
  constructor(
    public dialogRef: MatDialogRef<AddEditCouponComponent>,
    private fb: FormBuilder,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private subscriptionservices: SubscriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.data.isEdit == true) {
      const endingDate = this.data.Body.endDate.split('T')[0];
      const StartDate = this.data.Body.startDate.split('T')[0];

      this.CouponVO.type = this.data.Body.type;
      this.CouponVO.couponFor = this.data.Body.couponFor;
      this.CouponVO.createdDate = this.data.Body.createdDate;
      this.CouponVO.generationType = this.data.Body.generationType;
      this.CouponVO.remarks = this.data.Body.remarks;
      this.CouponVO.userId = this.data.Body.userId;
      this.CouponVO.discount = this.data.Body.discount;
      this.CouponVO.noOfCoupens = this.data.Body.noOfCoupens;
      this.CouponVO.typeOfSeries = this.data.Body.typeOfSeries;
      this.CouponVO.code = this.data.Body.code;
      this.CouponVO.discountType = this.data.Body.discountType;
      this.CouponVO.role = this.data.Body.role;
      this.form = this.fb.group({
        id: [this.data.Body.id],
        couponFor: [
          { value: this.data.Body.couponFor, disabled: this.disabledField },
          Validators.required,
        ],
        type: [
          { value: this.data.Body.type, disabled: this.disabledField },
          Validators.required,
        ],
        createdDate: [
          { value: this.data.Body.createdDate, disabled: this.disabledField },
        ],
        startDate: [StartDate, Validators.required],
        endDate: [endingDate, Validators.required],
        generationType: [
          {
            value: this.data.Body.generationType,
            disabled: this.disabledField,
          },
          Validators.required,
        ],
        remarks: [
          { value: this.data.Body.remarks, disabled: this.disabledField },
          Validators.required,
        ],
        userId: [
          { value: this.data.Body.userId, disabled: this.disabledField },
          Validators.required,
        ],
        discount: [
          { value: this.data.Body.discount, disabled: this.disabledField },
          Validators.required,
        ],
        noOfCoupens: [
          { value: this.data.Body.noOfCoupens, disabled: this.disabledField },
          Validators.required,
        ],
        typeOfSeries: [
          { value: this.data.Body.typeOfSeries, disabled: this.disabledField },
          Validators.required,
        ],
        code: [
          { value: this.data.Body.code, disabled: this.disabledField },
          Validators.required,
        ],
        role: [''],
        discountType: [
          { value: this.data.Body.discountType, disabled: this.disabledField },
          Validators.required,
        ],
      });
    } else {
      this.form = this.fb.group({
        type: ['', Validators.required],

        createdDate: [''],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        couponFor: ['', Validators.required],
        generationType: ['', Validators.required],
        remarks: ['', Validators.required],
        userId: ['', Validators.required],
        discountType: ['', Validators.required],
        discount: ['', Validators.required],
        noOfCoupens: ['', Validators.required],
        typeOfSeries: ['', Validators.required],
        code: ['', Validators.required],
        role: [''],
      });
    }
    this.subscriptionservices
      .getRoleByInstitution(
        JSON.parse(localStorage.getItem('auth') as string).selectedInstitute
      )
      .subscribe((data: any) => {
        this.roles = data.roles;
      });
    this.subscriptionservices.getSubscriptionplan().subscribe((data: any) => {
      this.subscriptionplan = data.teacherPricingPlans;
    });
  }

  removeValidation(formControl: AbstractControl) {
    formControl.clearValidators();
    formControl.updateValueAndValidity();
  }

  addValidation(formControl: AbstractControl) {
    formControl.setValidators(Validators.required);
    formControl.updateValueAndValidity();
  }

  submit() {
    if (this.data.isEdit == true) {
      if (this.data.Body.generationType === 'custom') {
        this.removeValidation(this.form.controls['code']);
      }
    }

    if (this.data.isEdit == false) {
      if (this.form.controls['generationType'].value === 'custom') {
        this.addValidation(this.form.controls['code']);
      }
    }

    if (this.form.controls['type'].value === 'normal') {
      this.removeValidation(this.form.controls['userId']);
    }
    if (this.form.controls['type'].value === 'reference') {
      this.addValidation(this.form.controls['userId']);
    }

    if (this.form.controls['generationType'].value === 'autogenerated') {
      this.removeValidation(this.form.controls['code']);
    }
    if (this.form.invalid) {
      this.submitted = true;
      return;
    } else if (this.form.get('id')?.value != null) {
      this.loader.loadingOn();
      this.CouponVO.id = this.form.get('id')?.value;
      this.CouponVO.startDate = this.form.get('startDate')?.value;
      this.CouponVO.endDate = this.form.get('endDate')?.value;
      this.subscriptionservices.addCoupons(this.CouponVO).subscribe(
        (res) => {
          this.dialogRef.close();
          this.alertService.successAlert(res.message);
          this.loader.loadingOff();
        },
        (err: HttpErrorResponse) => {
          this.loader.loadingOff();
          this.alertService.errorAlert(err.error.message);
        }
      );
    } else {
      this.loader.loadingOn();
      this.subscriptionservices.addCoupons(this.form.value).subscribe(
        (res) => {
          this.dialogRef.close();
          this.alertService.successAlert(res.message);
          this.loader.loadingOff();
        },
        (err: HttpErrorResponse) => {
          this.loader.loadingOff();
          this.alertService.errorAlert(err.error.message);
        }
      );
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  selectRole(roleId: any) {
    this.loader.loadingOn();
    this.subscriptionservices.getUserByRole(roleId).subscribe(
      (data: any) => {
        this.users = data;

        this.loader.loadingOff();
      },
      (error: any) => {
        this.loader.loadingOff();
        this.alertService.errorAlert('Something went wrong!');
      }
    );
  }
  get controls() {
    return this.form.controls;
  }
  onlyNumeric(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onDiscountTypeChange(event: any) {
    const discountControl = this.form.controls['discount'];
    discountControl.setValidators([Validators.required]);
    discountControl.updateValueAndValidity();
  }
}

