import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { Roles } from '../../model/Roles';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  authService: any;
  constructor(private http: HttpClient) {}

  fetchRolesOfInstitute() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchRolesOfInstitute/${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res: any) => res.body));
  }

  addRole(role: Roles) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/addRole/${AuthService.getInstituteId}`,
        role,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchScreenMapping(roleId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchScreens/${roleId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  saveScreenMapping(
    roleId: number,
    screenMappingIds: number[],
    appScreenMappingIds: number[]
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append(
      'screenIds',
      screenMappingIds.toString()
    );
    params = params.append('appScreenMappingIds', appScreenMappingIds.toString());
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/saveScreenMapping/${roleId}`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  delete(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .delete<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/deleteRole/${id}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  hasSignUpAccess() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/hasSignUpAccess`,
        '',
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  hasModuleAccess(moduleId: number | undefined, instituteId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/hasModuleAccess/${moduleId}/${instituteId}`,
        '',
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }
}
