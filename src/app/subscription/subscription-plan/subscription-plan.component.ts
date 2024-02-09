import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, debounceTime, map, of } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { SubscriptionPricingPlans } from 'src/app/model/subscriptionplan.model';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { AddEditPlanComponent } from './add-edit-plan/add-edit-plan.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
@Component({
  selector: 'app-subscription-plan',
  standalone: true,
  imports: [],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.scss'
})
export class SubscriptionPlanComponent implements OnInit {
  subscriptionplanlist: SubscriptionPricingPlans[] = [];
  sacCodes: number[] = [];
  open!: number;
  typeOfShorting: boolean = true;
  type: any;
  totalCount: any;
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;
  constructor(
    private subscriptionplan: SubscriptionService,
    private dialog: MatDialog,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.plans(this.page);
    this.applyFilter();
    this.fetchSacCodes();
  }
  plans(page: number) {
    this.loader
      .showLoader(
        this.subscriptionplan.getPlans(page, this.size, this.searchParam)
      )
      .subscribe((data: any) => {
        this.subscriptionplanlist = data.body.subscriptionPlans;
        this.totalCount = data.body.total_count;
      });
  }
  editPlan(row: SubscriptionPricingPlans) {
    this.dialog
      .open(AddEditPlanComponent, {
        disableClose: true,
        data: {
          row: row,
          isEdit: true,
          sacCodes: this.sacCodes,
        },
      })
      .afterClosed()
      .subscribe((res4) => this.plans(this.page));
  }
  changePage(page: number) {
    this.page = page;
    this.plans(this.page);
  }

  changeSize(event: number) {
    this.size = event;
    this.plans(0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.plans(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }
  addplans() {
    this.dialog
      .open(AddEditPlanComponent, {
        disableClose: true,
        data: { isEdit: false, sacCodes: this.sacCodes },
      })
      .afterClosed()
      .subscribe((res4) => this.plans(this.page));
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.subscriptionplan.getPlans(
                  this.page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.subscriptionplanlist = value.body.subscriptionPlans;
          this.totalCount = value.body.total_count;
        });
      });
  }
  fetchSacCodes() {
    this.loader.showLoader(this.subscriptionplan.fetchSacCodes()).subscribe({
      next: (data: ApiResponse) => {
        this.sacCodes = data.body;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert(error.error.message);
      },
    });
  }
}
