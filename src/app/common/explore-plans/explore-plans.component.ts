import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../model/ApiResponse';
import { SubscriptionPlanTransactionHistory } from '../../model/Subscription';
import { addOnPlan, addOnPlanFeatures } from '../../model/addOn.model';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { MatDialog } from '@angular/material/dialog';
import { AddonFeaturesPreviewComponent } from '../../StandaloneComponents/addon-features-preview/addon-features-preview.component';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-explore-plans',
   
  templateUrl: './explore-plans.component.html',
  styleUrl: './explore-plans.component.scss'
})
export class ExplorePlansComponent implements OnInit {
  annualPlans: any[] = [];
  addons: addOnPlan[] = [];
  transaction: SubscriptionPlanTransactionHistory[] = [];

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private alertService: SwalAlertService,
    private matDailog: MatDialog,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader
      .showLoader(this.subscriptionService.getSubscriptionplan())
      .subscribe({
        next: (data: any) => {
          this.annualPlans = data.teacherPricingPlans;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Fetching Active Plans');
        },
      });
    this.loader
      .showLoader(this.subscriptionService.fetchActiveAddons())
      .subscribe({
        next: (data: ApiResponse) => {
          this.addons = data.body;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Fetching Active Add ons');
        },
      });
    this.loader
      .showLoader(this.subscriptionService.fetchSubscriptionPlanHistory())
      .subscribe({
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

  buyAddons(id: number) {
    this.router.navigate(['/checkout'], {
      queryParams: { id: id, type: 'addon' },
    });
    return;
    this.router.navigate(['/login']);
  }

  showFeatures(features: addOnPlanFeatures[]) {
    this.matDailog.open(AddonFeaturesPreviewComponent, {
      data: {
        features: features.map(
          (value: addOnPlanFeatures) => value.featureDescription
        ),
      },
      panelClass: 'addon-matdailog',
    });
  }
}
