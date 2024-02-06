import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnInit {
  borderradius!: '39px';
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput!: NgOtpInputComponent;
  showLoading: boolean = false;
  email!: string;
  referralCode: any;
  clicked: boolean = true;
  otp!: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      (this.email = data.id), (this.referralCode = data.referralCode);
      localStorage.setItem('email', this.email);
    });
  }

  onOtpChange(event: any) {
    if (event.length === 4) {
      this.otp = event;
      this.clicked = false;
    }
  }

  submit() {
    this.clicked = true;
    this.loader.loadingOn();
    this.authService
      .checkOTP({
        otp: this.otp,
        email: this.email,
        referralCode: this.referralCode,
      })
      .subscribe(
        (res: any) => {
          this.loader.loadingOff();
          this.router.navigate(['/login'], {
            queryParams: { message: 'You have successfully registered.' },
          });
          this.alertService.successAlert('Registered Successfully!');
        },
        (err: HttpErrorResponse) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Something went wrong!');
          this.clicked = false;
        }
      );
  }
}
