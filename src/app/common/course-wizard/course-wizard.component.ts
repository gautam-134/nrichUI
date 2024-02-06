import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { BatchVO } from 'src/app/model/BatchVO';
import { Course } from 'src/app/model/Course';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { SupportDetails } from 'src/app/model/SupportDetails';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CourseWizardService } from 'src/app/services/course/course-wizard.service';
import { CourseService } from 'src/app/services/course/course.service';
import { SupportService } from 'src/app/services/Support/support.service';

@Component({
  selector: 'app-course-wizard',
  standalone: true,
  imports: [],
  templateUrl: './course-wizard.component.html',
  styleUrl: './course-wizard.component.scss'
})
export class CourseWizardComponent implements OnInit, OnDestroy {
  tab: number = 1;
  togglePlanForm: boolean = true;
  tabSubscription!: Subscription;
  pricingPlanSubscription!: Subscription;
  batchSubscription!: Subscription;
  planSubscription!: Subscription;
  toggleBatchForm: boolean = true;
  isEdit: boolean = false;
  supportDetails!: SupportDetails[];
  constructor(
    private courseWizard: CourseWizardService,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private supportService: SupportService
  ) {}
  ngOnDestroy(): void {
    if (this.tabSubscription) {
      this.tabSubscription.unsubscribe();
    }
    if (this.pricingPlanSubscription) {
      this.pricingPlanSubscription.unsubscribe();
    }
    if (this.batchSubscription) {
      this.batchSubscription.unsubscribe();
    }
    this.courseWizard.tabSubject$.next(1);
    this.courseWizard.setCourse(new Course());
    this.courseWizard.enableEditMode(false);
  }

  ngOnInit() {
    this.supportDetails = this.supportService.courseCreationSupport();
    if (this.activatedRoute.snapshot.queryParams['id']) {
      this.isEdit = true;
      this.loader
        .showLoader(
          this.courseService.fetchCourse(
            this.activatedRoute.snapshot.queryParams['id']
          )
        )
        .subscribe(
          (data: Course) => {
            this.courseWizard.enableEditMode(true);
            this.courseWizard.setCourse(data);
            this.courseWizard.courseSubject$.next(true);
          },
          (error: HttpErrorResponse) => {
            this.alertService.errorAlert('Something went wrong!');
          }
        );
    } else {
      this.isEdit = false;
      this.courseWizard.courseSubject$.next(false);
    }
    this.tabSubscription = this.courseWizard.tabSubject$.subscribe(
      (data: number) => {
        this.tab = data;
      }
    );
    this.batchSubscription = this.courseWizard.batchSubject$.subscribe(
      (id: BatchVO | boolean) => {
        this.toggleBatchForm = typeof id == 'boolean' ? id : false;
      }
    );
    this.planSubscription = this.courseWizard.planSubject$.subscribe(
      (data: PricingPlanVO | boolean) => {
        this.togglePlanForm = typeof data == 'boolean' ? data : false;
      }
    );
    this.getTeachersList();
  }

  getTeachersList() {
    this.loader
      .showLoader(this.courseService.fetchTeachersForCourseMapping())
      .subscribe({
        next: (data: any[]) => {
          this.courseWizard.setTeachers(data);
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  nextFromTab(tab: number) {
    this.courseWizard.nextFromTab(tab);
  }
}
