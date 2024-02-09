import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { map } from 'rxjs';
import { ClassRes } from 'src/app/model/classVO';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  fetchAdminDashboardAnaytics() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAdminDashboardAnalytics?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  fetchAdminLiveWebinarsForDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveWebinarsForAdminDashboard?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchAdminLiveDemoClassesForDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveDemoClassesForAdminDashboard?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchLiveClassesForAdminDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveClassesForAdminDashboard?&instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchFutureClassesOfAdminDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/futureClassesForAdminDashboard?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchAllQuizesForAdminDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    const params = new HttpParams().append(
      'instituteId',
      AuthService.getInstituteId
    );
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllQuizsForAdminDashboard`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res?.body));
  }

  fetchCoursesForAdminDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchCoursesForAdminDashboard?instituteId=${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }

  fetchAllAssignmentsForAdminDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    const params = new HttpParams().append(
      'instituteId',
      AuthService.getInstituteId
    );
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllAssignmentsForAdminDashboard`,
        { params: params, headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  getStorageDetails() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    const params = new HttpParams().append(
      'instituteId',
      AuthService.getInstituteId
    );
    return this.http
      .get<any>(`${environment.apiEndpoint}/users/v2/api/getStorageDetails`, {
        params: params,
        headers: headers,
      })
      .pipe(map((res: ApiResponse) => res.body));
  }
}
