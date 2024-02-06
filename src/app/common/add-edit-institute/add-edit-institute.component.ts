import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/loader.service';
import { SupportDetails } from 'src/app/model/SupportDetails';
import { SupportService } from 'src/app/services/Support/support.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { CoverImageCropComponent } from '../cover-image-crop/cover-image-crop.component';
import { InstituteImageCropComponent } from '../institute-image-crop/institute-image-crop.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-institute',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-institute.component.html',
  styleUrl: './add-edit-institute.component.scss'
})
export class AddEditInstituteComponent implements OnInit {
  instituteForm!: FormGroup;
  isSubmit: boolean = false;
  imageSrc!: any;
  file!: File;
  coverImage!: File;
  coverImageSrc!: any;
  disableField: boolean = false;
  instituteId!: number;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  @ViewChild('coverSelect') coverSelect!: ElementRef;
  countryList: string[] = [];
  stateList: string[] = [];
  instituteFormVO: InstituteFormVO = new InstituteFormVO();
  cropedFile!: string;
  imageName!: string;
  imageFormat!: string;
  coverImageName!: string;
  coverImageFormat!: string;
  isImageCroped: boolean = false;
  isCoverImageCroped: boolean = false;
  supportDetails!: SupportDetails[];
  emailStatus: string = '';
  hasSubDomain: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
    private instituteService: InstituteService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private supportService: SupportService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.commonService.fetchStatesAndCountries().subscribe((data) => {
      this.countryList = data.countries;
      this.stateList = data.states;
    });
    this.createInstituteForm();
    this.refresh();
    this.supportDetails = this.supportService.instituteSupport();
  }

  refresh() {
    this.instituteId = +AuthService.getInstituteId;
    this.loader
      .showLoader(this.instituteService.getInstituteDetails(this.instituteId))
      .subscribe(
        (res: InstituteFormVO) => {
          this.instituteFormVO = res;
          this.emailStatus = this.instituteFormVO.isEmailVerifiedForSMTP;
          this.imageSrc = this.instituteFormVO.instituteImagePath;
          this.coverImageSrc = this.instituteFormVO.coverImagePath;
          if (this.instituteFormVO.subDomain) {
            this.hasSubDomain = true;
          }
          this.createInstituteForm();
        },
        (err: any) => {
          this.alertService.errorAlert(
            'Error while fetching institute details'
          );
        }
      );
  }
  createInstituteForm() {
    this.instituteForm = this.fb.group({
      instituteName: [this.instituteFormVO?.instituteName, Validators.required],
      ownerName: [this.instituteFormVO?.ownerName],
      email: [
        this.instituteFormVO?.email,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      bankName: [this.instituteFormVO?.bankName, Validators.required],
      accountNumber: [
        this.instituteFormVO?.accountNumber,
        [Validators.required, Validators.pattern('^[0-9]{9,18}$')],
      ],
      subDomain: [this.instituteFormVO?.subDomain, Validators.required],
      subDomainUrl: [
        'https://' + this.instituteFormVO?.subDomain + '.nrichlearning.com',
        Validators.required,
      ],
      ifscCode: [
        this.instituteFormVO.ifscCode,
        [
          Validators.required,
          Validators.pattern('^[A-Za-z]{4}[a-zA-Z0-9]{7}$'),
        ],
      ],
      address: [this.instituteFormVO?.address, Validators.required],
      mobileNumber: [
        this.instituteFormVO?.mobileNumber,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      aboutUs: [this.instituteFormVO?.aboutUs],
      country: [this.instituteFormVO?.country, Validators.required],
      state: [this.instituteFormVO?.state, Validators.required],
      latitude: [this.instituteFormVO?.latitude, Validators.required],
      longitude: [this.instituteFormVO?.longitude, Validators.required],
      isEmailVerifiedForSMTP: [this.instituteFormVO?.isEmailVerifiedForSMTP],
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.instituteForm.invalid) {
      return;
    }
    this.instituteFormVO = this.instituteForm.value;

    if (this.isImageCroped == true) {
      this.convertBase64ToFile();
    }
    if (this.isCoverImageCroped == true) {
      this.convertCoverBase64ToFile();
    }
    this.instituteFormVO.instituteId = this.instituteId;
    this.loader
      .showLoader(
        this.instituteService.saveInstituteDetails(
          this.instituteFormVO,
          this.file,
          this.coverImage
        )
      )
      .subscribe(
        (res: any) => {
          this.alertService.successAlert(
            `Profile set-up is complete.${
              !this.hasSubDomain
                ? '<br />Your sub domain will be activated in 30 seconds'
                : ''
            }`
          );

          this.refresh();
          if (this.file) {
            window.location.reload();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 406) {
            this.alertService.errorAlert(err.error.message);
            return;
          }
          this.alertService.errorAlert(err.error.message);
        }
      );
  }

  getGeoLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.instituteForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }

  setSubDomainUrl(event: any) {
    console.log(event.target.value);
    this.instituteForm.patchValue({
      subDomainUrl: `https://${event.target.value}.nrichlearning.com`,
    });
  }

  copyToClipboard() {
    if (this.isSubmit || this.instituteForm.get('subDomain')?.value) {
      // Get the input element
      const subDomainInput = document.getElementById(
        'subDomainUrl'
      ) as HTMLInputElement;

      // Select the text in the input element
      subDomainInput.select();
      subDomainInput.setSelectionRange(0, 99999); // For mobile devices

      // Copy the selected text to the clipboard
      document.execCommand('copy');
      Swal.fire({
        position: 'top-end',
        title: 'Copied to clipboard',
        showConfirmButton: false,
        timer: 500,
      });

      // Optionally, you can provide user feedback, for example:
      // alert('Copied the text: ' + subDomainInput.value);
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        if (file.size > 1048576) {
          this.alertService.errorAlert('Institute image must be less than 1MB');
          this.fileSelect.nativeElement.value = '';
          return;
        }
        this.imageName = file.name;
        this.imageFormat = file.type;
        this.openDialog(file);
      } else {
        this.fileSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select jpg/jpeg/png format');
      }
    } else {
      this.fileSelect.nativeElement.value = '';
      return;
    }
  }

  onCoverImageChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        if (file.size > 1048576) {
          this.alertService.errorAlert('Cover image must be less than 1 MB');
          this.coverSelect.nativeElement.value = '';
          return;
        }
        this.coverImageName = file.name;
        this.coverImageFormat = file.type;
        this.openCoverDialog(file);
      } else {
        this.coverSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select jpg/jpeg/png format');
      }
    } else {
      this.coverSelect.nativeElement.value = '';
      return;
    }
  }

  isFileImage(file: any) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  get controls() {
    return this.instituteForm.controls;
  }

  onlyNumeric(event: any) {
    const keyCode = event.keyCode;
    if (
      (keyCode >= 48 && keyCode <= 57) ||
      keyCode === 8 ||
      keyCode === 46 ||
      (keyCode >= 37 && keyCode <= 40) ||
      (keyCode >= 96 && keyCode <= 105)
    )
      return true;
    return false;
  }

  openDialog(imageFile: any) {
    let dialogRef = this.dialog.open(InstituteImageCropComponent, {
      data: {
        imageFile: imageFile,
      },
    });
    dialogRef.componentInstance.cropedImageEvent.subscribe((image: string) => {
      this.imageSrc = image;
      this.isImageCroped = true;
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
  openCoverDialog(imageFile: any) {
    let dialogRef = this.dialog.open(CoverImageCropComponent, {
      data: {
        imageFile: imageFile,
      },
    });
    dialogRef.componentInstance.cropedImageEvent.subscribe((image: string) => {
      this.coverImageSrc = image;
      this.isCoverImageCroped = true;
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
    this.file = new File([u8arr], this.imageName, { type: this.imageFormat });
  }

  convertCoverBase64ToFile() {
    const arr = this.coverImageSrc.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.coverImage = new File([u8arr], this.coverImageName, {
      type: this.coverImageFormat,
    });
  }

  verifyEmail() {
    this.loader.showLoader(this.instituteService.verifyEmail()).subscribe({
      next: (data: any) => {
        this.emailStatus = data.body;
        this.alertService.successAlert(data.message);
        this.refresh();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(
          'Error while sending verification email !'
        );
      },
    });
  }

  checkStatus() {
    this.loader.showLoader(this.instituteService.checkStatus()).subscribe({
      next: (data: any) => {
        this.emailStatus = data.body;
        this.emailStatus == 'Pending'
          ? this.alertService.successAlert(
              'Please check your inbox and click the link to proceed with verfication process!'
            )
          : this.emailStatus == 'Success'
          ? this.alertService.successAlert('Your email is now verified!')
          : this.emailStatus == 'Failed' ||
            this.emailStatus == 'TemporaryFailure'
          ? this.alertService.errorAlert('Email verfication failed!')
          : '';
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Not able to fetch verification status!');
      },
    });
  }

  onlyAlphabets(event: any) {
    const keyCode = event.keyCode;
    if (
      (keyCode >= 65 && keyCode <= 90) || // A-Z
      (keyCode >= 97 && keyCode <= 122) || // a-z
      keyCode === 8 || // Backspace
      keyCode === 46 || // Delete
      (keyCode >= 37 && keyCode <= 40)
    ) {
      // Arrow keys
      return true;
    }
    return false;
  }
}

export class InstituteFormVO {
  instituteId!: number;
  instituteName!: string;
  address!: string;
  ownerName!: string;
  mobileNumber!: string;
  aboutUs!: string;
  email!: string;
  country!: string;
  state!: string;
  instituteImagePath!: string;
  coverImagePath!: string;
  latitude!: string;
  longitude!: string;
  isEmailVerifiedForSMTP!: string;
  bankName!: number;
  accountNumber!: number;
  ifscCode!: string;
  subDomain!: string;
}
