import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { MaterialPreviewComponent } from 'src/app/common/file-management/material-preview/material-preview.component';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { classMaterialVO } from 'src/app/model/ClassMaterialVO';
import { VideoTimeTracking } from 'src/app/model/PrerecordedModels';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';
import { StudentService } from 'src/app/services/student/student.service';
@Component({
  selector: 'app-admin-all-material',
  standalone: true,
  imports: [],
  templateUrl: './admin-all-material.component.html',
  styleUrl: './admin-all-material.component.scss'
})
export class AdminAllMaterialComponent implements OnInit {
  material!: classMaterialVO[];
  batchId!: number;
  filePath: string = '';
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  videoTypes: string[] = ['mp4', 'mov', 'avi', 'mkv'];
  imageTypes: string[] = ['jpeg', 'jpg', 'png'];
  otherTypes: string[] = ['pdf', 'doc', 'docx'];
  audioTypes: string[] = ['mp3']
  totalCount!: number;
  subject = new Subject<string>();

  typeOfShorting: boolean = true;
  type: any;

  result$!: Observable<any>;
  videoTimeTracking=new VideoTimeTracking();
  selectedMaterialId!: number;
  constructor(
    private dialog: MatDialog,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private http: PreRecordedModuleService,
    private alert: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.fetchMaterial(this.page);
    this.applyFilter();
  }

  fetchMaterial(page: number) {
    this.studentService
      .fetchBatchMaterial(this.batchId, page, this.size, this.searchParam)
      .subscribe((res: any) => {
        this.material = res?.body.ClassMaterialVOList;
        this.totalCount = res?.body.total_count;
      });
  }
  // viewDetail(element: any) {
  //   this.dialog.open(MaterialPreviewComponent, {
  //     data: { element: element },
  //     width: '600px',
  //     height: '400px',
  //   });
  // }

  showPreview(key: string, id: any) {
    const filePath = this.filePath + key;
    const type = this.getFileType(filePath);
    this.selectedMaterialId = id;
  
    const dialogRef = this.dialog.open(MaterialPreviewComponent, {
      maxWidth: '800px',
      data: {
        path: filePath,
        type: type,
        selectedMaterialId: id,
      },
    });

    dialogRef.componentInstance.videoStopped.subscribe((videoResumeTime: number) => {
      if (videoResumeTime !== undefined) {
        this.storeVideoTime(videoResumeTime);
      }
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
    this.videoTimeTracking.materialType='STUDYMATERIAL';
    this.http.savePreRecordedVideoTime(this.videoTimeTracking)
    .subscribe({
      next: (data: ApiResponse) => {
      },
      error: (error: HttpErrorResponse) => {
        this.alert.errorAlert(error.error.message);
      },
    });
  }

  getFileType(filePath: string) {
    return this.imageTypes.includes(
      filePath.substring(filePath.lastIndexOf('.') + 1)
    )
      ? 'image'
      : this.videoTypes.includes(
        filePath.substring(filePath.lastIndexOf('.') + 1)
      )
        ? 'video'
        : this.audioTypes.includes(
          filePath.substring(filePath.lastIndexOf('.') + 1)
        )
          ? 'audio'
          : this.otherTypes.includes(
            filePath.substring(filePath.lastIndexOf('.') + 1)
          )
            ? 'pdf'
            : 'other';
  }

  pageChange(event: any) {
    this.fetchMaterial(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.fetchMaterial(0);
  }
  searchFile(evt: any) {
    if (evt.target.value == '') {
      this.fetchMaterial(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.studentService.fetchBatchMaterial(
                  this.batchId,
                  this.page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.material = value?.body.ClassMaterialVOList;
          this.totalCount = value?.body.total_count;
        });
      });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
