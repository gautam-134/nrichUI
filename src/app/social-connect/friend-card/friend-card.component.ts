import { Component, Input, OnInit } from '@angular/core';
import { Friends } from '../suggested-friends/suggested-friends.component';
import { LoaderService } from 'src/app/loader.service';
import { SocialApiService } from '../services/social-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';

@Component({
  selector: 'app-friend-card',
  standalone: true,
  imports: [],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.scss'
})
export class FriendCardComponent implements OnInit {
  @Input() friend!: Friends;
  constructor(
    private loader: LoaderService,
    private api: SocialApiService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
  }

  sendFriendRequest(friend: Friends) {
    this.loader.showLoader(this.api.sendFriendRequests(friend.id)).subscribe({
      next: (data: ApiResponse) => {
        friend.status='REQUESTED'
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(error.error.message);
      },
    });
  }
}
