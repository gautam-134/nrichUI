import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { LoaderService } from 'src/app/loader.service';
import { CsvUploadRecordsVO, UserCsvVO } from 'src/app/model/UserCsvVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-user-upload',
  standalone: true,
  imports: [],
  templateUrl: './bulk-user-upload.component.html',
  styleUrl: './bulk-user-upload.component.scss'
})
export class BulkUserUploadComponent implements OnInit {
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
  csvtype:string="USERS";
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private loader: LoaderService,
    private instituteService: InstituteService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.fetchAllCsvRecords(this.csvtype,
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

  pageChange(event: any) {
    this.refresh(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.loadingOn();
        this.header = true;
        this.ngxCsvParser
          .parse(files[0], { header: this.header, delimiter: ',' })
          .pipe()
          .subscribe(
            (result: any) => {
              this.csvRecords = result;
              this.usersData = this.csvRecords;
              this.instituteService
                .saveUsersCSV({
                  usersDataList: this.usersData,
                  instituteId: JSON.parse(
                    localStorage.getItem('auth') as string
                  ).selectedInstitute,
                })
                .subscribe(
                  (data: any) => {
                    
                    this.alertService.successAlert(data.message);
                    this.FetchedRecord = data.body;
                    this.loader.loadingOff();
                    this.myInputVariable.nativeElement.value = '';
                    this.refresh(this.page);
                  },
                  (error: any) => {
                    this.alertService.errorAlert(error.error.errorMessage);
                    this.myInputVariable.nativeElement.value = '';
                    this.loader.loadingOff();
                  }
                );
            },
            (error: NgxCSVParserError) => {}
          );
      } else if (result.isDenied) {
        this.myInputVariable.nativeElement.value = '';
        this.alertService.okErrorAlert('Document not uploaded');
      }
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

  backToLastPage() {
    this.router.navigate(
      [`${AuthService.getModulePrefix}/users`]);

  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}

