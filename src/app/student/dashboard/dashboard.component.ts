import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NotificationDetailsComponent } from '../../common/header/notification-details/notification-details.component';
import { LoaderService } from '../../loader.service';
import { assignmentVO } from '../../model/assignmentVO';
import { ClassVO } from '../../model/classVO';
import { MobileCourseVO } from '../../model/MobileCourseVO';
import { BellNotificationVO } from '../../model/Notification';
import { StudentDashboardCount } from '../../model/StudentDashboardCount';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { StudentService } from '../../services/student/student.service';

@Component({
  selector: 'app-dashboard',
   
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  name!: string;
  instituteName!: string;
  d = new Date();
  courses: MobileCourseVO[] = [];
  assighnments: assignmentVO[] = [];
  liveClasses: ClassVO[] = [];
  futureClasses: ClassVO[] = [];
  notifications: BellNotificationVO[] = [];
  liveNotification = new BellNotificationVO();
  pendingQuizs: any = [];
  subscription!: Subscription;
  studentDashboardCount = new StudentDashboardCount();
  totalNotifications: number = 0;
  page: number = 0;
  size: number = 10;
  constructor(
    private studentService: StudentService,
    private loader: LoaderService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.name = AuthService.getUserFirstName;
    this.loader
      .showLoader(
        this.studentService.fetchStudentCoursesWithPagination(
          AuthService.getInstituteId,
          0,
          50,
          ''
        )
      )
      .subscribe({
        next: (data: any) => {
          this.courses = data.body.courses;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
    this.loader
      .showLoader(this.studentService.fetchPendingAssignments(0, 50))
      .subscribe({
        next: (data: any) => {
          this.assighnments = data.body.assighnments;
        },
        error: (error: HttpErrorResponse) => {},
      });
    this.loader.showLoader(this.studentService.allLiveClasses()).subscribe({
      next: (data: any) => {
        this.liveClasses = data.body;
      },
      error: (error: HttpErrorResponse) => {},
    });
    this.loader.showLoader(this.studentService.allFutureClasses()).subscribe({
      next: (data: any) => {
        this.futureClasses = data.body;
      },
      error: (error: HttpErrorResponse) => {},
    });

    this.loader
      .showLoader(this.studentService.fetchPendingQuizs(0, 50))
      .subscribe({
        next: (data: any) => {
          this.pendingQuizs = data.body.quizes;
        },
        error: (error: HttpErrorResponse) => {},
      });
    this.getBellNotifications(this.page, false);
    this.subscribeLiveNotification();

    this.studentService.fetchStudentDashboardCounts().subscribe({
      next: (data: any) => {
        this.studentDashboardCount = data.body;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 1 >=
      event.target.scrollHeight
    ) {
      if (this.notifications.length != this.totalNotifications) {
        this.page += 1;
        this.getBellNotifications(this.page, true);
      }
    }
  }

  getBellNotifications(page: number, flag: boolean) {
    this.notificationService.getBellNotifications(page).subscribe({
      next: (data) => {
        if (flag == true) {
          this.notifications = this.notifications.concat(data.notifications);
        } else {
          this.notifications = data.notifications;
        }
        this.totalNotifications = data.totalCount;
      },
      error: (error) => {
        this.alertService.errorAlert('Error while fetching notifications');
      },
    });
  }

  subscribeLiveNotification() {
    this.subscription = this.notificationService.liveNotification.subscribe(
      (data: any) => {
        this.liveNotification.id = +data.data.notificationId;
        this.liveNotification.name = data.notification.title;
        this.liveNotification.notification = data.notification.body;
        this.liveNotification.viewed = 'false';
        this.notifications.unshift(this.liveNotification);
        this.liveNotification = new BellNotificationVO();
      }
    );
  }

  updateNotificationStatus(notification: BellNotificationVO) {
    this.dialog.open(NotificationDetailsComponent, {
      data: {
        title: notification.name,
        text: notification.notification,
      },
    });

    if (notification.viewed == 'false') {
      this.notificationService
        .updateNotificationStatus(notification.id)
        .subscribe({
          next: (data) => {
            this.notifications.map((notify) => {
              if (notify.id == notification.id) {
                notify.viewed = 'true';
              }
            });
          },
          error: (error) => {},
        });
    }
  }
}