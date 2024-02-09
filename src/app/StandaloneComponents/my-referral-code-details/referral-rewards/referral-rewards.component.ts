import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import Swal from 'sweetalert2';
import { ReferralsRewards } from '../referral-dashboard/referral-dashboard.component';
import { CommonModule2 } from "../../../common/common.module";

@Component({
  selector: 'app-referral-rewards',
  standalone: true,
  imports: [],
  templateUrl: './referral-rewards.component.html',
  styleUrl: './referral-rewards.component.scss'
})
export class ReferralRewardsComponent  implements OnInit, OnChanges {
  @Input('referralRewards') referralRewards!: ReferralsRewards;
  @Input('config') config!: number;
  @Input('maxPages') maxPages!: number;
  @Input('pagenumber') pageNumber!:number
  @Output() nextRewardPage = new EventEmitter<number>();
  constructor(private _clipboardService:ClipboardService) {}
  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
   
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