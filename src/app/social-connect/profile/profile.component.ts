import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { SocialApiService } from '../services/social-api.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { Friends } from '../suggested-friends/suggested-friends.component';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MyProfile } from './my-profile/my-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  myFriends: Friends[] = [];
  id: number | undefined;
  myProfile: MyProfile = new MyProfile();
  isFriendsTabSelected: boolean = false;
  constructor(
    private loader: LoaderService,
    private socialApi: SocialApiService,
    private alertService: SwalAlertService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: Params) => {
      if (data['id']) this.id = data['id'];
      else this.id = undefined;
      this.fetchMyProfile();
      this.fetchMyFriends();
      this.refreshProfile();
    });
  }

  refreshProfile() {
    this.socialApi.refreshProfile.subscribe({
      next: (response: any) => {
        this.fetchMyProfile();
      },
    });
  }

  fetchMyProfile() {
    this.loader
      .showLoader(
        this.id ? this.socialApi.myProfile(this.id) : this.socialApi.myProfile()
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.myProfile = data.body;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  fetchMyFriends() {
    this.loader
      .showLoader(
        this.id ? this.socialApi.myFriends(this.id) : this.socialApi.myFriends()
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.myFriends = data.body;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }
}
