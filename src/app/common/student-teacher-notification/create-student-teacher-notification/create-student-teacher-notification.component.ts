import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { NotificationVO } from 'src/app/model/Notification';
import { LoaderService } from 'src/app/loader.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-student-teacher-notification',
  standalone: true,
  imports: [],
  templateUrl: './create-student-teacher-notification.component.html',
  styleUrl: './create-student-teacher-notification.component.scss'
})
export class CreateStudentTeacherNotificationComponent implements OnInit {
  students: UserV2VO[] = [];
  teachers: UserV2VO[] = [];
  admins: UserV2VO[] = [];
  users: UserV2VO[] = [];

  notificationForm!: FormGroup;
  tags!: { value: string }[];
  notificationDetails = new NotificationVO();

  NotificationVO: NotificationVO = new NotificationVO();
  submitted: boolean = false;
  instituteId!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: SwalAlertService,
    private loader: LoaderService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.instituteId = AuthService.getInstituteId;
    this.fetchInstituteUsers();
    this.initializeForm();
  }

  initializeForm() {
    this.notificationForm = this.fb.group({
      id: [this.notificationDetails.id ? this.notificationDetails.id : null],
      name: [this.notificationDetails.name, Validators.required],
      role: ['', Validators.required],
      notification: [
        this.notificationDetails.notification,
        Validators.required,
      ],
      metaTags: [this.notificationDetails.metaTags],
      toIds: [this.notificationDetails.toIds, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.notificationForm.valid) {
      this.NotificationVO = this.notificationForm.value;
      this.NotificationVO.instituteId = +this.instituteId;
      this.NotificationVO.toIds = this.notificationForm.controls['toIds'].value;
      (this.NotificationVO.metaTags = this.tags.map(function (a: any) {
        return a['value'];
      })),
        this.loader
          .showLoader(
            this.notificationService.createUserNotification(this.NotificationVO)
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

  fetchInstituteUsers() {
    this.authService.fetchUsersByInstitute().subscribe({
      next: (data: any) => {
        this.students = data.students;
        this.teachers = data.teachers;
        this.admins = data.admins;
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.errorAlert('Error while fetching students');
      },
    });
  }

  get form() {
    return this.notificationForm.controls;
  }

  updateUsers(event: any) {
    if (event.target.value == 'Admin') {
      this.users = this.admins;
    } else if (event.target.value == 'Teacher') {
      this.users = this.teachers;
    } else if (event.target.value == 'Student') {
      this.users = this.students;
    }
  }
}

export class UserV2VO {
  id!: number;
  name!: string;
}
