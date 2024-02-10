import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgOtpInputComponent } from 'ng-otp-input';
import { InstituteRoles } from '../../../enums/InstituteRoles';
import { LoaderService } from '../../../loader.service';
import { AuthService } from '../../../services/auth.service';
import { SelectInstituteComponent } from '../select-institute/select-institute.component';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';

@Component({
  selector: 'app-login-otp',
   
  templateUrl: './login-otp.component.html',
  styleUrl: './login-otp.component.scss'
})
export class LoginOtpComponent implements OnInit, OnDestroy {
  email: any;
  enterOtp: boolean = false;
  enableBtn: boolean = true;
  Otp: string = '';
  toggleButton: boolean = false;
  emailValue: any;
  mobileNo: string = '';

  countDown!: Subscription;
  counter = 60;
  tick = 1000;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private auth: AuthService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput!: NgOtpInputComponent;

  ngOnInit(): void {}

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
    // this.loaderService
    //   .showLoader(this.authService.resendOtp(this.mobileNo))
    //   .subscribe({
    //     next: (res) => {
    //       this.refresh();
    //     },
    //     error: (err) => {
    //       this.alertService.errorAlert('Error while sending OTP');
    //     },
    //   });
  }

  sendOtp(emailValue: any) {
    // const regexp = new RegExp('^((\\+91-?)|0)?[0-9]{10}$');
    // if (regexp.test(emailValue)) {
    //   this.loaderService.loadingOn();
    //   this.authService.signInWithOtpSent(emailValue).subscribe(
    //     (res: any) => {
    //       this.loaderService.loadingOff();
    //       this.emailValue = res.body;
    //       this.enterOtp = true;
    //       this.toggleButton = true;
    //       this.refresh();
    //     },
    //     (err) => {
    //       this.loaderService.loadingOff();
    //       if (err.error.status == '403') {
    //         this.alertService.errorAlert(err.error.message);
    //       } else {
    //         this.alertService.errorAlert('Something went wrong!');
    //       }
    //     }
    //   );
    // } else {
    //   this.alertService.errorAlert('Please enter correct mobile number!');
    // }
  }

  onOtpChange(event: any) {
    this.Otp = event;
    if (this.Otp.length == 4) {
      this.enableBtn = false;
    }
  }

  resetOtpValue() {
    this.ngOtpInput.setValue(null);
  }

  onlyNumeric(event: any) {
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

  Login() {
    this.loaderService.loadingOn();
    this.authService.login(this.mobileNo, this.Otp, true, 1).subscribe(
      (auth: any) => {
        this.auth.loggedInSubject.next(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('auth', JSON.stringify(auth));
        this.loaderService.loadingOff();
        if (
          JSON.parse(localStorage.getItem('auth') || '{}').isProfileCompleted
        ) {
          if (auth.hasMultipleRoles) {
            this.selectInstitute();
          } else if (auth.role.authority == 'Student') {
            this.router.navigateByUrl('/student/enrollments');
          } else if (auth.role.authority == 'Teacher') {
            this.router.navigateByUrl('/teacher/enrollments');
          } else {
            this.router.navigateByUrl('/admin/enrollments');
          }
        } else if (
          !JSON.parse(localStorage.getItem('auth') || '{}')
            .isProfileCompleted &&
          JSON.parse(localStorage.getItem('auth') || '{}').role.authority != ''
        ) {
          if (
            JSON.parse(localStorage.getItem('auth') || '{}').role.authority ==
              InstituteRoles.InstituteAdmin ||
            JSON.parse(localStorage.getItem('auth') || '{}').role.authority ==
              InstituteRoles.Admin
          ) {
            this.router.navigate(['/signup'], {
              queryParams: { type: 'admin' },
            });
          } else if (
            JSON.parse(localStorage.getItem('auth') || '{}').role.authority ==
              'Teacher' &&
            !JSON.parse(localStorage.getItem('auth') || '{}').isProfileCompleted
          ) {
            this.router.navigateByUrl('/teacher/profile');
          } else {
            this.router.navigate(['/signup'], {
              queryParams: { type: 'student' },
            });
          }
        } else {
          this.router.navigateByUrl('/signup-role');
        }
      },
      (error: HttpErrorResponse) => {
        this.loaderService.loadingOff();
        this.alertService.errorAlert('OTP is incorrect');
        this.resetOtpValue();
      }
    );
  }
  private selectInstitute() {
    this.dialog.open(SelectInstituteComponent, {
      disableClose: true,
    });
  }
}
