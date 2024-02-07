import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CourseCategoryVO } from 'src/app/model/categories.model';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CourseService } from 'src/app/services/course/course.service';

@Component({
  selector: 'app-sub-sub-categories',
  standalone: true,
  imports: [],
  templateUrl: './sub-sub-categories.component.html',
  styleUrl: './sub-sub-categories.component.scss'
})
export class SubSubCategoriesComponent implements OnInit {
  subSubCategories: CourseCategoryVO[] = [];
  config!: number;
  pageNumber: number = 0;
  maxPages: number = 10;
  isCategoryLoaded: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['id']) {
        this.getSubSubCategories(params['id']);
      }
    });
  }

  nextPage($event: any) {
    this.pageNumber = $event;
    // this.loader
    //   .showLoader(
    //     this.teacherService.fetchTeachersListWithPagination(this.pageNumber)
    //   )
    //   .subscribe((data: any) => {
    //     this.teachersList = data.teachers;
    //     this.config = data.totalCount;
    //   });
  }

  getSubSubCategories(idSubSubCategory: string) {
    this.isCategoryLoaded = false;
    this.subSubCategories = [];
    this.courseService
      .getSubSubCategories(Number(idSubSubCategory), false)
      .subscribe({
        next: (res: any) => {
          this.isCategoryLoaded = true;
          this.subSubCategories = res.subSubCategories;
        },
        error: (error: HttpErrorResponse) => {
          this.isCategoryLoaded = true;
          this.alertService.errorAlert(
            'Error While Fetching Sub Sub Categories'
          );
        },
      });
  }

  getFirstChar(str: any) {
    var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var arr = str.split(' ', 2);
    var newStr = '';
    for (var i = 0; i < arr.length; i++) {
      newStr += arr[i].charAt(0);
      if (numArr.includes(arr[i].charAt(1))) {
        newStr += arr[i].charAt(1);
      }
    }
    return newStr;
  }

  // pageChanged(event: any) {
  //   this.config.currentPage = event;
  // }
}
