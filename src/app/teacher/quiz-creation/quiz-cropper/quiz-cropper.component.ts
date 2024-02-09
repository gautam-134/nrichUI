import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { LoaderService } from 'src/app/loader.service';

@Component({
  selector: 'app-quiz-cropper',
  standalone: true,
  imports: [],
  templateUrl: './quiz-cropper.component.html',
  styleUrl: './quiz-cropper.component.scss'
})
export class QuizCropperComponent implements OnInit, AfterViewInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  file!: any;
  imageName!: string;
  imageFormat!: string;
  constructor(
    private dialogRef: MatDialogRef<QuizCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
    private loader: LoaderService
  ) {}
  ngAfterViewInit(): void {
    let file: File = this.data.event.target.files[0];
    this.imageName = file.name;
    this.imageFormat = file.type;
    this.fileChangeEvent(this.data.event);
  }
  ngOnInit(): void {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {}
  loadImageFailed() {
    // show message
  }

  convertBase64ToFile() {
    this.loader.loadingOn();
    const arr = this.croppedImage.split(',');
    // const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file = new File([u8arr], this.imageName, { type: this.imageFormat });
    this.loader.loadingOff();
    this.dialogRef.close(this.file);
  }
}
