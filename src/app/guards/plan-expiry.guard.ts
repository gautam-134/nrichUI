import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MyplanService } from '../services/myplan.service';
import { SubscriptionService } from '../services/subscription/subscription.service';

@Injectable({
  providedIn: 'root',
})
export class PlanExpiryGuard implements CanLoad {
  constructor(
    private subscriptionService: SubscriptionService,
    private myPlanService: MyplanService,
    private router: Router
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((res) => {
      this.subscriptionService.fetchPlanDetails().subscribe({
        next: (data) => {
          this.myPlanService.myPlanDetails$.next(data);
          return res(true);
        },
        error: (error: HttpErrorResponse) => {
          if (error.error.status == 423) {
            this.router.navigate(['/planExpired']);
          }
          return res(false);
        },
      });
    });
  }
}
