import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ReportingRequest } from 'src/app/model/ReportingRequest';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  isReportUpload = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  fetchReportsName() {
    let instituteId = AuthService.getInstituteId;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetch/report/types?instituteId=${instituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchAllReportsRecords(page: number, size: number) {
    let instituteId = AuthService.getInstituteId;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetch/report/records?instituteId=${instituteId}&page=${page}&size=${size}`,
      {
        headers: headers,
      }
    );
  }

  fetchCriteriaFields(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/report/criteria/fields?id=${id}&instituteId=${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchCriteriaFieldsSubValues(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/report/criteria/fields/values?id=${id}`,
      {
        headers: headers,
      }
    );
  }

  createReport(report: ReportingRequest) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/generate/report`,
      report,
      {
        headers: headers,
      }
    );
  }
}
