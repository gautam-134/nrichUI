import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-cover-image-crop',
  standalone: true,
  imports: [],
  templateUrl: './cover-image-crop.component.html',
  styleUrl: './cover-image-crop.component.scss'
})
export class CoverImageCropComponent implements OnInit {
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
    private dialogRef: MatDialogRef<CoverImageCropComponent>
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
