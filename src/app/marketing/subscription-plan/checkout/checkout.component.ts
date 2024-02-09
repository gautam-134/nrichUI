import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { addOnPlan } from 'src/app/model/addOn.model';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { BillingAddressVO } from 'src/app/model/BillingAddressVO';
import {
  planlist,
  SubscriptionPlanOrderRequest,
  SubscriptionPlanTransactionVO,
} from 'src/app/model/subscription-PaymentVOs';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MyplanService } from 'src/app/services/myplan.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import Swal from 'sweetalert2';
import { Order } from '../../course-page/buy-course/buy-course.component';
declare var Razorpay: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  tab: number = 1;
  orderRequest = new SubscriptionPlanOrderRequest();
  isTransactionSuccessSubscription!: Subscription;
  isCouponCanceledSubscription!: Subscription;
  isCouponAppliedSubscription!: Subscription;
  billingAddressSubscription!: Subscription;
  paymentSubscription!: Subscription;
  tabSubscription!: Subscription;
  addonPurchaseSubscription!: Subscription;
  @ViewChild('dClick') defaultBtn!: ElementRef;
  constructor(
    private checkoutService: CheckoutService,
    private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private location: Location,
    private alertService: SwalAlertService,
    private myPlanService: MyplanService
  ) {}

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.checkoutService.reinitializeCouponState(
      this.orderRequest.transactionId
    );
  }

  ngOnDestroy(): void {
    this.checkoutService.tabSubject$.next(1);
    if (this.isTransactionSuccessSubscription)
      this.isTransactionSuccessSubscription.unsubscribe();
    if (this.isCouponCanceledSubscription)
      this.isCouponCanceledSubscription.unsubscribe();
    if (this.billingAddressSubscription)
      this.billingAddressSubscription.unsubscribe();
    if (this.isCouponAppliedSubscription)
      this.isCouponAppliedSubscription.unsubscribe();
    if (this.paymentSubscription) this.paymentSubscription.unsubscribe();
    if (this.tabSubscription) this.tabSubscription.unsubscribe();
    if (this.addonPurchaseSubscription)
      this.addonPurchaseSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.orderRequest.addonIds = [];
    if (this.activatedRoute.snapshot.queryParams['type'] == 'addon') {
      this.orderRequest.addonIds = [
        +this.activatedRoute.snapshot.queryParams['id'],
      ];
    } else if (
      this.activatedRoute.snapshot.queryParams['type'] == 'pricingplan'
    ) {
      this.orderRequest.planId = this.activatedRoute.snapshot.queryParams['id'];
      this.orderRequest.addonIds = [];
    }
    // this.orderRequest.amount =
    //   this.activatedRoute.snapshot.queryParams['price'];
    // this.orderRequest.planId = this.activatedRoute.snapshot.queryParams['id'];
    // this.orderRequest.addonIds = [];
    this.getStates();
    this.getBillingAddress();
    this.getPlanDetails(
      this.activatedRoute.snapshot.queryParams['id'],
      this.activatedRoute.snapshot.queryParams['type']
    );
    this.billingAddress();
    this.couponAppliedSubscription();
    this.couponCanceled();
    this.subscribeToPayment();
    this.subscribeToTabSubject();
    this.fetchAddons();
    this.onAddonsSelection();
  }

  subscribeToTabSubject() {
    this.tabSubscription = this.checkoutService.tabSubject$.subscribe(
      (tab: number) => {
        this.tab = tab;
        this.orderRequest.coupenCode = undefined;
      }
    );
  }

  billingAddress() {
    this.billingAddressSubscription =
      this.checkoutService.saveAddressSubject$.subscribe(
        (data: BillingAddressVO) => {
          this.saveBillingAddress(data);
        }
      );
  }

  couponAppliedSubscription() {
    this.isCouponAppliedSubscription =
      this.checkoutService.isCouponApplied$.subscribe((coupon: string) => {
        if (coupon) {
          this.orderRequest.coupenCode = coupon;
          this.createOrder();
        }
      });
  }
  getPlanDetails(id: number, type: string) {
    this.loader
      .showLoader(this.subscriptionService.getplanlist(id, type))
      .subscribe({
        next: (data: planlist) => {
          this.checkoutService.planListSubject$.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
          this.location.back();
        },
      });
  }

  getStates() {
    this.loader.showLoader(this.subscriptionService.getstates()).subscribe({
      next: (data: any) => {
        this.checkoutService.statesSubject$.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error While Fetching States');
      },
    });
  }

  saveBillingAddress(address: BillingAddressVO) {
    this.loader
      .showLoader(this.subscriptionService.saveBillingAddress(address))
      .subscribe({
        next: (data: BillingAddressVO) => {
          this.createOrder();
          this.checkoutService.billingAddressSubject$.next(data);
          this.checkoutService.tabSubject$.next(2);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Updating Billing Address');
        },
      });
  }

  getBillingAddress() {
    this.loader
      .showLoader(this.subscriptionService.getBillingAddress())
      .subscribe({
        next: (data: BillingAddressVO) => {
          this.checkoutService.billingAddressSubject$.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error While Fetching Billing Address');
        },
      });
  }

  createOrder() {
    this.loader
      .showLoader(this.subscriptionService.createOrder(this.orderRequest))
      .subscribe({
        next: (data: SubscriptionPlanTransactionVO) => {
          this.orderRequest.transactionId = data.id;
          this.checkoutService.createOrderSubject$.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.orderRequest.coupenCode=undefined
          this.alertService.errorAlert(error.error.message);
        },
      });
  }

  couponCanceled() {
    this.isCouponCanceledSubscription =
      this.checkoutService.isCouponReinitializeSuccessfully$.subscribe(
        (data: boolean) => {
          if (data) {
            this.orderRequest.coupenCode = undefined;
            this.createOrder();
          }
        }
      );
  }

  subscribeToPayment() {
    this.paymentSubscription = this.checkoutService.paymentSubject$.subscribe(
      () => {
        this.loader.loadingOn();
        this.payment();
      }
    );
  }

  renderNextTab() {
    this.defaultBtn.nativeElement.click();
  }
  changeTabWithSuccess() {
    this.loader.loadingOff();
    this.checkoutService.tabSubject$.next(3);
  }

  paymentSuccess(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
  ) {
    this.loader
      .showLoader(
        this.subscriptionService.subscriptionPaymentSuccess(
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          this.orderRequest.transactionId
        )
      )
      .subscribe(
        (data: ApiResponse) => {
          //success
          this.checkoutService.setMsgAndStatus(
            'Payment done successfully',
            true
          );
          this.myPlanService.fetchPlanDetails();
          this.renderNextTab();
        },
        (error: HttpErrorResponse) => {
          this.checkoutService.setMsgAndStatus(
            error.status == 400
              ? error.error.message
              : 'Your Payment has completed but there is some issue from our side please contact nrichlearning.com',
            false
          );
          this.renderNextTab();
        }
      );
  }

  fetchAddons() {
    this.subscriptionService.fetchActiveAddons().subscribe({
      next: (data: ApiResponse) => {
        if (this.activatedRoute.snapshot.queryParams['type'] == 'addon') {
          let addonList: addOnPlan[] = data.body;
          addonList = addonList.filter(
            (addon) =>
              addon.id != +this.activatedRoute.snapshot.queryParams['id']
          );
          this.checkoutService.addonsListSubject$.next(addonList);
          return;
        }
        this.checkoutService.addonsListSubject$.next(data.body);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire(
          'Error',
          'Somthing went wrong while fetching addons list',
          'error'
        );
      },
    });
  }

  onAddonsSelection() {
    this.addonPurchaseSubscription =
      this.checkoutService.purchaseAddons$.subscribe((addonId: number) => {
        if (this.orderRequest.addonIds.includes(addonId)) {
          this.orderRequest.addonIds.splice(
            this.orderRequest.addonIds.indexOf(addonId),
            1
          );
          this.createOrder();
          return;
        }
        this.orderRequest.addonIds.push(addonId);
        this.createOrder();
      });
  }

  order: Order = {} as Order;
  options = {
    amount: 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: 'INR',
    name: 'Nrich Learning',
    description: 'Test Transaction',
    image: 'https://nrichlearning.com/assets/img/logo.png',
    order_id: '', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: (response: any) => {
      // alert('sucess');
      this.paymentSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
    prefill: {
      name: 'test',
      email: 'email',
      contact: '1234567899',
    },
    notes: {
      address: 'Nrich Learning',
    },
    theme: {
      color: '#3399cc',
    },
  };

  payment() {
    this.loader
      .showLoader(
        this.subscriptionService.subscriptionPlanPayment(
          this.orderRequest.transactionId
        )
      )
      .subscribe(
        (data: SubscriptionPlanTransactionVO) => {
          this.options.amount = data.netamount;
          this.options.currency = data.currency;
          this.options.order_id = data.orderId;
          this.options.description=data.orderId
          this.options.prefill.name = AuthService.getUserFirstName;
          this.options.prefill.contact = AuthService.getMobileNumber;
          this.options.prefill.email = AuthService.email;
          var rzp1 = new Razorpay(this.options);
          rzp1.open();
          rzp1.on('payment.error', (response: any) => {
            // rzp1.close();
            //   this.checkoutService.setMsgAndStatus(
            //     response.error.description,
            //     false
            //   );
            //   this.renderNextTab();
            this.subscriptionService
              .subscriptionPaymentFailed(
                response.error.metadata.order_id,
                response.error.metadata.payment_id,
                this.orderRequest.transactionId
              )
              .subscribe(
                (data: any) => {},
                (error: any) => {}
              );
          });
        },
        (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        }
      );
  }
}
