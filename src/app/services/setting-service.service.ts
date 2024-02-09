import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';
import { RazorpayDetails } from '../model/razorPayDetails';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SettingServiceService {
  constructor(private http: HttpClient) {}
  saveRazorPayDetails(razorPayDetailsVO: RazorpayDetails) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/save/instituteRazorPaydetails`,
      razorPayDetailsVO,
      {
        headers: headers,
      }
    );
  }

  fetchInstituteRazorPayDetails(instituteId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<RazorpayDetails>(
      `${environment.apiEndpoint}/users/v2/api/fetch/instituteRazorPaydetails?instituteId=${instituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchToken() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/createVerificationToken/${AuthService.getInstituteId}`,
      '',
      {
        headers: headers,
      }
    );
  }

  savePageToken(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/savePageToken/${token}/${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  fetchAllowedHeaderNames() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/allowed/column/names/${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }
}
