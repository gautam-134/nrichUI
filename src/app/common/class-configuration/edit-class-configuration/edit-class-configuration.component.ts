import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../loader.service';
import { ClassConfigurationVO, ScheduleClass } from '../../../model/schedule-class-list.model';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { InstituteService } from '../../../services/institute/institute.service';

@Component({
  selector: 'app-edit-class-configuration',
   
  templateUrl: './edit-class-configuration.component.html',
  styleUrl: './edit-class-configuration.component.scss'
})
export class EditClassConfigurationComponent implements OnInit {
  now: any;
  new!: { value: string }[];
  form!: FormGroup;
  timeCompareMsg!: string;
  isSubmit: boolean = false;
  uploadSuccess = new EventEmitter<boolean>();
  classConfigurationVO = new ClassConfigurationVO();
  isFieldsDisabled: boolean = false;
  constructor(private alertService: SwalAlertService, private fb: FormBuilder,
    private instituteService: InstituteService, private el: ElementRef,
    private loader: LoaderService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      scheduleDTO: ScheduleClass;
      isEdit: boolean;
      from: boolean;
      isZoom: boolean;
    }) { }

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.data.isEdit) {
      if (this.data.scheduleDTO.metaTags != null) {
        this.new = this.data.scheduleDTO.metaTags.map(function (e) {
          return { display: e, value: e };
        });
      }

      console.log(this.data.scheduleDTO)
      this.form = this.fb.group({
        idClassSchedule: [this.data.scheduleDTO.idClassSchedule],
        classConfigId: [this.data.scheduleDTO.id],
        classTitle: [
          this.data.scheduleDTO.classTitle,
          [
            Validators.required,
            this.validateCharctersInput,
            this.validateInputWords,
          ],
        ],
        metaTags: ['', Validators.required],
      });
    }
    // else {
    //   this.form = this.fb.group({
    //     startDate: [],
    //     endDate: [],
    //     idTeacher: [''],
    //     createdBy: [''],
    //     updatedBy: [''],
    //     classTitle: [
    //       '',
    //       [
    //         Validators.required,
    //         this.validateCharctersInput,
    //         this.validateInputWords,
    //       ],
    //     ],
    //     classDescription: [
    //       '',
    //       [
    //         Validators.required,
    //         this.validateDetailsCharctersInput,
    //         this.validateDetailsInputWords,
    //       ],
    //     ],
    //     classSubject: [''],
    //     videoToBeUploadedOrNot: [''],
    //     videoToBeRedirectType: [''],
    //     start: ['', Validators.required],
    //     starttime: ['', Validators.required],
    //     endtime: ['', Validators.required],
    //     idCourse: [],
    //     idSubject: [],
    //     topicArray: [],
    //     classType: ['', Validators.required],
    //     repeatMeeting: [false, Validators.required],
    //     meetingStartDate: ['', Validators.required],
    //     meetingEndDate: ['', Validators.required],
    //     endMeetingRadioInput: [false, Validators.required],
    //     noOfOccurence: ['', Validators.required],
    //     blueJeansMeetingId: [''],
    //     participantPasscode: [''],
    //     moderatorPasscode: [''],
    //     metaTags: ['', Validators.required],
    //   });
    // }

  }


  get f() {
    return this.form.controls;
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


  onEdit() {
    this.isSubmit = true;
    console.log(this.form)
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
    this.classConfigurationVO.classConfigId = this.form.get('classConfigId')?.value;
    this.classConfigurationVO.classTitle = this.form.get('classTitle')?.value;
    this.classConfigurationVO.idInstitution = this.data.scheduleDTO.idInstitution;
    this.classConfigurationVO.metaTags = this.new.map(function (a) {
      return a['value'];
    }),
      this.loader
        .showLoader(
          this.instituteService.editClassConfiguration(this.classConfigurationVO)
        )
        .subscribe(
          (res: any) => {
            this.alertService.successAlert('Class configuration updated successfully !');
            this.uploadSuccess.emit(true);
          },
          (err: HttpErrorResponse) => {
            this.alertService.errorAlert(err?.error?.message);
            this.uploadSuccess.emit(false);
          }
        );
  }
}

