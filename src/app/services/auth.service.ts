import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { UserInstitutes } from '../auth/login/select-institute/select-institute.component';
import { UserFormVO } from '../common/add-user/add-user.component';
import { ApiResponse } from '../model/ApiResponse';
import { Auth } from '../model/Auth';
import { Menu } from '../model/Menu';
import { Profile } from '../model/Profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInSubject = new BehaviorSubject<boolean>(false);
  isLogin: boolean = false;
  static instituteId: any;
  nameSubject = new BehaviorSubject<string>('');
  profileImageSubject = new BehaviorSubject<string>('');
  statesSubject$ = new BehaviorSubject<{ id: number; stateName: string }[]>([]);
  nameSubjectObs$ = this.nameSubject.asObservable();
  profileImageSubjectObs$ = this.profileImageSubject.asObservable();
  static whatsappSubject$ = new BehaviorSubject<boolean>(false);
  subDomainInstitute = new BehaviorSubject<number>(1);
  subDomainInstituteName = new BehaviorSubject<string>('Nrich Learning');
  marketingHeaderLogo = new BehaviorSubject<string>('assets/svg/logo.svg');

  constructor(private http: HttpClient) {
    this.loggedInSubject.subscribe((value: any) => {
      this.isLogin = value;
    });
  }

  getSubDomain(url: string): string {
    // url = 'https://simran.nrichlearning.com'; // HARD CODED
    const withoutProtocol = url.replace(/^(https?:|)\/\//, '');
    const subdomain = withoutProtocol.split('.')[0];
    return subdomain;
  }

  getInstituteBySubDomain(subDomain: string) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/sub-domain-institute/${subDomain}`
      )
      .pipe(map((res) => res.body));
  }

  public static get getUserFirstName(): string {
    return JSON.parse(localStorage.getItem('auth') as string)?.first_name;
  }

  public static get getUserProfileId(): string {
    return JSON.parse(localStorage.getItem('auth') as string)?.user_profile_id;
  }

  getAccessToken() {
    if (this.parseAuth()) {
      return this.parseAuth().access_token;
    }
    return null;
  }

  public static get getFilePath(): string {
    return localStorage.getItem('path') as string;
  }
  public static get getUserId(): number {
    return +JSON.parse(localStorage.getItem('auth') as string)?.user_id;
  }

  public static get getMobileNumber(): string {
    return JSON.parse(localStorage.getItem('auth') as string)?.mobile_number;
  }

  public static get getEmail(): number {
    return +JSON.parse(localStorage.getItem('auth') as string)?.email;
  }

  public static get getRoleType(): string {
    return JSON.parse(localStorage.getItem('auth') as string)?.role?.roleType;
  }

  public static get getModulePrefix(): string {
    const roleType = String(
      JSON.parse(localStorage.getItem('auth') as string)?.role?.roleType
    );
    return roleType == 'InstituteAdmin' || roleType == 'Admin'
      ? '/admin'
      : roleType == 'Teacher'
      ? '/teacher'
      : roleType == 'Student'
      ? '/student'
      : roleType == 'SuperAdmin'
      ? '/master'
      : '';
  }

  parseAuth() {
    if (localStorage.getItem('auth') && localStorage.getItem('auth') != null) {
      return JSON.parse(localStorage.getItem('auth') as string);
    }
    return null;
  }

  validLoginToken() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
      loginToken: this.getSingleLoginValidateToken,
    });

    return this.http
      .get<Menu[]>(`${environment.apiEndpoint}/users/v1/api/user/login/valid`, {
        headers: headers,
      })
      .pipe(shareReplay());
  }

  getUserMenuBar(instituteId: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });

    return this.http.get<Menu[]>(
      `${environment.apiEndpoint}/users/v1/api/fetchScreenMapping/${instituteId}`,
      { headers: headers }
    );
  }

  getUserRoles(userid: any, instituteid: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return (
      this.http
        .get(
          `${environment.apiEndpoint}/users/v1/api/getUserRoles/${userid}/${instituteid}`
        )
        .pipe(),
      { headers: headers }
    );
  }

  get getSingleLoginValidateToken(): string {
    return this.parseAuth()?.user_unique_login_token;
  }

  isLoggin() {
    let auth = localStorage.getItem('auth');
    if (auth) {
      return true;
    }
    return false;
  }

  logout() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/logout`,
      '',
      {
        headers: headers,
      }
    );
  }

  updateUserOnlineStatus(online: boolean) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/chat/update/user/online/status`,
      { status: online },
      {
        headers: headers,
      }
    );
  }

  checkReferralCode(referralCode: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/checkReferralCode/${referralCode}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  createUser(data: Profile, file1: File, file2: File) {
    const formdata: FormData = new FormData();
    formdata.append('userDetails', JSON.stringify(data));
    if (file1 !== undefined || file1 !== null) {
      formdata.append('profilePic', file1);
    }
    if (file2 !== undefined || file2 !== null) {
      formdata.append('teaserVideo', file2);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/createUser`,
        formdata,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  addUser(data: UserFormVO, file: File) {
    const formdata: FormData = new FormData();
    formdata.append('userDetails', JSON.stringify(data));
    if (file !== undefined || file !== null) {
      formdata.append('profilePic', file);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/addUser`,
      formdata,
      { headers: headers }
    );
  }

  editUser(data: UserFormVO, file: File) {
    const formdata: FormData = new FormData();
    formdata.append('userDetails', JSON.stringify(data));
    if (file !== undefined || file !== null) {
      formdata.append('profilePic', file);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/editUser`,
        formdata,
        { headers: headers }
      )
      .pipe(map((res) => res.body));
  }

  disableUser(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    const params = new HttpParams()
      .append('id', id)
      .append('instituteId', AuthService.getInstituteId);
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/deleteUser`,
      '',
      { headers: headers, params: params }
    );
  }

  getProfile() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(`${environment.apiEndpoint}/users/v2/api/getProfile`, {
        headers: headers,
      })
      .pipe(map((res) => res.body));
  }

  getZoomStatus(classId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/zoomStatus/${AuthService.getInstituteId}/${classId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  getUserProfile(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getUserProfile?id=${id}&instituteId=${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  planExpiry() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(`${environment.apiEndpoint}/users/v2/api/planExpiry`, {
        headers: headers,
      })
      .pipe(map((res) => res.body));
  }

  getInstituteImage() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http
      .get<ApiResponse>(
        `${
          environment.apiEndpoint
        }/users/v2/api/getInstituteImage?instituteId=${+AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res.body));
  }

  verifyEmail(email: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/verifyEmail?email=${email}&instituteId=${AuthService.getInstituteId}`,
      '',
      { headers: headers }
    );
  }

  completeEmailVerification(id: string) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/completeVerification`,
      id
    );
  }

  createTeacher(data: any) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/addTeacher`,
      data
    );
  }

  checkOTP(data: any) {
    return this.http
      .post(`${environment.apiEndpoint}/users/v1/api/otp`, data)
      .pipe();
  }

  signInWithOtpSent(data: string, isMobileLogin: boolean) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/mobileAuthentication`,
      isMobileLogin ? { mobile: data } : { email: data }
    );
  }

  resendOtp(data: string, isMobileLogin: boolean) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/mobileAuthentication`,
      isMobileLogin ? { mobile: data } : { email: data }
    );
  }

  getMyIpAddress() {
    this.http
      .get<any>('https://geolocation-db.com/json/')
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((response: { IPv4: string }) => {
          localStorage.setItem('MY_IP', response.IPv4);
        })
      )
      .subscribe();
  }

  public static get getAccessToken(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.access_token;
  }

  public static get getBucketName(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}').bucketName;
  }

  public static get username(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.first_name;
  }

  public static get email(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.email;
  }

  public static get mobileNumber(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.mobile_number;
  }
  public static get userId(): number {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.user_id;
  }

  // public static get getUserRoleName(): string {
  //   return JSON.parse(localStorage.getItem('auth') || '{}')?.role?.authority;
  // }

  public static get getUserRoleType(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.role?.roleType;
  }

  public static get getUserName(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.first_name;
  }

  public static get getInstituteId(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.selectedInstitute;
  }

  public static get getGender(): string {
    return JSON.parse(localStorage.getItem('auth') || '{}')?.gender;
  }

  public get getVersion(): string | null {
    var version = localStorage.getItem('ver');
    return version ? version.toString() : null;
  }

  login(
    username: string,
    password: string,
    loginFromWeb: boolean,
    instituteId: number
  ) {
    this.getMyIpAddress();

    return this.http.post<Auth>(`${environment.apiEndpoint}/login`, {
      username: username,
      password: password,
      instituteId: instituteId,
      isWebLogin: loginFromWeb,
    });
  }

  enrollInstituesListRes() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getUserInstitutes`,
        {
          headers: headers,
        }
      )
      .pipe(map((response: ApiResponse) => response.body));
  }

  enrolledInstitute(instituteId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getUserInstitute/${instituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((response: ApiResponse) => response.body));
  }

  isUserEnrolled(mobileNumber: string, instituteId: number) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/isUserEnrolled/${mobileNumber}/${instituteId}`
      )
      .pipe(map((response: ApiResponse) => response.body));
  }

  institutes = new BehaviorSubject<UserInstitutes[]>([]);

  enrollAllInstituesListRes(page: number, size: number, searchParam: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getAllUserInstitutes?page=${page}&size=${size}&searchParam=${searchParam}`,
        {
          headers: headers,
        }
      )
      .pipe(map((response: ApiResponse) => response.body));
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/forgotPassword?email=${email}`,
      ''
    );
  }

  assignStudentRole() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });

    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/student/assign/role?instituteId=1`,
      '',
      { headers: headers }
    );
  }

  assignAdminRole() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .post(`${environment.apiEndpoint}/users/v2/api/admin/assign/role`, '', {
        headers: headers,
      })
      .pipe(map((res: ApiResponse) => res.body));
  }

  savePassword(data: any) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/savePassword`,
      data
    );
  }

  confirmOtp(email: any, otp: any) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/confirmOtp?email=${email}&otp=${otp}`
      )
      .pipe(map((response: ApiResponse) => response.body));
  }
  getTeacherId(email: string) {
    return this.http.get(
      `${environment.apiEndpoint}/users/v1/api/getTeacherId?email=${email}`
    );
  }

  checkUpdate() {
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/check/updates`
    );
  }

  fetchUsersByInstitute() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/getInstituteUsers/${AuthService.getInstituteId}`,
        {
          headers: headers,
        }
      )
      .pipe(map((response: ApiResponse) => response.body));
  }
}
