import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { saveAs } from 'file-saver';
import { LoaderService } from '../../loader.service';
import { S3FileInfo, S3StorageDetails } from '../../model/S3StorageDetails';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import Swal from 'sweetalert2';

import { MatDialog } from '@angular/material/dialog';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { PreviewComponent } from './preview/preview.component';

@Component({
  selector: 'app-file-management',
   
  templateUrl: './file-management.component.html',
  styleUrl: './file-management.component.scss'
})
export class FileManagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  bucketSize!: number;
  usedSpace!: number;
  files: S3FileInfo[] = [];
  selectedFiles: S3FileInfo[] = [];
  selectedSize: number = 0;
  filePath: string = '';
  videoTypes: string[] = ['mp4', 'mov', 'avi', 'mkv'];
  imageTypes: string[] = ['jpeg', 'jpg', 'png'];
  audioTypes: string[] = ['mp3'];
  otherTypes: string[] = ['pdf', 'doc', 'docx'];
  typeOfShorting: boolean = true;
  type: any;
  size: string = '5';
  s3StorageDetails = new S3StorageDetails();
  @ViewChild('fileSearch') courseSearch!: ElementRef;
  currentTokens: string[] = [];
  searchSubscription!: Subscription;
  constructor(
    private subscriptionService: SubscriptionService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.search();
  }

  ngOnInit(): void {
    this.refresh();
    this.fetchAnaytics();
  }

  fetchAnaytics() {
    this.subscriptionService.getS3Properties().subscribe({
      next: (data: S3StorageDetails) => {
        this.bucketSize = data.bucketSize;
        this.usedSpace = data.usedSpace / 1024 / 1024 / 1024;
      },
      error: (error: HttpErrorResponse) => {
        this.bucketSize = 0;
        this.usedSpace = 0;
        this.alertService.errorAlert(
          'Somthing went wrong while fetching storage details.'
        );
      },
    });
  }

  search() {
    this.currentTokens = [];
    this.searchSubscription = fromEvent(
      this.courseSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.subscriptionService.gets3BucketPropertiesWithPagination(
              this.size,
              undefined,
              data.target.value
            )
          )
          .subscribe({
            next: (res: S3StorageDetails) => {
              this.s3StorageDetails = res;
              this.files = res?.uploadedFiles;
            },
            error: (error) => {
              this.alertService.errorAlert('Somthing Went Wrong !');
            },
          });
      });
  }

  refresh() {
    let api$ = this.subscriptionService.gets3BucketPropertiesWithPagination(
      this.size,
      this.s3StorageDetails.nextContinuationToken
    );
    this.loader.showLoader(api$).subscribe({
      next: (res: S3StorageDetails) => {
        this.s3StorageDetails = res;
        this.currentTokens.push(res.continuationToken);
        this.files = res?.uploadedFiles;
      },
      error: (error) => {
        this.alertService.errorAlert('Somthing Went Wrong !');
      },
    });
  }

  nextAndPrev(isNext: boolean) {
    if (!isNext) this.currentTokens.pop();
    let api$ = this.subscriptionService.gets3BucketPropertiesWithPagination(
      this.size,
      !isNext
        ? this.currentTokens[this.currentTokens.length - 1]
        : this.s3StorageDetails.nextContinuationToken
    );
    this.loader.showLoader(api$).subscribe({
      next: (res: S3StorageDetails) => {
        this.s3StorageDetails = res;
        if (isNext) this.currentTokens.push(res.continuationToken);
        this.files = res?.uploadedFiles;
      },
      error: (error) => {
        this.alertService.errorAlert('Something went wrong.');
      },
    });
  }

  addToSelected(data: S3FileInfo, event: any) {
    if (event.target.checked) {
      data.selected = true;
      this.selectedFiles.push(data);
      this.selectedSize += data.size;
    } else {
      const index = this.selectedFiles.findIndex((c) => c.etag == data.etag);
      if (index > -1) {
        this.selectedFiles[index].selected = false;
        this.selectedSize -= data.size;
        this.selectedFiles.splice(index, 1);
      }
    }
  }

  showPreview(key: string) {
    const filePath = this.filePath + key;
    const type = this.getFileType(filePath);
    this.dialog.open(PreviewComponent, {
      maxWidth: '800px',
      data: {
        path: filePath,
        type: type,
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
      :this.audioTypes.includes(
        filePath.substring(filePath.lastIndexOf('.') + 1)
      )
      ?'audio'
      : 'file';
  }

  downloadFile(key: string,eTag:string) {
    this.loader
      .showLoader(this.subscriptionService.downloadFile(key,eTag))
      .subscribe(
        (data: any) => {
          const blob = new Blob([data], { type: data.type });
          saveAs(blob, key.split('/').pop());
        },
        (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            'You are not allowed to download the resources'
          );
        }
      );
  }

  deleteFiles() {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the file?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        let keys = this.selectedFiles.map((value: S3FileInfo) => value.key);
        this.loader.loadingOn();
        this.subscriptionService.deleteFiles(keys).subscribe({
          next: (data: ApiResponse) => {
            this.loader.loadingOff();
            this.selectedFiles = [];
            this.currentTokens = [];
            this.s3StorageDetails = new S3StorageDetails();
            this.selectedSize = 0;
            this.refresh();
          },
          error: (error: HttpErrorResponse) => {
            this.loader.loadingOff();
            this.alertService.errorAlert('Something went wrong!');
          },
        });
      } else if (result.isDenied) {
        this.alertService.errorAlert('Files not deleted');
      }
    });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  changeSize(event: any) {
    this.currentTokens = [];
    this.size = event.target.value;
    this.s3StorageDetails = new S3StorageDetails();
    this.refresh();
  }
}
