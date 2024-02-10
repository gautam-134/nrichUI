import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { StickyNoteVO } from '../model/StickyNoteVO';
import { ApiResponse } from '../model/ApiResponse';
import { map } from 'rxjs';
import { ReportAbuseVO } from '../model/ReportAbuseVO';
import { ReportedPostActionVO } from '../model/ReportedPostActionVO';

@Injectable({
  providedIn: 'root',
})
export class SocialApiService {
  constructor(private http: HttpClient) {}

  fetchReportsName() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/pending-requests`,
      {
        headers: headers,
      }
    );
  }

  fetchSuggestedFriends() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/suggested-friends`,
      {
        headers: headers,
      }
    );
  }

  fetchUpcomingBirthdays(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/get/usersBirthday/${AuthService.getInstituteId}?page=${page}&size=${size}`,
      {
        headers: headers,
      }
    );
  }

  addStickyNote(stickyNoteVO: StickyNoteVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.socialConnectEndpoint}/socialconnect/v2/api/add/stickyNote/${AuthService.getInstituteId}`,
        stickyNoteVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  reportOnPost(reportAbuseVO: ReportAbuseVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.socialConnectEndpoint}/socialconnect/v2/api/report/abuse/${AuthService.getInstituteId}`,
        reportAbuseVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchPost(postId?: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/fetchPost/${postId}`,
      {
        headers: headers,
      }
    );
  }

  fetchStickyNotes(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/get/stickyNotes/${AuthService.getInstituteId}?page=${page}&size=${size}`,
      {
        headers: headers,
      }
    );
  }

  deleteStickyNote(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete<ApiResponse>(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/delete/stickyNote?id=${id}`,
      {
        headers: headers,
      }
    );
  }

  fetchAbusedReportedPostRecord(page: number, size: number,type:string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/get/abuse/reports/${AuthService.getInstituteId}?page=${page}&size=${size}&type=${type}`,
      {
        headers: headers,
      }
    );
  }

  fetchAllAbusedReportsOfPost(postId: number, page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.socialConnectEndpoint}/socialconnect/v2/api/get/all/abuse/reportsOfPost?postId=${postId}&page=${page}&size=${size}`,
      {
        headers: headers,
      }
    );
  }

  takeActionOnReportedPost(reportedPostActionVO: ReportedPostActionVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.socialConnectEndpoint}/socialconnect/v2/api/take/action/reported/post/${AuthService.getInstituteId}`,
        reportedPostActionVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }
}
