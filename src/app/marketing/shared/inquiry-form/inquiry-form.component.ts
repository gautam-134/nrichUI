import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { MobileCourseVO } from '../../../model/MobileCourseVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { InquiryForm } from '../../../model/InquiryFormVO';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-inquiry-form',
  templateUrl: './inquiry-form.component.html',
  styleUrls: ['./inquiry-form.component.scss'],
})
export class InquiryFormComponent implements OnInit, OnChanges {
  @Input('type') type!: string;
  @Input('courses') courses: MobileCourseVO[] = [];
  form!: UntypedFormGroup;
  isSubmit: boolean = false;
  inqueryForm: InquiryForm = new InquiryForm();
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      message: ['', Validators.required],
      id: [
        this.type == 'course'
          ? this.activatedRoute.snapshot.queryParams['id']
          : '',
        Validators.required,
      ],
    });
  }
  ngOnInit(): void {
  }
  get controls() {
    return this.form.controls;
  }
  submit() {
    if (this.form.invalid) {
      this.isSubmit = true;
      return;
    }
    if(this.type=='course'){
      this.inqueryForm.queryFrom='Course Page';
    }else if(this.type=='institute') this.inqueryForm.queryFrom='Institute Page';
    else this.inqueryForm.queryFrom='Teacher Page';
    this.inqueryForm.name = this.form.controls['name'].value;
    this.inqueryForm.mobileNumber = this.form.controls['mobileNumber'].value;
    this.inqueryForm.message=this.form.controls['message'].value;
    this.inqueryForm.id=this.form.controls['id'].value;
   
    this.loader
      .showLoader(this.courseService.contactUs(this.inqueryForm))
      .subscribe(
        (res) => {
          this.form.reset();
          this.isSubmit = false;
          this.alertService.successAlert('Inquiry sent to Institute!');
        },
        (err) => {
          this.alertService.errorAlert('Error while submitting inquiry!');
        }
      );
  }
  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
