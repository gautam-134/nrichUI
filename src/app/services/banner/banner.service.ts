import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BannerVO } from 'src/app/model/BannerVO';
import { AuthService } from '../auth.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getBanners(page: number, size: number, searchParam?: string) {
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
      .get<ApiResponse>(`${environment.apiEndpoint}/users/v2/api/getBanners`, {
        headers: headers,
        params: params,
      })
      .pipe(map((res) => res.body));
  }

  saveBannerDetails(data: BannerVO, bannerImage: File) {
    const formdata: FormData = new FormData();
    formdata.append('bannerDetails', JSON.stringify(data));
    formdata.append('bannerImage', bannerImage);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/createBanner`,
      formdata,
      { headers: headers }
    );
  }

  changeStatus(bannerId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/changeBannerStatus?id=${bannerId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  getBannersByLocation(location: string) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getBannersByLocation/${location}`
      )
      .pipe(map((res) => res.body));
  }
}
