import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderService } from '../loader.service';
import { ApiResponse } from '../model/ApiResponse';
import { RazorpayDetails } from '../model/razorPayDetails';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { AuthService } from '../services/auth.service';
import { SettingServiceService } from '../services/setting-service.service';
import { environment } from '../../environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import Swal from 'sweetalert2';

export class WebhookVerificationTokenVO {
  id!: number;
  instituteId!: number;
  token!: string;
  webhookUrlSecret!: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  razorpaydetails = new RazorpayDetails();
  isVerified: boolean = false;
  razorPayForm!: FormGroup;
  fbVerificationForm!: FormGroup;
  isSubmit: boolean = false;
  webhookVerTokenVO = new WebhookVerificationTokenVO();
  webhookUrls!: string;
  pageToken!: string;
  columnNames:string[]=[]
  @ViewChild('script') script!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingServiceService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private _clipboardService: ClipboardService
  ) {}
  ngOnInit(): void {
    this.fetchInstituteRazorPayDetails();
    this.initForm();
    this.getVerificationToken();
    this.fetchAllowedColumnNames();
  }

  fetchAllowedColumnNames() {
    this.loader
      .showLoader(this.settingService.fetchAllowedHeaderNames())
      .subscribe({
        next: (data: ApiResponse) => {
          this.columnNames=data.body
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }

  fetchInstituteRazorPayDetails() {
    this.settingService
      .fetchInstituteRazorPayDetails(AuthService.getInstituteId)
      .subscribe((res: any) => {
        this.razorpaydetails = res.body;
        this.initForm();
      });
  }
  initForm() {
    this.razorPayForm = this.fb.group(
      {
        id: [this.razorpaydetails.id],
        razorPayKeyId: [
          this.razorpaydetails.razorPayKeyId,
          Validators.required,
        ],
        razorPaySecret: [
          this.razorpaydetails.razorPaySecret,
          Validators.required,
        ],
        instituteId: [
          this.razorpaydetails.instituteId
            ? this.razorpaydetails.instituteId
            : AuthService.getInstituteId,
        ],
      },
      { updateOn: 'submit' }
    );
  }

  get controls() {
    return this.razorPayForm?.controls;
  }

  submit() {
    if (this.razorPayForm.invalid) {
      this.isSubmit = true;
      return;
    }
    this.razorpaydetails.id = this.razorPayForm.get('id')?.value;
    this.razorpaydetails.razorPayKeyId =
      this.razorPayForm.get('razorPayKeyId')?.value;
    this.razorpaydetails.razorPaySecret =
      this.razorPayForm.get('razorPaySecret')?.value;
    this.razorpaydetails.instituteId =
      this.razorPayForm.get('instituteId')?.value;

    this.loader
      .showLoader(this.settingService.saveRazorPayDetails(this.razorpaydetails))
      .subscribe((res: any) => {
        this.alertService.successAlert(res.message);
      });
  }
  verifyRazorPayCredientials() {}

  getVerificationToken() {
    this.loader.showLoader(this.settingService.fetchToken()).subscribe({
      next: (data: ApiResponse) => {
        this.webhookVerTokenVO = data.body;
        this.webhookUrls =
          environment.webHookUrl +
          '?token=' +
          this.webhookVerTokenVO.webhookUrlSecret;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Something Went Wrong !');
      },
    });
  }

  submitToken() {
    this.loader
      .showLoader(this.settingService.savePageToken(this.pageToken))
      .subscribe({
        next: (data: ApiResponse) => {
          this.alertService.successAlert('Token saved successfully.');
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Something Went Wrong !');
        },
      });
  }

  copyScript() {
    this._clipboardService.copy(this.script.nativeElement.value);
    Swal.fire({
      position: 'top-end',
      title: 'Copied !',
      showConfirmButton: false,
      timer: 600,
      width: 200,
    });
  }
}
