import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { AllUsers } from 'src/app/model/AllUsers';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss'
})
export class AdminDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  adminId!: number;
  details: AllUsers[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('adminSearch') adminSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private masterService: MasterService,
    private loader: LoaderService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.adminId = this.activatedRoute.snapshot.queryParams['id'];
    this.refresh(this.page);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.search();
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.masterService.getAdminDetails(this.adminId, page, this.size)
      )
      .subscribe({
        next: (data) => {
          this.details = data.adminDetails;
          this.totalCount = data.totalCount;
        },
      });
  }

  search() {
    this.searchSubscription = fromEvent(this.adminSearch.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.masterService.getAdminDetails(
              this.adminId,
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.details = data.adminDetails;
            this.totalCount = data.totalCount;
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

  goBack() {
    this.location.back();
  }
}
