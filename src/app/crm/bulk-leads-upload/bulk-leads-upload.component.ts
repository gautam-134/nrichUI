import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { LoaderService } from '../../loader.service';
import { CrmFormFieldsVO } from '../../model/CrmFormFieldsVO';
import { InstituteLeadsVO } from '../../model/InstituteLeadsVO';
import { UserCsvVO, CsvUploadRecordsVO } from '../../model/UserCsvVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { CRMService } from '../../services/CRM/crm.service';
import { InstituteService } from '../../services/institute/institute.service';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-leads-upload',
   
  templateUrl: './bulk-leads-upload.component.html',
  styleUrl: './bulk-leads-upload.component.scss'
})
export class BulkLeadsUploadComponent implements OnInit {
  csvRecords: any[] = [];
  // : CustomerLeads[];
  usersData!: UserCsvVO[];
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  csvUploadRecordsVO: CsvUploadRecordsVO[] = [];
  header = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  FetchedRecord: any;
  role: any;
  typeOfShorting: boolean = true;
  type: any;
  instituteLeads: InstituteLeadsVO[] = [];
  additionalFields: CrmFormFieldsVO[] = [];
  csvType: string = 'CRM';
  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private router: Router,
    private crmService: CRMService,
    private alertService: SwalAlertService,
    private subscriptionService: SubscriptionService,
    private ngxCsvParser: NgxCsvParser
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
  }
  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.fetchAllCsvRecords(
          this.csvType,
          JSON.parse(localStorage.getItem('auth') as string).selectedInstitute,
          this.size,
          page
        )
      )
      .subscribe((res: any) => {
        this.csvUploadRecordsVO = res.body.csvRecords;
        this.totalCount = res.body.total_count;
      });
  }

  downloadSample() {
    this.loader.showLoader(this.crmService.downloadSampleCSV()).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: data.type });
        saveAs(blob);
      },
      error: (error: HttpErrorResponse) => {

        this.alertService.errorAlert(
          'Something went wrong while downloading sample file'
        );
      },
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  backToLastPage() {
    this.router.navigate(['/crm/dashboard']);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    if (!files[0].name.includes('.csv')) {
      alert('Please select the csv file.');
      return;
    }

    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to upload the document?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Yes',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'No',
    }).then((result: { isConfirmed: any; isDenied: any }) => {
      if (result.isConfirmed) {
        this.loader.loadingOn();
        this.header = true;
        this.ngxCsvParser
          .parse(files[0], { header: this.header, delimiter: ',' })
          .subscribe(
            (result: any) => {
              this.csvRecords = result;
              this.crmService.getFormFields().subscribe({
                next: (data: CrmFormFieldsVO[]) => {
                  this.additionalFields = data;
                  this.csvRecords.forEach((record) => {
                    let iLeadsVO = new InstituteLeadsVO();
                    iLeadsVO = record;
                    iLeadsVO.instituteId = +AuthService.getInstituteId;
                    let map = new Map<number, string>();
                    for (let prop of Object.keys(record)) {
                      this.additionalFields.find((field) => {
                        if (field.formControlName == prop) {
                          map.set(field.id, record[prop]);
                          return true;
                        }
                        return false;
                      });
                    }
                    const convMap: any = {};
                    map.forEach((val: string, key: number) => {
                      convMap[key] = val;
                    });
                    iLeadsVO.leadFormFields = convMap;
                    this.instituteLeads.push(iLeadsVO);
                  });
                  this.loader
                    .showLoader(
                      this.crmService.saveLeadsCSV(this.instituteLeads)
                    )
                    .subscribe({
                      next: (data) => {
                        this.alertService.successAlert(data.message!);
                        this.refresh(this.page);
                        this.myInputVariable.nativeElement.value = '';
                        this.instituteLeads = [];
                      },
                      error: (error: HttpErrorResponse) => {
                        this.alertService.errorAlert(error.error.errorMessage);
                        this.myInputVariable.nativeElement.value = '';
                        this.instituteLeads = [];
                      },
                    });
                },
                error: (error: HttpErrorResponse) => {
                  this.myInputVariable.nativeElement.value = '';
                  this.alertService.errorAlert(
                    'Something went wrong while uploading leads'
                  );
                },
              });

              // this.instituteLeads = this.csvRecords;
              // this.crmService
              //   .saveLeadsCSV ({
              //     usersDataList: this.instituteLeads,
              //     instituteId: JSON.parse(
              //       localStorage.getItem('auth') as string
              //     ).selectedInstitute,
              //   })
              //   .subscribe(
              //     (data: any) => {
              //       this.alertService.successAlert(data.body.message);
              //       // this.FetchedRecord = data.body;
              //       this.loader.loadingOff();
              //       this.myInputVariable.nativeElement.value = '';
              //       // this.refresh(this.page);
              //     },
              //     (error: any) => {
              //       this.alertService.errorAlert(error.error.errorMessage);
              //       this.myInputVariable.nativeElement.value = '';
              //       this.loader.loadingOff();
              //     }
              //   );
            },
            (error: NgxCSVParserError) => {
              this.loader.loadingOff();
            }
          );
      } else if (result.isDenied) {
        this.myInputVariable.nativeElement.value = '';
        this.alertService.okErrorAlert('Document not uploaded');
      }

      // if (result.isConfirmed) {

      //   this.loader.loadingOn();
      //   let file = $event.target.files[0];
      //   let formData = new FormData();
      //   formData.append('leadsCSV', file);
      //   this.crmService.saveLeadsCSV(formData).subscribe({
      //     next: (data: any) => {
      //       this.loader.loadingOff();
      //     },
      //     error: (error: HttpErrorResponse) => {
      //       this.loader.loadingOff();
      //       this.myInputVariable.nativeElement.value = '';
      //       this.alertService.errorAlert('Error occured while creating leads');
      //     },
      //   });

      // } else if (result.isDenied) {
      //   this.myInputVariable.nativeElement.value = '';
      //   this.alertService.okErrorAlert('Document not uploaded');
      // }
    });
  }

  downloadCSV(key: string) {
    this.subscriptionService.downloadFile(key).subscribe(
      (data: any) => {
        const blob = new Blob([data], { type: data.type });
        saveAs(blob);
      },
      (error: HttpErrorResponse) => {
        this.alertService.errorAlert(error.message);
      }
    );
  }
}
