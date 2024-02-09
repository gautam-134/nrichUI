import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { LoaderService } from 'src/app/loader.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';


@Component({
  selector: 'app-teacher-reviews',
  standalone: true,
  imports: [],
  templateUrl: './teacher-reviews.component.html',
  styleUrl: './teacher-reviews.component.scss'
})
export class TeacherReviewsComponent implements OnInit {
  starRating = 0;
  form: UntypedFormGroup;
  result: any;
  isSubmit: boolean = false;
  user_id!: number;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TeacherReviewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teacherservices: TeacherService,private loader :LoaderService
  ) {
    this.form = this.fb.group({
      id: [''],
      userId: [''],
      teacherId: [''],
      rating: ['', Validators.required],
      review: ['', Validators.required],
      userName: [''],
    });
  }

  ngOnInit(): void {}
  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid) {
      this.isSubmit = true;
      return;
    }
    this.user_id = +JSON.parse(localStorage.getItem('auth') || '')?.user_id;
    this.form.get('userId')?.setValue(this.user_id);
    this.form.get('teacherId')?.setValue(this.data.teacherId);
    this.loader.showLoader(
    this.teacherservices
      .savefeedback(this.form.value))
      .subscribe((data: any) => {
        this.dialogRef.close();
      });
  }

  get controls() {
    return this.form.controls;
  }
}
