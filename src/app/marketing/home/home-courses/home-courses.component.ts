import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { DemoClass } from 'src/app/model/DemoClass';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-home-courses',
  standalone: true,
  imports: [],
  templateUrl: './home-courses.component.html',
  styleUrl: './home-courses.component.scss'
})
export class HomeCoursesComponent implements OnInit {
  allCourses: MobileCourseVO[] = [];
  freeCourses: MobileCourseVO[] = [];
  newCourses: MobileCourseVO[] = [];
  trendingCourses: MobileCourseVO[] = [];
  popularCourses: MobileCourseVO[] = [];
  webinar: DemoClass[] = [];
  tab: number = 1;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader
      .showLoader(this.courseService.fetchAllCoursesWithPagination(0, 10))
      .subscribe((res: any) => {
        this.allCourses = res.courses;
      });

    this.loader
      .showLoader(this.courseService.fetchFreeCourses())
      .subscribe((res: MobileCourseVO[]) => {
        this.freeCourses = res;
        // this.allCourses.push(...this.freeCourses);
      });

    this.loader
      .showLoader(this.courseService.fetchNewCourses())
      .subscribe((res: MobileCourseVO[]) => {
        this.newCourses = res;
        // this.allCourses.push(...this.newCourses);
      });

    this.loader
      .showLoader(this.courseService.fetchTrendingCourses())
      .subscribe((res: MobileCourseVO[]) => {
        this.trendingCourses = res;
        // this.allCourses.push(...this.trendingCourses);
      });

    this.loader
      .showLoader(this.courseService.fetchPopularCourses())
      .subscribe((res: MobileCourseVO[]) => {
        this.popularCourses = res;
        // this.allCourses.push(...this.popularCourses);
      });
    this.loader
      .showLoader(this.courseService.fetchWebinars())
      .subscribe((res: DemoClass[]) => {
        this.webinar = res;
      });
  }

  viewAll() {
    switch (this.tab) {
      case 1:
        this.router.navigate(['/course-list'], {
          queryParams: { search: 'allCourses' },
        });
        break;
      case 2:
        this.router.navigate(['/course-list'], {
          queryParams: { search: 'newCourses' },
        });
        break;
      case 3:
        this.router.navigate(['/course-list'], {
          queryParams: { search: 'freeCourses' },
        });
        break;
      case 4:
        this.router.navigate(['/course-list'], {
          queryParams: { search: 'trendingCourses' },
        });
        break;
      case 5:
        this.router.navigate(['/course-list'], {
          queryParams: { search: 'popularCourses' },
        });
        break;
      case 6:
        this.router.navigate(['/course-list'], {
          queryParams: { search: 'webinar' },
        });
        break;
      default:
        break;
    }
  }
}

