import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { BlogsRes, BlogsVO } from '../../model/BlogsVO';
import { ClassMappingVO, CourseBatchMapVO } from '../../model/CourseBatchMapVO';
import { ExpertVO } from '../../model/ExpertVO';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  search(search: any) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/search/globalSearch?search=${search}`
      )
      .pipe(map((res) => res.body));
  }

  searchInstituteName(name: string) {
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/search/searchInstitutes?name=${name}`
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  searchInstitutecategory(category: any) {
    return this.http.get<any>(
      `${environment.apiEndpoint}/search/searchInstitutes?category=${category}`
    );
  }

  searchInstitutelocation(location: any) {
    return this.http.get<any>(
      `${environment.apiEndpoint}/search/searchInstitutes?location=${location}`
    );
  }

  nearestInstitutes(
    latitude: number,
    longitude: number,
    pageNumber: number,
    size: number
  ) {
    let params = new HttpParams()
      .append('latitude', latitude.toString())
      .append('longitude', longitude.toString())
      .append('page', pageNumber)
      .append('size', size);
    return this.http
      .get<ApiResponse>(`${environment.apiEndpoint}/search/nearestInstitutes`, {
        params: params,
      })
      .pipe(map((res) => res.body));
  }

  filterInstitute(
    instituteName: string,
    categoryId: number | undefined,
    page: number,
    size: number
  ) {
    let params = new HttpParams().append('page', page).append('size', size);
    if (instituteName) params = params.append('name', instituteName);
    if (categoryId) params = params.append('categoryId', categoryId);
    return this.http
      .get<ApiResponse>(`${environment.apiEndpoint}/search/filterInstitutes`, {
        params: params,
      })
      .pipe(map((res: ApiResponse) => res.body));
  }

  searchCourseName(CourseName: any) {
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/search/searchCourses?name=${CourseName}`
      )
      .pipe(shareReplay());
  }

  fetchStatesAndCountries() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchStatesAndCountries`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res?.body));
  }
  
  fetchCountries() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchCountries`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res?.body));
  }
  
  fetchStates() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchStates`,
        {
          headers: headers,
        }
      )
      .pipe(map((res) => res?.body));
  }
  

  getStates() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http
      .get<any>(`${environment.apiEndpoint}/users/v1/api/getStates`, {
        headers: headers,
      })
      .pipe(map((res) => res?.body));
  }

  searchCourseCategory(categoryName: any) {
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/search/searchCourses?category=${categoryName}`
      )
      .pipe(shareReplay());
  }

  searchCourseLocation(location: any) {
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/search/searchCourses?location=${location}`
      )
      .pipe(shareReplay());
  }

  filterCourse(
    courseName: string,
    page: number,
    size: number,
    filterType: string,
    categoryId?: number
  ) {
    let params = new HttpParams().append('filterType', filterType);
    if (categoryId) params = params.append('categoryId', categoryId);
    if (courseName) params = params.append('name', courseName);
    params = params.append('page', page).append('size', size);
    return this.http
      .get<ApiResponse>(`${environment.apiEndpoint}/search/filterCourses`, {
        params: params,
      })
      .pipe(map((res) => res?.body));
  }

  searchTeacherName(teacherName: any) {
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/search/searchTeachers?name=${teacherName}`
      )
      .pipe(shareReplay());
  }

  searchTeacherCategory(categoryName: any) {
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/search/searchTeachers?category=${categoryName}`
      )
      .pipe(shareReplay());
  }

  searchTeacherLocation(location: any) {
    return this.http
      .get<any>(
        `${environment.apiEndpoint}/search/searchTeachers?location=${location}`
      )
      .pipe(shareReplay());
  }

  filterTeacher(
    teacherName: string,
    categoryId: number | undefined,
    page: number,
    size: number
  ) {
    let params = new HttpParams().append('page', page).append('size', size);
    if (teacherName) params = params.append('name', teacherName);
    if (categoryId) params = params.append('categoryId', categoryId);
    return this.http
      .get<ApiResponse>(`${environment.apiEndpoint}/search/filterTeachers`, {
        params: params,
      })
      .pipe(map((res: ApiResponse) => res.body));
  }

  saveInquiry(inquiryForm: any) {
    return this.http.post(
      `${environment.apiEndpoint}/users/v1/api/saveInquiry`,
      inquiryForm
    );
  }

  fetchBlogs() {
    return this.http
      .get<BlogsRes>(`${environment.apiEndpoint}/users/v1/api/fetchBlogsList`)
      .pipe(map((res: { body: any }) => res.body));
  }
  fetchBlogDetails(id: any) {
    return this.http.get<BlogsVO>(
      `${environment.apiEndpoint}/users/v1/api/fetchBlogDetails?id=${id}`
    );
  }

  fetchInstituteBlogs(
    page: number,
    size: number,
    instituteId: any,
    searchParam?: string
  ) {
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', instituteId)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', instituteId)
            .append('searchParam', searchParam);
    return this.http
      .get<BlogsRes>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteBlogs`,
        {
          params: params,
        }
      )
      .pipe(map((res: { body: any }) => res.body));
  }

  fetchExperts(instituteId?: any) {
    if (instituteId == null) {
      return this.http.get<ExpertVO>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteExpertsList`
      );
    } else {
      return this.http.get<ExpertVO>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteExpertsList?InstituteId=${instituteId}`
      );
    }
  }

  getBatchMapping(mappingForId: number, mappingType: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
      mappingType: mappingType,
    });
    let instituteId = AuthService.getInstituteId;
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/institute/` +
          instituteId +
          `/mappingForId/` +
          mappingForId +
          `/batch/mapping`,
        { headers: headers }
      )
      .pipe(map((res) => res?.body));
  }

  fetchMaterialClasses(idClassMaterial: number, batchIds:any){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });
    let params= new HttpParams()
        .append('idClassMaterial', idClassMaterial)
        .append('ids', batchIds);
        return this.http.get<ApiResponse>(
          `${environment.apiEndpoint}/users/v2/api/mapping/fetchMaterialClasses` ,
          {
            headers: headers,
            params: params,
          }
          
        ).pipe(map((res) => res?.body));

  }

  saveClassMapping(classMappingVO: ClassMappingVO[]){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/mapping/mapMaterialWithClasses`,
      classMappingVO,
      {
        headers: headers,
      }
    );

  }

  saveBatchMapping(
    mappingType: string,
    mappingForId: number,
    courseBatchMapVOList: CourseBatchMapVO[],
    teacherId: any
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
      mappingType: mappingType,
    });

    let params = null;
    if (teacherId) {
      params = new HttpParams().append('teacherId', teacherId);
    } else {
      params = new HttpParams();
    }

    let instituteId = AuthService.getInstituteId;
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/institute/` +
        instituteId +
        `/mappingForId/` +
        mappingForId +
        `/batch/mapping`,
      courseBatchMapVOList,
      { headers: headers, params: params }
    );
  }

  fetchTeachers(classId: number, mappingType: string, batchesId: number[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
      mappingType: mappingType,
    });
    let params = new HttpParams().append('batchesId', batchesId.join(','));
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/class/` +
          classId +
          `/common/teachers`,
        { headers: headers, params: params }
      )
      .pipe(map((res) => res?.body));
  }

  getInstituteAchievers(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', AuthService.getInstituteId)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam)
            .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchInstituteAchievers`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchBlogsListing(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', AuthService.getInstituteId)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam)
            .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchBlogsListing`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchBlogsList(page: number, size: number, searchParam?: string) {
    let params =
      searchParam == undefined
        ? new HttpParams().append('page', page).append('size', size)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchBlogsList`,
        {
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchAllInstituteBlogs(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', AuthService.getInstituteId)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam)
            .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllInstituteBlogs`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  fetchAllBlogs(page: number, size: number, searchParam?: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    let params =
      searchParam == undefined
        ? new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('instituteId', AuthService.getInstituteId)
        : new HttpParams()
            .append('page', page)
            .append('size', size)
            .append('searchParam', searchParam)
            .append('instituteId', AuthService.getInstituteId);
    return this.http
      .get<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/fetchAllBlogs`,
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res) => res.body));
  }

  deleteAchiever(Id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v2/api/deleteInstituteExpert?Id=${Id}`,
      {
        headers: headers,
      }
    );
  }

  deleteBlog(Id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete(
      `${environment.apiEndpoint}/users/v2/api/deleteBlog?Id=${Id}`,
      {
        headers: headers,
      }
    );
  }

  updateAchieverFeature(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append('id', id);
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateAchieverFeature`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  updateBlogFeature(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append('id', id);
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateBlogFeature`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  updateInstituteBlogFeature(id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams().append('id', id);
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateInstituteBlogFeature`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  createAchiever(data: any, file: File) {
    const formdata: FormData = new FormData();
    formdata.append('instituteExpertVO', JSON.stringify(data));
    if (file !== undefined || file !== null) {
      formdata.append('expertImage', file);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/addInstituteExperts`,
      formdata,
      {
        headers: headers,
      }
    );
  }

  createBlog(data: any, file: File) {
    const formdata: FormData = new FormData();
    formdata.append('blogVO', JSON.stringify(data));
    if (file !== undefined || file !== null) {
      formdata.append('coverImage', file);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post(
      `${environment.apiEndpoint}/users/v2/api/createBlog`,
      formdata,
      {
        headers: headers,
      }
    );
  }

  updateAchieverDisplayOrder(displayOrder: string, id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams()
      .append('displayOrder', displayOrder.toString())
      .append('id', id.toString());
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateAchieverDisplayOrder`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  updateBlogDisplayOrder(displayOrder: string, id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams()
      .append('displayOrder', displayOrder.toString())
      .append('id', id.toString());
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateBlogDisplayOrder`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  updateInstituteBlogDisplayOrder(displayOrder: string, id: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let params = new HttpParams()
      .append('displayOrder', displayOrder.toString())
      .append('id', id.toString());
    return this.http
      .post<ApiResponse>(
        `${environment.apiEndpoint}/users/v2/api/updateInstituteBlogDisplayOrder`,
        '',
        {
          headers: headers,
          params: params,
        }
      )
      .pipe(map((res: ApiResponse) => res.body));
  }

  getAchieverDetails(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchAchieverDetails/${id}`,
      {
        headers: headers,
      }
    );
  }

  getBlogDetails(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get(
      `${environment.apiEndpoint}/users/v2/api/fetchBlogDetails/${id}`,
      {
        headers: headers,
      }
    );
  }
}
