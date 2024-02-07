import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, debounceTime, map, of } from 'rxjs';
import { UserInstitutes } from 'src/app/auth/login/select-institute/select-institute.component';
import { LoaderService } from 'src/app/loader.service';
import { Auth } from 'src/app/model/Auth';
import { MyplanDetails } from 'src/app/model/MyPlanDetails';
import { BellNotificationVO } from 'src/app/model/Notification';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MyplanService } from 'src/app/services/myplan.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PlanDetailsComponent } from '../plan-details/plan-details.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output('desktopHamburgerClick')
  desktopHamburgerClick: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  emitValue!: boolean;
  scrHeight!: number;
  userName: any;
  instituteImageSrc: string = 'assets/svg/logo.svg';
  imgSrc: string = '';
  result$!: Observable<any>;
  hasImage: boolean = false;
  hidesidebar!: boolean;
  planName: string | undefined;
  daysLeft: string | undefined;
  planExpiry: number = 0;
  role!: string;
  institutes: UserInstitutes[] = [];
  hasMultipleRoles: any;
  notificationRead: boolean = false;
  notifications: BellNotificationVO[] = [];
  readNotifications: number[] = [];
  unseenNotificationsCount: number = 0;
  totalNotifications: number = 0;
  subscribe!: Subscription;
  liveNotification = new BellNotificationVO();
  myplanDetailSubscription!: Subscription;
  page: number = 0;
  size: number = 5;
  isInstituteListLoaded: boolean = false;
  institutePage: number = 0;
  instituteSize: number = 5;
  totalInstitutes: number = 0;
  loginUserRole: string | undefined;
  myPlanDetails!: MyplanDetails | undefined;
  isSearchInputVisible = false;
  searchParam: string = '';
  subject = new Subject<string>();
  subDomainInstitute: number = 1;
  constructor(
    public authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private myPlanService: MyplanService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private alertService: SwalAlertService
  ) {
    this.getScreenSize();
  }

  ngOnDestroy(): void {
    if (this.subscribe) this.subscribe.unsubscribe();
    if (this.myplanDetailSubscription)
      this.myplanDetailSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.subDomainInstitute.subscribe({
      next: (data: number) => {
        this.subDomainInstitute = data;
      },
      error: (error: HttpErrorResponse) => {},
    });
    this.myPlanService.fetchPlanDetails();
    this.loginUserRole = AuthService.getRoleType;
    this.subscribeLiveNotification();
    this.hasMultipleRoles = JSON.parse(
      localStorage.getItem('auth') as string
    ).hasMultipleRoles;
    this.fetchAllInstituteList(this.institutePage, false);
    this.applyFilter();
    this.getBellNotifications(this.page, false);
    this.getScreenSize();
    this.role = AuthService.getRoleType;
    this.subscribePlanDetails();
    var auth = JSON.parse(localStorage.getItem('auth') as string);

    this.authService.getInstituteImage().subscribe({
      next: (res) => {
        res ? (this.instituteImageSrc = res) : this.instituteImageSrc;
      },
      error: (err) => {},
    });

    this.authService.getUserProfile('').subscribe(
      (res: any) => {
        this.imgSrc = res.userImagePath;
        this.userName = res.name ? res.name : auth.mobile_number;
        this.authService.nameSubject.next(
          res.name ? res.name : auth.mobile_number
        );
        this.authService.profileImageSubject.next(res.userImagePath);
        this.imgSrc?.length > 0
          ? (this.hasImage = true)
          : (this.hasImage = false);
      },
      (err: any) => {}
    );
  }

  openslider() {
    this.emitValue = !this.emitValue;
    this.desktopHamburgerClick.emit(this.emitValue);
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;

    if (window.innerWidth <= 900) {
      this.emitValue = false;
      this.hidesidebar = true;
      this.openslider();
    } else {
      this.emitValue = true;
      this.hidesidebar = false;
      this.openslider();
    }
  }

  subscribeLiveNotification() {
    this.subscribe = this.notificationService.liveNotification.subscribe(
      (data: any) => {
        this.liveNotification.id = +data.data.notificationId;
        this.liveNotification.name = data.notification.title;
        this.liveNotification.notification = data.notification.body;
        this.liveNotification.viewed = 'false';
        this.liveNotification.createdDate = new Date();
        this.liveNotification.redirection = data.data.redirection;
        this.notifications.unshift(this.liveNotification);
        this.unseenNotificationsCount += 1;
        this.liveNotification = new BellNotificationVO();
        this.openNotificationSnackbar();
      }
    );
  }

  routeToDashboard() {
    this.router.navigateByUrl(`${AuthService.getModulePrefix}/dashboard`);
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      if (this.notifications.length != this.totalNotifications) {
        this.page += 1;
        this.getBellNotifications(this.page, true);
      }
    }
  }

  openNotificationSnackbar() {
    this.snackBar.open(
      `You have ${this.unseenNotificationsCount} new notifications`,
      'OK',
      {
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
  }

  getBellNotifications(page: number, flag: boolean) {
    this.notificationService.getBellNotifications(page).subscribe({
      next: (data) => {
        if (flag == true) {
          this.notifications = this.notifications.concat(data.notifications);
        } else {
          this.notifications = data.notifications;
        }
        this.unseenNotificationsCount = data.unseenNotificationsCount;
        this.totalNotifications = data.totalCount;
      },
      error: (error) => {
        // this.alertService.errorAlert('Error while fetching notifications');
      },
    });
  }

  readAllNotifications() {
    this.notifications.map((notify) => {
      if (notify.viewed == 'false') {
        notify.viewed = 'true';
        this.readNotifications.push(notify.id);
      }
    });
    if (this.readNotifications.length > 0) {
      this.notificationService.updateNotificationStatus().subscribe({
        next: (data) => {
          this.unseenNotificationsCount = 0;
          this.readNotifications = [];
        },
        error: (error) => {
          this.notifications.map((notify) => {
            if (this.readNotifications.includes(notify.id)) {
              notify.viewed = 'false';
            }
          });
          this.readNotifications = [];
        },
      });
    }
  }

  updateNotificationStatus(notification: BellNotificationVO) {
    if (notification.redirection != '') {
      this.router.navigateByUrl(
        `${AuthService.getModulePrefix}/${notification.redirection}`
      );
    } else {
      this.dialog.open(NotificationDetailsComponent, {
        data: {
          title: notification.name,
          text: notification.notification,
        },
      });
    }

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
            this.unseenNotificationsCount -= 1;
          },
          error: (error) => {},
        });
    }
  }

  scrWidth(scrHeight: number, scrWidth: any) {
    throw new Error('Method not implemented.');
  }

  openProfile() {
    this.router.navigateByUrl(AuthService.getModulePrefix + '/profile');
  }

  subscribePlanDetails() {
    this.myplanDetailSubscription = this.myPlanService.myPlanDetails$.subscribe(
      (data: MyplanDetails | undefined) => {
        this.myPlanDetails = data;
        this.planName = data?.planName;
        this.daysLeft = data?.daysLeft;
        this.authService.planExpiry().subscribe({
          next: (data) => {
            this.planExpiry = data;
            this.showSnackbarTopPosition();
          },
          error: (error: HttpErrorResponse) => {},
        });
      }
    );
    // if (AuthService.getRoleType == InstituteRoles.InstituteAdmin) {
    //   this.loader
    //     .showLoader(this.subscriptionPlanService.fetchPlanDetails())
    //     .subscribe({
    //       next: (res) => {
    //         this.subscriptionPlanService.pricingPlanSubject.next(res);
    //         this.planName = res.planName;
    //         this.daysLeft = res.daysLeft;
    //         this.authService.planExpiry().subscribe({
    //           next: (data) => {
    //             this.planExpiry = data;
    //             this.showSnackbarTopPosition();
    //           },
    //           error: (error: HttpErrorResponse) => {},
    //         });
    //       },
    //       error: (error) => {},
    //     });
    // }
  }

  planDetails() {
    this.dialog.open(PlanDetailsComponent, {
      data: {},
      width: '100%',
      height: '99%',
    });
  }

  logout() {
    this.loader.loadingOn();
    this.authService.logout().subscribe({
      next: (data: any) => {
        this.authService.loggedInSubject.next(false);
        localStorage.clear();
        this.loader.loadingOff();
        this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.loader.loadingOff();
        this.alertService.errorAlert(error.error.message);
      },
    });
    // this.router.navigate(['/']);
  }

  selectInstitute(id: any) {
    if (!id) {
      this.alertService.errorAlert('Please Select Institute');
      return;
    }
    const selectedInstitute = this.institutes.find(
      (institute) => institute.instituteId == +id
    );
    const auth: Auth = JSON.parse(localStorage.getItem('auth') || '{}');
    auth.role.roleType = selectedInstitute?.roleType;
    auth.role.authority = selectedInstitute?.roleType;
    auth.selectedInstitute = selectedInstitute?.instituteId;
    localStorage.setItem('auth', JSON.stringify(auth));
    this.authService.loggedInSubject.next(true);
    this.myPlanService.fetchPlanDetails();
    this.redirectTo(`${AuthService.getModulePrefix}/onboard`);
  }
  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  fetchAllInstituteList(page: number, flag: any) {
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
  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.authService.enrollAllInstituesListRes(
                  this.page,
                  this.instituteSize,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((data: any) => {
          this.institutes = data.institutes;
          this.totalInstitutes = data.totalCount;
        });
      });
  }

  showSnackbarTopPosition() {
    var splitted = this.daysLeft?.split(' ');
    if (splitted != undefined && +splitted[0] == this.planExpiry) {
      this.snackBar.open(
        'Your plan will expire tomorrow. Explore plans for enjoying latest and new features',
        '✖️',
        {
          panelClass: ['custom-style'],
          verticalPosition: 'top',
          horizontalPosition: 'right',
        }
      );
    }
  }
  onScrollOfInstitutes(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      if (this.institutes.length != this.totalInstitutes) {
        this.institutePage += 1;
        this.fetchAllInstituteList(this.institutePage, true);
      }
    }
  }
  openSettings() {
    this.router.navigateByUrl(AuthService.getModulePrefix + '/settings');
  }

  openReferralDetails() {
    this.router.navigateByUrl(
      AuthService.getModulePrefix + '/my-referral-details'
    );
  }

  openPurchaseHistory() {
    this.router.navigateByUrl(
      AuthService.getModulePrefix + '/purchase-history'
    );
  }

  toggleSearchInput(event: Event) {
    event.stopPropagation();
    this.isSearchInputVisible = !this.isSearchInputVisible;
  }

  search(event: any) {
    if (event.target.value == '') {
      this.fetchAllInstituteList(this.institutePage, false);
    } else {
      const searchText = event.target.value;
      this.subject.next(searchText);
    }
  }
}
