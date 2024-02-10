import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../../../loader.service';
import { ApiResponse } from '../../../model/ApiResponse';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { SocialApiService } from '../../services/social-api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  @Input() myProfile!: MyProfile;
  myProfileId!: number;
  constructor(
    private loader: LoaderService,
    private socialApi: SocialApiService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.myProfileId = +AuthService.getUserProfileId;
  }

  accept() {
    this.loader
      .showLoader(this.socialApi.acceptFriendRequests(this.myProfile.id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.myProfile.status = 'FRIEND';
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }
  reject() {
    this.loader
      .showLoader(this.socialApi.rejectFriendRequests(this.myProfile.id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.myProfile.status = 'NOTFRIEND';
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }

  handleCoverImageError(event: any) {
    event.target.src = 'assets/images/page-img/profile-bg1.jpg';
  }

  sendFriendRequest() {
    this.loader
      .showLoader(this.socialApi.sendFriendRequests(this.myProfile.id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.myProfile.status = 'REQUESTED';
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }

  unFriend() {
    this.loader
      .showLoader(this.socialApi.unFriend(this.myProfile.id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.myProfile.status = 'NOTFRIEND';
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }
}

export class MyProfile {
  id!: number;
  name!: string;
  profileImage!: string;
  coverImage!: string;
  noOfPosts!: number;
  noOfFriends!: number;
  status!: string;
  educationQualification!: string;
  employmentStatus!: string;
  interest: string[] = [];
  bio!: string;
  state!: string;
  country!: string;
  dob!: string;
  gender!: string;
}
