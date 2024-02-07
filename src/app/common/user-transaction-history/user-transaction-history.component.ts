import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SubscriptionPlanTransactionHistory } from 'src/app/model/Subscription';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
@Component({
  selector: 'app-user-transaction-history',
  standalone: true,
  imports: [],
  templateUrl: './user-transaction-history.component.html',
  styleUrl: './user-transaction-history.component.scss'
})
export class UserTransactionHistoryComponent implements OnInit {
  TransactionHistory: SubscriptionPlanTransactionHistory[] = [];
  constructor(
    private subscriptionPlanService: SubscriptionService,
    private alertService: SwalAlertService,
    private loaderService:LoaderService
  ) {}

  ngOnInit(): void {
    this.subscriptionPlanService
      .fetchSubscriptionPlanHistory()
      .subscribe((res: ApiResponse) => {
        this.TransactionHistory = res.body;
      });
  }

  downloadInvoice(id: number) {
    this.loaderService.showLoader(
    this.subscriptionPlanService.generateOrDownloadInvoice(id)).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: data.type });
        saveAs(blob, 'invoice.pdf');
      },
      error: (error: any) => {
        this.alertService.okErrorAlert(error);
      },
    });
  }
}
