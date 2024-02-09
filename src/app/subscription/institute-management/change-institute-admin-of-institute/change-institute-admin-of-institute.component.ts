import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take, timer } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { InstituteAdminDetails } from 'src/app/model/InstituteAdminDetails';
import { InstituteAdminDetailsChangingHistoryVO } from 'src/app/model/InstituteAdminDetailsChangingHistoryVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { InstituteService } from 'src/app/services/institute/institute.service';

@Component({
  selector: 'app-change-institute-admin-of-institute',
  standalone: true,
  imports: [],
  templateUrl: './change-institute-admin-of-institute.component.html',
  styleUrl: './change-institute-admin-of-institute.component.scss'
})
export class ChangeInstituteAdminOfInstituteComponent implements OnInit {
  instituteId: any;
  changeInstituteAdminForm!: FormGroup;
  instituteName!: string;
  instituteAdminDetails!: InstituteAdminDetails;
  submitted: boolean = false;
  isFormDisabled: boolean = false;
  showOTPSection = false;
  countDown!: Subscription;
  counter = 60;
  tick = 1000;
  sendOtpClicked: boolean = false;

  instituteAdminDetailsChangingHistoryVO!: InstituteAdminDetailsChangingHistoryVO;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private instituteService: InstituteService,
    private alertService: SwalAlertService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isFormDisabled = true;
    this.route.queryParams.subscribe((params) => {
      this.instituteId = params['id'];
      this.instituteName = params['instituteName'];
    });

