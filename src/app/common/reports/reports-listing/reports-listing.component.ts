import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ReportingRecordsVO } from 'src/app/model/ReportingRequest';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { ReportsService } from 'src/app/services/ReportsService/reports.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
@Component({
  selector: 'app-reports-listing',
  standalone: true,
  imports: [],
  templateUrl: './reports-listing.component.html',
  styleUrl: './reports-listing.component.scss'
})
export class ReportsListingComponent implements OnInit, OnDestroy {
  reportingRecordsVOList: ReportingRecordsVO[] = [];
  subscription!: Subscription;
  page: number = 0;
  size: number = 5;
  totalElements!: number;
  typeOfShorting: boolean = true;
  type: any;
  isFirstRowColored: boolean = false;
  constructor(
    private reportService: ReportsService,
    private loader: LoaderService,
    private subscriptionService: SubscriptionService,
    private alertService: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchAllReportRecords(this.page, false);
    this.reportService.isReportUpload.next(false);
    this.subscription = this.reportService.isReportUpload.subscribe(
      (isUpload: boolean) => {
        if (isUpload) {
          this.fetchAllReportRecords(this.page, true);
        }
      }
    );
  }

  fetchAllReportRecords(page: number, fromGenerateReport: boolean) {
    this.loader
      .showLoader(this.reportService.fetchAllReportsRecords(page, this.size))
      .subscribe({
        next: (res: ApiResponse) => {
          this.reportingRecordsVOList = res.body.reports;
          this.totalElements = res.body.total_count;
          if (fromGenerateReport) this.isFirstRowColored = true;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  download(report: ReportingRecordsVO, index: number) {
    if (index == 0) this.isFirstRowColored = false;
    const reportType = 'INVOICE REPORT';
    const reportType1 = 'STUDENT INVOICE REPORT';
    const fileName =
      report.reportType.toLocaleLowerCase() == reportType.toLocaleLowerCase() ||
      report.reportType.toLocaleLowerCase() == reportType1.toLocaleLowerCase()
        ? 'invoices/' + report.reportFileName + '.zip'
        : report.reportFileName + '.xlsx';
    this.loader
      .showLoader(this.subscriptionService.downloadFile(fileName))
      .subscribe({
        next: (data: any) => {
          const blob = new Blob([data], { type: data.type });
          saveAs(
            blob,
            report.reportType.toLocaleLowerCase() ==
              reportType.toLocaleLowerCase() ||
              report.reportType.toLocaleLowerCase() ==
                reportType1.toLocaleLowerCase()
              ? report.reportFileName + '.zip'
              : report.reportFileName + '.xlsx'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  pageChange(event: any) {
    this.fetchAllReportRecords(event, false);
  }
  changeSize(event: any) {
    this.size = event;
    this.fetchAllReportRecords(0, false);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}