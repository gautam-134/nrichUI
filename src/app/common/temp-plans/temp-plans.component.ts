import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addOnPlan } from 'src/app/model/addOn.model';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SubscriptionPlanTransactionHistory } from 'src/app/model/Subscription';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';

@Component({
  selector: 'app-temp-plans',
  standalone: true,
  imports: [],
  templateUrl: './temp-plans.component.html',
  styleUrl: './temp-plans.component.scss'
})
export class TempPlansComponent implements OnInit {
  annualPlans: any[] = [];
  transaction: SubscriptionPlanTransactionHistory[] = [];
  addons: addOnPlan[] = [];

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.subscriptionService.getActiveAddons().subscribe({
      next: (data: addOnPlan[]) => {
        this.addons = data;
      },
      error: (error: any) => {},
    });
    this.subscriptionService.getSubscriptionplan().subscribe({
      next: (data: any) => {
        this.annualPlans = data.teacherPricingPlans;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error While Fetching Active Plans');
      },
    });
    this.subscriptionService.fetchSubscriptionPlanHistory().subscribe({
      next: (data: ApiResponse) => {
        this.transaction = data.body;
      },
      error: (HttpErrorResponse) => {
        this.alertService.errorAlert(
          'Error While Fetching Transaction History'
        );
      },
    });
  }

  purchase(id: number, price: number) {
    this.router.navigate(['/checkout'], {
      queryParams: { id: id, price: price, type: 'pricingplan' },
    });
  }

  purchaseAddon(id: number, price: number) {
    this.router.navigate(['/checkout'], {
      queryParams: { id: id, price: price, type: 'addon' },
    });
  }
}
