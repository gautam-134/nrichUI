import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { InstituteFormVO } from 'src/app/common/add-edit-institute/add-edit-institute.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Data } from 'src/app/model/BatchMappingVO';
import { CourseDTO } from 'src/app/model/CourseVO';
import { InquiryFormVO } from 'src/app/model/InquiryFormVO';
import { ClassMaterialDTO } from 'src/app/model/MappingList';
import { FetchClassAndMaterial } from 'src/app/model/Material';
import { SubjectMappingVO } from 'src/app/model/SubjectMappingVO';
import { TopicMappingVO } from 'src/app/model/TopicMappingVO';
import { TeachersListRes } from 'src/app/model/feature-home-teacher.model';
import { FetchMaterialMapping } from 'src/app/model/material-mapping-list';
import {
  BlueJeansMetaData,
  ClassConfigurationVO,
  ScheduleClassVO,
} from 'src/app/model/schedule-class-list.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { UploadMaterial } from 'src/app/model/UploadMaterial';
import { InstituteAdminDetailsChangingHistoryVO } from 'src/app/model/InstituteAdminDetailsChangingHistoryVO';

@Injectable({
  providedIn: 'root',
})
export class InstituteService {
  addRequestedCourse(courseDTO: CourseDTO) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchMaterialForMapping(id: number, idInstitution: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http
      .get<FetchClassAndMaterial>(
        `${environment.apiEndpoint}/users/v1/api/fetchClassesAndClassMateralData?idTeacher=${id}&idInstitution=${idInstitution}`,
        { headers: headers }
      )
      .pipe(map((res) => res.data));
  }

