import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlogImageCropperComponent } from '../../common/blog-listing/blog-image-cropper/blog-image-cropper.component';
import { LoaderService } from '../../loader.service';
import { ApiResponse } from '../../model/ApiResponse';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CommonService } from '../../services/common/common.service';
import { SocialApiService } from '../services/social-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { Inject } from '@angular/core';
@Component({
  selector: 'app-create-profile',
   
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss'
})
export class CreateProfileComponent implements OnInit {
  new: { value: string }[] = [];
  isSubmit: boolean = false;
  profilePic!: File;
  profilePicBase64: string | undefined;
  coverPicBase64: string | undefined;
  coverImage!: File;
  profilePicPreivew: string | undefined;
  coverPicPreview: string | undefined;
  userProfile = new UserProfile();
  userProfileForm!: FormGroup;
  countryList: string[] = [];
  stateList: string[] = [];
  constructor(
    private dialog: MatDialog,
    private loader: LoaderService,
    private http: SocialApiService,
    private alert: SwalAlertService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) {}

  get getControls() {
    return this.userProfileForm.controls;
  }

  ngOnInit(): void {
    this.fetchProfile();
    this.createForm();
    this.fetchCountryAndState();
  }

  fetchCountryAndState() {
    this.loader
      .showLoader(this.commonService.fetchStatesAndCountries())
      .subscribe((data: any) => {
        this.countryList = data.countries;
        this.stateList = data.states;
      });
  }

  createForm() {
    this.userProfileForm = this.fb.group({
      id: [this.userProfile.id],
      instituteId: [this.userProfile.instituteId],
      name: [
        {
          value: this.userProfile.name ? this.userProfile.name : '',
          disabled: true,
        },
        Validators.required,
      ],
      dateOfBirth: [
        {
          value: this.userProfile.dateOfBirth
            ? this.userProfile.dateOfBirth
            : '',
          disabled: true,
        },
        Validators.required,
      ],
      gender: [
        {
          value: this.userProfile.gender ? this.userProfile.gender : '',
          disabled: true,
        },
        Validators.required,
      ],
      state: [
        {
          value: this.userProfile.state ? this.userProfile.state : '',
          disabled: true,
        },
        Validators.required,
      ],
      country: [
        {
          value: this.userProfile.country ? this.userProfile?.country : '',
          disabled: true,
        },
        Validators.required,
      ],
      employmentStatus: [
        this.userProfile.employmentStatus
          ? this.userProfile.employmentStatus
          : '',
        Validators.required,
      ],
      interest: [
        this.userProfile.interest ? this.userProfile.interest : '',
        Validators.required,
      ],
      educationQualification: [
        this.userProfile.educationQualification
          ? this.userProfile.educationQualification
          : '',
        Validators.required,
      ],
      bio: [
        this.userProfile.bio ? this.userProfile.bio : '',
        Validators.required,
      ],
    });
  }

  private handleInterest() {
    if (this.userProfile?.interest)
      this.new = this.userProfile?.interest.map(function (e) {
        return { display: e, value: e };
      });
  }

  fetchProfile() {
    this.loader.showLoader(this.http.fetchProfile()).subscribe({
      next: (data: ApiResponse) => {
        this.userProfile = data.body;
        this.handleInterest();
        this.createForm();
      },
      error: (error: HttpErrorResponse) => {
        // this.createProfileIfNotExist();
      },
    });
  }

  // private createProfileIfNotExist() {
  //   console.log('create profile if not exist');
  //   this.userProfile.instituteId = +AuthService.getInstituteId;
  //   this.loader
  //     .showLoader(this.http.createProfile(this.userProfile))
  //     .subscribe({
  //       next: (data: ApiResponse) => {
  //         console.log('profile crreated');
  //         this.userProfile = data.body;
  //         this.createForm();
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         console.log('error while createing proile');
  //         this.alert.okErrorAlert(error.error.message);
  //       },
  //     });
  // }

  removeImage(isProfilePic: boolean) {
    if (isProfilePic) {
      this.profilePicBase64 = undefined;
      this.userProfile.profileImage = undefined;
      this.profilePicPreivew = undefined;
    } else {
      this.coverPicPreview = undefined;
      this.coverPicBase64 = undefined;
      this.userProfile.coverImage = undefined;
    }
  }

  uploadImage(
    event: any,
    widthRatio: number,
    heightRatio: number,
    isProfilePic: boolean
  ) {
    let file: File = event.target.files[0];
    const dialogRef = this.dialog.open(BlogImageCropperComponent, {
      data: {
        imageFile: file,
        isConvertbase64ToFile: true,
        widthRatio: widthRatio,
        heightRatio: heightRatio,
      },
    });
    dialogRef.componentInstance.convertBase64ToFile.subscribe(
      (obj: { file: File; base64: string }) => {
        if (isProfilePic) {
          this.profilePic = obj.file;
          this.profilePicBase64 = obj.base64;
          this;
        } else {
          this.coverImage = obj.file;
          this.coverPicBase64 = obj.base64;
        }
      }
    );
    dialogRef.componentInstance.cropedImageEvent.subscribe((base64) => {});
  }

  submit() {
    this.userProfileForm.enable();
    this.isSubmit = true;
    if (this.userProfileForm.invalid) return;
    const profileImage = this.userProfile.profileImage;
    const coverImage = this.userProfile.coverImage;
    this.userProfile = this.userProfileForm.value;
    this.userProfile.coverImage = coverImage;
    this.userProfile.profileImage = profileImage;
    this.userProfileForm.disable();
    this.userProfile.interest = this.new.map(function (a) {
      return a['value'];
    });
    this.loader
      .showLoader(
        this.http.createProfile(
          this.userProfile,
          this.profilePic,
          this.coverImage
        )
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.userProfile = data.body;
          this.alert.successAlert('Profile updated successfully');
          this.router.navigate([
            `/${AuthService.getModulePrefix}/social-connect/profile`,
          ]);
        },
        error: (error: HttpErrorResponse) => {
          this.alert.okErrorAlert(
            error.error.message ? error.error.message : ''
          );
        },
      });
  }
}

export class UserProfile {
  id!: number;
  educationQualification!: string;
  employmentStatus!: string;
  profileImage: string | undefined;
  coverImage: string | undefined;
  interest!: string[];
  name!: string;
  instituteId!: number;
  gender!: string;
  state!: string;
  country!: string;
  dateOfBirth!: Date;
  bio!: string;
}

