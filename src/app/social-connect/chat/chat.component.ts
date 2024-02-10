import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { ApiResponse } from '../../model/ApiResponse';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { RxStompService } from '../services/rx-stomp.service';
import { SocialApiService } from '../services/social-api.service';
@Component({
  selector: 'app-chat',
   
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  openChat: boolean = false;
  chatRooms: ChatRoom[] = [];
  isNewRoomCreatedSubscription!: Subscription;
  listOfSubscriptions: Subscription[] = [];
  constructor(
    private socialApiService: SocialApiService,
    private router: Router,
    private rxStompService: RxStompService,
    private alertService: SwalAlertService,
    private loader: LoaderService
  ) {}
  ngOnDestroy(): void {
    if (this.isNewRoomCreatedSubscription)
      this.isNewRoomCreatedSubscription.unsubscribe();
    this.listOfSubscriptions.forEach((value: Subscription) => {
      if (value) value.unsubscribe();
    });
  }

  isNewRoomCreated() {
    this.socialApiService.refreshRooms.subscribe((data: ChatRoom) => {
      this.subscribeToOnlineAndOflineStatus(data.id);
      this.chatRooms.unshift(data);
    });
  }

  ngOnInit(): void {
    this.isNewRoomCreated();
    this.loader.showLoader(this.socialApiService.fetchMyRooms()).subscribe({
      next: (data: ApiResponse) => {
        this.chatRooms = data.body;
        this.chatRooms.forEach(
          (value: { id: number; name: string; profileImage: string }) => {
            this.subscribeToOnlineAndOflineStatus(value.id);
          }
        );
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert(error.error.message);
      },
    });
  }

  open() {
    this.openChat = !this.openChat;
  }

  goToRoom(id: number) {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/chat/${id}`,
    ]);
  }

  subscribeToOnlineAndOflineStatus(profileId: number) {
    const subscription: Subscription = this.rxStompService
      .watch(`/isFriendActive/${profileId}`)
      .subscribe((message: Message) => {
        const msg = JSON.parse(message.body);
        const index = this.chatRooms.findIndex((value) => {
          if (value.id == msg.id) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          const obj = this.chatRooms[index];
          obj.status = msg.status;
          obj.onlineAgo = '0 sec';
        }
      });
    this.listOfSubscriptions.push(subscription);
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }
}


export class ChatRoom {
  id!: number;
  name!: string;
  profileImage!: string;
  status!: string;
  onlineAgo!: string;
}
