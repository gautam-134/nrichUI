import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Subject, Subscription } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { SupportDetails } from '../../model/SupportDetails';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course/course.service';
import { SupportService } from '../../services/Support/support.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
   
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {
  change: number = 0;
  courses: [] = [];
  page: number = 0;
  size: number = 5;
  totalCourses!: number;
  typeOfShorting: boolean = true;
  type: any;
  @ViewChild('displayOrder') displayOrder!: ElementRef;
  @ViewChild('courseSearch') courseSearch!: ElementRef;
  eventsSubject: Subject<void> = new Subject<void>();
  searchSubscription!: Subscription;
  supportDetails!: SupportDetails[];
  constructor(
    private courseService: CourseService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private supportService: SupportService
  ) {}
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    this.search();
  }

  ngOnInit(): void {
    this.refresh(this.page);
    this.supportDetails = this.supportService.courseListingSupport();
  }

  search() {
    this.searchSubscription = fromEvent(
      this.courseSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.courseService.fetchCourses(0, this.size, data.target.value)
          )
          .subscribe((data: any) => {
            this.courses = data.courses;
            this.totalCourses = data.total_courses;
          });
      });
  }

  refresh(page: number) {
    this.loader
      .showLoader(this.courseService.fetchCourses(page, this.size))
      .subscribe((data: any) => {
        this.courses = data.courses;
        this.totalCourses = data.total_courses;
      });
  }

  editCourse(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/create-course'], {
      queryParams: { id: id },
    });
  }

  addCourse() {
    this.router.navigate([AuthService.getModulePrefix + '/create-course']);
  }
  addItem(e: any) {
    this.refresh(0);
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.courseService.updateInstituteCourseDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {
          // this.displayOrder.nativeElement.focusout();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  featured(element: any, event: any) {
    this.courseService.updateInstituteCourseFeaturedFlag(element.id).subscribe({
      next: (data: any) => {},
      error: (error: HttpErrorResponse) => {
        element.instituteIsFeatured = !event.target.checked;
        this.alertService.errorAlert('Something went wrong!');
      },
    });
  }

  enrolledStudents(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/enrolled-students'], {
      queryParams: { id: id },
    });
  }

  deleteCourse(id: number) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to disable this course?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Disable',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Disable',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.showLoader(this.courseService.deleteCourse(id)).subscribe({
          next: (res: any) => {
            this.alertService.successAlert('Course Disable Successfully !');
            this.refresh(0);
            this.eventsSubject.next();
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.errorAlert('Something went wrong!');
          },
        });
      } else if (result.isDenied) {
      }
    });
  }

  short(type: any) {
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