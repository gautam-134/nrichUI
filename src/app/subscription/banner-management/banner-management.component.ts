import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { BannerVO } from 'src/app/model/BannerVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { BannerService } from 'src/app/services/banner/banner.service';

@Component({
  selector: 'app-banner-management',
  standalone: true,
  imports: [],
  templateUrl: './banner-management.component.html',
  styleUrl: './banner-management.component.scss'
})
export class BannerManagementComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  banners: BannerVO[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('notificationSearch') notificationSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private bannerService: BannerService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(this.bannerService.getBanners(page, this.size))
      .subscribe({
        next: (data) => {
          this.banners = data.banners;
          this.totalCount = data.totalCount;
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching banners');
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
            this.bannerService.getBanners(0, this.size, data.target.value)
          )
          .subscribe((data: any) => {
            this.banners = data.banners;
            this.totalCount = data.totalCount;
          });
      });
  }

  disableBanner(element: any, event: any) {
    this.bannerService.changeStatus(element.id).subscribe({
      next: (data: any) => {},
      error: (error: HttpErrorResponse) => {
        element.featured = !event.target.checked;
        this.alertService.errorAlert('Error while updating status!');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.search();
  }

  pageChange(event: any) {
    this.refresh(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }
}