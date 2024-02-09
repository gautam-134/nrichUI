import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { addOnPlan } from '../model/addOn.model';
import { BillingAddressVO } from '../model/BillingAddressVO';
import { planlist, SubscriptionPlanTransactionVO } from '../model/subscription-PaymentVOs';
import { SubscriptionService } from './subscription/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  billingAddressSubject$ = new BehaviorSubject<BillingAddressVO | undefined>(undefined);
  saveAddressSubject$ = new Subject<BillingAddressVO>();
  statesSubject$ = new BehaviorSubject<{ id: number, stateName: string }[]>([]);
  tabSubject$ = new BehaviorSubject<number>(1);
  planListSubject$ = new BehaviorSubject<planlist | undefined>(undefined);
  addonsListSubject$=new BehaviorSubject<addOnPlan[]>([]);
  purchaseAddons$=new Subject<number>();
  createOrderSubject$ = new BehaviorSubject<SubscriptionPlanTransactionVO | undefined>(undefined)
  isCouponReinitializeSuccessfully$ = new BehaviorSubject<boolean>(false)
  isCouponApplied$ = new Subject<string>()
  paymentSubject$ = new Subject<void>()
  paymentStatus: boolean = false
  msg: string = ''

  constructor(
    private subscriptionService: SubscriptionService,
  ) { }

  setMsgAndStatus(msg: string, status: boolean) {
    this.msg = msg
    this.paymentStatus = status
  }


  reinitializeCouponState(id: number | undefined) {
    this.subscriptionService
      .reinitializeCoupenState(id)
      .subscribe({
        next: (data: any) => {
          this.isCouponReinitializeSuccessfully$.next(true)
        },
        error: (error: HttpErrorResponse) => {
        }
      }
      );
  }


}
