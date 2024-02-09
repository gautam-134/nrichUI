import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { FetchClassAndMaterial } from 'src/app/model/Material';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private http: HttpClient, private authService: AuthService) { }
  saveToken(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<FetchClassAndMaterial>(
        `${environment.apiEndpoint}/users/v2/api/saveToken/${token}/${AuthService.getInstituteId}/${false}`,'',
        { headers: headers }
      )
      .pipe(map((res) => res.data));
  }
}
