import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { LoaderService } from 'src/app/loader.service';
import { MappingType } from 'src/app/model/MappingType';
import {
  BlueJeansMetaData,
  ScheduleClass,
} from 'src/app/model/schedule-class-list.model';
import { TeacherList } from 'src/app/model/teacher-info';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import Swal from 'sweetalert2';
import { ClassMappingPageComponent } from '../class-mapping-page/class-mapping-page.component';

@Component({
  selector: 'app-create-edit-class-configuration',
  standalone: true,
  imports: [],
  templateUrl: './create-edit-class-configuration.component.html',
  styleUrl: './create-edit-class-configuration.component.scss'
})
export class CreateEditClassConfigurationComponent implements OnInit {
  selected!: Date | null;
  time = { hour: 13, minute: 30 };
  selectedDate = new Date();
  form!: FormGroup;
  isTeacher: boolean = true;
  scheduleClass: ScheduleClass = new ScheduleClass();
  isSubmit: boolean = false;
  teacherList: any;
  blueJeansDetails!: BlueJeansMetaData;
  startTime = '00:01 pm';
  endTime = '00:01 pm';
  days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  date: Date = new Date();
  iswebinarShow: boolean = false;
  uploadSuccess = new EventEmitter<boolean>();
  classSchduleDays: number[] = [];
  new!: { value: string }[];
  timeCompareMsg!: string;
  now: any;
  constructor(
    private fb: FormBuilder,
    private instituteService: InstituteService,
    private teacherService: TeacherService,
    private el: ElementRef,
    private loader: LoaderService,
    private dialog: MatDialog,
    private alertService: SwalAlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      scheduleDTO: ScheduleClass;
      isEdit: boolean;
      from: boolean;
      isZoom: boolean;
    }
  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.data.isEdit) {
      if (this.data.scheduleDTO.metaTags != null) {
        this.new = this.data.scheduleDTO.metaTags.map(function (e) {
          return { display: e, value: e };
        });
      }
      this.form = this.fb.group({
        idClassSchedule: [this.data.scheduleDTO.idClassSchedule],
        classConfigId: [this.data.scheduleDTO.classConfigId],
        startDate: [this.data.scheduleDTO.startDate],
        endDate: [this.data.scheduleDTO.endDate],
        idTeacher: [this.data.scheduleDTO.idTeacher],
        createdBy: [this.data.scheduleDTO.createdBy],
        updatedBy: [this.data.scheduleDTO.updatedBy],
        classTitle: [
          this.data.scheduleDTO.classTitle,
          [
            Validators.required,
            this.validateCharctersInput,
            this.validateInputWords,
          ],
        ],
        classDescription: [
          this.data.scheduleDTO.classDescription,
          [
            Validators.required,
            this.validateDetailsCharctersInput,
            this.validateDetailsInputWords,
          ],
        ],
        classSubject: [this.data.scheduleDTO.classSubject],
        videoToBeUploadedOrNot: [this.data.scheduleDTO.videoToBeUploadedOrNot],
        videoToBeRedirectType: [
          this.data.scheduleDTO.videoToBeRedirectToBlueJeans
        ],
        start: [
          moment(this.data.scheduleDTO.startDate).utc().format('YYYY-MM-DD'),
          Validators.required,
        ],
        starttime: [
          moment(this.data.scheduleDTO.startDate).format('HH:mm'),
          Validators.required,
        ],
        endtime: [
          moment(this.data.scheduleDTO.endDate).format('HH:mm'),
          Validators.required,
        ],
        idCourse: [],
        idSubject: [],
        topicArray: [],
        classType: [this.data.scheduleDTO.classType, Validators.required],
        repeatMeeting: [false, Validators.required],
        meetingStartDate: ['', Validators.required],
        meetingEndDate: ['', Validators.required],
        endMeetingRadioInput: [false, Validators.required],
        noOfOccurence: ['', Validators.required],
        blueJeansMeetingId: [''],
        participantPasscode: [''],
        moderatorPasscode: [''],
        metaTags: ['', Validators.required],
      });
    } else {
      this.form = this.fb.group({
        startDate: [],
        endDate: [],
        idTeacher: [''],
        createdBy: [''],
        updatedBy: [''],
        classTitle: [
          '',
          [
            Validators.required,
            this.validateCharctersInput,
            this.validateInputWords,
          ],
        ],
        classDescription: [
          '',
          [
            Validators.required,
            this.validateDetailsCharctersInput,
            this.validateDetailsInputWords,
          ],
        ],
        classSubject: [''],
        videoToBeUploadedOrNot: [''],
        videoToBeRedirectType: [''],
        start: ['', Validators.required],
        starttime: ['', Validators.required],
        endtime: ['', Validators.required],
        idCourse: [],
        idSubject: [],
        topicArray: [],
        classType: ['', Validators.required],
        repeatMeeting: [false, Validators.required],
        meetingStartDate: ['', Validators.required],
        meetingEndDate: ['', Validators.required],
        endMeetingRadioInput: [false, Validators.required],
        noOfOccurence: ['', Validators.required],
        blueJeansMeetingId: [''],
        participantPasscode: [''],
        moderatorPasscode: [''],
        metaTags: ['', Validators.required],
      });
    }

    if (this.data.isEdit) {
      this.scheduleClass = this.data.scheduleDTO;
      this.classSchduleDays = this.data.scheduleDTO.days;
    }

    this.fetchTeacherList();
  }

  get f() {
    return this.form.controls;
  }

  fetchTeacherList() {
    if (
      JSON.parse(localStorage.getItem('auth') as string).role.authority !=
      'Teacher'
    ) {
      this.isTeacher = false;
      this.teacherService
        .fetchTeacherList(
          '',
          JSON.parse(localStorage.getItem('auth') as string).selectedInstitute
        )
        .subscribe((res: any) => {
          this.teacherList = res.users as unknown as TeacherList;
        });
    }
    //  else {
    //   this.scheduleClass.idTeacher = JSON.parse(
    //     localStorage.getItem('auth') as string
    //   ).user_id;
    //   this.form
    //     .get('idTeacher')!
    //     .setValue(JSON.parse(localStorage.getItem('auth') as string).user_id);
    // }
    this.startTime = moment(this.data.scheduleDTO.startDate).format('H:mm');
    this.endTime = moment(this.data.scheduleDTO.endDate).format('H:mm');
  }
  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 28) {
      return { validateCharctersInput: true };
    }
    return null;
  }

  validateInputWords(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.split(' ').length > 5) {
      return { validateInputWords: true };
    }
    return null;
  }

  validateDetailsCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 151) {
      return { validateDetailsCharctersInput: true };
    }
    return null;
  }

  validateDetailsInputWords(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.split(' ').length > 25) {
      return { validateDetailsInputWords: true };
    }
    return null;
  }
  async onSubmit() {
    this.timeCompareMsg = '';
    this.isSubmit = true;
    if (!this.form.controls['repeatMeeting'].value) {
      this.form.get('meetingStartDate')!.clearValidators();
      this.form.get('meetingEndDate')!.clearValidators();
      this.form.get('endMeetingRadioInput')!.clearValidators();
      this.form.get('noOfOccurence')!.clearValidators();
      this.form.get('meetingStartDate')!.updateValueAndValidity();
      this.form.get('meetingEndDate')!.updateValueAndValidity();
      this.form.get('endMeetingRadioInput')!.updateValueAndValidity();
      this.form.get('noOfOccurence')!.updateValueAndValidity();
    } else {
      this.form.get('meetingStartDate')!.setValidators(Validators.required);
      this.form
        .get('meetingStartDate')
        ?.setValue(this.form.get('start')?.value);
      if (this.form.get('endMeetingRadioInput')!.value) {
        this.form.get('noOfOccurence')!.setValidators(Validators.required);
        this.form.get('noOfOccurence')!.updateValueAndValidity();
        this.form.get('meetingEndDate')!.clearValidators();
        this.form.get('meetingEndDate')!.updateValueAndValidity();
      } else {
        this.form.get('meetingEndDate')!.setValidators(Validators.required);
        this.form.get('meetingEndDate')!.updateValueAndValidity();
        this.form.get('noOfOccurence')!.clearValidators();
        this.form.get('noOfOccurence')!.updateValueAndValidity();
      }
      this.form.get('endMeetingRadioInput')!.setValidators(Validators.required);
      this.form.get('meetingStartDate')!.updateValueAndValidity();
      this.form.get('endMeetingRadioInput')!.updateValueAndValidity();
    }

    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl: HTMLElement =
            this.el.nativeElement.querySelector(
              '[formcontrolname="' + key + '"]'
            );
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    if (
      this.classSchduleDays.length == 0 &&
      this.form.get('repeatMeeting')!.value
    ) {
      this.alertService.errorAlert('Please Select Days');
      return;
    }

    this.scheduleClass.startDate = moment(
      this.form.get('start')?.value + ' ' + this.form.get('starttime')?.value
    ).format('YYYY-MM-DD HH:mm:ss');
    this.scheduleClass.endDate = moment(
      this.form.get('start')?.value + ' ' + this.form.get('endtime')?.value
    ).format('YYYY-MM-DD HH:mm:ss');
    this.scheduleClass.startDateStr = this.scheduleClass.startDate;
    this.scheduleClass.endDateStr = this.scheduleClass.endDate;

    if (
      new Date(this.scheduleClass.startDateStr) >=
      new Date(this.scheduleClass.endDateStr)
    ) {
      this.timeCompareMsg = 'Start Time must be less than End time';
      return;
    }
    if (
      new Date(this.form.get('start')!.value).getDate() !=
        new Date(this.form.get('meetingStartDate')!.value).getDate() &&
      this.form.controls['repeatMeeting'].value
    ) {
      this.alertService.errorAlert('Date and meeting start date must be same');
      return;
    }
    if (!this.data.isZoom) {
      if (
        !(await this.zoomNotInPlanWarning().catch((obj: boolean) => {
          return obj;
        }))
      ) {
        return;
      }
    }
    this.loader
      .showLoader(
        this.instituteService.saveClassConfiguration({
          classTitle: this.form.get('classTitle')?.value,
          classSubject: this.form.get('classSubject')?.value,
          selectedDate: this.scheduleClass.selectedDate,
          classDescription: this.form.get('classDescription')?.value,
          startDateStr: this.scheduleClass.startDateStr,
          endDateStr: this.scheduleClass.endDateStr,
          classType: this.form.get('classType')?.value,
          createdBy: JSON.parse(localStorage.getItem('auth') as string).user_id,
          idTeacher: this.form.get('idTeacher')?.value,
          updatedBy: this.form.get('updatedBy')?.value,
          isNew: this.scheduleClass.isNew,
          videoToBeUploadedOrNot: this.form.get('videoToBeUploadedOrNot')
            ?.value,
          videoToBeRedirectToBlueJeans: true,
          idInstitution: JSON.parse(localStorage.getItem('auth') as string)
            .selectedInstitute,
          meetingStartDate: new Date(
            moment(
              this.form.get('start')?.value +
                ' ' +
                this.form.get('starttime')?.value
            ).format('YYYY-MM-DD HH:mm:ss')
          ),
          meetingEndDate: new Date(
            moment(
              this.form.get('meetingEndDate')?.value +
                ' ' +
                this.form.get('endtime')?.value
            ).format('YYYY-MM-DD HH:mm:ss')
          ),
          days: this.classSchduleDays,
          repeatMeeting: this.form.controls['repeatMeeting'].value,
          blueJeansMetaData: this.blueJeansDetails,
          active: true,
          startDate: '',
          endDate: '',
          idClassSchedule: null,
          classConfigId: null,
          teacherName: '',
          metaTags: this.new.map(function (a) {
            return a['value'];
          }),
        })
      )
      .subscribe(
        (res: any) => {
          this.alertService
            .buttonSuccessAlert('Class Created Successfully!', 'Map To Batch')
            .then((result) => {
              if (result.isConfirmed) {
                this.dialog.open(ClassMappingPageComponent, {
                  data: {
                    id: res,
                    mappingType: MappingType.CLASS_CONFIGURATION,
                  },
                  width: '100%',
                  height: '99%',
                });
                this.uploadSuccess.emit(true);
              } else {
                this.uploadSuccess.emit(true);
              }
            });
        },
        (err: HttpErrorResponse) => {
          this.uploadSuccess.emit(false);
          this.alertService.errorAlert(err?.error?.message);
        }
      );
  }

  zoomNotInPlanWarning() {
    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        "Seems like you don't have Zoom SDK addon. Make sure the current schedule classes would not be integrated with zoom in future. Do you want to continue ? </p>",
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

  onEdit() {
    this.timeCompareMsg = '';
    this.isSubmit = true;
    if (!this.form.controls['repeatMeeting'].value) {
      this.form.get('meetingStartDate')!.clearValidators();
      this.form.get('meetingEndDate')!.clearValidators();
      this.form.get('endMeetingRadioInput')!.clearValidators();
      this.form.get('noOfOccurence')!.clearValidators();
      this.form.get('meetingStartDate')!.updateValueAndValidity();
      this.form.get('meetingEndDate')!.updateValueAndValidity();
      this.form.get('endMeetingRadioInput')!.updateValueAndValidity();
      this.form.get('noOfOccurence')!.updateValueAndValidity();
    }
    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl: HTMLElement =
            this.el.nativeElement.querySelector(
              '[formcontrolname="' + key + '"]'
            );
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    this.scheduleClass.startDate = moment(
      this.form.get('start')?.value + ' ' + this.form.get('starttime')?.value
    ).format('YYYY-MM-DD HH:mm:ss');
    this.scheduleClass.endDate = moment(
      this.form.get('start')?.value + ' ' + this.form.get('endtime')?.value
    ).format('YYYY-MM-DD HH:mm:ss');
    this.scheduleClass.startDateStr = this.scheduleClass.startDate;
    this.scheduleClass.endDateStr = this.scheduleClass.endDate;

    if (
      new Date(this.scheduleClass.startDateStr) >=
      new Date(this.scheduleClass.endDateStr)
    ) {
      this.timeCompareMsg = 'Start Time must be less than End time';
      return;
    }
    if (
      new Date(this.form.get('start')!.value).getDate() !=
        new Date(this.form.get('meetingStartDate')!.value).getDate() &&
      this.form.controls['repeatMeeting'].value
    ) {
      this.alertService.errorAlert('Date and meeting start date must be same');
      return;
    }

    this.loader
      .showLoader(
        this.instituteService.saveClassConfiguration({
          idClassSchedule: this.form.get('idClassSchedule')?.value,
          classConfigId: this.scheduleClass.classConfigId,
          classTitle: this.form.get('classTitle')?.value,
          classSubject: this.form.get('classSubject')?.value,
          selectedDate: this.scheduleClass.selectedDate,
          classDescription: this.form.get('classDescription')?.value,
          startDateStr: this.scheduleClass.startDateStr,
          endDateStr: this.scheduleClass.endDateStr,
          classType: this.form.get('classType')?.value,
          idTeacher: this.form.get('idTeacher')?.value,
          createdBy: this.form.get('createdBy')?.value,
          updatedBy: JSON.parse(localStorage.getItem('auth') as string).user_id,
          isNew: this.scheduleClass.isNew,
          videoToBeUploadedOrNot: this.form.get('videoToBeUploadedOrNot')
            ?.value,
          videoToBeRedirectToBlueJeans: true,
          idInstitution: JSON.parse(localStorage.getItem('auth') as string)
            .selectedInstitute,
          meetingStartDate: new Date(
            moment(
              this.form.get('start')?.value +
                ' ' +
                this.form.get('starttime')?.value
            ).format('YYYY-MM-DD HH:mm:ss')
          ),
          meetingEndDate: new Date(
            moment(
              this.form.get('meetingEndDate')?.value +
                ' ' +
                this.form.get('endtime')?.value
            ).format('YYYY-MM-DD HH:mm:ss')
          ),
          days: this.classSchduleDays,
          repeatMeeting: this.form.controls['repeatMeeting'].value,
          blueJeansMetaData: this.blueJeansDetails,
          active: true,
          startDate: '',
          endDate: '',
          teacherName: '',
          metaTags: this.new.map(function (a) {
            return a['value'];
          }),
        })
      )
      .subscribe(
        (res: any) => {
          this.alertService.successAlert('Class Edited successfully !');
          this.uploadSuccess.emit(true);
        },
        (err: HttpErrorResponse) => {
          this.alertService.errorAlert(err?.error?.message);
          this.uploadSuccess.emit(false);
        }
      );
  }
  addDaysInList(day: any) {
    if (this.classSchduleDays.includes(day)) {
      this.classSchduleDays.forEach((value, index) => {
        if (value == day) this.classSchduleDays.splice(index, 1);
      });
      return;
    }
    this.classSchduleDays.push(day);
  }

  calculateDate(occ: any) {
    if (occ === '') {
      this.form.controls['meetingEndDate'].setValue(undefined);
    }
    let date = new Date();
    date = new Date(date.setDate(date.getDate() + occ * 7));
    this.form.controls['meetingEndDate'].setValue(
      moment(date).format('YYYY-MM-DD')
    );
  }

  isWebinarEnableOrdesabled(isDemoClass: string) {
    if (isDemoClass == 'true') {
      this.iswebinarShow = false;
      this.form.get('isWebinar')!.clearValidators();
      this.form.get('isWebinar')!.updateValueAndValidity();
    } else {
      this.iswebinarShow = true;
      this.form.get('isWebinar')!.updateValueAndValidity();

      this.form.get('isWebinar')!.setValidators(Validators.required);
    }
  }
  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
