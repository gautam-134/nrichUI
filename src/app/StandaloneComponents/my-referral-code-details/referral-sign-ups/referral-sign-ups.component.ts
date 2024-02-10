import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { ReferralSignups } from '../referral-dashboard/referral-dashboard.component';
import { CommonModule2 } from '../../../common/common.module';

@Component({
  selector: 'app-referral-sign-ups',
   
  templateUrl: './referral-sign-ups.component.html',
  styleUrl: './referral-sign-ups.component.scss'
})
export class ReferralSignUpsComponent implements OnInit, OnChanges {
  @Input('referralUsers') referralUsers!: ReferralSignups;
  @Input('config') config!: number;
  @Input('maxPages') maxPages!: number;
  @Input('pagenumber') pageNumber!:number
  @Output() nextPage = new EventEmitter<number>();
  totalCount: number = 0;

  ngOnInit(): void {
    this.totalCount = 0;
  }
  ngOnChanges(changes: SimpleChanges): void {
  
  }
}
