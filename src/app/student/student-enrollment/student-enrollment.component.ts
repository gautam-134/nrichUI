import { Component, OnInit } from '@angular/core';
import { Subject, Observable, debounceTime, map, of } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { MobileCourseVO } from '../../model/MobileCourseVO';
import { StudentService } from '../../services/student/student.service';

@Component({
  selector: 'app-student-enrollment',
   
  templateUrl: './student-enrollment.component.html',
  styleUrl: './student-enrollment.component.scss'
})
export class StudentEnrollmentComponent implements OnInit {
  studentCourses: MobileCourseVO[] = [];
  id!: number;
  instituteId: any;

  config!: number;
  pageNumber: number = 0;
  size: number = 8;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;

  constructor(
    private studentservices: StudentService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    this.refresh(this.pageNumber);
    this.applyFilter();
  }

  refresh(page: any) {
    this.loaderService
      .showLoader(
        this.studentservices.fetchStudentCoursesWithPagination(
          this.instituteId,
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe((data: any) => {
        this.studentCourses = data.body.courses;
        this.config = data.body.total_count;
      });
  }

  nextPage($event: any) {
    this.pageNumber = $event;
    window.scrollTo(0, 0);
    this.refresh(this.pageNumber);
  }
  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.pageNumber);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loaderService.showLoader(
                this.studentservices.fetchStudentCoursesWithPagination(
                  JSON.parse(localStorage.getItem('auth') as string)
                    .selectedInstitute,
                  this.pageNumber,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.studentCourses = value.body.courses;
          this.config = value.body.total_count;
        });
      });
  }
}

