import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from '../loader.service';
import { MyplanDetails } from '../model/MyPlanDetails';
import { SubscriptionService } from './subscription/subscription.service';

@Injectable({
  providedIn: 'root',
})
export class MyplanService {
  myPlanDetails$ = new BehaviorSubject<MyplanDetails | undefined>(undefined);
  constructor(
    private loader: LoaderService,
    private subscriptionPlanService: SubscriptionService
  ) {}

  fetchPlanDetails() {
    this.loader
      .showLoader(this.subscriptionPlanService.fetchPlanDetails())
      .subscribe({
        next: (data: MyplanDetails) => {
          this.myPlanDetails$.next(data);
        },
        error: (error: HttpErrorResponse) => {},
      });
  }
}
