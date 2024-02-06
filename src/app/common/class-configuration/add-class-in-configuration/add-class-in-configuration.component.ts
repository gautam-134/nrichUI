import { Component } from '@angular/core';

@Component({
  selector: 'app-add-class-in-configuration',
  standalone: true,
  imports: [],
  templateUrl: './add-class-in-configuration.component.html',
  styleUrl: './add-class-in-configuration.component.scss'
})
export class AddClassInConfigurationComponent implements OnInit {

  now: any;
  new!: { value: string }[];
  form!: FormGroup;
  timeCompareMsg!: string;
  isSubmit: boolean = false;
  uploadSuccess = new EventEmitter<boolean>();
  scheduleClassVO = new ScheduleClassVO();
  isFieldsDisabled: boolean = false;
  constructor(private alertService: SwalAlertService, private fb: FormBuilder,
    private instituteService: InstituteService, private el: ElementRef,
    private loader: LoaderService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      classConfigId: number;
    }) { }

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.form = this.fb.group({
      startDate: [],
      endDate: [],
      classConfigId:[],
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
      start: ['', Validators.required],
      starttime: ['', Validators.required],
      endtime: ['', Validators.required],
      classType: ['', Validators.required],
      metaTags: ['', Validators.required],
    });
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
    this.timeCompareMsg ='';
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
    this.scheduleClassVO.classConfigId = this.data.classConfigId;
    this.scheduleClassVO.idInstitution=AuthService.getInstituteId;
    this.scheduleClassVO.classTitle = this.form.get('classTitle')?.value;
    this.scheduleClassVO.metaTags = this.new.map(function (a) {
      return a['value'];
    });

    this.scheduleClassVO.classDescription = this.form.get('classDescription')?.value;
    this.scheduleClassVO.classType = this.form.get('classType')?.value;
    this.scheduleClassVO.startDate = moment(
      this.form.get('start')?.value + ' ' + this.form.get('starttime')?.value
    ).format('YYYY-MM-DD HH:mm:ss');
    this.scheduleClassVO.endDate = moment(
      this.form.get('start')?.value + ' ' + this.form.get('endtime')?.value
    ).format('YYYY-MM-DD HH:mm:ss');
    this.scheduleClassVO.startDateStr = this.scheduleClassVO.startDate;
    this.scheduleClassVO.endDateStr = this.scheduleClassVO.endDate;
    this.scheduleClassVO.startDate ="";
    this.scheduleClassVO.endDate="";
    if (
      new Date(this.scheduleClassVO.startDateStr) >=
      new Date(this.scheduleClassVO.endDateStr)
    ) {
      this.timeCompareMsg = 'Start Time must be less than End time';
      return;
    }
    this.loader
      .showLoader(
        this.instituteService.addClassInConfiguration(this.scheduleClassVO)
      )
      .subscribe(
        (res: any) => {
          this.alertService.successAlert('Class added in this schedule successfully !');
          this.uploadSuccess.emit(true);
        },
        (err: HttpErrorResponse) => {
          this.alertService.errorAlert(err?.error?.message);
          this.uploadSuccess.emit(false);
        }
      );
  }
}
