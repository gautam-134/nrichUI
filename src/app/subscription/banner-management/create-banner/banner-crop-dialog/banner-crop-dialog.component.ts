import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-banner-crop-dialog',
  standalone: true,
  imports: [],
  templateUrl: './banner-crop-dialog.component.html',
  styleUrl: './banner-crop-dialog.component.scss'
})
export class BannerCropDialogComponent implements OnInit {
  isImageLoaded: boolean = false;
  file: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCroppedImage: boolean = false;
  imageName!: string;
  imageFormat!: string;
  cropedImageEvent = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imageFile: any },
    private dialogRef: MatDialogRef<BannerCropDialogComponent>
  ) {}

  ngOnInit(): void {
    this.file = this.data.imageFile;
    this.isImageLoaded = false;
    this.isCroppedImage = true;
    this.imageChangedEvent = event;
    this.imageName = this.file.name;
    this.imageFormat = this.file.type;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image?: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
    this.isImageLoaded = true;
  }
  loadImageFailed() {
    this.isImageLoaded = true;
    // show message
  }

  closeDialog() {
    this.cropedImageEvent.emit(this.croppedImage);
    this.dialogRef.close();
  }
}
