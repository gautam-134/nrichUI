import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { map } from 'rxjs';
import { InstituteLeadsVO } from 'src/app/model/InstituteLeadsVO';
import {
  crmLeadComments,
  CrmLeadTrackerVO,
} from 'src/app/model/CrmLeadTrackerVO';
import { FacebookLeadData } from 'src/app/crm/facebook-leads/facebook-leads.component';

@Injectable({
  providedIn: 'root',
})
export class CRMService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchCrmDashboardAnaytics() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchCrmDashboardAnalytics?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  fetchCrmDashboardLeadsStats(statType: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchCrmDashboardLeadsStats?instituteId=${AuthService.getInstituteId}&statType=${statType}`,
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  fetchTotalLeadsRecord(recordType: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchCrmDashboardTotalLeads?instituteId=${AuthService.getInstituteId}&statType=${recordType}`,
        { headers: headers }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  getFormFields() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getFormFields/${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchStatusAndSubStatus() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchStatusAndSubStatus`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  getFormFieldsAndData(leadId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getFormFieldsAndData/${AuthService.getInstituteId}/${leadId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchLeadData(leadId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getLeadData/${leadId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  getInstituteLeads(
    page: number,
    size: number,
    status: string,
    onSubStatusId: string,
    leadType: string,
    assignTo:string,
    searchParam?: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = searchParam
      ? new HttpParams()
          .append('page', page)
          .append('size', size)
          .append('searchParam', searchParam)
          .append('instituteId', +AuthService.getInstituteId)
          .append('status', status)
          .append('subStatus', onSubStatusId)
          .append('leadType', leadType)
          .append('assignTo', assignTo)
      : new HttpParams()
          .append('page', page)
          .append('size', size)
          .append('instituteId', +AuthService.getInstituteId)
          .append('status', status)
          .append('subStatus', onSubStatusId)
          .append('leadType', leadType)
          .append('assignTo', assignTo);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getInstituteLeads`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }
  getInstituteFollowUpLeads(
    page: number,
    size: number,
    status: string,
    onSubStatusId: string,
    filterType: any,
    searchParam?: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = searchParam
      ? new HttpParams()
          .append('page', page)
          .append('size', size)
          .append('filterType', filterType)
          .append('searchParam', searchParam)
          .append('status', status)
          .append('subStatus', onSubStatusId)
          .append('instituteId', +AuthService.getInstituteId)
      : new HttpParams()
          .append('page', page)
          .append('size', size)
          .append('filterType', filterType)
          .append('status', status)
          .append('subStatus', onSubStatusId)
          .append('instituteId', +AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getFollowUpLeads`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }
  addField(id: number, fieldName: string, isRequired: boolean) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('id', id)
      .append('fieldName', fieldName)
      .append('isRequired', isRequired)
      .append('instituteId', AuthService.getInstituteId);
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/addField`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  addLead(instituteLeadsVO: InstituteLeadsVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/addLead`,
        instituteLeadsVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  saveLeadsCSV(data: InstituteLeadsVO[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/uploadLeadsCSV`,
        data,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res));
  }

  editLead(instituteLeadsVO: InstituteLeadsVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/editLead`,
        instituteLeadsVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  deleteField(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/deleteField/${id}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchAllTeachersAndAdminsOfInstitute() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllTeachersAndAdmins/${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }
  fetchInsituteCourses() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteCourses/${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchAssignedUserofLead(leadId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAssignedUser/${leadId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  assignLead(crmLeadTrackerVO: CrmLeadTrackerVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/assignLead`,
        crmLeadTrackerVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  deleteLeads(leadIds: number[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.delete<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/deleteLeads?leadIds=${leadIds}`,
      {
        headers: headers,
      }
    );
  }

  addCommentToLead(crmLeadCommentsVO: crmLeadComments) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/addCommentToLead`,
        crmLeadCommentsVO,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchHistoryOfLead(leadId: number, page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchHistoryOfLead/${leadId}/${page}/${size}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchLeadTrackerComments(leadTrackerId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchLeadTrackerComments?leadTrackerId=${leadTrackerId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  downloadSampleCSV() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/downloadSampleCSV/${AuthService.getInstituteId}`,
      {
        headers: headers,
        responseType: 'blob',
      }
    );
  }

  failedToConvertLeads(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/failed/to/convert/leads/${AuthService.getInstituteId}/${page}/${size}`,
      {
        headers: headers,
      }
    );
  }

  saveFacebookLeads(leads: FacebookLeadData[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams().append(
      'instituteId',
      AuthService.getInstituteId
    );
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/import/fb/leads`,
      leads,
      {
        headers: headers,
        params: params,
      }
    );
  }
}
