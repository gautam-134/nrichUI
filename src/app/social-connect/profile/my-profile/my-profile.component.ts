import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SocialApiService } from '../../services/social-api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyFriendsComponent implements OnInit, OnChanges {
  @Input() myFriends: Friends[] = [];
  @Input() profileId!: number;
  roleType!: string;
  myProfileId!: number;
  constructor(
    private loader: LoaderService,
    private socialApi: SocialApiService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.myProfileId = +AuthService.getUserProfileId;
    this.roleType = AuthService.getRoleType;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges?.['profileId']?.['currentValue'])
      this.profileId = simpleChanges?.['profileId']?.['currentValue'];
  }

  unFriend(id: number, i: number) {
    this.loader.showLoader(this.socialApi.unFriend(id)).subscribe({
      next: (data: ApiResponse) => {
        this.socialApi.refreshProfile.next(true);
        this.myFriends.splice(i, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(error.error.message);
      },
    });
  }
}