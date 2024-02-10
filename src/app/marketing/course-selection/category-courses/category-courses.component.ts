import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MobileCourseVO } from '../../../model/MobileCourseVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-category-courses',
   
  templateUrl: './category-courses.component.html',
  styleUrl: './category-courses.component.scss'
})
export class CategoryCoursesComponent implements OnInit {
  categoryCourses: MobileCourseVO[] = [];
  config!: number;
  pageNumber: number = 0;
  size: number = 3;
  totalElement!: number;
  categoryId!: number;
  subSubCategoryId!: number;
  name!: string;
  isCategoryLoaded: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.subSubCategoryId = params['id'];
      this.categoryId = params['categoryId'];
      this.name = params['name'];
      this.fetchCategoryCourses();
    });
  }

  fetchCategoryCourses() {
    this.isCategoryLoaded = false;
    this.categoryCourses = [];
    this.courseService
      .fetchCategoryCourses(
        this.categoryId,
        this.subSubCategoryId,
        this.name,
        this.pageNumber,
        this.size
      )
      .subscribe({
        next: (data: { courses: MobileCourseVO[]; totalCount: number }) => {
          this.isCategoryLoaded = true;
          this.categoryCourses = data.courses;
          this.totalElement = data.totalCount;
        },
        error: (error: HttpErrorResponse) => {
          this.isCategoryLoaded = true;
          this.alertService.errorAlert('Error while fetching courses');
        },
      });
  }

  pageChange($event: any) {
    this.pageNumber = $event;
    window.scrollTo(0, 0);
    this.fetchCategoryCourses();
  }
}
