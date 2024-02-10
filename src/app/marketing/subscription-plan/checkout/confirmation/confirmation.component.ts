import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckoutService } from '../../../../services/checkout.service';

@Component({
  selector: 'app-confirmation',
   
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  isPaymentSuccess: boolean = false;
  msg: string = "";
  paymentStatusSubscription!: Subscription;
  constructor(private checkoutService: CheckoutService,private location:Location) { }

  ngOnDestroy(): void {
    if (this.paymentStatusSubscription) this.paymentStatusSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.isPaymentSuccess=this.checkoutService.paymentStatus
    this.msg=this.checkoutService.msg
  }

  back(){
   // this.checkoutService.tabSubject$.next(1)
   this.location.back()
  }
}