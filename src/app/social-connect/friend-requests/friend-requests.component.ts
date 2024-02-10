import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../loader.service';
import { ApiResponse } from '../../model/ApiResponse';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { ChatRoom } from '../chat/chat.component';
import { SocialApiService } from '../services/social-api.service';
import { Friends } from '../suggested-friends/suggested-friends.component';
// import { Inject } from '@angular/core';
@Component({
  selector: 'app-friend-requests',
   
  templateUrl: './friend-requests.component.html',
  styleUrl: './friend-requests.component.scss'
})
export class FriendRequestsComponent implements OnInit {
  friendRequests: Friends[] = [];
  constructor(
    private socialApiService: SocialApiService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngOnInit(): void {
    this.fetchPendingRequests();
  }

  fetchPendingRequests() {
    this.socialApiService.fetchReportsName().subscribe({
      next: (data: ApiResponse) => {
        this.friendRequests = data.body;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert(error.error.message);
      },
    });
  }

  accept(id: number, index: number) {
    this.loader
      .showLoader(this.socialApiService.acceptFriendRequests(id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.friendRequests.splice(index, 1);
          const chatRoom = new ChatRoom();
          chatRoom.id = data.body.recieverId;
          chatRoom.onlineAgo = data.body.lastActiveDate;
          chatRoom.profileImage = data.body.recieverProfileImage;
          chatRoom.status = data.body.recieverStatus;
          chatRoom.name = data.body.recieverName;
          this.socialApiService.refreshRooms.next(chatRoom);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }
  reject(id: number, index: number) {
    this.loader
      .showLoader(this.socialApiService.rejectFriendRequests(id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.friendRequests.splice(index, 1);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }
}
