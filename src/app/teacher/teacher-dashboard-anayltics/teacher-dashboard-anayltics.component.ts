import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { NotificationDetailsComponent } from 'src/app/common/header/notification-details/notification-details.component';
import { LoaderService } from 'src/app/loader.service';
import { assignmentVO } from 'src/app/model/assignmentVO';
import { ClassVO } from 'src/app/model/classVO';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { BellNotificationVO } from 'src/app/model/Notification';
import { TeacherDashboardAnayltics } from 'src/app/model/TeacherDashboardAnaytics';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/Classes/class.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-teacher-dashboard-anayltics',
  standalone: true,
  imports: [],
  templateUrl: './teacher-dashboard-anayltics.component.html',
  styleUrl: './teacher-dashboard-anayltics.component.scss'
})
export class TeacherDashboardAnaylticsComponent implements OnInit {
  d = new Date();
  courses: MobileCourseVO[] = [];
  name!: string;
  gender!: string;
  notifications: BellNotificationVO[] = [];
  liveNotification = new BellNotificationVO();
  subscription!: Subscription;
  apexChart!: ApexChart;
  series!: ApexAxisChartSeries;
  title!: ApexTitleSubtitle;
  xAxix!: ApexXAxis;
  @ViewChild('chartObj') chart!: ChartComponent;
  teacherAnalytics = new TeacherDashboardAnayltics();
  liveClasses: ClassVO[] = [];
  futureClasses: ClassVO[] = [];
  liveDemo: ClassVO[] = [];
  liveWebinar: ClassVO[] = [];
  assignments: assignmentVO[] = [];
  quizs: any[] = [];
  attendance: { className: string; presentStudents: string }[] = [];
  classNames: string[] = [];
  presentStudents: any[] = [];

  radialBar!: ApexChart;
  radialBarSeries!: ApexNonAxisChartSeries;
  radiallabels!: string[];
  radialplotOptions!: ApexPlotOptions;

  page = 0;
  size = 10;
  totalNotifications: number = 0;

  constructor(
    private loader: LoaderService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private dashboardService: TeacherService,
    private classService: ClassService,
    private alertService: SwalAlertService
  ) {}
  ngOnInit(): void {
    this.name = AuthService.getUserFirstName;
    this.gender = AuthService.getGender;
    this.getBellNotifications(this.page, false);
    this.fetchTeacherDashboardAnaytics();
    this.subscribeLiveNotification();
    this.initializeCharOptions();
    this.fetchLiveClasses();
    this.fetchFutureClasses();
    this.fetchLiveWebinars();
    this.fetchLiveDemoClasses();
    this.fetchAssignments();
    this.fetchQuizes();
    this.fetchCourses();
    this.fetchLastClassesRecords();
    this.initializeAttendanceRadialBar();
  }

  private fetchLastClassesRecords() {
    this.loader
      .showLoader(this.dashboardService.fetchLastClassesRecords())
      .subscribe({
        next: (data: { className: string; presentStudents: string }[]) => {
          for (let element in data) {
            this.presentStudents.push(+data[element].presentStudents);
            this.classNames.push(data[element].className);
          }
          this.initializeAttendanceRadialBar();
          this.initializeCharOptions();
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchTeacherDashboardAnaytics() {
    this.loader
      .showLoader(this.dashboardService.fetchTeacherDashboardAnaytics())
      .subscribe({
        next: (data: TeacherDashboardAnayltics) => {
          this.teacherAnalytics = data;
          this.initializeCharOptions();
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
  private initializeAttendanceRadialBar(): void {
    this.radialBar = {
      type: 'radialBar',
      height: '330px',
      width: '350px',
    };
    this.radialBarSeries = this.presentStudents;
    this.radiallabels = this.classNames;
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
            label: 'Total',
            formatter: function (w) {
              var sum = 0;
              w.config?.series.forEach((x: any) => (sum += x));
              return sum + '';
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
        data: this.teacherAnalytics.learnerStats,
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

  private fetchLiveClasses() {
    this.loader
      .showLoader(this.classService.fetchLiveClassesOfTeacherForDashboard())
      .subscribe({
        next: (res: any) => {
          this.liveClasses = res.LiveClassesList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchFutureClasses() {
    this.loader
      .showLoader(this.classService.fetchFutureClassesOfBatchTeacher())
      .subscribe({
        next: (res: any) => {
          this.futureClasses = res.FutureClassesList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchLiveDemoClasses() {
    this.loader
      .showLoader(this.classService.fetchTeacherLiveDemoClassesForDashboard())
      .subscribe({
        next: (res: any) => {
          this.liveDemo = res.LiveDemoClassesList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchLiveWebinars() {
    this.loader
      .showLoader(this.classService.fetchTeacherLiveWebinarsForDashboard())
      .subscribe({
        next: (res: any) => {
          this.liveWebinar = res.liveWebinarsList;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchQuizes() {
    this.loader
      .showLoader(this.dashboardService.fetchAllQuizesForTeacherDashboard())
      .subscribe({
        next: (res: any) => {
          this.quizs = res.quizes;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchAssignments() {
    this.loader
      .showLoader(this.dashboardService.fetchTeacherAssignmentsForDashboard())
      .subscribe({
        next: (res: any) => {
          this.assignments = res.assignments;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  private fetchCourses() {
    this.loader
      .showLoader(this.dashboardService.fetchTeacherCoursesForDashboard())
      .subscribe({
        next: (data: any) => {
          this.courses = data.body.courses;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }
}
