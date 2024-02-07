import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { PrerecordedModuleVO, VideoTimeTracking } from 'src/app/model/PrerecordedModels';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';

@Component({
  selector: 'app-prerecordedpreview',
  standalone: true,
  imports: [],
  templateUrl: './prerecordedpreview.component.html',
  styleUrl: './prerecordedpreview.component.scss'
})
export class PrerecordedpreviewComponent implements OnInit {
  @Output() goBack = new EventEmitter();
  @Input() id!: number;
  @Input() moduleName!: string;
  description!: string;
  topicName!:string;
  prerecordedModule = new PrerecordedModuleVO();
  selectedMaterialId!: number;
  path!: string;
  type!: string;
  videoTimeTracking=new VideoTimeTracking();
  constructor(
    private http: PreRecordedModuleService,
    private loader: LoaderService,
    private alert: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.loader
      .showLoader(this.http.fetchPreRecordedModule(this.id))
      .subscribe({
        next: (data: ApiResponse) => {
          this.prerecordedModule = data.body;
          if (
            this.prerecordedModule.prerecordedSectionVOs.length >= 1 &&
            this.prerecordedModule.prerecordedSectionVOs[0]
              .prerecordedMaterialVOs.length >= 1
          ) {
            const material =
              this.prerecordedModule.prerecordedSectionVOs[0]
                .prerecordedMaterialVOs[0];
            this.path = material.fileName;
            this.type = material.type;
            this.description = material.description;
            this.topicName=material.name
            this.selectedMaterialId = material.id;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alert.errorAlert(error.error.message);
        },
      });
  }

  storeVideoTime(videoResumeTime: number) {
    const requestBody = {
      id: null, // The ID will be generated by the backend
      materialId: this.selectedMaterialId, // Provide the material ID
      userId: AuthService.getUserId, // Provide the user ID
      videoResumeTime,
      totalWatchedTime: null, // Calculate this on the backend if needed
      createdDate: null, // Will be set by the backend
      updatedDate: null // Will be set by the backend
    };
   
    this.videoTimeTracking.materialId = requestBody.materialId;
    this.videoTimeTracking.userId = requestBody.userId;
    this.videoTimeTracking.videoResumeTime = requestBody.videoResumeTime;
    this.videoTimeTracking.materialType='PRERECORDED';
    this.http.savePreRecordedVideoTime(this.videoTimeTracking)
    .subscribe({
      next: (data: ApiResponse) => {
      },
      error: (error: HttpErrorResponse) => {
        this.alert.errorAlert(error.error.message);
      },
    });


  }

  back() {
    this.goBack.emit();
  }
}
