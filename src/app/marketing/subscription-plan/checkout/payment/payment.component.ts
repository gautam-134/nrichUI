import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { addOnPlan, addOnPlanFeatures } from '../../../../model/addOn.model';
import {
  planlist,
  SubscriptionPlanTransactionVO,
} from '../../../../model/subscription-PaymentVOs';
import { CheckoutService } from '../../../../services/checkout.service';
import { AddonFeaturesPreviewComponent } from '../../../../StandaloneComponents/addon-features-preview/addon-features-preview.component';

@Component({
  selector: 'app-payment',
   
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {
  planList!: planlist | undefined;
  coupon!: string;
  subscriptionPlanTransaction: SubscriptionPlanTransactionVO | undefined;
  transactionSubject!: Subscription;
  planSubscription!: Subscription;
  addonSubscription!: Subscription;
  addons: addOnPlan[] = [];
  selectedAddonsId: number[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private matDialog: MatDialog
  ) {}

  reinitalizeCoupon() {
    this.coupon = '';
    this.checkoutService.reinitializeCouponState(
      this.subscriptionPlanTransaction?.id
    );
  }

  ngOnDestroy(): void {
    if (this.transactionSubject) this.transactionSubject.unsubscribe();
    if (this.planSubscription) this.planSubscription.unsubscribe();
    if (this.addonSubscription) this.addonSubscription.unsubscribe();
  }

  addAddons(id: number) {
    if (this.selectedAddonsId.includes(id)) {
      const index = this.selectedAddonsId.findIndex((addOn) => addOn == id);
      this.selectedAddonsId.splice(index, 1);
    } else {
      this.selectedAddonsId.push(id);
    }
    this.checkoutService.purchaseAddons$.next(id);
  }

  pay() {
    this.checkoutService.paymentSubject$.next();
  }

  goBack() {
    this.checkoutService.tabSubject$.next(1);
  }

  ngOnInit(): void {
    this.planSubscription = this.checkoutService.planListSubject$.subscribe({
      next: (data: planlist | undefined) => {
        this.planList = data;
      },
    });
    this.transactionSubject =
      this.checkoutService.createOrderSubject$.subscribe(
        (data: SubscriptionPlanTransactionVO | undefined) => {
          this.subscriptionPlanTransaction = data;
        }
      );
    this.addonSubscription = this.checkoutService.addonsListSubject$.subscribe(
      (data: addOnPlan[]) => {
        this.addons = data;
      }
    );
  }

  applyCoupon() {
    this.checkoutService.isCouponApplied$.next(this.coupon);
  }
  
  showFeatures(features: addOnPlanFeatures[]) {
    this.matDialog.open(AddonFeaturesPreviewComponent, {
      data: {
        features: features.map(
          (value: addOnPlanFeatures) => value.featureDescription
        ),
      },
      panelClass: 'addon-matdailog',
    });
  }
}