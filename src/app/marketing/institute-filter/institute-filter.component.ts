import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { CourseCategoryVO } from '../../model/categories.model';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CommonService } from '../../services/common/common.service';
import { CourseService } from '../../services/course/course.service';

@Component({
  selector: 'app-institute-filter',
   
  templateUrl: './institute-filter.component.html',
  styleUrl: './institute-filter.component.scss'
})
export class InstituteFilterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  name!: string;
  categoryName!: string;
  categoryId!: number | undefined;
  resultName: string[] = [];
  instituteList: any;
  config!: number;
  pageNumber: number = 0;
  size: number = 10;
  @ViewChild('instituteSearch') instituteSearch!: ElementRef;
  categoryList: CourseCategoryVO[] = [];
  searchSubscription!: Subscription;
  flag = false;
  constructor(
    private commonService: CommonService,
    private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private alertService: SwalAlertService
  ) {}
  ngAfterViewInit(): void {
    this.search();
    this.name = this.activatedRoute.snapshot.queryParams['name'];
    if (this.name) {
      this.instituteSearch.nativeElement.value = this.name;
      this.filterInstitute();
    }
  }
  ngOnDestroy(): void {
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.searchCourseCategory();
    this.filterInstitute();
  }

  search() {
    this.searchSubscription = fromEvent(
      this.instituteSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.name = data.target.value;
        if (this.name.length > 3) this.searchInstitutename();
      });
  }

  nextPage($event: any) {
    this.pageNumber = $event;
    if (this.flag == false) {
      this.filterInstitute();
    } else {
      this.nearestInstitutes();
    }
    window.scrollTo(0, 0);
  }

  searchInstitutename() {
    this.commonService
      .searchInstituteName(this.name)
      ?.subscribe((data: string[]) => {
        this.resultName = data;
      });
  }
  fetchInstituteByCategory(event: any) {
    const category = this.categoryList.find(
      (cl) => cl.categoryName === event.target.value
    );
    this.categoryId = category?.idCourseCategory;
  }

  searchInstitutes() {
    this.flag = false;
    this.pageNumber = 0;
    this.filterInstitute();
    window.scrollTo(0, 0);
  }

  nearestInstitutes() {
    this.flag = true;
    navigator.geolocation.getCurrentPosition((position) => {
      this.loader
        .showLoader(
          this.commonService.nearestInstitutes(
            position.coords.latitude,
            position.coords.longitude,
            this.pageNumber,
            this.size
          )
        )
        .subscribe({
          next: (data) => {
            this.instituteList = data.institutions;
            this.config = data.total_count;
          },
          error: (error) => {
            this.alertService.errorAlert(
              'Error while fetching nearest institutes'
            );
          },
        });
    });
  }

  filterInstitute() {
    this.loader
      .showLoader(
        this.commonService.filterInstitute(
          this.name,
          this.categoryId,
          this.pageNumber,
          this.size
        )
      )
      .subscribe((data: { institutions: any; total_count: number }) => {
        this.instituteList = data.institutions;
        this.config = data.total_count;
      });
  }

  searchCourseCategory() {
    this.loader
      .showLoader(this.courseService.fetchFeatureCategoryList(false))
      .subscribe({
        next: (data: CourseCategoryVO[]) => {
          this.categoryList = data;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }
}