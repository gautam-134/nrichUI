import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PricingPlanVO } from '../../../model/PricingPlanVO';
import { AuthService } from '../../../services/auth.service';
import { BuyCourseComponent } from '../buy-course/buy-course.component';

@Component({
  selector: 'app-pricing-plans',
   
  templateUrl: './pricing-plans.component.html',
  styleUrl: './pricing-plans.component.scss'
})
export class PricingPlansComponent implements OnInit {
  @Input('pricingPlan') pricingPlan: PricingPlanVO[] = [];
  @Input('paymentType') paymentType: string | undefined;
  @Input('courseName') courseName:string | undefined;
  isLogin!: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLogin = this.auth.isLoggin();
  }

  login() {
    if (this.isLogin) {
      return;
    }
    this.router.navigate(['/login']);
  }

  pricingPlanInfo(plan: PricingPlanVO) {
     this.dialog.open(BuyCourseComponent, {
      data: {
        pricingPlanId: plan.idPricingPlan,
        discountPrice:plan.discountPrice,
        price:plan.price,
        paymentType:this.paymentType,
        courseName:this.courseName,
      },
    });
  }
}

