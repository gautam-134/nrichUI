import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coupon-details',
   
  templateUrl: './coupon-details.component.html',
  styleUrl: './coupon-details.component.scss'
})
export class CouponDetailsComponent implements OnInit {
  id!: number;
  coupons!: any[];
  constructor(
    private subscriptionservices: SubscriptionService,
    private activateRoute: ActivatedRoute,
    private _clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((data) => {
      this.id = data?.['id'];
    });
    this.subscriptionservices.getcoupensdetail(this.id).subscribe((res) => {
      this.coupons = res.body;
    });
  }
  copy(text: string) {
    this._clipboardService.copy(text);
    Swal.fire({
      position: 'top-end',
      title: 'Copied !',
      showConfirmButton: false,
      timer: 600,
      width: 200,
    });
  }
}
