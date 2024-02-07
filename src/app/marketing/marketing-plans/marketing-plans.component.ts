import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { addOnPlan, addOnPlanFeatures } from 'src/app/model/addOn.model';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SubscriptionPricingPlans } from 'src/app/model/subscriptionplan.model';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { AddonFeaturesPreviewComponent } from 'src/app/StandaloneComponents/addon-features-preview/addon-features-preview.component';

@Component({
  selector: 'app-marketing-plans',
  standalone: true,
  imports: [],
  templateUrl: './marketing-plans.component.html',
  styleUrl: './marketing-plans.component.scss'
})
export class MarketingPlansComponent implements OnInit {
  @ViewChild('myDiv') myDiv!: ElementRef;
  annualPlans: SubscriptionPricingPlans[] = [];
  addOns: addOnPlan[] = [];
  isLogin: boolean = false;
  constructor(
    private subscriptionService: SubscriptionService,
    private alertService: SwalAlertService,
    private authService: AuthService,
    private router: Router,
    private matDailog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLogin = this.authService.isLoggin();
    this.getPlans();
    this.getAddons();
  }

  getPlans() {
    this.subscriptionService.getSubscriptionplan().subscribe({
      next: (data: any) => {
        this.annualPlans = data.teacherPricingPlans;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error While Fetching Active Plans');
      },
    });
  }

  getAddons() {
    this.subscriptionService.fetchActiveAddons().subscribe({
      next: (data: ApiResponse) => {
        this.addOns = data.body;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(
          'Something went wrong while fetching addons list'
        );
      },
    });
  }

  buyPlan(id: number) {
    if (this.isLogin) {
      this.router.navigate(['/checkout'], {
        queryParams: { id: id, type: 'pricingplan' },
      });
      return;
    }
    this.router.navigate(['/login']);
  }

  buyAddons(id: number) {
    if (this.isLogin) {
      this.router.navigate(['/checkout'], {
        queryParams: { id: id, type: 'addon' },
      });
      return;
    }
    this.router.navigate(['/login']);
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    slideTransition: 'linear',
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,

    navText: ['', ''],

    responsive: {
      0: {
        items: 1,
      },
      900: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
    nav: false,
  };

  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    slideTransition: 'linear',
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,
    rtl: true,

    navText: ['', ''],

    responsive: {
      0: {
        items: 1,
      },
      900: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
    nav: false,
  };

  customOptions3: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    slideTransition: 'linear',
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,

    navText: ['', ''],

    responsive: {
      0: {
        items: 1,
      },
      900: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
    nav: false,
  };

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

  scrollToMyDiv() {
    this.myDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