  getMyBatches(couresId: number) {
    let instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<Data>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllBatches?courseId=${couresId}&instituteId=${instituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.BatchList));
  }

  fetchAllCsvRecords(
    csvType: string,
    idInstitution: any,
    size: number,
    page: number
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchUsersCsvRecordsList?instituteId=${idInstitution}&size=${size}&page=${page}&csvType=${csvType}`,
      { headers: headers }
    );
  }

  fetchClassMaterial(materialId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchClassMaterial?materialId=${materialId}`,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  fetchMaterial(
    id: number,
    idInstitution: number,
    page: number,
    size: number,
    searchParam: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http
      .get<FetchClassAndMaterial>(
        `${environment.apiEndpoint}/users/v2/api/fetchClassesAndClassMaterialData?idTeacher=${id}&idInstitution=${idInstitution}&page=${page}&size=${size}&searchParam=${searchParam}`,
        { headers: headers }
      )
      .pipe(map((res) => res.data));
  }

  fetchMaterialMappingList(
    id: number,
    teacherId: number,
    selectedInstitute: number
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http
      .get<FetchMaterialMapping>(
        `${environment.apiEndpoint}/users/v1/api/fetchMaterialMappingList?idClassMaterial=${id}&idTeacher=${teacherId}&idInstitute=${selectedInstitute}`,
        { headers: headers }
      )
      .pipe(map((res) => res.dataObjects));
  }

  fetchMaterialMapping(idClassMaterial: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v1/api/fetchMaterialMapping?idClassMaterial=${idClassMaterial}`,
      {
        headers: headers,
      }
    );
  }

  fetchClassMapping(idClassSchedule: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/users/v1/api/fetchClassMapping?idClassSchedule=${idClassSchedule}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.data.mappingObj));
  }

  addClassMaterial(data: ClassMaterialDTO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/mapClassMaterial`,
      data,
      { headers: headers }
    );
  }

  delteMaterialMappingList(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/deleteMaterialClassMapping?idMaterialClassMapping=${id}`,
      {},
      { headers: headers }
    );
  }

  fetchMaterialSubjectMapping(instituteId: number, materialId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/mapping/fetchMaterialSubjectMapping?instituteId=${instituteId}&materialId=${materialId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchMaterialTopicMapping(instituteId: number, materialId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/mapping/fetchMaterialTopicMapping?instituteId=${instituteId}&materialId=${materialId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  saveSubjectMapping(data: {
    materialId: number;
    subjects: SubjectMappingVO[];
    oldSubjects: SubjectMappingVO[];
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/mapping/mapMaterialWithSubjects`,
      data,
      { headers: headers }
    );
  }

  saveTopicMapping(data: { materialId: number; topics: TopicMappingVO[] }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/mapping/mapMaterialWithTopics`,
      data,
      { headers: headers }
    );
  }

  getOfflineApplicationsCount() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams().append(
      'instituteId',
      AuthService.getInstituteId
    );
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchOfflineEnrollmentApplicationsCount`,
        { headers: headers, params: params }
      )
      .pipe(map((res) => res.body));
  }

  getOfflineApplications(page: number, size: number, searchParam: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('instituteId', AuthService.getInstituteId)
      .append('page', page)
      .append('size', size)
      .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchOfflineEnrollmentApplications`,
        { headers: headers, params: params }
      )
      .pipe(map((res) => res.body));
  }

  paymentRecieved(enrollments: number[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/offlinePaymentReceived`,
      enrollments,
      { headers: headers }
    );
  }

  paymentNotRecieved(enrollments: number[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/offlinePaymentNotReceived`,
      enrollments,
      { headers: headers }
    );
  }

  uploadMaterial(data: UploadMaterial, file: any[]) {
    const formdata: FormData = new FormData();
    formdata.append('classMaterialVO', JSON.stringify(data));
    if (file.length > 0) {
      for (var i = 0; i < file.length; i++) {
        formdata.append('file', file[i]);
      }
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params = new HttpParams().append(
      'instituteId',
      +AuthService.getInstituteId
    );
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/addClassMaterial`,
      formdata,
      {
        headers: headers,
        params: params,
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  getInstituteDetails(instituteId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getInstituteDetails?instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  saveInstituteDetails(data: InstituteFormVO, file: File, coverImage: File) {
    const formdata: FormData = new FormData();
    formdata.append('instituteDetails', JSON.stringify(data));
    if (file !== undefined || file !== null) {
      formdata.append('institutePic', file);
    }
    if (coverImage !== undefined || coverImage !== null) {
      formdata.append('coverImage', coverImage);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/saveInstituteDetails`,
      formdata,
      { headers: headers }
    );
  }

  verifyEmail() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/verifyEmail/aws?instituteId=${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  checkStatus() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/checkStatus/aws?instituteId=${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }

  fetchInstitute(id: any) {
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchInstituteDetails?idInstitute=${id}`
    );
  }

  mapClassConfigWithSubjectTopic(data: {
    idClassConfig: number;
    courseArray: number[];
    subjectArray: number[];
    topicArray: number[];
    batchArray: number[];
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/mapClassConfigWithSubjectTopic`,
      data,
      { headers: headers }
    );
  }

  fetchClassConfigurationMapping(
    userId: number,
    classConfigId: number,
    instituteId: number
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v1/api/fetchClassConfigMapping/${userId}/${classConfigId}/${instituteId}`,
      { headers: headers }
    );
  }

  fetchInstituteTeacherList(id: any) {
    return this.http.get(
      `${
        environment.apiEndpoint
      }/users/v2/api/fetchInstituteTeachers?idInstitute=${id}&page=${0}&size=${10}`
    );
  }

  fetchInstituteRoles(instituteId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteRoles?instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  changeVisibility(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/changeVisibility`,
      id,
      { headers: headers }
    );
  }

  fetchInstituteUsers(
    instituteId: string,
    role: string,
    page: number,
    size: number,
    searchParam: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteUsers?instituteId=${instituteId}&role=${role}&page=${page}&size=${size}&searchParam=${searchParam}`,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  fetchInstituteCourseList(id: any) {
    return this.http.get(
      `${
        environment.apiEndpoint
      }/users/v2/api/fetchInstituteCourses?idInstitute=${id}&page=${0}&size=${10}`
    );
  }

  fetchAdminCourseListWithPagination(
    id: any,
    page: any,
    size: any,
    searchParam: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchAdminCourses?idInstitute=${id}&page=${page}&size=${size}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  fetchActiveInstitution() {
    return this.http.get(
      environment.apiEndpoint + '/users/v1/api/fetchActiveInstitutions'
    );
  }

  fetchAllActiveInstitution() {
    return this.http.get(
      environment.apiEndpoint + '/users/v2/api/fetchAllActiveInstituteList'
    );
  }

  fetchInstituteCoursesWithPagination(idInstitute: number, pageNumber: number) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteCourses?idInstitute=${idInstitute}&page=${pageNumber}&size=9`
      )
      .pipe(map((res) => res.body));
  }

  fetchInstituteEducators(idInstitute: number) {
    return this.http.get<TeachersListRes>(
      `${environment.apiEndpoint}/users/v2/api/fetchInstituteTeachers?idInstitute=${idInstitute}`
    );
  }

  fetchInstituteAdminDetails(instituteId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchInstituteAdminDetails?instituteId=${instituteId}`,
      { headers: headers }
    );
  }

  fetchCourseReqList() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const userId = this.authService.parseAuth().user_id;
    const instituteId = localStorage.getItem('selectedInstitute');
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/users/v1/api/fetchCourseRequestList?userId=${userId}&instituteId=${instituteId}`,
        { headers: headers }
      )
      .pipe(map((res) => res.requests));
  }

  fetchAllClassSchedule(
    id: any,
    userId: any,
    classConfigId: any,
    size: number,
    page: number,
    searchParam: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/fetchAllClassSchedule?idInstitution=${id}&userId=${userId}&classConfigId=${classConfigId}&size=${size}&page=${page}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  // checkStorageOfMaterial(idInstitute: number, requestedDataSize: any) {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.authService.getAccessToken()}`,
  //   });

  //   return this.http.get(
  //     `${environment.apiEndpoint}/users/v1/api/checkStorage?idInstitute=${idInstitute}&requestedDataSize=${requestedDataSize}`,
  //     { headers: headers }
  //   );
  // }

  getClassConfigurations(
    idInstitution: any,
    size: number,
    page: number,
    searchParam: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<any>(
      `${environment.apiEndpoint}/users/v2/api/classConfigurations?idInstitution=${idInstitution}&size=${size}&page=${page}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  deleteFutureClasses(classConfigId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v2/api/deleteFutureClasses?id=${classConfigId}`,
      { headers: headers }
    );
  }

  saveClass(data: {
    idClassSchedule?: any;
    classConfigId?: any;
    classTitle: string;
    classSubject: string;
    selectedDate: Date;
    classDescription: string;
    startDateStr: string;
    endDateStr: string;
    classType: string;
    idTeacher: number;
    isNew: boolean;
    videoToBeUploadedOrNot: boolean;
    meetingStartDate: Date;
    meetingEndDate: Date;
    idInstitution: number;
    isDemoClass: boolean;
    isWebinar: boolean;
    videoToBeRedirectToBlueJeans: boolean;
    days: number[];
    repeatMeeting: boolean;
    blueJeansMetaData: BlueJeansMetaData;
    active?: boolean;
  }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/scheduleClass`,
      data,
      { headers: headers }
    );
  }

  saveClassConfiguration(scheduleClassVO: ScheduleClassVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/scheduleClass`,
        scheduleClassVO,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  editClassConfiguration(classConfigurationVO: ClassConfigurationVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/editClassConfigDetails`,
        classConfigurationVO,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  addClassInConfiguration(scheduleClassVO: ScheduleClassVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/addClassInConfiguration`,
        scheduleClassVO,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  cancelClasss(idClass: number, active: boolean) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v1/api/cancelClass/${idClass}/${active}/${AuthService.getInstituteId}`,
      { headers: headers }
    );
  }

  deleteClass(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });

    return this.http.delete(
      `${environment.apiEndpoint}/users/v1/api/deleteClass?idClassSchedule=${id}
      `,
      { headers: headers }
    );
  }

  deletematerial(idClassMaterial: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v2/api/deleteMaterial/${idClassMaterial}
   `,
      { headers: headers }
    );
  }
  fetchDemoClassRequests(
    teacherId: any,
    page: number,
    size: number,
    searchParam: string
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetchDemoClassRequests?teacherId=${teacherId}&page=${page}&size=${size}&searchParam=${searchParam}`,
      { headers: headers }
    );
  }

  changeDemoClassRequest(data: { status: string; ids: number[] }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/changeDemoClassRequestStatus`,
      data,
      { headers: headers }
    );
  }
  saveUsersCSV(usersDataList: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/uploadUsersCSV`,
      usersDataList,
      { headers: headers }
    );
  }

  saveEnquiry(inquiryVO: InquiryFormVO) {
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${this.authService.getAccessToken()}`,
    // });
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/contactUsEnquiry`,
      inquiryVO
    );
  }

  fetchAllInstituteList(pageSize: any, pageNumber: any, searchParam: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllInstituteList?size=${pageSize}&page=${pageNumber}&searchParam=${searchParam}`,
        { headers: headers }
      )
      .pipe(map((res: any) => res.body));
  }

  updateDisplayOrder(displayOrder: string, id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams()
      .append('displayOrder', displayOrder.toString())
      .append('id', id.toString());
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateInstituteDisplayOrder`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  updateInstituteFeaturedFlag(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append('id', id);
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateInstituteFeaturedFlag`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }
  fetchVacentSpace() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/vacent/space/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  verifyMobileOtpsToChangeInstituteAdmin(
    instituteAdminDetailsChangingHistoryVO: InstituteAdminDetailsChangingHistoryVO
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post(
        `${environment.apiEndpoint}/users/v2/api/verify/mobile/numbers`,
        instituteAdminDetailsChangingHistoryVO,
        { headers: headers }
      );
  }

  resendOTP(
    instituteAdminDetailsChangingHistoryVO: InstituteAdminDetailsChangingHistoryVO
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post(
        `${environment.apiEndpoint}/users/v2/api/resend/otp`,
        instituteAdminDetailsChangingHistoryVO,
        { headers: headers }
      );
  }

  changeInstituteAdminMobileNumber(
    instituteAdminDetailsChangingHistoryVO: InstituteAdminDetailsChangingHistoryVO
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http
      .post(
        `${environment.apiEndpoint}/users/v2/api/change/institute/admin/mobile/number`,
        instituteAdminDetailsChangingHistoryVO,
        { headers: headers }
      );
  }
}
