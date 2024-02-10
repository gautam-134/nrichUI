import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LoaderService } from '../../../loader.service';
import { ApiResponse } from '../../../model/ApiResponse';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { SocialApiService } from '../../services/social-api.service';
import { Friends } from '../../suggested-friends/suggested-friends.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-friends',
   
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.scss'
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