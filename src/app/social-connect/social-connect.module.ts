import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialConnectRoutingModule } from './social-connect-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SocialConnectComponent } from './social-connect.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { StoriesComponent } from './stories/stories.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { CommonModule2 } from '../common/common.module';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './post/post.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { SuggestedFriendsComponent } from './suggested-friends/suggested-friends.component';
import { FriendCardComponent } from './friend-card/friend-card.component';
import { UpcomingBirthdayComponent } from './upcoming-birthday/upcoming-birthday.component';
import { StickyNotesComponent } from './sticky-notes/sticky-notes.component';
import { AddStickyNoteComponent } from './sticky-notes/add-sticky-note/add-sticky-note.component';
import { NewsfeedPostsComponent } from './newsfeed-posts/newsfeed-posts.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AbuseReportListingComponent } from './abuse-report-listing/abuse-report-listing.component';
import { AbuseReportedByComponent } from './abuse-report-listing/abuse-reported-by/abuse-reported-by.component';
import { ReportAbuseOnPostComponent } from './newsfeed-posts/report-abuse-on-post/report-abuse-on-post.component';
import { ProfileComponent } from './profile/profile.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { MyFriendsComponent } from './profile/my-friends/my-friends.component';
import { TimelineComponent } from './profile/timeline/timeline.component';
import { AboutComponent } from './profile/about/about.component';
import { TakeActionOnReportedPostComponent } from './view-post/take-action-on-reported-post/take-action-on-reported-post.component';
import { EventsComponent } from './events/events.component';
import { RxStompService } from './services/rx-stomp.service';
import { rxStompServiceFactory } from './socket-config/rx-stomp-service-factory';
import { ChatComponent } from './chat/chat.component';
import { FloatingChatWindowComponent } from './floating-chat-window/floating-chat-window.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';

@NgModule({
  declarations: [
    SocialConnectComponent,
    CreatePostComponent,
    ViewPostComponent,
    StoriesComponent,
    OnlineUsersComponent,
    NewsfeedComponent,
    CreateProfileComponent,
    PostComponent,
    ImageCropperComponent,
    FriendRequestsComponent,
    SuggestedFriendsComponent,
    FriendCardComponent,
    UpcomingBirthdayComponent,
    StickyNotesComponent,
    AddStickyNoteComponent,
    NewsfeedPostsComponent,
    AbuseReportListingComponent,
    AbuseReportedByComponent,
    ReportAbuseOnPostComponent,
    ProfileComponent,
    MyProfileComponent,
    MyFriendsComponent,
    TimelineComponent,
    AboutComponent,
    TakeActionOnReportedPostComponent,
    EventsComponent,
    ChatComponent,
    FloatingChatWindowComponent,
    ChatRoomComponent,
    GlobalSearchComponent,
    EmojiPickerComponent,
    ChatRoomsComponent
    
  ],
  imports: [
    CommonModule,
    SocialConnectRoutingModule,
    CommonModule2,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    TagInputModule,
    ImageCropperModule,
    MatIconModule,
    MatMenuModule,
    MatMenuModule,
    MatAutocompleteModule,
    PickerModule
  ], 
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
})
export class SocialConnectModule {}
