import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbuseReportListingComponent } from './abuse-report-listing/abuse-report-listing.component';
import { AbuseReportedByComponent } from './abuse-report-listing/abuse-reported-by/abuse-reported-by.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { ProfileComponent } from './profile/profile.component';
import { SocialConnectComponent } from './social-connect.component';
import { AddStickyNoteComponent } from './sticky-notes/add-sticky-note/add-sticky-note.component';
import { StickyNotesComponent } from './sticky-notes/sticky-notes.component';
import { SuggestedFriendsComponent } from './suggested-friends/suggested-friends.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { EventsComponent } from './events/events.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

const routes: Routes = [
  {
    path: '',
    component: SocialConnectComponent,
    children: [
      {
        path: 'newsfeed',
        component: NewsfeedComponent,
      },
      {
        path: 'create-profile',
        component: CreateProfileComponent,
      },
      {
        path: 'friend-requests',
        component: FriendRequestsComponent,
      },
      {
        path: 'suggested-friends',
        component: SuggestedFriendsComponent,
      },
      {
        path: 'sticky-notes',
        component: StickyNotesComponent,
      },
      {
        path: 'add-sticky-note',
        component: AddStickyNoteComponent,
      },
      {
        path: 'abuse-reports',
        component: AbuseReportListingComponent,
      },
      {
        path: 'abused-reported-by',
        component: AbuseReportedByComponent,
      },
      {
        path: 'view-post',
        component: ViewPostComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'events/:id',
        component: EventsComponent,
      },
      {
        path: 'events',
        component: EventsComponent,
      },
      {
        path: 'chat/:id',
        component: ChatRoomComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialConnectRoutingModule {}
