import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: '0'})),
      state('true', style({ height: AUTO_STYLE})),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in'))
    ])
  ],
})
export class FaqComponent implements OnInit {
  @Input('selectedValue') selectedValue!:string;
  panelOpenState = false;
  expand!: false
  faq: any[] = [];
  page=0;
  size=10;
  constructor( private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
this.refresh();
  }
refresh(){
      this.subscriptionService.fetchActiveFaqList(
        this.selectedValue
    )
    .subscribe((res: any) => {
      this.faq = res.faqList;
      // this.totalCount = res.totalCount;
    });
}
}
