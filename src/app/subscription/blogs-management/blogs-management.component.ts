import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  debounceTime,
  fromEvent,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { BlogsVO } from 'src/app/model/BlogsVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';


@Component({
  selector: 'app-blogs-management',
  standalone: true,
  imports: [],
  templateUrl: './blogs-management.component.html',
  styleUrl: './blogs-management.component.scss'
})
export class BlogsManagementComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  typeOfShorting: boolean = true;
  type: any;
  blogsList!: BlogsVO[];
  @ViewChild('blogSearch') notificationSearch!: ElementRef;
  searchSubscription!: Subscription;
  roleType!: string;
  constructor(
    private loader: LoaderService,
    private commonService: CommonService,
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
    this.roleType = AuthService.getRoleType;
    this.refresh(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.commonService.fetchAllBlogs(page, this.size, this.searchParam)
      )
      .subscribe((res: any) => {
        this.blogsList = res.blogsList;
        this.totalCount = res.totalCount;
      });
  }

  changePage(page: number) {
    this.page = page;
    this.refresh(this.page);
  }

  changeSize(event: number) {
    this.size = event;
    this.refresh(0);
  }

  updateFeatured(id: any) {
    this.loader
      .showLoader(this.commonService.updateBlogFeature(id))
      .subscribe();
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.commonService.updateBlogDisplayOrder(displayOrder, elementId)
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

  search() {
    this.searchSubscription = fromEvent(
      this.notificationSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.commonService.fetchAllBlogs(0, this.size, data.target.value)
          )
          .subscribe((data: any) => {
            this.blogsList = data.blogsList;
            this.totalCount = data.totalCount;
          });
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
