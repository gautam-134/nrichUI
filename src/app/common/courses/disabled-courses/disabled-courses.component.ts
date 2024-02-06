import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disabled-courses',
  standalone: true,
  imports: [],
  templateUrl: './disabled-courses.component.html',
  styleUrl: './disabled-courses.component.scss'
})
export class DisabledCoursesComponent implements OnInit {
  change: number = 0;
  courses: [] = [];
  page: number = 0;
  size: number = 5;
  totalCourses!: number;
  typeOfShorting: boolean = true;
  type: any;
  searchSubscription!: Subscription;
  @ViewChild('displayOrder') displayOrder!: ElementRef;
  @ViewChild('courseSearch') courseSearch!: ElementRef;
  @Input() events!: Observable<void>;
  @Output() newItemEvent = new EventEmitter<boolean>();
  eventsSubscription: Subscription | undefined;
  constructor(
    private courseService: CourseService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService
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
    this.eventsSubscription = this.events.subscribe(() =>
      this.refresh(this.page)
    );
    this.refresh(this.page);
  }
  refresh(page: number) {
    this.loader
      .showLoader(this.courseService.fetchDisabledCourses(page, this.size))
      .subscribe((data: any) => {
        this.courses = data.courses;
        this.totalCourses = data.total_courses;
      });
  }

  search() {
    this.searchSubscription = fromEvent(
      this.courseSearch?.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.courseService.fetchDisabledCourses(
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.courses = data.courses;
            this.totalCourses = data.total_courses;
          });
      });
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
          this.alertService.errorAlert('Something went wrong!');
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

  editCourse(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/create-course'], {
      queryParams: { id: id },
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
        'Do you want to retrieve this course?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Retrieve',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Retrieve',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.courseService.retrieveCourse(id))
          .subscribe({
            next: (res: any) => {
              this.alertService.successAlert('Course Retrieve Successfully !');
              this.refresh(0);
              this.newItemEvent.emit(true);
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