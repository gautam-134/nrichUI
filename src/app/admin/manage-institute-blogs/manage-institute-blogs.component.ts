import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Subject,
  Observable,
  Subscription,
  fromEvent,
  debounceTime,
} from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { BlogsVO } from 'src/app/model/BlogsVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-institute-blogs',
  standalone: true,
  imports: [],
  templateUrl: './manage-institute-blogs.component.html',
  styleUrl: './manage-institute-blogs.component.scss'
})
export class ManageInstituteBlogsComponent implements OnInit {
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
  constructor(
    private loader: LoaderService,
    private router: Router,
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
    this.refresh(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.commonService.fetchAllInstituteBlogs(
          page,
          this.size,
          this.searchParam
        )
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

  addBlog() {
    this.router.navigate([`${AuthService.getModulePrefix}/add-blog`]);
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
            this.commonService.fetchAllInstituteBlogs(
              0,
              this.size,
              data.target.value
            )
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

  editBlog(element: any) {
    this.router.navigate([`${AuthService.getModulePrefix}/add-blog`], {
      queryParams: { id: element.idBlog },
    });
  }

  onDelete(id: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Blog?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.showLoader(this.commonService.deleteAchiever(id)).subscribe(
          (res) => {
            this.alertService.successAlert('Deleted');
            this.refresh(this.page);
          },
          (err) => {
            this.alertService.errorAlert(err.error.message);
          }
        );
      } else if (result.isDenied) {
        this.alertService.okErrorAlert('Blog not deleted');
      }
    });
  }

  viewBlog(element: any) {}

  updateFeatured(id: any) {
    this.loader
      .showLoader(this.commonService.updateInstituteBlogFeature(id))
      .subscribe();
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.commonService.updateInstituteBlogDisplayOrder(
          displayOrder,
          elementId
        )
      )
      .subscribe({
        next: (data: any) => {},
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
