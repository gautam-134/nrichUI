import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { OfflineEnrollmentApplication } from '../../model/OfflineEnrollmentApplication';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { InstituteService } from '../../services/institute/institute.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offline-enrollment',
   
  templateUrl: './offline-enrollment.component.html',
  styleUrl: './offline-enrollment.component.scss'
})
export class OfflineEnrollmentComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  selectAll = false;
  totalEnrollments: number = 0;
  searchParam: string = '';
  offlineEnrollmentsList: OfflineEnrollmentApplication[] = [];
  applicationCount: number = 0;
  subject = new Subject();
  result$!: Observable<any>;
  typeOfShorting: boolean = true;
  type: any;
  selectedEnrollmentsList: any[] = [];
  enrollmentSelected: boolean = false;
  constructor(
    private instituteService: InstituteService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.getOfflineApplications(
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe(
        (data) => {
          this.offlineEnrollmentsList = data.applicationDetails;
          this.applicationCount = data?.applicationCount;
          this.selectAll = false;
          this.selectedEnrollmentsList=[];
        },
        (error) => {
          this.alertService.errorAlert('Error while fetching enrollment list');
        }
      );
  }

  selectedEnrollments(application: OfflineEnrollmentApplication, event: any) {
    if (event.target.checked) {
      this.selectedEnrollmentsList.push(application.id);
      this.enrollmentSelected = true;
    } else {
      const index = this.selectedEnrollmentsList.indexOf(application.id);
      if (index !== -1) {
        this.selectedEnrollmentsList.splice(index, 1);
        if (this.selectedEnrollmentsList.length === 0)
          this.enrollmentSelected = false;
      }
    }

  }
  
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.selectedEnrollmentsList = []; // Clear the selected enrollments list
    this.offlineEnrollmentsList.forEach((row) => {
      row.selected = this.selectAll;
      if (this.selectAll) {
        this.selectedEnrollmentsList.push(row.id);
      } else {
        row.selected = false;
      }
    });
    if (this.selectedEnrollmentsList.length != 0)
    this.enrollmentSelected = true;
    else
    this.enrollmentSelected=false;
  }
  acceptOrRejectAll() {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Are you sure you want to confirm this transaction? </p>',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#029EF2',
      confirmButtonText: 'Accept',
      showDenyButton: true,
      denyButtonColor: '#FF635F',
      denyButtonText: 'Reject',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(
            this.instituteService.paymentRecieved(this.selectedEnrollmentsList)
          )
          .subscribe(
            (data: any) => {
              if (data.body.includes('Not'))
                this.alertService.errorAlert(data.body);
              else this.alertService.successAlert(data.body);
              this.selectedEnrollmentsList = [];
              this.selectAll = false;
              this.refresh(this.page);
              this.enrollmentSelected = false;
            },
            (error) => {
              this.alertService.errorAlert('Something went wrong!');
              this.selectedEnrollmentsList = [];
              this.selectAll = false;
              this.enrollmentSelected = false;
            }
          );
      } else if (result.isDenied) {
        this.loader
          .showLoader(
            this.instituteService.paymentNotRecieved(
              this.selectedEnrollmentsList
            )
          )
          .subscribe(
            (data: any) => {
              this.alertService.successAlert('Requests Rejected');
              this.selectedEnrollmentsList = [];
              this.selectAll = false;
              this.refresh(this.page);
              this.enrollmentSelected = false;
            },
            (error) => {
              this.alertService.errorAlert('Something went wrong!');
              this.selectedEnrollmentsList = [];
              this.selectAll = false;
              this.enrollmentSelected = false;
            }
          );
      }
    });
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.instituteService.getOfflineApplications(
                  this.page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((response) => {
        this.result$ = response;
        this.result$.subscribe((value) => {
          this.offlineEnrollmentsList = value?.applicationDetails;
          this.applicationCount = value?.applicationCount;
          this.selectedEnrollmentsList = [];
          this.enrollmentSelected = false;
        });
      });
  }

  search(evt: any) {
    this.page = 0;
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  pageChange(event: any) {
    this.page = event;
    this.refresh(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
