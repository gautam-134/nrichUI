import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardService } from 'ngx-clipboard';
import Swal from 'sweetalert2';

export interface ReferralSignups {
  totalCount: number;
  users: { id: number; email: string; name: string; userImagePath?: string }[];
}
export interface ReferralsRewards {
  totalCount: number;
  rewards: { id: number; status: string; code: string;codeDetailsVO:CodeDetailsVO }[];
}
 export interface CodeDetailsVO{
  id:number;
  discount:number;
  discountType:string;
  endDate:Date;
  startDate:Date;
 }
@Component({
  selector: 'app-referral-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './referral-dashboard.component.html',
  styleUrl: './referral-dashboard.component.scss'
})
export class ReferralDashboardComponent implements OnInit {
  @Input() code = '';
  @Input() referrerDiscount = '';
  @Input() referredDiscount = '';
  @Input() totalRewardCount = 0;
  @Input() totalSignUpCount = 0;
  page: number = 0;
  size: number = 10;
  link!: string;
  constructor(private _clipboardService: ClipboardService) {}

  ngOnInit(): void {}
  copy(text: string) {
    this.link = 'https://nrichlearning.com/login/' + text;
    this._clipboardService.copy(this.link);
    Swal.fire({
      position: 'top-end',
      title: 'Copied !',
      showConfirmButton: false,
      timer: 600,
      width: 200,
    });
  }
}
