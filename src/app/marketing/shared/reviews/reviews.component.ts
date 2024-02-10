import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../loader.service';
import { CourseVO } from '../../../model/CourseVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  @Input('courseDetails') courseDetails?: CourseVO;
  studentFeedback!: UntypedFormGroup;
  submitted: boolean = false;
  @Output() newItemEvent = new EventEmitter<string>();
  constructor(private fb: UntypedFormBuilder, private courseService: CourseService, private loaderService: LoaderService, private alertService: SwalAlertService,
    public dialogRef: MatDialogRef<ReviewsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) { }
  ngOnInit(): void {
    
    this.studentFeedback = this.fb.group({
      rating: ['', Validators.required],
      review: ['', Validators.required],
      userId: [''],
      courseId: [''],
      instituteId: [AuthService.getInstituteId],
    });
  }

  close() {
    this.dialogRef.close();
  }
  get fControls() {
    return this.studentFeedback.controls;
  }
  submit() {
    if (this.studentFeedback.status == 'INVALID') {
      alert('invalid');
      this.submitted = true;
      return;
    }

    this.studentFeedback
      .get('userId')
      ?.setValue(+JSON.parse(localStorage.getItem('auth') || '')?.user_id);
    this.studentFeedback
      .get('courseId')
      ?.setValue(this.data.idCourse);
    this.loaderService.showLoader(
      this.courseService
        .saveStudentFeedback(this.studentFeedback.value))
      .subscribe({
        next: (data: any) => {
          this.newItemEvent.emit();
          this.studentFeedback.reset();
          this.dialogRef.close();
        }, error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
          this.newItemEvent.emit();
          this.studentFeedback.reset();
          this.dialogRef.close();
        }
      });
  }
}
