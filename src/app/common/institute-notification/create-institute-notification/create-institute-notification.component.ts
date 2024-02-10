import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, debounceTime, map, of } from 'rxjs';
import { UserInstitutes } from '../../../auth/login/select-institute/select-institute.component';
import { LoaderService } from '../../../loader.service';
import { NotificationVO } from '../../../model/Notification';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-create-institute-notification',
   
  templateUrl: './create-institute-notification.component.html',
  styleUrl: './create-institute-notification.component.scss'
})
export class CreateInstituteNotificationComponent implements OnInit {
  NotificationForm!: FormGroup;
  submitted: boolean = false;
  NotificationVO: NotificationVO = new NotificationVO();
  institutes: UserInstitutes[] = [];
  disableField: boolean = false;
  instituteId!: string;
  tags!: { value: string }[];
  id!: any;
  notificationDetails = new NotificationVO();
  isEdit: boolean = false;
  totalInstitutes: number = 0;
  isInstituteListLoaded: boolean = false;
  institutePage: number = 0;
  instituteSize: number = 5;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;
  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: SwalAlertService
  ) {
    this.id = +this.route.snapshot.queryParams?.['id'];
  }
  ngOnInit(): void {
    this.instituteId = AuthService.getInstituteId;
    this.fetchInstitutes(this.institutePage, false);
    this.applyFilter();
    this.initializeForm();
    if (this.id) {
      this.loader
        .showLoader(
          this.notificationService.getInstituteNotificationDetail(this.id)
        )
        .subscribe((data: any) => {
          this.notificationDetails = data.body;
          if (data.body.metaTags != null) {
            this.tags = data.body.metaTags.map(function (e: any) {
              return { display: e, value: e };
            });
          }
          this.initializeForm();
        });
    }
  }

  // fetchInstitutes() {
  //   this.authService.institutes.subscribe({
  //     next: (data: UserInstitutes[]) => {
  //       this.institutes = data;
  //     },
  //     error: (HttpErrorResponse) => {
  //       this.alertService.errorAlert('Error while fetching institutes list');
  //     },
  //   });
  // }

  fetchInstitutes(page: number, flag: any) {
    this.authService
      .enrollAllInstituesListRes(page, this.instituteSize, this.searchParam)
      .subscribe(
        (data: any) => {
          this.isInstituteListLoaded = true;
          this.authService.institutes.next(data.institutes);

          if (flag == true) {
            this.institutes = this.institutes.concat(data.institutes);
          } else {
            this.institutes = data.institutes;
          }
          this.totalInstitutes = data.totalCount;
        },
        (error: any) => {}
      );
  }

  onScrollOfInstitutes(element: any) {
    const scrollPosition = element.scrollHeight - element.clientHeight;
    const threshold = 50;
    if (element.scrollTop >= scrollPosition - threshold) {
      if (this.institutes.length !== this.totalInstitutes) {
        this.institutePage += 1;
        this.fetchInstitutes(this.institutePage, true);
      }
    }
  }

  initializeForm() {
    this.NotificationForm = this.fb.group({
      id: [this.notificationDetails.id ? this.notificationDetails.id : null],
      name: [this.notificationDetails.name, Validators.required],
      notification: [
        this.notificationDetails.notification,
        Validators.required,
      ],
      metaTags: [this.notificationDetails.metaTags],
      toIds: [this.notificationDetails.toIds, Validators.required],
    });
  }

  get form() {
    return this.NotificationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.NotificationForm.valid) {
      this.NotificationVO = this.NotificationForm.value;
      this.NotificationVO.instituteId = +this.instituteId;
      this.NotificationVO.toIds = this.NotificationForm.controls['toIds'].value;
      (this.NotificationVO.metaTags = this.tags.map(function (a: any) {
        return a['value'];
      })),
        this.loader
          .showLoader(
            this.notificationService.createInstituteNotification(
              this.NotificationVO
            )
          )
          .subscribe(
            (res: any) => {
              this.alertService.successAlert(res.message);
              this.router.navigate([
                `${AuthService.getModulePrefix}/institute-notification`,
              ]);
            },
            (err: HttpErrorResponse) => {
              this.alertService.errorAlert(err.error.message);
            }
          );
    }
  }

  cancel() {
    this.router.navigate([
      `${AuthService.getModulePrefix}/institute-notification`,
    ]);
  }

  search(event: any) {
    if (event.target.value == '') {
      this.fetchInstitutes(this.institutePage, false);
    } else {
      const searchText = event.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
              this.authService.enrollAllInstituesListRes(this.institutePage,this.instituteSize, searchText)
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((data: any) => {
          this.institutes = data.institutes;
          this.totalInstitutes=data.totalCount;
        });
      });
  }
}

