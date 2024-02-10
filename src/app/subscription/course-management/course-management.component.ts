import { Component, OnInit } from '@angular/core';
import { Subject, Observable, debounceTime, map, of } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { MobileCourseVO } from '../../model/MobileCourseVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CourseService } from '../../services/course/course.service';

@Component({
  selector: 'app-course-management',
   
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss'
})
export class CourseManagementComponent implements OnInit {
  Courses: MobileCourseVO[] = [];
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  typeOfShorting: boolean = true;
  type: any;
  selectedValue: string = 'All Courses';

  constructor(
    private courseService: CourseService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.fetchCourses(this.selectedValue, this.page);
    this.applyFilter(this.selectedValue, this.page);
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.courseService.updateDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {
          // this.displayOrder.nativeElement.focusout();
        },
        error: (error: any) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  featured(element: any, event: any) {
    this.loader
      .showLoader(this.courseService.updateFeaturedFlag(element.idCourse))
      .subscribe({
        next: (data: any) => {},
        error: (error: any) => {
          element.featured = !event.target.checked;
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  onValueChange(event: any) {
    this.selectedValue = event.target.value;
    this.page = 0;
    this.fetchCourses(this.selectedValue, this.page);
  }

  fetchCourses(selectedValue: any, page: number) {
    if (selectedValue == 'All Courses') {
      this.loader
        .showLoader(
          this.courseService.fetchAllCoursesList(
            page,
            this.size,
            this.searchParam
          )
        )
        .subscribe((res: any) => {
          this.Courses = res.courses;
          this.totalCount = res.totalCount;
        });
    }
    if (selectedValue == 'Free Courses') {
      this.loader
        .showLoader(
          this.courseService.fetchFreeCoursesWithPagination(
            page,
            this.size,
            this.searchParam
          )
        )
        .subscribe((res: any) => {
          this.Courses = res.courses;
          this.totalCount = res.totalCount;
        });
    }

    if (selectedValue == 'New Courses') {
      this.loader
        .showLoader(
          this.courseService.fetchNewCoursesWithPagination(
            page,
            this.size,
            this.searchParam
          )
        )
        .subscribe((res: any) => {
          this.Courses = res.courses;
          this.totalCount = res.totalCount;
        });
    }

    if (selectedValue == 'Trending Courses') {
      this.loader
        .showLoader(
          this.courseService.fetchTrendingCoursesWithPagination(
            page,
            this.size,
            this.searchParam
          )
        )
        .subscribe((res: any) => {
          this.Courses = res.courses;
          this.totalCount = res.totalCount;
        });
    }
    if (selectedValue == 'Popular Courses') {
      this.loader
        .showLoader(
          this.courseService.fetchPopularCoursesWithPagination(
            page,
            this.size,
            this.searchParam
          )
        )
        .subscribe((res: any) => {
          this.Courses = res.courses;
          this.totalCount = res.totalCount;
        });
    }
  }

  changePage(page: number) {
    this.page = page;
    this.fetchCourses(this.selectedValue, this.page);
  }

  changeSize(event: number) {
    this.size = event;
    this.fetchCourses(this.selectedValue, 0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.fetchCourses(this.selectedValue, this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter(selectedValue: any, page: any) {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.courseService.fetchAllCoursesList(
                  page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.Courses = value.courses;
          this.totalCount = value.totalCount;
        });
      });
  }

  short(type: any, event?: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
