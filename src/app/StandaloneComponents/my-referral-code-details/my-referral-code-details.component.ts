import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import Swal from 'sweetalert2';
import { ReferralDashboardComponent, ReferralSignups, ReferralsRewards } from './referral-dashboard/referral-dashboard.component';

import { ReferralRewardsComponent } from './referral-rewards/referral-rewards.component';
import { ReferralSignUpsComponent } from './referral-sign-ups/referral-sign-ups.component';

@Component({
  selector: 'app-my-referral-code-details',
  standalone: true,
  imports: [
    CommonModule,
    ReferralDashboardComponent,
    ReferralRewardsComponent,
    ReferralSignUpsComponent,
  ],
  templateUrl: './my-referral-code-details.component.html',
  styleUrl: './my-referral-code-details.component.scss'
})
export class MyReferralCodeDetailsComponent implements OnInit {
  tab: number = 1;
  page: number = 0;
  size: number = 10;
  userPage:number=0;
  usersSize:number=10;
  code!: string;
  referralSignups!: ReferralSignups;
  referralRewards!: ReferralsRewards;
  totalRewardCount: any;
  totalSignUpCount:any;
  referredDiscount: any;
  referrerDiscount: any;
  constructor(private subscriptionService: SubscriptionService,private _clipboardService:ClipboardService) {}
  ngOnInit(): void {
    this.myReferralCode();
    this.myReferralDiscountPrice();
    this.myReferralUsers(0);
    this.myRewards(0);
  }
  myRewards(page:number) {
    this.subscriptionService.fetchReferralRewards(page, this.size).subscribe({
      next: (data: ApiResponse) => {
        this.referralRewards = data.body;
        this.totalRewardCount =data.body.totalCount;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
  myReferralUsers(page:number) {
    this.subscriptionService.fetchReferralUsers(page, this.usersSize).subscribe({
      next: (data: ApiResponse) => {
        
        this.referralSignups = data.body;
        this.totalSignUpCount=data.body.totalCount;
   
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  myReferralCode() {
    this.subscriptionService.getMyReferralCode().subscribe({
      next: (data: ApiResponse) => {
        this.code = data.body;
      },
      error: (error: HttpErrorResponse) => {
      
      },
    });
  }

  myReferralDiscountPrice() {
    this.subscriptionService.getReferralDiscountPrice().subscribe({
      next: (data: ApiResponse) => {
        this.referredDiscount = data.body.referredDiscount;
        this.referrerDiscount=data.body.referrerDiscount;
      },
      error: (error: HttpErrorResponse) => {
      
      },
    });
  }

  copy(text: string) {
    text = 'https://nrichlearning.com/login/' + text;
    this._clipboardService.copy(text);
    Swal.fire({
      position: 'top-end',
      title: 'Copied !',
      showConfirmButton: false,
      timer: 600,
      width: 200,
    });
  }


  nextPage($event: any) {
    this.userPage = $event;
    this.myReferralUsers(this.userPage);
  }

  nextRewardPage($event: any){
    this.userPage = $event;
    this.myRewards(this.userPage);
  }
}
