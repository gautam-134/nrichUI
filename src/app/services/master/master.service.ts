import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ApiResponse } from '../../model/ApiResponse';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getAllStudents(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams().append('page', page).append('size', size)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllStudents`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res?.body));
  }

  getStudentDetails(
    studentId: number,
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
            .append('studentId', studentId)
            .append('page', page)
            .append('size', size)
        : new HttpParams()
            .append('studentId', studentId)
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchStudentDetails`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res?.body));
  }

  getAllAdmins(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams().append('page', page).append('size', size)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllAdmins`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res?.body));
  }

  getAdminDetails(
    adminId: number,
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
            .append('adminId', adminId)
            .append('page', page)
            .append('size', size)
        : new HttpParams()
            .append('adminId', adminId)
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAdminDetails`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res?.body));
  }
}
