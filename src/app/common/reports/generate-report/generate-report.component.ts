import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import {
  ReportingCriteriaFieldValuesVO,
  ReportingCriteriaFieldVO,
  ReportingCriteriaVO,
  ReportingNameVO,
} from 'src/app/model/ReportingCriteriaVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { ReportsService } from 'src/app/services/ReportsService/reports.service';

@Component({
  selector: 'app-generate-report',
  standalone: true,
  imports: [],
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.scss'
})
export class GenerateReportComponent implements OnInit {
  reportingNameList: ReportingNameVO[] = [];
  reportName!: ReportingNameVO;
  submitted: boolean = false;
  showSelectedFields: boolean = false;
  @ViewChild('report') selection!: ElementRef;
  constructor(
    private reportService: ReportsService,
    private loaderService: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.fetchReportNames();
  }

  fetchReportNames() {
    this.loaderService
      .showLoader(this.reportService.fetchReportsName())
      .subscribe({
        next: (res: ApiResponse) => {
          this.reportingNameList = res.body;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }
  onReportSelection(id: any) {
    this.reportName?.criteria.forEach((value: ReportingCriteriaVO) => {
      value.fields = [];
    });

    this.reportName = new ReportingNameVO();
    if (id) this.showSelectedFields = true;
    else this.showSelectedFields = false;
    this.reportName.id = id;
    var selectedReport: ReportingNameVO | undefined =
      this.reportingNameList.find((value: ReportingNameVO) => value.id == id);
    this.reportName.criteria = selectedReport ? selectedReport.criteria : [];
  }

  fetchCriteriaFields(event: any, criteriaId: any, index: number) {
    if (!event.currentTarget.checked) {
      const id = this.reportName.criteria[index].id;
      this.reportName.criteria.forEach((value: ReportingCriteriaVO) => {
        if (value.id == id) value.fields.splice(0, value.fields.length);
      });
    }
    if (event.currentTarget.checked) {
      this.loaderService
        .showLoader(this.reportService.fetchCriteriaFields(event.target.value))
        .subscribe({
          next: (data: ApiResponse) => {
            this.reportName.criteria.forEach((value: ReportingCriteriaVO) => {
              if (value.id == criteriaId){
                value.fields = data.body;
                value.error=""
              }
              // value.error = '';
              // value?.fields?.forEach((field: ReportingCriteriaFieldVO) => {
              //   field.value = '';
              //   field.criteriaFieldValues?.forEach(
              //     (value: ReportingCriteriaFieldValuesVO) => {
              //       value.criterialFieldSubValues = [];
              //     }
              //   );
              // });
            });
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.okErrorAlert(error.error.message);
          },
        });
      return;
    }
  }

  submit() {
    if (!this.reportName?.id) {
      this.alertService.okErrorAlert('Please select Report !');
      return;
    }
    for (var criteria of this.reportName.criteria) {
      if (
        criteria.required &&
        (!criteria?.fields || criteria?.fields?.length == 0)
      ) {
        criteria.error = criteria.criteriaName + ' is required.';
        return;
      }
    }
    let isAllRequiredFieldPrsent = true;
    for (var criteria of this.reportName.criteria) {
      if (criteria.fields) {
        for (var field of criteria.fields) {
          if (field.required && field.value == '') {
            field.error = field.fieldLabel + ' is required.';
            isAllRequiredFieldPrsent = false;
          }
        }
      }
    }
    if (!isAllRequiredFieldPrsent) return;
    this.loaderService
      .showLoader(
        this.reportService.createReport(this.reportName.getReportRequest)
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.showSelectedFields = false;
          this.reportService.isReportUpload.next(true);
          this.reportName?.criteria.forEach((value: ReportingCriteriaVO) => {
            value.fields = [];
          });
          this.reportName = new ReportingNameVO();
          this.selection.nativeElement.value = '';
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  fetchSubValuesOfField(id: string) {
    this.loaderService
      .showLoader(this.reportService.fetchCriteriaFieldsSubValues(+id))
      .subscribe({
        next: (data: any) => {
          this.reportName?.criteria.forEach((value: ReportingCriteriaVO) => {
            if (value?.fields != undefined) {
              value?.fields.forEach((value: ReportingCriteriaFieldVO) => {
                if (value.criteriaFieldValues != undefined) {
                  value?.criteriaFieldValues.forEach(
                    (value: ReportingCriteriaFieldValuesVO) => {
                      value.criterialFieldSubValues = [];
                      if (value.id == +id)
                        value.criterialFieldSubValues = data.body;
                    }
                  );
                }
              });
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }
}

