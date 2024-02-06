import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { NotificationDetailsComponent } from 'src/app/common/header/notification-details/notification-details.component';
import { LoaderService } from 'src/app/loader.service';
import { AdminDashboardAnayltics } from 'src/app/model/AdminDashboardAnalytics';
import { assignmentVO } from 'src/app/model/assignmentVO';
import { ClassVO } from 'src/app/model/classVO';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { BellNotificationVO } from 'src/app/model/Notification';
import { DashboardService } from 'src/app/services/admin/dashboard.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-admin-dashboard-analytics',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard-analytics.component.html',
  styleUrl: './admin-dashboard-analytics.component.scss'
})
export class AdminDashboardAnalyticsComponent implements OnInit {
  d = new Date();
  name!: string;
  gender!: string;
  adminAnalytics = new AdminDashboardAnayltics();
  liveClasses: ClassVO[] = [];
  futureClasses: ClassVO[] = [];
  liveDemo: ClassVO[] = [];
  liveWebinar: ClassVO[] = [];
  assignments: assignmentVO[] = [];
  quizs: any[] = [];
  courses: MobileCourseVO[] = [];
  totalSpace = 0;
  usedSpace = 0;

  planName: string = '';
  endDate: string = '';
  startDate: string = '';

  notifications: BellNotificationVO[] = [];
  liveNotification = new BellNotificationVO();
  subscription!: Subscription;
  page = 0;
  size = 10;
  totalNotifications: number = 0;

  apexChart!: ApexChart;
  series!: ApexAxisChartSeries;
  title!: ApexTitleSubtitle;
  xAxix!: ApexXAxis;

  radialBar!: ApexChart;
  radialBarSeries!: ApexNonAxisChartSeries;
  radiallabels: string[] = ['Storage'];
  radialplotOptions!: ApexPlotOptions;

  constructor(
    private loader: LoaderService,
    private dashboardService: DashboardService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.name = AuthService.getUserFirstName;
    this.gender = AuthService.getGender;
    this.getBellNotifications(this.page, false);
    this.subscribeLiveNotification();
    this.fetchDashboardAnaytics();
    this.fetchLiveClasses();
    this.fetchFutureClasses();
    this.fetchLiveDemoClasses();
    this.fetchLiveWebinars();
    this.fetchAssignments();
    this.fetchQuizes();
    this.initializeCharOptions();
    this.storageDetails();
    this.initializeStorageRadialBar(0, 0);
    this.fetchCourses();
  }

  private storageDetails() {
    this.loader
      .showLoader(this.dashboardService.getStorageDetails())
      .subscribe({
        next: (data) => {
          this.totalSpace = data.totalStorage;
          this.usedSpace = data.usedSpace;
          this.initializeStorageRadialBar(this.totalSpace, this.usedSpace);
          this.initializeCharOptions();
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchQuizes() {
    this.loader
      .showLoader(this.dashboardService.fetchAllQuizesForAdminDashboard())
      .subscribe({
        next: (res: any) => {
          this.quizs = res.quizes;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchAssignments() {
    this.loader
      .showLoader(this.dashboardService.fetchAllAssignmentsForAdminDashboard())
      .subscribe({
        next: (res: any) => {
          this.assignments = res.assignments;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchLiveClasses() {
    this.loader
      .showLoader(this.dashboardService.fetchLiveClassesForAdminDashboard())
      .subscribe({
        next: (res: any) => {
          this.liveClasses = res.liveClassesList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchFutureClasses() {
    this.loader
      .showLoader(this.dashboardService.fetchFutureClassesOfAdminDashboard())
      .subscribe({
        next: (res: any) => {
          this.futureClasses = res.futureClassesList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchLiveDemoClasses() {
    this.loader
      .showLoader(this.dashboardService.fetchAdminLiveDemoClassesForDashboard())
      .subscribe({
        next: (res: any) => {
          this.liveDemo = res.liveDemoClassesList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchLiveWebinars() {
    this.loader
      .showLoader(this.dashboardService.fetchAdminLiveWebinarsForDashboard())
      .subscribe({
        next: (res: any) => {
          this.liveWebinar = res.liveWebinarsList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchCourses() {
    this.loader
      .showLoader(this.dashboardService.fetchCoursesForAdminDashboard())
      .subscribe({
        next: (data: any) => {
          this.courses = data.body.courses;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchDashboardAnaytics() {
    this.loader
      .showLoader(this.dashboardService.fetchAdminDashboardAnaytics())
      .subscribe({
        next: (data: AdminDashboardAnayltics) => {
          this.adminAnalytics = data;
          this.initializeCharOptions();
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private initializeStorageRadialBar(
    totalStorage: number,
    usedSpace: number
  ): void {
    this.radialBar = {
      type: 'radialBar',
      height: '280px',
      width: '300px',
    };
    let usedStorage = (usedSpace / totalStorage) * 100;
    this.radialBarSeries = [usedStorage];
    this.radiallabels = this.radiallabels;
    this.radialplotOptions = {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total Storage',
            formatter: (w) => {
              return totalStorage + '';
            },
          },
        },
      },
    };
  }

  private initializeCharOptions(): void {
    this.apexChart = {
      type: 'line',
      height: '250px',
      width: '750px',
      toolbar: {
        show: false
      },
    };
    this.series = [
      {
        name: 'Student Enrolled',
        data: this.adminAnalytics.learnerStats,
      },
    ];
    this.title = {
      text: '',
    };
    this.xAxix = {
      categories: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'Jun',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
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

  private getBellNotifications(page: number, flag: boolean) {
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

  private subscribeLiveNotification() {
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
