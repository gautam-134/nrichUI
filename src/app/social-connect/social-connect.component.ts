import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';
import { ApiResponse } from '../model/ApiResponse';
import { AuthService } from '../services/auth.service';
import { UserProfile } from './create-profile/create-profile.component';
import { RxStompService } from './services/rx-stomp.service';
import { SocialApiService } from './services/social-api.service';
import { SwalAlertService } from '../services/alert/swal-alert.service';
import { RxStompState } from '@stomp/rx-stomp';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-social-connect',
   
  templateUrl: './social-connect.component.html',
  styleUrl: './social-connect.component.scss'
})
export class SocialConnectComponent implements OnInit, OnDestroy {
  @Output('desktopHamburgerClick')
  desktopHamburgerClick: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  opensidebar!: any;
  scrHeight!: number;
  removecss!: boolean;
  userProfile = new UserProfile();
  response: boolean = false;
  socketStateSubscription!: Subscription;
  constructor(
    private socialApi: SocialApiService,
    private loader: LoaderService,
    private router: Router,
    private rxStompService: RxStompService,
    private alert: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    this.rxStompService.deactivate();
    if (this.socketStateSubscription)
      this.socketStateSubscription.unsubscribe();
    this.userIsActiveOrInactive('Offline');
  }

  ngOnInit(): void {
    this.rxStompService.activate();
    this.isRedirecToProfileOrNewsFeed();
    this.getScreenSize();
    this.subscribeToSocketState();
  }

  subscribeToSocketState() {
    this.socketStateSubscription =
      this.rxStompService.connectionState$.subscribe((state) => {
        if (state === RxStompState.OPEN) {
          // Connection is established
          this.userIsActiveOrInactive('Online');
        } else if (state === RxStompState.CLOSED) {
          // Connection is disconnected
          this.userIsActiveOrInactive('Offline');
        }
      });
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.userIsActiveOrInactive('Offline');
  }

  userIsActiveOrInactive(status: string) {
    this.socialApi.setUserStatus(status).subscribe({
      next: (data: ApiResponse) => {},
      error: (error: HttpErrorResponse) => {},
    });
  }

  toggleDesktopSidebarOpen(value: Boolean) {
    this.opensidebar = value;
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;

    if (window.innerWidth <= 900) {
      this.removecss = true;
    } else {
      this.removecss = false;
    }
  }

  setAuth() {
    this.socialApi.fetchProfile().subscribe({
      next: (response: ApiResponse) => {
        this.userProfile = response.body;
        if (
          AuthService.getUserProfileId == undefined ||
          AuthService.getUserProfileId != this.userProfile.id.toString()
        ) {
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          auth.user_profile_id = this.userProfile.id.toString();
          localStorage.setItem('auth', JSON.stringify(auth));
        }
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  isRedirecToProfileOrNewsFeed() {
    this.loader.showLoader(this.socialApi.fetchProfile()).subscribe({
      next: (data: ApiResponse) => {
        this.response = true;
        this.setAuth();
      },
      error: (error: HttpErrorResponse) => {
        this.createProfileIfNotExist();
      },
    });
  }

  private createProfileIfNotExist() {
    this.userProfile.instituteId = +AuthService.getInstituteId;
    this.loader
      .showLoader(this.socialApi.createProfile(this.userProfile))
      .subscribe({
        next: (data: ApiResponse) => {
          this.response = true;
          this.setAuth();
          this.router.navigate([
            `/${AuthService.getModulePrefix}/social-connect/create-profile`,
          ]);
        },
        error: (error: HttpErrorResponse) => {
          this.alert.okErrorAlert(error.error.message);
        },
      });
  }

  suggestedFriends() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/suggested-friends`,
    ]);
  }
  friendRequest() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/friend-requests`,
    ]);
  }
  friends() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/profile`,
    ]);
  }
  createProfile() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/create-profile`,
    ]);
  }
  pendingrequest() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/friend-requests`,
    ]);
  }
  newsFeed() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/newsfeed`,
    ]);
  }
}

