import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { classData, ClassRes } from 'src/app/model/classVO';
import { environment } from 'src/environments/environment';
import { SwalAlertService } from '../alert/swal-alert.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  fetchLiveClasses(batchId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${
          environment.apiEndpoint
        }/users/v2/api/liveClasses?batchId=${batchId}&size=${10}&page=${0}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchTeacherLiveDemoClasses(
    batchId: any,
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/teacherLiveDemoClassesOfBatch?batchId=${batchId}&size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchTeacherLiveDemoClassesForDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/teacherLiveDemoClassesOfBatch?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchStudentLiveDemoClasses(
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/studentLiveDemoClasses?size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchTeacherLiveWebinarsForDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveWebinarsOfBatch?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchLiveWebinarsOfBatch(
    batchId: number,
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveWebinarsOfBatch?batchId=${batchId}&size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchFutureWebinarsOfBatch(
    batchId: number,
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/futureWebinarsOfBatch?batchId=${batchId}&size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchAllFutureWebinars(
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllFutureWebinars?size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchAllLiveWebinars(
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllLiveWebinars?size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchLiveClassesOfBatch(
    batchId: number,
    pageSize: any,
    pageNumber: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveClassesOfBatch?batchId=${batchId}&page=${pageNumber}&size=${pageSize}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchLiveClassesOfTeacherForDashboard() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/liveClassesOfBatch?&instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchFutureClassesOfBatch(
    batchId: number,
    pageSize: any,
    pageNumber: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/futureClassesOfBatch?batchId=${batchId}&page=${pageNumber}&size=${pageSize}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchFutureClassesOfBatchTeacher() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${environment.apiEndpoint}/users/v2/api/futureClassesOfBatch?instituteId=${AuthService.getInstituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchTeacherFutureDemoClasses(
    batchId: any,
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<classData>(
        `${environment.apiEndpoint}/users/v2/api/teacherFutureDemoClassesOfBatch?batchId=${batchId}&size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchStudentFutureDemoClasses(
    size: number,
    page: number,
    searchParam: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<classData>(
        `${environment.apiEndpoint}/users/v2/api/studentFutureDemoClasses?size=${size}&page=${page}&searchParam=${searchParam}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  getRecordedClassesMaterial(classId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/getRecordedClassesMaterial?classId=${classId}`,
      {
        headers: headers,
      }
    );
  }
  fetchFutureClasses(batchId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ClassRes>(
        `${
          environment.apiEndpoint
        }/users/v2/api/futureClasses?batchId=${batchId}&size=${10}&page=${0}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchRecordedClasses(
    batchId: any,
    pageSize: any,
    pageNumber: any,
    instituteId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<classData>(
        `${environment.apiEndpoint}/users/v2/api/recordedClasses?batchId=${batchId}&pageSize=${pageSize}&pageNumber=${pageNumber}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  saveVideoResumeTiming(data: {
    userId?: number;
    materialId?: number;
    videoResumeTiming?: number;
    watchTime?: number;
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/saveVideoResumeTime`,
      data,
      {
        headers: headers,
      }
    );
  }

  checkRoomLimit(classId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/checkRoomLimit/${classId}/${AuthService.getInstituteId}`,
      '',
      {
        headers: headers,
      }
    );
  }

  redirectToZoom(classScheduleId: number) {
    this.loader
      .showLoader(this.authService.getZoomStatus(classScheduleId))
      .subscribe({
        next: (data: boolean) => {
          const link = document.getElementById('meetingLink');

          if (data) {
            link?.setAttribute(
              'href',
              `${environment.zoomUrl}/meeting?${classScheduleId}&${AuthService.getInstituteId}&${AuthService.getAccessToken}`
            );
            // window.open(
            //   `${environment.zoomUrl}/meeting` +
            //     '?' +
            //     classScheduleId.toString() +
            //     '&' +
            //     AuthService.getInstituteId +
            //     '&' +
            //     AuthService.getAccessToken
            // );
            link?.click();
            return;
          }
          link?.setAttribute('href', 'https://zoom.us/join');
          link?.click();
        },
        error: (err) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  isParticipantInMeeting(classId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/participants/inmeeting/${classId}`,
      '',
      {
        headers: headers,
      }
    );
  }
  fetchClassMappedMaterial(classId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchClassMappedMaterial?classId=${classId}`,
      {
        headers: headers,
      }
    );
  }

  fetchMaterialClassesByDate(date: Date, idClassMaterial: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('date', date.toString())
      .append('idClassMaterial', idClassMaterial)
      .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllMaterialClasses`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchMaterialClassesByDateSearch(
    date: Date,
    searchParam: string,
    idClassMaterial: number
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('date', date.toString())
      .append('idClassMaterial', idClassMaterial)
      .append('searchParam', searchParam)
      .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllMaterialClasses`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchMappedMaterialClasses(idClassMaterial: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('idClassMaterial', idClassMaterial)
      .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchMappedMaterialClasses`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }
}
