import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  getCouresOfStudent() {
    const instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentCourses?instituteId=${instituteId}`,
      { headers: headers }
    );
  }

  fetchStudentCoursesWithPagination(
    id: any,
    page: any,
    size: any,
    searchParam: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentCoursesForDashboard?idInstitute=${id}&page=${page}&size=${size}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  fetchAssignments(batchId: any, pageSize: any, pageNumber: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchTeacherAssignmentsOfBatch?batchId=${batchId}&size=${pageSize}&page=${pageNumber}`,
      { headers: headers }
    );
  }

  fetchAssignmentsToStudent(batchId: any, size: any, page: any, type: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentAssignmentsOfBatch?batchId=${batchId}&size=${size}&page=${page}&type=${type}`,
      { headers: headers }
    );
  }

  fetchPendingAssignments(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentAssighnments?instituteId=${AuthService.getInstituteId}&size=${size}&page=${page}&type=pending`,
      { headers: headers }
    );
  }

  fetchPendingQuizs(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentQuizes?instituteId=${AuthService.getInstituteId}&size=${size}&page=${page}&type=pending`,
      { headers: headers }
    );
  }

  fetchStudentDashboardDetails(instituteId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentDashboardDetails?instituteId=${instituteId}`,
      { headers: headers }
    );
  }

  fetchBatchMaterial(batchId: any, page: number, size: any, searchParam: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchBatchMaterial?batchId=${batchId}&page=${page}&size=${size}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  saveVideoResumeTiming(data: {
    userId: number;
    materialId: number;
    videoResumeTiming: number;
    watchTime: number;
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

  downloadFile(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append('id', id);
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/download/student/invoice`,
      {
        headers: headers,
        params: params,
        responseType: 'blob',
      }
    );
  }

  fetchQuizResultById(quizId: number, studentId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('quizId', quizId)
      .append('studentId', studentId);
    return this.http
      .get<any>(`${environment.apiEndpoint}/users/v1/api/fetchQuizResultById`, {
        headers: headers,
        params: params,
      })
      .pipe(map((res) => res?.data));
  }

  getFeedBackComment(quizId: number, userId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v1/api/getFeedback/${userId}/${quizId}`,
      {
        headers: headers,
      }
    );
  }

  allLiveClasses() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/allLiveClasses?instituteId=${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  allFutureClasses() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/allFutureClasses?instituteId=${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchStudentDashboardCounts() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchStudentDashboardCounts?instituteId=${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }
  deleteStudent(userId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let instituteId = AuthService.getInstituteId;
    return this.http.delete<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/deleteStudent?instituteId=${instituteId}&userId=${userId}`,
      { headers: headers }
    );
  }

  getPurchaseHistory(size: number, page: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/purchase/history?page=${page}&instituteId=${AuthService.getInstituteId}&size=${size}`,
      {
        headers: headers,
      }
    );
  }
}
