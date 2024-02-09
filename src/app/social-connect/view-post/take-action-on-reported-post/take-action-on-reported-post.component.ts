import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { SocialApiService } from '../../social-api.service';
import { ReportedPostActionVO } from 'src/app/model/ReportedPostActionVO';
import { ViewPostComponent } from '../view-post.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-take-action-on-reported-post',
  standalone: true,
  imports: [],
  templateUrl: './take-action-on-reported-post.component.html',
  styleUrl: './take-action-on-reported-post.component.scss'
})
export class TakeActionOnReportedPostComponent implements OnInit {
  refresh = new EventEmitter<boolean>();
  descriptionVisible = false;
  descriptionText = '';
  dialogHeight = 348;
  reportedPostActionVO: ReportedPostActionVO = {};
  form!: FormGroup;
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ViewPostComponent>,
    private fb: FormBuilder,
    private socialConnectService: SocialApiService,
    private loader: LoaderService,
    @Inject(MAT_DIALOG_DATA)
    public data: { postId: any },
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      actionTaken: ['', Validators.required],
      actionReason: ['', Validators.required],
    });
  }
  get controls() {
    return this.form.controls;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  updateDescription() {
    const actionSelect = document.getElementById(
      'action-select'
    ) as HTMLSelectElement;
    const selectedValue = actionSelect.value;
    this.descriptionVisible =
      selectedValue === 'NotViolating' || selectedValue === 'Deleted';

    if (selectedValue === 'NotViolating') {
      this.descriptionText = 'No action is needed on this post.';
    } else if (selectedValue === 'Deleted') {
      this.descriptionText = 'This post will be deleted permanently.';
    } else {
      this.descriptionText = '';
    }

    this.dialogHeight = this.descriptionVisible ? 386 : 348;
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.reportedPostActionVO.postId = this.data.postId;
    this.reportedPostActionVO.actionTaken =
      this.form?.controls['actionTaken']?.value;
    this.reportedPostActionVO.actionReason =
      this.form?.controls['actionReason']?.value;
    this.loader
      .showLoader(
        this.socialConnectService.takeActionOnReportedPost(
          this.reportedPostActionVO
        )
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.refresh.emit(true);
            this.router.navigate([
              `${AuthService.getModulePrefix}/social-connect/abuse-reports`,
            ]);
        },
      });
  }
}
