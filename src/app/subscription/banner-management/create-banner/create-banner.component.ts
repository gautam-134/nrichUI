import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BannerVO } from '../../../model/BannerVO';
import { BannerCropDialogComponent } from './banner-crop-dialog/banner-crop-dialog.component';
import { LoaderService } from '../../../loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { Router } from '@angular/router';
import { BannerService } from '../../../services/banner/banner.service';

@Component({
  selector: 'app-create-banner',
   
  templateUrl: './create-banner.component.html',
  styleUrl: './create-banner.component.scss'
})
export class CreateBannerComponent implements OnInit {
  bannerForm!: FormGroup;
  bannerDetails!: BannerVO;
  submitted: boolean = false;
  imageFormat!: string;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  imageSrc!: string;
  isImageCroped: boolean = false;
  file!: File;
  hasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private router: Router,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.bannerForm = this.fb.group({
      bannerName: [this.bannerDetails?.bannerName, Validators.required],
      redirectPath: [this.bannerDetails?.redirectPath, Validators.required],
      location: [this.bannerDetails?.location, Validators.required],
      bannerImagePath: [this.bannerDetails?.bannerImage, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.imageSrc) this.convertBase64ToFile();
    else {
      this.hasError = true;
      return;
    }
    if (this.bannerForm.valid) {
      this.bannerDetails = this.bannerForm.value;
      this.loader
        .showLoader(
          this.bannerService.saveBannerDetails(this.bannerDetails, this.file)
        )
        .subscribe({
          next: (data: any) => {
            this.alertService.successAlert('Banner created successfully!');
            this.router.navigateByUrl('/master/banners');
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.errorAlert('Error while creating banner!');
          },
        });
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        this.bannerForm.get('bannerImagePath')?.setValue(file.name);
        this.imageFormat = file.type;
        this.openDialog(file);
      }
    } else {
      this.fileSelect.nativeElement.value = '';
      this.bannerForm.get('bannerImagePath')?.setValue('');
      return;
    }
  }

  isFileImage(file: any) {
    const acceptedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
    ];
    return file && acceptedImageTypes.includes(file['type']);
  }

  openDialog(imageFile: any) {
    let dialogRef = this.dialog.open(BannerCropDialogComponent, {
      data: {
        imageFile: imageFile,
      },
    });
    dialogRef.componentInstance.cropedImageEvent.subscribe((image: string) => {
      this.imageSrc = image;
      this.isImageCroped = true;
      this.hasError = false;
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  convertBase64ToFile() {
    const arr = this.imageSrc.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file = new File(
      [u8arr],
      this.bannerForm.get('bannerImagePath')?.value,
      {
        type: this.imageFormat,
      }
    );
  }

  get form() {
    return this.bannerForm?.controls;
  }
}
