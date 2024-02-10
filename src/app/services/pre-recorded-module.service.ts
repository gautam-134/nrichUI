import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MaterialUploadingCount,
  PrerecordedMaterialVO,
  PrerecordedModuleVO,
  PrerecordedSectionVO,
  VideoTimeTracking,
} from '../model/PrerecordedModels';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../model/ApiResponse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreRecordedModuleService {
  isMaterialUpdatedOrAdded = new BehaviorSubject<
    PrerecordedMaterialVO | undefined
  >(undefined);
  sectionMaterialUploadingCount = new BehaviorSubject<
    MaterialUploadingCount | undefined
  >(undefined);
  vacantSpace!: number;
  constructor(private http: HttpClient, private authService: AuthService) {}

  get getVacantSpace() {
    return this.vacantSpace;
  }

  setVacantSpace(vacantSpace: number) {
    this.vacantSpace = vacantSpace;
  }

  reduceVacantSpace(fileSize: number) {
    this.setVacantSpace(this.vacantSpace - fileSize);
  }

  increaseVacantSpace(fileSize: number) {
    this.setVacantSpace(this.vacantSpace + fileSize);
  }

  savePreRecordedModule(prerecordedModule: PrerecordedModuleVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/add/prerecordedModule`,
      prerecordedModule,
      {
        headers: headers,
      }
    );
  }

  fetchPrerecordedModules(page: number, size: number, searchParam: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    const params = searchParam
      ? new HttpParams()
          .append('page', page)
          .append('size', size)
          .append('searchParam', searchParam)
          .append('instituteId', +AuthService.getInstituteId)
      : new HttpParams()
          .append('page', page)
          .append('size', size)
          .append('instituteId', +AuthService.getInstituteId);
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/prerecordedModules`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  fetchPreRecordedModule(moduleId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/prerecordedModule/${moduleId}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  savePrerecordedSections(prerecordedSection: PrerecordedSectionVO) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/add/prerecordedSection`,
      prerecordedSection,
      {
        headers: headers,
      }
    );
  }

  deleteModule(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.delete<ApiResponse>(
      `${
        environment.apiEndpoint
      }/users/v2/api/delete/prerecordedModule/${id}/${+AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  savePrerecordedMaterial(
    prerecordedMaterial: PrerecordedMaterialVO,
    file?: File
  ) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    let data = new FormData();
    data.append('material', JSON.stringify(prerecordedMaterial));
    if (file) data.append('file', file);
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/add/prerecordedMaterial/${AuthService.getInstituteId}`,
      data,
      {
        headers: headers,
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  UpdateModuleStatus(moduleId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/submitPrerecordedModule/${moduleId}`,
      '',
      {
        headers: headers,
      }
    );
  }

  deletePrerecordedMaterial(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/delete/prerecordedMaterial/${id}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  deleteSection(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.delete<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/delete/prerecordedSection/${id}/${AuthService.getInstituteId}`,
      {
        headers: headers,
      }
    );
  }

  fetchMappedModules(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${AuthService.getAccessToken}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/batch/prerecordedModules/${id}`,
      {
        headers: headers,
      }
    );
  }

  savePreRecordedVideoTime(videoTimeTrackingVO: VideoTimeTracking) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.post<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/save/preRecordedVideoTime`,
      videoTimeTrackingVO,
      {
        headers: headers,
      }
    );
  }

  fetchVideoLastResumeTime(materialId: number,materialType:string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    });
    return this.http.get<ApiResponse>(
      `${environment.apiEndpoint}/users/v2/api/fetch/recordedMaterial/videoResumeTime/${materialId}/${materialType}`,
      {
        headers: headers,
      }
    );
  }
}
