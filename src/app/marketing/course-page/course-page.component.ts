import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CourseReviewsAndRatingsVO } from 'src/app/model/CourseReviewsAndRatingsVO';
import { CourseVO } from 'src/app/model/CourseVO';
import { DemoClass } from 'src/app/model/DemoClass';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course/course.service';
import { ReviewsComponent } from '../shared/reviews/reviews.component';

@Component({
  selector: 'app-course-page',
  standalone: true,
  imports: [],
  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.scss'
})
export class CoursePageComponent implements OnInit {
  courseDetails?: CourseVO;
  pricingPlan: PricingPlanVO[] = [];
  reviewAndRatings: CourseReviewsAndRatingsVO[] = [];
  demoClasses: DemoClass[] = [];
  relatedCourses: MobileCourseVO[] = [];
  // recommendedCourses: MobileCourseVO[] = [];
  panelOpenState = false;
  id!: string;
  courses!: MobileCourseVO[];
  metatages!: any[];
  isLogin: boolean = false;
  courseName: any;
  metadescription: string = '';
  page:number=0;
  size:number=3;
  roleType!: string;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    protected authService: AuthService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}
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
    this.roleType = AuthService.getRoleType;
    this.isLogin = this.authService.isLoggin();
    this.route.queryParams.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.courseName = params['name'];
        this.fetchCourseDetails(this.id);
        this.fetchPricingPlans(this.id);
        this.fetchCourseReviewsAndRatings(this.id);
        this.fetchDemoClasses(this.id);
        // this.fetchRecommendedCourses(this.id);
        this.fetchRelatedCourses(this.id);
      } else {
        this.alertService.errorAlert('Course not found');
        this.router.navigate(['/']);
      }
    });
  }

  fetchCourseDetails(id: string) {
    this.courseService.fetchCourseDetails(Number(id)).subscribe((res) => {
      this.courseDetails = res;
      this.setTitle(res.courseName);
      if (res.metaTags !== null) {
        this.metatages = res.metaTags?.split(',');
        this.setMetaTags({
          name: 'tags',
          content: this.metatages.toString(),
        });
      }
      if (res.metaDescription !== null) {
        this.metadescription = res.metaDescription;
        this.setMetaTags({
          name: 'description',
          content: this.metadescription,
        });
      }
    });
  }

  fetchPricingPlans(id: string) {
    this.courseService.fetchPricingPlan(Number(id)).subscribe((res) => {
      this.pricingPlan = res;
    });
  }

  fetchCourseReviewsAndRatings(id: string) {
    this.courseService
      .fetchCourseReviewsAndRatings(Number(id),this.page,this.size)
      .subscribe((res:any) => {
        this.reviewAndRatings = res.courseReviews;
      });
  }

  fetchDemoClasses(id: string) {
    this.courseService.fetchDemoClasses(Number(id)).subscribe((res) => {
      this.demoClasses = res;
    });
  }
  refresh() {
    this.route.queryParams.subscribe((params: Params) => {
      this.fetchCourseReviewsAndRatings(params['id']);
    });
  }

  // fetchRecommendedCourses(id: string) {
  //   this.courseService.fetchRecommendedCourses(Number(id)).subscribe((res) => {
  //     this.recommendedCourses = res;
  //   });
  // }

  fetchRelatedCourses(id: string) {
    this.courseService.fetchRelatedCourses(Number(id)).subscribe((res) => {
      this.relatedCourses = res;
    });
  }

  refreshDemoClassList() {
    this.fetchDemoClasses(this.id);
  }

  review(event: any) {}

  enroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ReviewsComponent, {
      data: { idCourse: this.courseDetails?.idCourse },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.fetchCourseDetails(this.id);
      this.fetchCourseReviewsAndRatings(this.id);
    });
  }

  viewAll() {
    this.router.navigate(['/course-list'], {
      queryParams: { search: 'allCourses' },
    });
  }
}
