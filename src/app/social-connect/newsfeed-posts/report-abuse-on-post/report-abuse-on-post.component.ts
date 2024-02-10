import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '../../../loader.service';
import { ApiResponse } from '../../../model/ApiResponse';
import { ReportAbuseVO } from '../../../model/ReportAbuseVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { SocialApiService } from '../../social-api.service';
import { NewsfeedPostsComponent } from '../newsfeed-posts.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report-abuse-on-post',
   
  templateUrl: './report-abuse-on-post.component.html',
  styleUrl: './report-abuse-on-post.component.scss'
})
export class ReportAbuseOnPostComponent implements OnInit {
  refresh = new EventEmitter<boolean>();
  form!: FormGroup;
  reportAbuseVO: ReportAbuseVO = {};
  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
    private socialConnectService: SocialApiService,
    private snackBar: MatSnackBar,
    private alertService: SwalAlertService,
    public dialogRef: MatDialogRef<NewsfeedPostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: any }
  ) {}

  ngOnInit(): void {
    this.initlizeForm();
  }

  initlizeForm() {
    this.form = this.fb.group({
      reason: [],
    });
  }
  submitReport() {
    this.reportAbuseVO.postId = this.data.postId;
    this.reportAbuseVO.reason = this.form?.controls['reason'].value;
    this.loader
      .showLoader(this.socialConnectService.reportOnPost(this.reportAbuseVO))
      .subscribe({
        next: (data: ApiResponse) => {
          this.alertService.successAlert(
            'Your report on this post is submitted successfully ! Thanks for helping us keep Nrich a safe and supportive Platform.'
          );
          this.refresh.emit(true);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 404) {
            this.showSnackbarBottomPosition(error.error.message);
          } else {
            this.alertService.errorAlert('Error while reporting');
          }
        },
      });
  }
  get controls() {
    return this.form.controls;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  showSnackbarBottomPosition(content: string) {
    let sb = this.snackBar.open(content, 'OK', {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }
}
