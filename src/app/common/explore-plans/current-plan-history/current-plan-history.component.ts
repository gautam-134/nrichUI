import { Component, OnInit } from '@angular/core';
import { Currentplan } from '../../../model/current-plan.model';
import { SubscriptionService } from '../../../services/subscription/subscription.service';

@Component({
  selector: 'app-current-plan-history',
   
  templateUrl: './current-plan-history.component.html',
  styleUrl: './current-plan-history.component.scss'
})
export class CurrentPlanHistoryComponent implements OnInit {
  currentplan!: Currentplan;
  plan: Currentplan[] = [];
  addons: any[] = [];

  currentPlanFeatures: any[] = [];
  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.fetchCurrentPlan();
  }
  fetchCurrentPlan() {
    this.subscriptionService.getCurrentActiveplan().subscribe((data: any) => {
      this.currentplan = data.activeplan.currentPlan;
    });
  }
}
