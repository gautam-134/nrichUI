import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Subscription, interval } from 'rxjs';
import { LoaderService } from './loader.service';
import { ApiResponse } from './model/ApiResponse';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase/firebase.service';
import { NotificationService } from './services/notification/notification.service';

declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'nrichUI';
  subscription!: Subscription;
  message!: any;
  networkSpeed!: number;
  intervalSubscriptioin!: Subscription;
  snacBarRef!: any;
  loaderSubscription!: Subscription;
  showLoader: boolean = false;
  appVersionObj!: { version: string; ishighPriority: boolean };
  isWhatsAppEnabled: boolean = false;
  isWhatsAppEnabledSub!: Subscription;
  isVisitedBefore: boolean = false;

  constructor(
    public loaderService: LoaderService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private changeDetection: ChangeDetectorRef,
    private matSnackBar: MatSnackBar,
    @Inject('VAPID_KEY') private VAPID_KEY: string,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.subscribeToWhatsapp();
    this.internetSpeedSubscription();
    this.noInteretConnectionListener();
    this.subscribeToLoader();

    const currentUrl = window.location.href;
    console.log('Current Url:- ', currentUrl);
    const subdomain = this.authService.getSubDomain(currentUrl);
    console.log('sub Domain:- ', subdomain);
    if (
      subdomain !== 'nrichlearning' &&
      subdomain !== 'profices' &&
      subdomain !== 'learningnewui' &&
      subdomain !== 'techglide'
    ) { 
      this.authService
        .getInstituteBySubDomain(subdomain)
        .subscribe((res: number) => {
          this.authService.subDomainInstitute.next(res);
          this.router.navigate([`/institute-info`], {
            queryParams: { id: res },
          });
        });
    } else {
      this.authService.subDomainInstitute.next(1);
    }

    this.authService.subDomainInstitute.subscribe({
      next: (data: any) => {
        console.log(data)
      }
    })

    if (this.authService.isLoggin()) {
      this.authService.loggedInSubject.next(true);
    } else {
      this.authService.loggedInSubject.next(false);
    }
    const element = document.getElementById('zmmtg-root');
    if (element) element.style.display = 'none';
    this.subscription = this.authService.loggedInSubject.subscribe(
      (isLogin: boolean) => {
        if (isLogin) this.requestPermission();
        this.listen();
      }
    );
    this.checkUpdate();
    this.subscribeToGT();
  }

  subscribeToGT() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-YJ75Q4FMM1', {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  userPermission(version: string) {
    let snack = this.matSnackBar.open(
      'New updates are available.Please reload the page',
      'Reload'
    );
    snack.onAction().subscribe(() => {
      localStorage.setItem('ver', this.appVersionObj.version);
      window.location.reload();
    });
  }

  checkUpdate() {
    const ver = this.authService.getVersion;
    this.authService.checkUpdate().subscribe({
      next: (value: ApiResponse) => {
        this.appVersionObj = value.body;
        if (this.appVersionObj.version != ver) {
          if (this.appVersionObj.ishighPriority || ver == null) {
            localStorage.setItem('ver', this.appVersionObj.version);
            window.location.reload();
            return;
          }
          this.userPermission(this.appVersionObj.version);
          return;
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  subscribeToLoader() {
    this.loaderSubscription = this.loaderService.loading$.subscribe(
      (data: boolean) => {
        this.showLoader = data;
        this.changeDetection.detectChanges();
      }
    );
  }

  internetSpeedSubscription() {
    const conn = (navigator as any).connection;
    this.intervalSubscriptioin = interval(5000).subscribe((data: any) => {
      this.networkSpeed = conn?.downlink;
      if (this.networkSpeed <= 0.2 && this.networkSpeed > 0) {
        if (!this.snacBarRef) {
          this.snacBarRef = this.snackBar
            .open(
              'You internet connection is slow. Please check your connection.',
              'OK',
              {
                duration: 20000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              }
            )
            .afterDismissed()
            .subscribe((data: any) => {
              this.snacBarRef = undefined;
            });
        }
      }
    });
  }

  noInteretConnectionListener() {
    window.addEventListener('offline', () => {
      this.snackBar.open('No Internet Connection !!', 'OK');
      window.addEventListener('online', () => {
        this.snackBar.open('You are online now !!', 'OK');
      });
    });
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: this.VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          this.firebaseService.saveToken(currentToken).subscribe({
            next: (data: any) => {},
            error: (error: HttpErrorResponse) => {},
          });
        } else {
        }
      })
      .catch((err) => {});
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      const data = payload.data;
      if (
        data &&
        +data?.['userId'] == AuthService.getUserId &&
        data?.['instituteId'] == AuthService.getInstituteId
      ) {
        this.notificationService.liveNotification.next(payload);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.intervalSubscriptioin) this.intervalSubscriptioin.unsubscribe();
    if (this.loaderSubscription) this.loaderSubscription.unsubscribe();
    if (this.isWhatsAppEnabledSub) this.isWhatsAppEnabledSub.unsubscribe();
    if (this.isWhatsAppEnabledSub) this.isWhatsAppEnabledSub.unsubscribe();
  }

  subscribeToWhatsapp() {
    this.isWhatsAppEnabledSub = AuthService.whatsappSubject$.subscribe(
      (isEnabled: boolean) => {
        this.isWhatsAppEnabled = isEnabled;
      }
    );
  }
}
