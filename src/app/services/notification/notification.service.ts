import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationVO } from 'src/app/model/Notification';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  liveNotification = new Subject<any>();

  getInstituteNotifications(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', AuthService.getInstituteId)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam)
            .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/instituteNotifications`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  getBellNotifications(page: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getBellNotifications/${AuthService.getInstituteId}/${page}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  updateNotificationStatus(notificationId?: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      notificationId == undefined
        ? new HttpParams().append('instituteId', AuthService.getInstituteId)
        : new HttpParams()
            .append('instituteId', AuthService.getInstituteId)
            .append('notificationId', notificationId);
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/updateNotificationStatus/`,
      { headers: headers, params: params }
    );
  }

  getNotifiedInstitutes(
    notificationId: number,
    page: number,
    size: number,
    searchParam?: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('notificationId', notificationId)
            .append('page', page)
            .append('size', size)
        : new HttpParams()
            .append('notificationId', notificationId)
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getNotifiedInstitutes`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  getNotifiedUsers(
    notificationId: number,
    page: number,
    size: number,
    searchParam?: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('notificationId', notificationId)
            .append('page', page)
            .append('size', size)
        : new HttpParams()
            .append('notificationId', notificationId)
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getNotifiedUsers`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  createInstituteNotification(NotificationVO: NotificationVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/createInstituteNotification`,
      NotificationVO,
      {
        headers: headers,
      }
    );
  }

  createUserNotification(NotificationVO: NotificationVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/createUserNotification`,
      NotificationVO,
      {
        headers: headers,
      }
    );
  }

  getInstituteNotificationDetail(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/notificationDetails/${id}`,
      {
        headers: headers,
      }
    );
  }

  deleteNotification(notificationId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v2/api/deleteNotification/${notificationId}`,
      {
        headers: headers,
      }
    );
  }

  getWhatsAppActiveNumber() {
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/getWhatsAppNumbers`
    );
  }
}
