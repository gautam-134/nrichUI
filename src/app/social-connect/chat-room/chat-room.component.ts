import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { RxStompService } from '../services/rx-stomp.service';
import { SocialApiService } from '../services/social-api.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  chatRoomResponse!: ChatRoomResponse;
  chatRoomMessagesResponse = new ChatRoomMessagesResponse();
  message: string = '';
  formattedText: string = '';
  messageList: MyMessages[] = [];
  myProfileId!: number;
  roomSubscription!: Subscription;
  deleteMessageSubscription!: Subscription;
  focusInSubscription!: Subscription;
  focusOutSubscription!: Subscription;
  page: number = 0;
  hoverId: number | undefined;
  showLoader: boolean = false;
  isRecieverFocusIn: boolean = false;
  @ViewChild('inputBox') inputBox!: ElementRef;
  constructor(
    private rxStompService: RxStompService,
    private socialConnectService: SocialApiService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private ngZone: NgZone,
    public location: Location
  ) {}
  ngOnDestroy(): void {
    if (this.roomSubscription) this.roomSubscription.unsubscribe();
    if (this.deleteMessageSubscription)
      this.deleteMessageSubscription.unsubscribe();
    if (this.focusOutSubscription) this.focusOutSubscription.unsubscribe();
    if (this.focusInSubscription) this.focusInSubscription.unsubscribe();
  }

  scrollWindowToBottom(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          left: 0,
          behavior: 'smooth', // Use 'auto' for instant scrolling without animation
        });
      }, 100); // Adjust the delay as needed
    });
  }

  ngOnInit(): void {
    this.myProfileId = +AuthService.getUserProfileId;
    this.subscribeQueryParamsId();
  }

  onEnterKeyPress(event: any) {
    event.preventDefault();
    this.onSendMessage();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // const windowHeight = window.innerHeight;
    // const documentHeight = document.documentElement.scrollHeight;
    let scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    //const maxScrollPosition = documentHeight - windowHeight;
    scrollPosition=scrollPosition-121
    if (
      scrollPosition == 0 &&
      this.page != 0 &&
      this.messageList.length < this.chatRoomMessagesResponse.totalCount
    ) {
      this.fetchMyMessages(this.chatRoomResponse.roomName);
    }
  }

  subscribeQueryParamsId() {
    this.activatedRoute.params.subscribe((data: Params) => {
      if (this.roomSubscription) this.roomSubscription.unsubscribe();
      this.page = 0;
      this.messageList = [];
      this.createOrFetchRoomId(data['id']);
    });
  }

  fetchMyMessages(roomName: string) {
    this.showLoader = true;
    this.socialConnectService.fetchRoomMessages(roomName, this.page).subscribe({
      next: (data: ApiResponse) => {
        this.showLoader = false;
        this.chatRoomMessagesResponse = data.body;
        this.subscribeToReciverBlurEvent();
        this.subscribeToReciverFocusInEvent();
        this.messageList = [
          ...this.chatRoomMessagesResponse.messages,
          ...this.messageList,
        ];
        this.messageList.reverse()
        this.page = this.page + 1;
        if (this.messageList.length > 4 && this.page == 1)
          this.scrollWindowToBottom();
      },
      error: (error: HttpErrorResponse) => {
        this.showLoader = false;
        this.alertService.okErrorAlert(error.error.message);
      },
    });
  }

  createOrFetchRoomId(profileId: number) {
    this.loader
      .showLoader(this.socialConnectService.createOrFetchRoom(profileId))
      .subscribe({
        next: (data: ApiResponse) => {
          this.chatRoomResponse = data.body;
          this.fetchMyMessages(this.chatRoomResponse.roomName);
          this.onDeleteMessage();
          // if (this.chatRoomResponse.recieverId) {
          //   const chatRoom = new ChatRoom();
          //   chatRoom.id = this.chatRoomResponse.recieverId;
          //   chatRoom.onlineAgo = this.chatRoomResponse.lastActiveDate;
          //   chatRoom.profileImage = this.chatRoomResponse.recieverProfileImage;
          //   chatRoom.status = this.chatRoomResponse.recieverStatus;
          //   chatRoom.name = this.chatRoomResponse.recieverName;
          //   this.socialConnectService.refreshRooms.next(chatRoom);
          // }
          this.receiveMessages();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  receiveMessages() {
    this.roomSubscription = this.rxStompService
      .watch(`/message/${this.chatRoomResponse.roomName}`)
      .subscribe((message: Message) => {
        const myMessage: MyMessages = JSON.parse(message.body);
        myMessage.message = myMessage.message.replace('\n', '</br>');
        this.messageList.push(myMessage);
        if (this.messageList.length > 4 && this.page == 1)
          this.scrollWindowToBottom();
      });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }

  onDeleteMessage() {
    this.deleteMessageSubscription = this.rxStompService
      .watch(`/message/delete/${this.chatRoomResponse.roomName}`)
      .subscribe((message: Message) => {
        const id = JSON.parse(message.body);
        const index = this.messageList.findIndex((value) => value.id == id);
        if (index != -1) this.messageList.splice(index, 1);
      });
  }

  onSendMessage() {
    if(this.message=='') return
    const message: MessageVO = new MessageVO();
    message.message = this.message;
    this.loader
      .showLoader(
        this.socialConnectService.sendMessage(
          this.chatRoomResponse.roomName,
          message
        )
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.message = '';
          this.formattedText = '';
          this.inputBox.nativeElement.blur()
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  onEmojiSelection($event: any) {
    this.message = this.message + ' ' + $event;
  }
  formatText() {
    this.formattedText = this.message.replace(/\n/g, '<br>');
  }

  deleteMessage(id: number, i: number) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete this message?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.socialConnectService.deleteMessage(id))
          .subscribe({
            next: (data: ApiResponse) => {
              this.messageList.splice(i, 1);
            },
            error: (error: HttpErrorResponse) => {
              this.alertService.errorAlert(error.error.message);
            },
          });
      } else if (result.isDenied) {
      }
    });
  }

  onFocus(event: any) {
    this.socialConnectService
      .focusIn(this.chatRoomResponse.roomName)
      .subscribe({
        next: (data: ApiResponse) => {},
        error: (error: HttpErrorResponse) => {},
      });
  }

  subscribeToReciverFocusInEvent() {
    this.focusInSubscription = this.rxStompService
      .watch(
        `/message/focusin/${this.chatRoomResponse.roomName}/${this.chatRoomMessagesResponse.recieverId}`
      )
      .subscribe((message: Message) => {
        this.isRecieverFocusIn = true;
      });
  }

  subscribeToReciverBlurEvent() {
    this.focusOutSubscription = this.rxStompService
      .watch(
        `/message/focusout/${this.chatRoomResponse.roomName}/${this.chatRoomMessagesResponse.recieverId}`
      )
      .subscribe((message: Message) => {
        this.isRecieverFocusIn = false;
      });
  }

  onBlur(event: any) {
    this.socialConnectService
      .focusOut(this.chatRoomResponse.roomName)
      .subscribe({
        next: (data: ApiResponse) => {},
        error: (error: HttpErrorResponse) => {},
      });
  }
}

export class MessageVO {
  id!: number;
  message!: string;
}

export class ChatRoomResponse {
  recieverId!: number;
  recieverProfileImage!: string;
  recieverName!: string;
  recieverStatus!: string;
  lastActiveDate!: string;
  roomName!: string;
}

export class MyMessages {
  id!: number;
  message!: string;
  profileId!: number;
  date!: Date;
}

export class ChatRoomMessagesResponse {
  senderId!: number;
  recieverId!: number;
  senderProfilePic!: string;
  recieverProfilePic!: string;
  messages: MyMessages[] = [];
  totalCount!: number;
  recieverName!: string;
  senderName!: string;
  chatDisabled!: boolean;
}
