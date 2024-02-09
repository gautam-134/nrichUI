import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { SubscriptionPlanVO } from 'src/app/model/SubscriptionPlanVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';

@Component({
  selector: 'app-institutes-plan',
  standalone: true,
  imports: [],
  templateUrl: './institutes-plan.component.html',
  styleUrl: './institutes-plan.component.scss'
})
export class InstitutesPlanComponent implements OnInit, OnDestroy {
  institutes: SubscriptionPlanVO[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('planSearch') plan!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private loader: LoaderService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
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
        this.subscriptionService.fetchAllCurrentActivePlans(page, this.size)
      )
      .subscribe({
        next: (data) => {
          this.institutes = data.institutes;
          this.totalCount = data.totalCount;
        },
        error: (error) => {
          this.alertService.errorAlert('Error while fetching plans');
        },
      });
  }

  editPlan(planId: number) {
    this.router.navigate([`${AuthService.getModulePrefix}/edit-plan`], {
      queryParams: { id: planId },
    });
  }

  search() {
    this.searchSubscription = fromEvent(this.plan.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.subscriptionService.fetchAllCurrentActivePlans(
              this.page,
              this.size,
              data.target.value
            )
          )
          .subscribe({
            next: (data) => {
              this.institutes = data.institutes;
              this.totalCount = data.totalCount;
            },
            error: (error) => {
              this.alertService.errorAlert('Error while fetching plans');
            },
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
}
