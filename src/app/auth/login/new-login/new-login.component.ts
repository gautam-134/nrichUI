import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { InstituteRoles } from '../../../enums/InstituteRoles';
import { LoaderService } from '../../../loader.service';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { SelectInstituteComponent } from '../select-institute/select-institute.component';
import { Auth } from '../../../model/Auth';

@Component({
  selector: 'app-new-login',
   
  templateUrl: './new-login.component.html',
  styleUrl: './new-login.component.scss'
})
export class NewLoginComponent implements OnInit {
  email: any;
  enterOtp: boolean = false;
  enableBtn: boolean = true;
  Otp: string = '';
  hiddenOtp: any;
  toggleButton: boolean = false;
  emailValue: any;
  mobileNo: string = '';
  isMobileLogin: boolean = true;

  countDown!: Subscription;
  counter = 60;
  tick = 1000;

  role!: string;
  referralCode!: string | null;
  subDomainInstitute: number = 1;
  subDomainInstituteName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private auth: AuthService,
    private dialog: MatDialog,
    private alertService: SwalAlertService,
    private activatedRoute: ActivatedRoute
  ) {}
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput!: NgOtpInputComponent;

  ngOnInit(): void {
    this.referralCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.authService.subDomainInstitute.subscribe((res) => {
      this.subDomainInstitute = res;
    });
    this.authService.subDomainInstituteName.subscribe({
      next: (instituteName: string) => {
        this.subDomainInstituteName = instituteName;
      },
    });
  }

  ngOnDestroy() {
    if (this.countDown) this.countDown.unsubscribe();
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
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

  resendOtp() {
    this.loaderService
      .showLoader(this.authService.resendOtp(this.mobileNo, this.isMobileLogin))
      .subscribe({
        next: (res) => {
          this.refresh();
        },
        error: (err) => {
          this.alertService.errorAlert('Error while sending OTP');
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
  sendOtp(value: any) {
    if (this.isMobileLogin) {
      if (this.validatePhoneNumber(value)) {
        // check institute part
        // if (this.checkUserEnrollment()) {
          this.sendOtpMethodCall(value);
        // }
      } else {
        this.alertService.errorAlert('Please enter correct mobile number!');
      }
    } else if (this.validateEmail(value)) {
      // check institute part
      // if (this.checkUserEnrollment()) {
        this.sendOtpMethodCall(value);
      // }
    } else {
      this.alertService.errorAlert('Please enter correct email!');
    }
  }

  checkUserEnrollment(): boolean {
    if (this.subDomainInstitute != 1) {
      this.loaderService.loadingOn();
      this.authService
        .isUserEnrolled(this.mobileNo, this.subDomainInstitute)
        .subscribe({
          next: (res: any) => {
            this.loaderService.loadingOff();
            return true;
          },
          error: (err: HttpErrorResponse) => {
            this.loaderService.loadingOff();
            this.alertService.errorAlert(err.error.message);
            return false;
          },
        });
    }

    return true;
  }

  sendOtpMethodCall(val: any) {
    this.loaderService.loadingOn();
    this.authService.signInWithOtpSent(val, this.isMobileLogin).subscribe(
      (res: any) => {
        this.loaderService.loadingOff();
        this.emailValue = res.body;
        this.enterOtp = true;
        this.toggleButton = true;
        this.refresh();
      },
      (err) => {
        this.loaderService.loadingOff();
        if (err.error.message) this.alertService.errorAlert(err.error.message);
        else this.alertService.errorAlert('Something went wrong!');
      }
    );
  }

  validatePhoneNumber(phoneNo: string): boolean {
    const emailRegex: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/;
    return emailRegex.test(phoneNo);
  }

  validateEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onlyNumeric(event: any) {
    if (this.isMobileLogin) {
      const keyCode = event.keyCode;
      if (
        (keyCode >= 48 && keyCode <= 57) ||
        keyCode === 8 ||
        keyCode === 46 ||
        (keyCode >= 37 && keyCode <= 40) ||
        (keyCode >= 96 && keyCode <= 105)
      )
        return true;
      return false;
    }
    return true;
  }

  Login() {
    this.loaderService.loadingOn();
    this.authService
      .login(this.mobileNo, this.Otp, true, this.subDomainInstitute)
      .subscribe(
        (auth: any) => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('auth', JSON.stringify(auth));
          if (this.subDomainInstitute == 1) {
            this.loaderService.loadingOff();
            if (!auth.hasMultipleRoles) {
              this.auth.loggedInSubject.next(true);
            }
            if (
              JSON.parse(localStorage.getItem('auth') || '{}')
                .isProfileCompleted ||
              JSON.parse(localStorage.getItem('auth') || '{}').oneTimeLogin
            ) {
              if (auth.hasMultipleRoles) {
                this.selectInstitute();
              } else {
                this.role = JSON.parse(
                  localStorage.getItem('auth') as string
                ).role.roleType;
                if (
                  this.role == 'Student' &&
                  +AuthService.getInstituteId == 1
                ) {
                  this.router.navigateByUrl(
                    '/'
                  );
                } else {
                  this.router.navigateByUrl(
                    `${AuthService.getModulePrefix}/onboard`
                  );
                }
              }
            } else if (
              !JSON.parse(localStorage.getItem('auth') || '{}')
                .isProfileCompleted &&
              JSON.parse(localStorage.getItem('auth') || '{}').role.roleType
            ) {
              if (
                JSON.parse(localStorage.getItem('auth') || '{}').role
                  .roleType == InstituteRoles.InstituteAdmin ||
                JSON.parse(localStorage.getItem('auth') || '{}').role
                  .roleType == InstituteRoles.Admin
              ) {
                if (this.referralCode) {
                  this.router.navigateByUrl(
                    `/profile/admin/${this.referralCode}`
                  );
                } else {
                  this.router.navigateByUrl('/profile/admin');
                }
              } else if (
                JSON.parse(localStorage.getItem('auth') || '{}').role
                  .roleType == 'Teacher' &&
                !JSON.parse(localStorage.getItem('auth') || '{}')
                  .isProfileCompleted
              ) {
                this.router.navigateByUrl('/teacher/profile');
              } else {
                this.router.navigateByUrl('/profile/student');
              }
            } else {
              if (this.referralCode) {
                this.router.navigateByUrl(`/role/${this.referralCode}`);
              } else {
                this.router.navigateByUrl('/role');
              }
            }
          } else {
            this.authService
              .enrolledInstitute(this.subDomainInstitute)
              .subscribe({
                next: (res: any) => {
                  this.loaderService.loadingOff();
                  const auth: Auth = JSON.parse(
                    localStorage.getItem('auth') || '{}'
                  );
                  auth.role.roleType = res.roleType;
                  auth.selectedInstitute = this.subDomainInstitute;
                  localStorage.setItem('auth', JSON.stringify(auth));
                  this.authService.loggedInSubject.next(true);
                  this.router.navigate([
                    `${AuthService.getModulePrefix}/onboard`,
                  ]);
                },
                error: (err: HttpErrorResponse) => {
                  this.loaderService.loadingOff();
                  this.alertService.errorAlert(err.error.message);
                },
              });
          }
        },
        (error: HttpErrorResponse) => {
          this.loaderService.loadingOff();
          if (error.error.status == 404) {
            this.alertService.errorAlert(error.error.message);
          } else {
            this.alertService.errorAlert('OTP is incorrect');
          }
          this.Otp = '';
        }
      );
  }
  private selectInstitute() {
    this.dialog.open(SelectInstituteComponent, {
      disableClose: true,
      width: '340px',
    });
  }

  navigateToInstitute() {
    if (this.subDomainInstitute === 1) {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigate([`/institute-info`], {
        queryParams: { id: this.subDomainInstitute },
      });
    }
  }
}
