import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CourseService } from 'src/app/services/course/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enrolled-students',
  standalone: true,
  imports: [],
  templateUrl: './enrolled-students.component.html',
  styleUrl: './enrolled-students.component.scss'
})
export class EnrolledStudentsComponent implements OnInit, AfterViewInit {
  batches: { id: number; batchName: string }[] = [];
  page: number = 0;
  size: number = 5;
  batchId!: number | undefined;
  search!: string;
  searchSubscription!: Subscription;
  totalStudents!: number;
  studentList: any[] = [];
  @ViewChild('searchStudents') searchStudents!: ElementRef;
  constructor(
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngAfterViewInit(): void {
    this.searchStudentsByName();
  }

  searchStudentsByName() {
    this.searchSubscription = fromEvent(
      this.searchStudents.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.search = data.target.value;
        this.fetchEnrolledStudent();
      });
  }

  ngOnInit(): void {
    this.loader
      .showLoader(
        this.courseService.fetchCourseBatches(
          this.activatedRoute.snapshot.queryParams['id']
        )
      )
      .subscribe({
        next: (data: { id: number; batchName: string }[]) => {
          this.batches = data;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching batches');
        },
      });
    this.fetchEnrolledStudent();
  }

  fetchEnrolledStudent() {
    this.loader
      .showLoader(
        this.courseService.fetchEnrolledStudents(
          +this.activatedRoute.snapshot.queryParams['id'],
          this.page,
          this.size,
          this.batchId,
          this.search
        )
      )
      .subscribe({
        next: (data: { total_count: number; enrolledStudents: any }) => {
          this.totalStudents = data.total_count;
          this.studentList = data.enrolledStudents;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  onBatchChange(event: any) {
    this.batchId = +event.target.value;
    if (isNaN(this.batchId)) this.batchId = undefined;
    this.page = 0;
    this.fetchEnrolledStudent();
  }

  pageChange(event: any) {
    this.page = event;
    this.fetchEnrolledStudent();
  }
  changeSize(event: any) {
    this.size = event;
    this.page = 0;
    this.fetchEnrolledStudent();
  }

  unEnrollStudent(id: number) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to Un-Enroll this Student?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Un-Enroll',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Un-Enroll',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.unenroll(id).subscribe({
          next: (res: any) => {
            this.alertService.successAlert(res.message);
            this.page = 0;
            this.fetchEnrolledStudent();
          },
          error: (err: any) => {
            this.alertService.errorAlert('Something went wrong!');
          },
        });
      } else if (result.isDenied) {
      }
    });
  }
}
