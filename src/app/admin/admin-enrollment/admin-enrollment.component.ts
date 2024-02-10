import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { MobileCourseVO } from '../../model/MobileCourseVO';
import { AuthService } from '../../services/auth.service';
import { InstituteService } from '../../services/institute/institute.service';

@Component({
  selector: 'app-admin-enrollment',
  templateUrl: './admin-enrollment.component.html',
  styleUrl: './admin-enrollment.component.scss'
})
export class AdminEnrollmentComponent implements OnInit {
  courseList: MobileCourseVO[] = [];
  instituteId: any;
  totalCount: any;
  config!: number;
  pageNumber: number = 0;
  size: number = 8;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  constructor(
    private instituteService: InstituteService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    this.getCoursesWithPagination(this.pageNumber);
    this.applyFilter();
  }
  getCoursesWithPagination(page: any) {
    this.loaderService
      .showLoader(
        this.instituteService.fetchAdminCourseListWithPagination(
          this.instituteId,
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe((data: any) => {
        this.courseList = data.body.courses;
        this.config = data.body.total_count;
      });
  }
  nextPage($event: any) {
    this.pageNumber = $event;
    window.scrollTo(0, 0);
    this.getCoursesWithPagination(this.pageNumber);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.getCoursesWithPagination(this.pageNumber);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  navigateToBatches(idCourse: any, batchId: any, courseName: string) {
    this.router.navigate([`${AuthService.getModulePrefix}/batches`], {
      queryParams: { id: idCourse, idbatch: batchId, courseName: courseName },
    });
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loaderService.showLoader(
                this.instituteService.fetchAdminCourseListWithPagination(
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
      .subscribe((res:any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.courseList = value.body.courses;
          this.config = value.body.total_count;
        });
      });
  }
}