    this.initializeForm();
    if (this.instituteId) {
      this.fetchInstituteAdminDetails();
    }
  }
  ngOnDestroy() {
    if (this.countDown) this.countDown.unsubscribe();
  }

  refresh() {
    this.counter = 60;
    this.countDown = timer(0, this.tick)
      .pipe(take(this.counter))
      .subscribe(() => {
        --this.counter;
        if (this.counter == 0) {
          this.countDown.unsubscribe();
        }
      });
  }
  initializeForm() {
    this.changeInstituteAdminForm = this.fb.group({
      id: [''],
      userId: ['', Validators.required],
      instituteName: [],
      name: [],
      instituteId: ['', Validators.required],
      oldMobileOtp: [''],
      newMobileOtp: [''],
      oldMobileNumber: [Validators.required],
      newMobileNumber: [
        '',
        [Validators.required, Validators.pattern(/^((\+91-?)|0)?[0-9]{10}$/)],this.validateNewMobileNumberAsync.bind(this),,
      ],
      oldOtpSentDate: [''],
      newOtpSentDate: [''],
      updatedDate: [''],
      updatedBy: [''],
      isVerified: [false],
      otpResendFor: [''],
    });
  }
  get controls() {
    return this.changeInstituteAdminForm.controls;
  }
  validateNewMobileNumberAsync(control: AbstractControl): Promise<ValidationErrors | null> {
    return Promise.resolve(this.validateNewMobileNumber(control));
  }
  
  validateNewMobileNumber(control: AbstractControl): { [key: string]: any } | null {
    const oldMobileNumber = this.changeInstituteAdminForm.get('oldMobileNumber')?.value;
    const newMobileNumber = control.value;
    if (oldMobileNumber !== undefined && newMobileNumber === oldMobileNumber) {
      return { 'sameAsOldMobileNumber': true };
    }

    return null;
  }
   
  validatePhoneNumber(phoneNo: string): boolean {
    const emailRegex: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/;
    return emailRegex.test(phoneNo);
  }
  fetchInstituteAdminDetails() {
    this.instituteService
      .fetchInstituteAdminDetails(this.instituteId)
      .subscribe({
        next: (data: any) => {
          this.instituteAdminDetails = data.body;
          this.changeInstituteAdminForm.patchValue({
            instituteName: this.instituteName,
            oldMobileNumber: this.instituteAdminDetails.mobileNumber || '',
            name: this.instituteAdminDetails.name || '',
            userId: this.instituteAdminDetails.userId,
          });
          this.changeInstituteAdminForm.get('name')?.disable();
          this.changeInstituteAdminForm.get('instituteName')?.disable();
          this.changeInstituteAdminForm.get('oldMobileNumber')?.disable();
          this.changeInstituteAdminForm
            .get('name')
            ?.setValue(this.instituteAdminDetails.name);
          this.changeInstituteAdminForm
            .get('oldMobileNumber')
            ?.setValue(this.instituteAdminDetails.mobileNumber);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            'Error While Fetching instituteAdminDetails !'
          );
        },
      });
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

  toggleOTPSection() {
    this.submitted = true;
    this.changeInstituteAdminForm
      .get('instituteId')
      ?.setValue(this.instituteId);
    if (this.changeInstituteAdminForm.valid) {
      this.changeInstituteAdminForm.get('name')?.enable();
      this.changeInstituteAdminForm.get('instituteName')?.enable();
      this.changeInstituteAdminForm.get('oldMobileNumber')?.enable();

      // Get form data
      const formData = this.changeInstituteAdminForm.value;

      // Disable controls again
      this.changeInstituteAdminForm.get('name')?.disable();
      this.changeInstituteAdminForm.get('instituteName')?.disable();
      this.changeInstituteAdminForm.get('oldMobileNumber')?.disable();
      this.loaderService
        .showLoader(
          this.instituteService.verifyMobileOtpsToChangeInstituteAdmin(formData)
        )
        .subscribe({
          next: (data: any) => {
            this.showOTPSection = !this.showOTPSection;
            this.refresh();
            this.instituteAdminDetailsChangingHistoryVO = data.body;
            console.log(data.body);
            this.changeInstituteAdminForm.get('id')?.setValue(data.body.id);
            this.changeInstituteAdminForm
              .get('oldMobileOtp')
              ?.setValidators([
                Validators.required,
                Validators.pattern(/^\d{4}$/),
              ]);
            this.changeInstituteAdminForm
              .get('newMobileOtp')
              ?.setValidators([
                Validators.required,
                Validators.pattern(/^\d{4}$/),
              ]);
            this.changeInstituteAdminForm
              .get('oldMobileOtp')
              ?.updateValueAndValidity();
            this.changeInstituteAdminForm
              .get('newMobileOtp')
              ?.updateValueAndValidity();
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert(
              'Error While sending OTP to Mobile Number !'
            );
          },
        });
    }
  }

  resendOTP(otpResendFor: String) {
    this.changeInstituteAdminForm.get('otpResendFor')?.setValue(otpResendFor);
    this.changeInstituteAdminForm.get('oldMobileNumber')?.enable();
    const formData = this.changeInstituteAdminForm.value;
    this.changeInstituteAdminForm.get('oldMobileNumber')?.disable();
    this.loaderService
      .showLoader(this.instituteService.resendOTP(formData))
      .subscribe({
        next: (data: any) => {
          this.refresh();
          if (otpResendFor === 'NEWMOBILENUMBER') {
            this.alertService.successAlert(
              'New Mobile OTP resend successfully!'
            );
            this.changeInstituteAdminForm.get('newMobileOtp')?.setValue('');
          } else if (otpResendFor === 'OLDMOBILENUMBER') {
            this.alertService.successAlert(
              'Current Mobile OTP resend successfully!'
            );
            this.changeInstituteAdminForm.get('oldMobileOtp')?.setValue('');
          } else {
            this.alertService.successAlert('OTP resend successfully!');
            this.changeInstituteAdminForm.get('oldMobileOtp')?.setValue('');
            this.changeInstituteAdminForm.get('newMobileOtp')?.setValue('');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Resending OTP !');
        },
      });
  }

  submit() {
    this.sendOtpClicked = true;
    if (this.changeInstituteAdminForm.valid) {
      const formData = this.changeInstituteAdminForm.value;
      this.loaderService
        .showLoader(
          this.instituteService.changeInstituteAdminMobileNumber(formData)
        )
        .subscribe({
          next: (data: any) => {
            this.goBack();
            this.alertService.successAlert(
              'Institute admin mobile number changed successfully'
            );
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert(error.error.errorMessage);
          },
        });
    }
  }

  goBack() {
    this.router.navigate(['/master/institute-management']);
  }
}