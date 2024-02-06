import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { Profile } from 'src/app/model/Profile';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { getMessaging, getToken } from 'firebase/messaging';
// import Swal from 'sweetalert2';
// import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-sign-up-profile',
  standalone: true,
  imports: [],
  templateUrl: './sign-up-profile.component.html',
  styleUrl: './sign-up-profile.component.scss'
})
export class SignUpProfileComponent implements OnInit {
  imageSrc!: any;
  signupForm!: UntypedFormGroup;
  referralCode: string | null = '';
  submitted: boolean = false;
  isTeacherOrStudent!: string;
  file!: File;
  file2!: File;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  profile: Profile = new Profile();
  countryList: string[] = [];
  stateList: string[] = [];

  changeHeight: boolean = false;
  hasCodeError: boolean = false;

  nextDetails: boolean = false;
  class1: string = 'non-active';
  class2: string = 'non-active';

  code!: string | null;
  type!: string | null;
  role: any;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private router: Router,
    private commonService: CommonService,
    private alertService: SwalAlertService,
    @Inject('VAPID_KEY') private VAPID_KEY: string,
    private firebaseService: FirebaseService,
    // private clipboard: ClipboardService
  ) {}

  ngOnInit(): void {
    this.requestPermission();
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.commonService.fetchStatesAndCountries().subscribe(
      (data) => {
        this.countryList = data.countries;
        this.stateList = data.states;
      },
      (error) => {}
    );
    this.createSignUpForm();
    this.isTeacherOrStudent = this.activatedRoute.snapshot.queryParams['type'];
    this.loader.showLoader(this.authService.getUserProfile('')).subscribe(
      (res) => {
        this.profile = res;
        this.imageSrc = this.profile.userImagePath;
        this.createSignUpForm();
      },
      (err) => {}
    );
  }

  skipProfile() {
    this.router.navigate([`${AuthService.getModulePrefix}/enrollments`]);
  }

  @HostListener('window:beforeunload')
  beforeunload() {
    localStorage.removeItem('auth');
  }

  createSignUpForm() {
    this.signupForm = this.fb.group({
      name: [this.profile?.name, Validators.required],
      email: [this.profile?.email, [Validators.email, Validators.required]],
      code: [this.code ? this.code : this.profile?.code],
      dob: [
        this.profile?.dob?.toString().substring(0, 10),
        Validators.required,
      ],
      gender: [this.profile?.gender, Validators.required],
      country: [this.profile?.country, Validators.required],
      state: [this.profile?.state, Validators.required],
      agree: [false, Validators.requiredTrue],
      teacherObj: this.fb.group({}),
    });
  }
  getToday(): string {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    return new Date(year - 5, month, day).toISOString().split('T')[0];
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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

  createUser() {
    debugger
    this.loader.loadingOn();

    const role = this.activatedRoute.snapshot.queryParams['type'];
    if (role === 'student') {
      this.signupForm.removeControl('teacherObj');
    }

    const profile = this.signupForm.value;
    profile.instituteId = AuthService.getInstituteId;
    profile.isProfileCompleted = true;

    if (role !== 'student') {
      profile.teacherObj.metaTags = [];
      profile.teacherObj.isPrivate = true;
    }

    this.loader
      .showLoader(
        this.authService.createUser(profile, this.file, this.file2)
      )
      .subscribe({
        next: (res) => {
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          auth.first_name = this.profile.name;
          auth.email = this.profile.email;
          localStorage.setItem('auth', JSON.stringify(auth));
          this.role = JSON.parse(
            localStorage.getItem('auth') as string
          ).role.roleType;
          this.authService.loggedInSubject.next(true);
          if (this.role == 'Student') {
            this.router.navigateByUrl('/');
          } else {
            this.router.navigateByUrl(`${AuthService.getModulePrefix}/onboard`);
          }
        },
        error: (err) => {
          if (err.error.status == '409') {
            this.alertService.errorAlert('Email already exists!');
          } else {
            this.alertService.errorAlert('Something went wrong!');
          }
        },
      });

    // this.authService.createUser(profile, this.file, this.file2).subscribe({
    //   next: (res) => {
    //     const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    //     const roleType = auth?.role?.roleType;

    //     if (roleType === 'Student') {
    //       auth.first_name = profile.name;
    //       auth.email = profile.email;
    //       localStorage.setItem('auth', JSON.stringify(auth));
    //       this.authService.loggedInSubject.next(true);
    //       this.router.navigateByUrl('/marketing/online-courses-directory');
    //       this.loader.loadingOff();
    //     } else {
    //       const subDomain = this.signupForm.get('subDomain')?.value;
    //       this.authService.loggedInSubject.next(false);
    //       if (localStorage.getItem('auth')) {
    //         localStorage.clear();
    //       }
    //       this.loader.loadingOff();
    //       this.alertService
    //         .buttonSuccessAlertOnly(
    //           `Your account has been created. <br />Sub-domain creation is in progress. <br /> You can use the sub-domain in 30 seconds <br /> <b>https://${subDomain}.nrichlearning.com</b>`,
    //           'Copy'
    //         )
    //         .then((result) => {
    //           const urlToCopy = `https://${subDomain}.nrichlearning.com`;
    //           this.clipboard.copyFromContent(urlToCopy);
    //           Swal.fire({
    //             position: 'top-end',
    //             title: 'Sub-Domain copied to clipboard!',
    //             showConfirmButton: false,
    //             timer: 1000,
    //           });
    //           this.router.navigateByUrl('/auth/login');
    //         });
    //     }
    //   },
    //   error: (err) => {
    //     this.loader.loadingOff();
    //     const errorMessage =
    //       err.error.status === 409
    //         ? err.error.message
    //         : 'Something went wrong!';
    //     this.alertService.errorAlert(errorMessage);
    //   },
    // });
  }

  submit() {
    this.submitted = false;
    // if (this.type == 'student') {
    //   this.signupForm.get('subDomain')?.clearValidators();
    //   this.signupForm.get('subDomain')?.updateValueAndValidity();
    // }
    debugger
    if (this.signupForm.invalid) {
      this.submitted = true;
      return;
    }
    if (
      !(
        this.signupForm.get('gender')?.value == 'M' ||
        this.signupForm.get('gender')?.value == 'F'
      )
    ) {
      this.submitted = true;
      return;
    }

    this.createUser();
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

  get controls() {
    return this.signupForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); 
        reader.onload = (event) => {
          this.imageSrc = event?.target?.result;
        };
      }
    } else {
      this.fileSelect.nativeElement.value = '';
      return;
    }
  }

  isFileImage(file: any) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  setActiveClass(val: number) {
    if (val == 1) {
      this.class1 = 'active';
      this.class2 = 'non-active';
      this.profile.gender = 'M';
      this.signupForm.patchValue({
        gender: 'M',
      });
    } else {
      this.class2 = 'active';
      this.class1 = 'non-active';
      this.profile.gender = 'F';
      this.signupForm.patchValue({
        gender: 'F',
      });
    }
  }

  checkNameAndEmail() {
    this.submitted = false;
    if (
      this.signupForm.get('name')?.invalid ||
      this.signupForm.get('email')?.invalid
    ) {
      this.submitted = true;
      return;
    }
    var referralCode = this.signupForm.get('code')?.value;
    if (referralCode) {
      this.authService.checkReferralCode(referralCode).subscribe({
        next: (data: any) => {
          this.hasCodeError = false;
          this.changeHeight = true;
          this.nextDetails = true;
        },
        error: (err: HttpErrorResponse) => {
          this.hasCodeError = true;
        },
      });
      return;
    }
    this.hasCodeError = false;
    this.changeHeight = true;
    this.nextDetails = true;
  }

  removeCodeValidation() {
    var referralCode = this.signupForm.get('code')?.value;
    if (!referralCode) this.hasCodeError = false;
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: this.VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          this.firebaseService.saveToken(currentToken).subscribe({
            next: (data: any) => {},
            error: (error: HttpErrorResponse) => {},
          });
        } else {
        }
      })
      .catch((err) => {});
  }
}