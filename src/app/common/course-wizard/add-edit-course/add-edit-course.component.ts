import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LoaderService } from 'src/app/loader.service';
import { Course } from 'src/app/model/Course';
import { AuthService } from 'src/app/services/auth.service';
import { CourseWizardService } from 'src/app/services/course/course-wizard.service';
import { CourseService } from 'src/app/services/course/course.service';
import Swal from 'sweetalert2';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { lastValueFrom, Subscription } from 'rxjs';
import { RequestForOtherCategoryComponent } from './request-for-other-category/request-for-other-category.component';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SettingServiceService } from 'src/app/services/setting-service.service';
import { RazorpayDetails } from 'src/app/model/razorPayDetails';

@Component({
  selector: 'app-add-edit-course',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-course.component.html',
  styleUrl: './add-edit-course.component.scss'
})
export class AddEditCourseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  courseForm!: FormGroup;
  isEdit: boolean = false;
  value: string = '';
  isSubmit: boolean = false;
  course = new Course();
  image: File | undefined;
  video: File | undefined;
  imageName!: string;
  imageFormat!: string;
  addOnBlur = true;
  courseCategories: CategoryVO[] = [];
  subCategories: CourseCategoryMappingVO[] = [];
  subSubCategories: CourseCategoryMappingVO[] = [];
  paymentModes: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @ViewChild('imageSelect') imageSelect!: ElementRef;
  @ViewChild('videoSelect') videoSelect!: ElementRef;
  @ViewChild('searchCategories') searchCategories!: ElementRef;
  @ViewChild('searchSubCategories') searchSubCategories!: ElementRef;
  @ViewChild('searchSubSubCategories') searchSubSubCategories!: ElementRef;
  @ViewChild('online') online!: ElementRef;
  @ViewChild('offline') offline!: ElementRef;
  courseSubscription$!: Subscription;
  metaTags: { name: string }[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCroppedImage: boolean = false;
  isImageLoaded: boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '105px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize'],[ ' foregroundColorPicker ', ' backgroundColorPicker ' ]],
  };
  invalidControlNames: string[] = [];
  invalidFields: string[] = [];
  instituteId!: number;
  categoryRequestId!: number;
  courseId!: number;
  videoSizeError: boolean = false;
  razorpaydetails = new RazorpayDetails();
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private loader: LoaderService,
    private courseWizard: CourseWizardService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private el: ElementRef,
    private alertService: SwalAlertService,
    private settingService: SettingServiceService
  ) {}
  ngAfterViewInit(): void {
    this.fetchCategories();
    this.courseSubscription$ = this.courseWizard.courseSubject$.subscribe(
      (data: boolean) => {
        if (data) {
          this.updateCourse();
          return;
        }
        this.fetchMostDisplayOrder();
      }
    );
  }
  ngOnDestroy(): void {
    if (this.courseSubscription$) {
      this.courseSubscription$.unsubscribe();
    }
  }
  fileChangeEvent($event: any): void {
    let file: File = $event.target.files[0];
    if (this.isFileImage(file)) {
      if (file.size > 1048576) {
        this.alertService.errorAlert(
          'Image size should not be greater than 1MB'
        );
        this.imageSelect.nativeElement.value = '';
        this.isCroppedImage = false;
        // this.imageChangedEvent = $event;
        this.croppedImage = null;
        this.courseForm.get('courseImage')?.setValue(null);
        this.imageName = '';
        this.imageFormat = '';
        return;
      }
      this.courseForm.get('courseImage')?.setValue(file.name);
      this.isCroppedImage = true;
      this.imageChangedEvent = $event;
      this.imageName = file.name;
      this.imageFormat = file.type;
    } else {
      this.imageSelect.nativeElement.value = '';

      this.alertService.errorAlert('Please select jpg/jpeg/png format');
    }
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
  ngOnInit(): void {
    this.createAndUpdateForm();
  }

  paymodeSelected($event: any) {
    if (this.paymentModes.includes($event.target.value)) {
      const index: number = this.paymentModes.indexOf($event.target.value);
      if (index !== -1) {
        this.paymentModes.splice(index, 1);
      }
      this.updatePaymentMode();
      return;
    }
    this.paymentModes.push($event.target.value);
    this.updatePaymentMode();
  }

  updatePaymentMode() {
    this.courseForm
      .get('paymentType')
      ?.setValue(
        this.paymentModes.length == 2
          ? 'Both'
          : this.paymentModes.length == 0
          ? ''
          : this.paymentModes[0]
      );
  }

  handlePaymentType() {
    if (this.course.paymentType == 'Both') {
      this.online.nativeElement.checked = 'online';
      this.offline.nativeElement.checked = 'offline';
      this.paymentModes.concat(['online', 'offline']);
    } else if (this.course.paymentType == 'online') {
      this.online.nativeElement.checked = 'online';
      this.paymentModes.push('online');
    } else if (this.course.paymentType == 'offline') {
      this.offline.nativeElement.checked = 'offline';
      this.paymentModes.push('offline');
    }
  }

  updateCourse() {
    this.course = this.courseWizard.getCourse;
    this.instituteId = this.course.idInstitution;
    this.metaTags = this.course.metaTags.map((tag: string) => {
      return { name: tag };
    });
    this.createAndUpdateForm();
    // this.handlePaymentType();
    this.isCroppedImage = true;
  }

  createAndUpdateForm() {
    this.courseForm = this.fb.group({
      id: [this.course.id],
      courseName: [
        this.course.courseName,
        [
          Validators.required,
          this.validateCharctersInput,
          this.validateInputWords,
        ],
      ],
      courseDescription: [
        this.course.courseDescription,
        [
          Validators.required,
          this.validateDescriptionCharctersInput,
          this.validateDescriptionInputWords,
        ],
      ],
      timePeriodCourse: [this.course.timePeriodCourse, Validators.required],
      subjectSyllabus: [this.course.subjectSyllabus, Validators.required],
      courseImage: [this.course.courseImage, Validators.required],
      metaTags: [this.course.metaTags],
      demoVideo: [
        this.course.demoVideo,
        this.course.id ? (this.course.demoVideo ? [] : []) : [],
      ],
      whetherAssignmentTestIncluded: [
        this.course.whetherAssignmentTestIncluded
          ? this.course.whetherAssignmentTestIncluded
          : 'false',
        Validators.required,
      ],
      whetherStudyMaterialIncluded: [
        this.course.whetherStudyMaterialIncluded
          ? this.course.whetherStudyMaterialIncluded
          : 'false',
        Validators.required,
      ],
      displayOrder: [this.course.displayOrder],
      instituteDisplayOrder: [this.course.instituteDisplayOrder],
      isCertificateIncluded: [
        this.course.isCertificateIncluded
          ? this.course.isCertificateIncluded.toString()
          : 'false',
        Validators.required,
      ],
      // paymentType: [this.course.paymentType ? this.course.paymentType:'offline', Validators.required],
      paymentType: [this.course.paymentType, Validators.required],
      demoVideoType: [this.course.demoVideoType],
      youtubeVideoLink: [
        this.course.youtubeVideoLink,
        this.course.id ? (this.course.youtubeVideoLink ? [] : []) : [],
      ],
      isCourseDetailsCompleted: [this.course.isCourseDetailsCompleted],
      categoryIds: [this.course.categoryIds],
      subCategoryIds: [this.course.subCategoryIds],
      subSubCategoryIds: [
        this.course.subSubCategoryIds ? this.course.subSubCategoryIds : [],
      ],
      hasTest: [
        this.course.hasTest ? this.course.hasTest.toString() : 'false',
        Validators.required,
      ],
      createdBy: [this.course.createdBy ? this.course.createdBy : null],
      liveOrRecordedLectures: [this.course.liveOrRecordedLectures, Validators.required],
    });
    this.fetchSubCategories();
    this.fetchSubSubCategories();
    // this.handlePaymentType();
  }

  fetchMostDisplayOrder() {
    this.courseService.fetchMostDisplayOrder().subscribe({
      next: (data: any) => {
        this.courseForm.get('instituteDisplayOrder')?.setValue(data);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  get getControls() {
    return this.courseForm.controls;
  }


  async checkCredentials(event:any){
    if (event.target.value == 'online') {
      const razorpyaDetails$ = this.settingService.fetchInstituteRazorPayDetails(
        AuthService.getInstituteId
      );
      try {
        await lastValueFrom(razorpyaDetails$);
      } catch (error) {
        if (AuthService.getRoleType == 'Teacher') {
              this.alertService.errorAlert(
                'No Razorpay Credentials found. Please contact institute admin !'
              );
              this.courseForm.get('paymentType')?.setValue('offline');
            } else {
              this.alertService.errorAlert(
                'No Razorpay Credentials found. Please Enter RazorPay Credentials !'
              );
              this.courseForm.get('paymentType')?.setValue('offline');
            }
        return
      }
    }
  }
  showWarning(invalidControlNames: any) {
    if (invalidControlNames.includes('courseName')) {
      this.invalidFields.push('Course Name');
    }
    if (invalidControlNames.includes('liveOrRecordedLectures')) {
      this.invalidFields.push('Live/ Recorded/ Both Lectures');
    }
    if (invalidControlNames.includes('courseDescription')) {
      this.invalidFields.push('Description');
    }
    if (invalidControlNames.includes('timePeriodCourse')) {
      this.invalidFields.push('Duration');
    }
    if (invalidControlNames.includes('courseImage')) {
      this.invalidFields.push('Course Image');
    }
    // if (
    //   invalidControlNames.includes('demoVideo') &&
    //   invalidControlNames.includes('youtubeVideoLink')
    // ) {
    //   this.invalidFields.push('Demo Video Or YouTube Video Link');
    // }else if(invalidControlNames.includes('demoVideo')){
    //   this.invalidFields.push('Demo Video');
    // }else if(invalidControlNames.includes('youtubeVideoLink')){
    //   this.invalidFields.push('YouTube Video Link');
    // }
    if (invalidControlNames.includes('whetherAssignmentTestIncluded')) {
      this.invalidFields.push('Assignment');
    }
    if (invalidControlNames.includes('whetherStudyMaterialIncluded')) {
      this.invalidFields.push('Study Material');
    }
    if (invalidControlNames.includes('isCertificateIncluded')) {
      this.invalidFields.push('Certifications');
    }
    if (invalidControlNames.includes('paymentType')) {
      this.invalidFields.push('Payment Mode');
    }
    if (invalidControlNames.includes('hasTest')) {
      this.invalidFields.push('Test');
    }
    if (this.metaTags.length == 0 && invalidControlNames.includes('metaTags')) {
      this.invalidFields.push('Tags');
    }
    if (invalidControlNames.includes('subjectSyllabus')) {
      this.invalidFields.push('Syllabus');
    }
    if (invalidControlNames.includes('subSubCategoryIds')) {
      this.invalidFields.push('Categories');
    }

    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do You Want To proceed to the Pricing Plan ? </p>',
      html:
        'We noticed you submitted the records while missing some key elements. <br> <span style="font-weight: 600"> ' +
        this.invalidFields.toString() +
        '</span> <br> Your Course will be private, but still accessible to create Pricing Plans for it. Click Cancel if there are any changes or Continue to proceed with this process as usual - only now with an unpublished course instead of one published under my account.',
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
  selectInput(demoVideoType: string) {
    if (demoVideoType == 'Normal') {
      this.courseForm.get('youtubeVideoLink')?.setValue(null);
      this.courseForm.get('demoVideo')?.setValue(this.course.demoVideo);
      // this.courseForm.get('demoVideo')?.addValidators(Validators.required);
      this.courseForm.get('youtubeVideoLink')?.clearValidators();
      this.courseForm.get('youtubeVideoLink')?.updateValueAndValidity();
      this.courseForm.get('demoVideo')?.updateValueAndValidity();
    } else {
      if (this.videoSelect?.nativeElement.value != null) {
        this.videoSelect.nativeElement.value = '';
      }

      this.video = undefined;
      this.courseForm.get('demoVideo')?.setValue(null);
      this.courseForm
        .get('youtubeVideoLink')
        ?.setValue(this.course.youtubeVideoLink);
      // this.courseForm
      //   .get('youtubeVideoLink')
      //   ?.addValidators(Validators.required);
      this.courseForm.get('youtubeVideoLink')?.updateValueAndValidity();
      this.courseForm.get('demoVideo')?.clearValidators();
      this.courseForm.get('demoVideo')?.updateValueAndValidity();
    }
  }
  fetchCategories() {
    this.loader.showLoader(this.courseService.fetchCategories()).subscribe({
      next: (data: CategoryVO[]) => {
        this.courseCategories = data;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  async submitBasicInfo() {
    this.invalidControlNames = [];
    this.invalidFields = [];
    this.courseForm
      .get('subSubCategoryIds')
      ?.addValidators(Validators.required);
    this.courseForm.get('subSubCategoryIds')?.updateValueAndValidity();
    if (this.metaTags.length == 0) {
      this.courseForm.get('metaTags')?.addValidators(Validators.required);
      this.courseForm.get('metaTags')?.updateValueAndValidity();
    }
    this.isSubmit = true;
    if (
      this.courseForm.get('courseName')?.invalid ||
      this.courseForm.get('paymentType')?.invalid ||
      this.courseForm.get('liveOrRecordedLectures')?.invalid ||
      this.courseForm.get('courseImage')?.invalid ||
      (this.courseForm.get('courseDescription')?.invalid &&
        this.courseForm.get('courseDescription')?.value)
    ) {
      Object.keys(this.courseForm.controls).find((key) => {
        if (this.courseForm.controls[key].invalid) {
          const invalidControl: HTMLElement =
            this.el.nativeElement.querySelector(
              '[formcontrolname="' + key + '"]'
            );
          invalidControl.focus();
        }
      });
      return;
    }
    if (this.courseForm.get('paymentType')?.value == 'online') {
      const razorpyaDetails$ = this.settingService.fetchInstituteRazorPayDetails(
        AuthService.getInstituteId
      );
      try {
        await lastValueFrom(razorpyaDetails$);
      } catch (error) {
        if (AuthService.getRoleType == 'Teacher') {
              this.alertService.errorAlert(
                'No Razorpay Credentials found. Please contact institute admin !'
              );
            } else {
              this.alertService.errorAlert(
                'No Razorpay Credentials found. Please Enter RazorPay Credentials !'
              );
            }
        return
      }
    }

    const isError = Object.keys(this.courseForm.controls).find((key) => {
      if (this.courseForm.get(key)?.invalid == true) {
        const controls = this.courseForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            this.invalidControlNames.push(name);
          }
        }
        return true;
      }
      return false;
    });

    this.course = this.courseForm.value;
    if (isError) {
      if (
        (await this.showWarning(this.invalidControlNames).catch(
          (obj: boolean) => {
            return obj;
          }
        )) == false
      ) {
        return;
      } else {
        this.course.isCourseDetailsCompleted = false;
      }
    } else {
      this.course.isCourseDetailsCompleted = true;
    }
    this.course.idInstitution = this.instituteId
      ? this.instituteId
      : +AuthService.getInstituteId;
    if (this.imageName) this.convertBase64ToFile();
    if (this.categoryRequestId && !this.courseId) {
      this.course.categoryRequestId = this.categoryRequestId;
    }
    this.loader
      .showLoader(
        this.courseService.createCourse(this.course, this.image, this.video)
      )
      .subscribe({
        next: (data: Course) => {
          data.categoryIds = this.course.categoryIds;
          data.subCategoryIds = this.course.subCategoryIds;
          data.subSubCategoryIds = this.course.subSubCategoryIds;

          this.courseWizard.setCourse(data);
          this.courseWizard.courseSubject$.next(true);
          if (this.course.id == undefined) {
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: { id: data.id },
            });
          }
          this.courseWizard.next(2);
          this.courseWizard.enableEditMode(true);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  isFileVedio(file: File) {
    const acceptedVideoTypes = ['video/mp4', 'video/ogg'];
    return file && acceptedVideoTypes.includes(file['type']);
  }

  onVideoSelect($event: any) {
    let file = $event.target.files[0];
    if (this.isFileVedio(file)) {
      if (file.size > 20971520) {
        this.alertService.errorAlert(
          'Demo video file size should not be greater than 20MB'
        );
        this.videoSelect.nativeElement.value = '';
        this.video = undefined;
        this.courseForm.get('demoVideo')?.setValue(null);
        return;
      } else {
        this.video = file;
        this.courseForm.get('demoVideo')?.setValue(this.video?.name);
      }
    } else {
      this.videoSelect.nativeElement.value = '';
      this.alertService.errorAlert('Please select mp4 format');
      return;
    }
  }

  isFileImage(file: File) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  add(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.metaTags.push({ name: value });
      this.courseForm.get('metaTags')?.value.push(value);
    }
    event.chipInput!.clear();
  }

  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 42) {
      return { validateCharctersInput: true };
    }
    return null;
  }
  validateInputWithoutSpace(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && (control.value || ' ').trim().length > 28) {
      return { validateInputWithoutSpace: true };
    }
    return null;
  }

  validateInputWords(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.split(' ').length > 5) {
      return { validateInputWords: true };
    }
    return null;
  }

  validateDescriptionCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 365) {
      return { validateDescriptionCharctersInput: true };
    }
    return null;
  }
  validateDescriptionInputWithoutSpace(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && (control.value || ' ').trim().length > 28) {
      return { validateDescriptionInputWithoutSpace: true };
    }
    return null;
  }

  validateDescriptionInputWords(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.split(' ').length > 65) {
      return { validateDescriptionInputWords: true };
    }
    return null;
  }
  remove(tag: any): void {
    const index = this.metaTags.indexOf(tag);
    if (index >= 0) {
      this.metaTags.splice(index, 1);
      this.courseForm.get('metaTags')?.value.splice(index, 1);
    }
  }

  fetchSubCategories() {
    if (this.courseForm.get('categoryIds')?.value) {
      this.loader
        .showLoader(
          this.courseService.fetchSubCategories(
            this.courseForm.get('categoryIds')?.value
          )
        )
        .subscribe({
          next: (data: CourseCategoryMappingVO[]) => {
            this.subCategories = data;
          },
          error: (error: HttpErrorResponse) => {},
        });
    }
  }

  fetchSubSubCategories() {
    if (this.courseForm.get('subCategoryIds')?.value) {
      this.loader
        .showLoader(
          this.courseService.fetchSubSubCategories(
            this.courseForm.get('subCategoryIds')?.value
          )
        )
        .subscribe({
          next: (data: CourseCategoryMappingVO[]) => {
            this.subSubCategories = data;
          },
          error: (error: HttpErrorResponse) => {},
        });
    }
  }

  onSelectionChange(event: any) {
    if (event == false) {
      this.courseForm.get('categoryIds')?.value.length;
      this.fetchSubCategories();
      this.searchCategories.nativeElement.value = '';
    }
  }

  omit_special_char(event:any)
{   
   var k;  
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}

  onSubCategorySelectionChange(event: any) {
    if (event == false) {
      this.fetchSubSubCategories();
      this.searchSubCategories.nativeElement.value = '';
    }
  }

  onSubSubCategorySelectionChange(event: any) {
    if (event == false) {
      this.searchSubSubCategories.nativeElement.value = '';
    }
  }

  convertBase64ToFile() {
    const arr = this.croppedImage.split(',');
    // const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.image = new File([u8arr], this.imageName, { type: this.imageFormat });
  }

  openAddCategoryDialog() {
    let dialogRef = this.dialog.open(RequestForOtherCategoryComponent, {
      width: '700px',
      maxHeight: '800px',
      disableClose: true,
      data: {
        courseId: this.course.id,
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe(
      (res: { categoryRequestId: number; courseId: number }) => {
        if (res) {
          this.categoryRequestId = res.categoryRequestId;
          this.courseId = res.courseId;
          dialogRef.close();
        }
      }
    );
  }

    selectLectureType(liveOrRecordedLectures: string){
      if(liveOrRecordedLectures == 'liveLectures'){
        this.courseForm.get('liveOrRecordedLectures')?.setValue('liveLectures');
      }
      else if(liveOrRecordedLectures == 'recordedLectures'){
        this.courseForm.get('liveOrRecordedLectures')?.setValue('recordedLectures');
      }
      else{
        this.courseForm.get('liveOrRecordedLectures')?.setValue('both');
      } 
    }
  
}

export interface CourseCategoryMappingVO {
  name: string;
  categories: CategoryVO[];
}

export interface CategoryVO {
  name: string;
  id: string;
}
