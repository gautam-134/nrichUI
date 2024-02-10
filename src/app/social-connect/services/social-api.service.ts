import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { PostVO } from '../../model/PostVO';
import { ApiResponse } from '../../model/ApiResponse';
import { UserProfile } from '../create-profile/create-profile.component';
import { Subject } from 'rxjs';
import { MessageVO } from '../chat-room/chat-room.component';
import { ChatRoom } from '../chat/chat.component';

@Injectable({
  providedIn: 'root',
})
export class SocialApiService {
  constructor(private http: HttpClient) {}

  postId = new Subject();
  refreshEvents = new Subject();
  refreshProfile = new Subject();
  refreshRooms = new Subject<ChatRoom>();
  fetchReportsName() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/pending-requests/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchSuggestedFriends(page: number, size: number, role: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append('page', page);
    params = params.append('size', size);
    params = params.append('role', role);
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/suggested-friends/${AuthService.getInstituteId}`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  addPost(
    data: PostVO,
    files: any[],
    links: string[],
    mediaToDelete: string[]
  ) {
    const formdata: FormData = new FormData();
    formdata.append('postVO', JSON.stringify(data));
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        formdata.append('files', files[i]);
      }
    }
    if (links.length > 0) {
      for (var i = 0; i < links.length; i++) {
        formdata.append('links', links[i]);
      }
    }
    if (mediaToDelete.length > 0) {
      for (var i = 0; i < mediaToDelete.length; i++) {
        formdata.append('mediaToDelete', mediaToDelete[i]);
      }
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/add/post/${AuthService.getInstituteId}`,
      formdata,
      {
        headers: headers,
      }
    );
  }

  fetchProfile() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/fetch/profile/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  createProfile(
    userProfile: UserProfile,
    profilePic?: File,
    coverImage?: File
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    const formdata: FormData = new FormData();
    formdata.append('profile', JSON.stringify(userProfile));
    if (profilePic) formdata.append('profilePic', profilePic);
    if (coverImage) formdata.append('coverImage', coverImage);
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/create/profile`,
      formdata,
      {
        headers: headers,
      }
    );
  }

  fetchPost(postId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/fetchPost/${postId}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchNewsfeed(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/newsfeed/${page}/${size}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  getEvents(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/events/${page}/${size}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  getEvent(postId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/event/${postId}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  sendFriendRequests(friendId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/friend/request/${friendId}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  likePost(postId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/likePost/${postId}/${AuthService.getInstituteId}`,
      '',
      {
        headers: headers,
      }
    );
  }

  commentPost(postId: number, comment: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/commentPost/${postId}/${AuthService.getInstituteId}`,
      comment,
      {
        headers: headers,
      }
    );
  }

  deleteComment(commentId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/deleteComment/${commentId}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  deletePost(postId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/deletePost/${postId}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  acceptFriendRequests(friendId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/accept/request/${friendId}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  rejectFriendRequests(friendId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/reject/request/${friendId}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  fetchProfilePosts(page: number, size: number, id?: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/profilePosts/${id}/${page}/${size}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  myFriends(id?: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams();
    if (id) params = params.append('id', id.toString());
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/fetch/friends/${AuthService.getInstituteId}`,
      { headers: headers, params: params }
    );
  }

  myProfile(id?: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams();
    if (id) {
      params = params.append('id', id);
    }
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/my-profile/${AuthService.getInstituteId}`,
      { headers: headers, params }
    );
  }

  unFriend(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/unfriend/${id}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  sendMessage(chatRoom: string, messageVO: MessageVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/message/${chatRoom}/${AuthService.getInstituteId}`,
      messageVO,
      { headers: headers }
    );
  }

  createOrFetchRoom(profileId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/find/room/${profileId}/${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }
  getUsersGlobally(search: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/globalSearch/${search}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchMyRooms() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/fetch/rooms/${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }

  fetchRoomMessages(chatRoomName: string, page: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/messages/${chatRoomName}/${page}/${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }

  deleteMessage(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/delete/message/${id}/${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }

  focusIn(roomName: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/focus/in/${roomName}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  focusOut(roomName: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/focus/out/${roomName}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  setUserStatus(status:string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/chat/user/status/${status}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }
}
