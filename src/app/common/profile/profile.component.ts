import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Profile } from 'src/app/model/Profile';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import Swal from 'sweetalert2';
import { ImageCropDialogComponent } from '../image-crop-dialog/image-crop-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  submitted: boolean = false;
  teaserVideoName: string = '';
  teaserVideo!: File;
  file!: File;
  imageSrc!: any;
  isVerified: boolean = false;
  containsEmail: boolean = false;
  isStudent: boolean = true;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  @ViewChild('videoSelect') videoSelect!: ElementRef;
  new: { value: string }[] = [];
  profile: Profile = new Profile();
  countryList: string[] = [];
  stateList: string[] = [];
  cropedFile!: string;
  isImageCroped: boolean = false;
  // imageName!: string;
  imageFormat!: string;
  emailMessage!: string;
  invalidControlNames: string[] = [];
  invalidFields: string[] = [];
  today!: Date;
  currentYear = moment().year();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private subscriptionService: SubscriptionService,
    private alertService: SwalAlertService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.myReferralCode();
    this.commonService.fetchStatesAndCountries().subscribe((data: any) => {
      this.countryList = data.countries;
      this.stateList = data.states;
    });
    this.isStudent = AuthService.getRoleType == 'Student' ? true : false;
    this.createProfileForm();
    this.loader.showLoader(this.authService.getProfile()).subscribe(
      (res: Profile) => {
        this.profile = res;
        this.createProfileForm();
        this.imageSrc = res.userImagePath;
        this.teaserVideoName = res.teacherObj.teacherTeasorVideo;
        this.isVerified = res.verified;
        res?.email?.length > 0
          ? (this.containsEmail = true)
          : (this.containsEmail = false);
        this.new = this.profile.teacherObj?.metaTags.map(function (e) {
          return { display: e, value: e };
        });
      },
      (err: any) => {
        this.alertService.errorAlert('Error while fetching profile');
      }
    );
  }
  getToday(): string {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    return new Date(year - 5, month, day).toISOString().split('T')[0];
  }
  createProfileForm() {
    this.profileForm = this.fb.group(
      {
        name: [this.profile?.name, Validators.required],
        email: [
          this.profile?.email,
          [Validators.email, Validators.required, this.emailvalidate],
        ],
        dob: [
          this.profile?.dob?.toString().substring(0, 10),
          Validators.required,
        ],
        gender: [this.profile?.gender, Validators.required],
        mobileNumber: [this.profile?.mobileNumber],
        address: [this.profile?.address, Validators.required],
        country: [this.profile?.country, Validators.required],
        state: [this.profile?.state, Validators.required],
        userImage: [this.profile?.userImage, Validators.required],
        isProfileCompleted: [this.profile?.isProfileCompleted],
        teacherObj: this.fb.group({
          teacherName: [this.profile?.name, Validators.required],
          teacherImage: [this.profile?.userImage],
          facebookPage: [this.profile?.teacherObj?.facebookPage],
          instaPage: [this.profile?.teacherObj?.instaPage],
          youtubePage: [this.profile?.teacherObj?.youtubePage],
          teacherPage: [this.profile?.teacherObj?.teacherPage],
          linkedInPage: [this.profile?.teacherObj?.linkedInPage],
          teacherOneLineDescription: [
            this.profile?.teacherObj?.teacherOneLineDescription,
            Validators.required,
          ],
          metaTags: [this.profile?.teacherObj?.metaTags, Validators.required],
          metaDescription: [
            this.profile?.teacherObj?.teacherOneLineDescription,
          ],
          experience: [
            this.profile?.teacherObj?.experience,
            Validators.required,
          ],
          isPrivate: [this.profile?.teacherObj?.isPrivate],
          displayOrder: [this.profile?.teacherObj?.displayOrder],
          teaserVideoType: [
            this.profile?.teacherObj?.youtubePage
              ? 'youtubeVideo'
              : this.profile?.teacherObj?.teacherTeasorVideo
              ? 'normalVideo'
              : '',
          ],
        }),
      },
      { validator: this.isYouTubeFieldValid }
    );
  }

  isYouTubeFieldValid(control: AbstractControl): ValidationErrors | null {
    const youtubeLink: string = control
      .get('teacherObj')
      ?.get('youtubePage')?.value;
    if (youtubeLink && !youtubeLink.includes('https://www.youtube.com/watch')) {
      return { inValidYoutubeLink: true };
    }
    return null;
  }

  submitStudentForm() {
    this.submitted = true;
    if (
      this.profileForm.get('email')?.invalid ||
      this.profileForm.get('dob')?.invalid ||
      this.profileForm.get('gender')?.invalid ||
      this.profileForm.get('address')?.invalid ||
      this.profileForm.get('country')?.invalid ||
      this.profileForm.get('state')?.invalid
    ) {
      return;
    }

    this.profileForm.removeControl('teacherObj');
    this.profile = this.profileForm.value;
    if (this.isImageCroped == true) {
      this.convertBase64ToFile();
    }
    this.loader
      .showLoader(
        this.authService.createUser(this.profile, this.file, this.teaserVideo)
      )
      .subscribe({
        next: (res: any) => {
          this.loader.loadingOff();
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          auth.first_name = this.profile.name;
          localStorage.setItem('auth', JSON.stringify(auth));
          this.authService.nameSubject.next(auth.first_name);
          if (this.file) {
            window.location.reload();
          }
          this.alertService.successAlert('Profile updated successfully');
        },
        error: (err: any) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Error while updating the profile');
        },
      });
  }

  async submitTeacherForm() {
    this.emailMessage = '';
    this.invalidControlNames = [];
    this.invalidFields = [];
    this.submitted = true;
   
    if (this.profileForm.errors?.['inValidYoutubeLink']) {
      const accordionPanel = document.getElementById('panelsStayOpen-collapseOne');
      if (accordionPanel) {
        this.renderer.removeClass(accordionPanel, 'collapse');
        this.renderer.addClass(accordionPanel, 'show');
      }
      return;
    }
    if (
      this.profileForm.get('name')?.invalid ||
      this.profileForm.get('email')?.invalid ||
      this.profileForm.get('dob')?.invalid ||
      this.profileForm.get('gender')?.invalid ||
      this.profileForm.get('address')?.invalid ||
      this.profileForm.get('country')?.invalid ||
      this.profileForm.get('state')?.invalid
    ) {
      return;
    }
    this.profile = this.profileForm.value;

    this.profile.email = this.profileForm.get('email')?.value;
    this.profile.teacherObj.metaDescription = this.profileForm.get(
      'teacherObj.teacherOneLineDescription'
    )?.value;
    let controls = (this.profileForm.get('teacherObj') as FormGroup).controls;
    if (this.profileForm.get('userImage')?.invalid) {
      this.invalidControlNames.push('image');
    }
    for (const name in controls) {
      if (controls[name].invalid) {
        this.invalidControlNames.push(name);
      }
    }
    if (
      this.invalidControlNames.length != 0 &&
      (await this.showWarning(this.invalidControlNames).catch(
        (obj: boolean) => {
          return obj;
        }
      )) == false
    ) {
      return;
    }
    if (this.invalidControlNames.length == 0) {
      this.profile.isProfileCompleted = true;
    } else {
      this.profile.isProfileCompleted = false;
    }
    this.profile.teacherObj.metaTags = this.new.map(function (a) {
      return a['value'];
    });

    if (
      AuthService.getRoleType == 'Admin' ||
      AuthService.getRoleType == 'InstituteAdmin'
    ) {
      this.profile.isProfileCompleted = true;
    }

    this.profile.fromProfile = true;
    if (this.isImageCroped == true) {
      this.convertBase64ToFile();
    }

    this.loader
      .showLoader(
        this.authService.createUser(this.profile, this.file, this.teaserVideo)
      )
      .subscribe(
        (res: any) => {
          this.loader.loadingOff();
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          auth.first_name = this.profile.name;
          localStorage.setItem('auth', JSON.stringify(auth));
          this.authService.nameSubject.next(auth.first_name);
          if (this.file) {
            window.location.reload();
          }
          this.alertService.successAlert('Profile updated successfully');
        },
        (err: any) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Error while updating the profile');
        }
      );
  }

  submit() {
    if (this.isStudent) {
      this.submitStudentForm();
      return;
    }
    this.submitTeacherForm();
  }

  get controls() {
    return this.profileForm.controls;
  }

  emailvalidate(control: AbstractControl): { [key: string]: any } | null {
    const regexp = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
    );
    if (!regexp.test(control.value)) {
      return { emailvalidate: true };
    } else {
      return null;
    }
  }

  verifyEmail() {
    this.loader
      .showLoader(
        this.authService.verifyEmail(this.profileForm.get('email')?.value)
      )
      .subscribe(
        (res: any) => {
          this.emailMessage = 'Email sent to your given email address';
        },
        (err: any) => {
          this.alertService.errorAlert(err.error.message);
        }
      );
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        this.profileForm.get('userImage')?.setValue(file.name);
        this.imageFormat = file.type;
        this.openDialog(file);
      } else {
        this.fileSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select jpg/jpeg/png format');
      }
    } else {
      this.fileSelect.nativeElement.value = '';
      this.profileForm.get('userImage')?.setValue('');
      return;
    }
  }

  openDialog(imageFile: any) {
    let dialogRef = this.dialog.open(ImageCropDialogComponent, {
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

  convertBase64ToFile() {
    const arr = this.imageSrc.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file = new File([u8arr], this.profileForm.get('userImage')?.value, {
      type: this.imageFormat,
    });
  }
  onTeasorVideoChange($event: any) {
    let file = $event.target.files[0];
    if (this.isFileVedio(file)) {
      this.teaserVideo = file;
    } else {
      this.videoSelect.nativeElement.value = '';
      this.alertService.errorAlert(
        'Please select Teasor Video or change material type.'
      );
    }
  }

  isFileVedio(file: any) {
    const acceptedVideoTypes = ['video/mp4', 'video/ogg'];
    return file && acceptedVideoTypes.includes(file['type']);
  }

  isFileImage(file: any) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  showWarning(invalidControlNames: any) {
    if (invalidControlNames.includes('teacherName')) {
      this.invalidFields.push('Teacher Name');
    }
    if (invalidControlNames.includes('image')) {
      this.invalidFields.push('Profile Pic');
    }
    if (invalidControlNames.includes('teacherOneLineDescription')) {
      this.invalidFields.push('Description');
    }
    if (invalidControlNames.includes('experience')) {
      this.invalidFields.push('Experience');
    }
    if (this.new.length == 0 && invalidControlNames.includes('metaTags')) {
      this.invalidFields.push('Tags');
    }

    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do You Want To proceed to the Pricing Plan ? </p>',
      html:
        'You have not completed the teacher Details.' +
        '<br><br>' +
        'The below mentioned inputs are required to publish teacher on public profile.<br>' +
        ' <b>' +
        this.invalidFields.toString() +
        '</b>',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Continue',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  myReferralCode() {
    this.subscriptionService.getMyReferralCode().subscribe({
      next: (data: ApiResponse) => {},
      error: (error: HttpErrorResponse) => {},
    });
  }
}
