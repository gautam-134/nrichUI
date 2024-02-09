import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PreviewComponent } from 'src/app/common/file-management/preview/preview.component';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Material, recordedClassDetails } from 'src/app/model/ClassList';
import { VideoTimeTracking } from 'src/app/model/classVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/Classes/class.service';

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [],
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit, OnDestroy {
  date = new Date();
  classId!: number;
  assignments!: Material[];
  tests!: Material[];
  referenceMaterial!: Material[];
  classVOObj: recordedClassDetails[] = [];
  liveRecordings!: Material[];
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  updatedTime: number = 0;
  startFrom: number = 0;
  subscription!: Subscription[];
  subscriptionMap = new Map<number, Subscription>();
  apiMap = new Map<number, VideoTimeTracking>();
  filePath!: string;
  typeOfShorting: boolean = true;
  type: any;
  userId!: number;
  isFullScreen: boolean = false;
  mappedMaterial: any[] = [];
  handleCssChangeAtRuntime: boolean = false;
  intervalId!: any;
  pIndex: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private errorDialog: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.userId = AuthService.getUserId;
    this.filePath = AuthService.getFilePath;
    let classId = this.route.snapshot.paramMap.get('classId');
    if (classId) {
      this.classId = Number.parseInt(classId);
      let detail$ = this.classService.getRecordedClassesMaterial(this.classId);
      this.loader.showLoader(detail$).subscribe(
        (res: any) => {
          this.classVOObj = res.body;
        },
        (err: HttpErrorResponse) => {
          this.errorDialog.errorAlert(err.error.message);
        }
      );
      this.classService.fetchClassMappedMaterial(this.classId).subscribe({
        next: (data: ApiResponse) => {
          this.mappedMaterial = data.body;
        },
        error: (err: HttpErrorResponse) => {
          this.errorDialog.errorAlert(err.error.message);
        },
      });
    }
  }


  // updateSeekBar(
  //   materialId: number,
  //   classMaterialObj: ClassMaterialObject,
  //   index: number
  // ) {
  //   const video = document.getElementById(
  //     'liveClassVideo' + index.toString()
  //   ) as HTMLVideoElement;
  //   if (classMaterialObj.resumeTiming != null) {
  //     video.currentTime = classMaterialObj.resumeTiming.videoResumeTime;
  //     video.ontimeupdate = classMaterialObj.resumeTiming.videoResumeTime;
  //   }
  // }
  // saveVideoTimeDetails(
  //   materialId: number,
  //   classMaterialObj: ClassMaterialObject,
  //   index: number
  // ) {
  //   let updatedTime: number = 0;
  //   const video = document.getElementById(
  //     'liveClassVideo' + index.toString()
  //   ) as HTMLVideoElement;
  //   const videoTimeTracking = new VideoTimeTracking();
  //   videoTimeTracking.materialId = materialId;
  //   videoTimeTracking.userId = +JSON.parse(
  //     localStorage.getItem('auth') as string
  //   ).user_id;
  //   const $sub = interval(100).subscribe((value) => {
  //     videoTimeTracking.videoResumeTiming = updatedTime;
  //     videoTimeTracking.watchTime = (value * 100) / 1000;
  //   });
  //   this.apiMap.set(materialId, videoTimeTracking);
  //   this.subscriptionMap.set(materialId, $sub);
  //   video.ontimeupdate = (event) => {
  //     updatedTime = video.currentTime;
  //   };
  // }

  ngOnDestroy(): void {
    // this.apiMap.forEach((value: VideoTimeTracking) => {
    //   this.classService
    //     .saveVideoResumeTiming({
    //       userId: +JSON.parse(localStorage.getItem('auth') as string).user_id,
    //       materialId: value.materialId,
    //       videoResumeTiming: value.videoResumeTiming,
    //       watchTime: value.watchTime,
    //     })
    //     .subscribe(
    //       (data: any) => {},
    //       (error: any) => {}
    //     );
    // });
    // this.subscriptionMap.forEach((sub: Subscription) => {
    //   sub.unsubscribe();
    // });
    //    this.watchedTimeSubscription.unsubscribe()
  }

  // clearSubscription(materialId: number) {
  //   let videoTimeDetails = this.apiMap.get(materialId);
  //   this.classService
  //     .saveVideoResumeTiming({
  //       userId: +JSON.parse(localStorage.getItem('auth') as string).user_id,
  //       materialId: videoTimeDetails?.materialId,
  //       videoResumeTiming: videoTimeDetails?.videoResumeTiming,
  //       watchTime: videoTimeDetails?.watchTime,
  //     })
  //     .subscribe(
  //       (data: any) => {},
  //       (error: any) => {}
  //     );
  //   this.apiMap.delete(materialId);
  //   this.subscriptionMap.get(materialId)?.unsubscribe();
  //   // this.watchedTimeSubscription.unsubscribe()
  // }

  // @HostListener('window:beforeunload')
  // beforeunloadHandler() {
  //   this.apiMap.forEach((value: VideoTimeTracking) => {
  //     this.classService
  //       .saveVideoResumeTiming({
  //         userId: +JSON.parse(localStorage.getItem('auth') as string).user_id,
  //         materialId: value.materialId,
  //         videoResumeTiming: value.videoResumeTiming,
  //         watchTime: value.watchTime,
  //       })
  //       .subscribe(
  //         (data: any) => {},
  //         (error: any) => {}
  //       );
  //   });
  //   this.subscriptionMap.forEach((sub: Subscription) => {
  //     sub.unsubscribe();
  //   });
  // }
  showPreview(filePath: string, type: string) {
    this.dialog.open(PreviewComponent, {
      maxWidth: '800px',
      data: {
        path: filePath,
        type: type,
      },
    });
  }
}
