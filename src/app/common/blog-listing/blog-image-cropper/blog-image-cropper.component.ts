import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { InstituteImageCropComponent } from '../../institute-image-crop/institute-image-crop.component';

@Component({
  selector: 'app-blog-image-cropper',
  standalone: true,
  imports: [],
  templateUrl: './blog-image-cropper.component.html',
  styleUrl: './blog-image-cropper.component.scss'
})
export class BlogImageCropperComponent implements OnInit {
  isImageLoaded: boolean = false;
  file: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCroppedImage: boolean = false;
  imageName!: string;
  imageFormat!: string;
  cropedImageEvent = new EventEmitter<string>();
  convertBase64ToFile = new EventEmitter<{ file: File; base64: string }>();
  widthRatio: number | undefined;
  heightRatio: number | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      imageFile: any;
      isConvertbase64ToFile?: boolean;
      widthRatio?: number;
      heightRatio?: number;
    },
    private dialogRef: MatDialogRef<InstituteImageCropComponent>
  ) {}

  ngOnInit(): void {
    this.file = this.data.imageFile;
    this.isImageLoaded = false;
    this.isCroppedImage = true;
    this.imageChangedEvent = event;
    this.imageName = this.file.name;
    this.imageFormat = this.file.type;
    this.widthRatio = this.data.widthRatio;
    this.heightRatio = this.data.heightRatio;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image?: LoadedImage) {
    // show cropper
    this.isImageLoaded = true;
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    this.isImageLoaded = false;
    // show message
  }

  closeDialog() {
    if (
      this.data.isConvertbase64ToFile &&
      this.data.isConvertbase64ToFile == true
    ) {
      this.convertBase64ToFile.emit({
        file: this.convertBase64StringToFile(),
        base64: this.croppedImage,
      });
      this.dialogRef.close();
      return;
    }
    this.cropedImageEvent.emit(this.croppedImage);
    this.dialogRef.close();
  }
  convertBase64StringToFile(): File {
    const arr = this.croppedImage.split(',');
    // const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], this.imageName, { type: this.imageFormat });
  }
}
