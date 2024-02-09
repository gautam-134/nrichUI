import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

import { CourseReviewsAndRatingsVO } from 'src/app/model/CourseReviewsAndRatingsVO';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { teacherDetails } from 'src/app/model/teacher-info';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { TeacherReviewsComponent } from './teacher-reviews/teacher-reviews.component';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [],
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.scss'
})
export class TeacherProfileComponent implements OnInit {
  id: any;
  teacherDetails!: teacherDetails;
  @ViewChild('videoPlayer')
  videoplayer!: ElementRef;
  teachercourselist: MobileCourseVO[] = [];
  teacherReviewlist: CourseReviewsAndRatingsVO[] = [];
  form: FormGroup;
  isSubmit: boolean = false;
  metatages!: any[];
  isLogin: boolean = false;
  metadescription: string = '';
  page: number = 0;
  size: number = 3;
  constructor(
    private teacherService: TeacherService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public authService: AuthService,
    private meta: Meta,
    private titleService: Title
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      inquiry: ['', Validators.required],
      teacherName: [null],
      teacherId: [null],
      courseId: [null],
      courseName: [null, Validators.required],
      email: [null],
      userId: [null],
      instituteId: [null],
    });
  }

  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }

  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }

  private setTitle(name: string) {
    this.titleService.setTitle(name);
  }

  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description'");
    this.titleService.setTitle('Nrich Learning');
  }

  ngOnInit(): void {
    this.isLogin = this.authService.isLoggin();
    this.route.queryParams.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getTeacherDetails();
        this.teacherService.getTeacherCoures(this.id).subscribe((data: any) => {
          this.teachercourselist = data.body;
          this.teacherDetails.courseCount = data.body.length;
        });
        this.teacherService
          .getTeacherReviews(this.id, this.page, this.size)
          .subscribe((data: any) => {
            this.teacherReviewlist = data.body.teacherReviews;
          });
      }
    });
    this.teacherService.getTeacherDetails(this.id).subscribe((data: any) => {
      this.teacherDetails = data.body;
      this.teacherDetails.youtubePage =
        this.teacherDetails?.youtubePage?.replace(
          '/watch?v=',
          '/embed/'
        ) as string;
      this.setTitle(data.body.name);
      if (data.body?.tags !== null) {
        this.metatages = data.body.tags;
        this.setMetaTags({
          name: 'tags',
          content: this.metatages.toString(),
        });
      }
      if (data.body?.meta_description !== null) {
        this.metadescription = data.body.meta_description;
        this.setMetaTags({
          name: 'description',
          content: this.metadescription,
        });
      }
    });
    this.teacherService.getTeacherCoures(this.id).subscribe((data: any) => {
      this.teachercourselist = data.body;
      this.teacherDetails.courseCount = data?.body?.length;
    });
    this.review();
  }

  getTeacherDetails() {
    this.teacherService.getTeacherDetails(this.id).subscribe((data: any) => {
      this.teacherDetails = data.body;
      this.teacherDetails.teacherTeasorVideoPath =
        this.teacherDetails.youtubePage != undefined
          ? (this.teacherDetails.youtubePage.replace(
              '/watch?v=',
              '/embed/'
            ) as string)
          : this.teacherDetails.teacherTeasorVideoPath;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TeacherReviewsComponent, {
      data: { teacherId: this.teacherDetails.id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getTeacherDetails();
      this.review();
    });
  }

  video() {
    this.videoplayer?.nativeElement.play();
  }
  get controls() {
    return this.form.controls;
  }
  submit() {
    if (this.form.invalid) {
      this.isSubmit = true;
      return;
    }
    this.form.get('teacherId')?.setValue(this.teacherDetails.id);
    this.commonService.saveInquiry(this.form.value).subscribe((data: any) => {
      this.form.reset();
    });
  }
  review() {
    this.teacherService
      .getTeacherReviews(this.id, this.page, this.size)
      .subscribe((data: any) => {
        this.teacherReviewlist = data.body.teacherReviews;
      });
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}