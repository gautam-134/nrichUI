import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { ContactCourses } from '../../../model/ContactCourses';
import { InquiryForm } from '../../../model/InquiryFormVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-subscription-contact-us',
   
  templateUrl: './subscription-contact-us.component.html',
  styleUrl: './subscription-contact-us.component.scss'
})
export class SubscriptionContactUsComponent implements OnInit {
  form!: FormGroup;
  courses: ContactCourses[] = [];
  inqueryForm: InquiryForm = new InquiryForm();
  subject = new Subject<string>();
  courseName: string = '';
  submitted: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      id: ['', Validators.required],
    });

    this.subject.pipe(debounceTime(1000)).subscribe((data: string) => {
      if (this.courseName.length >= 3)
        this.loader
          .showLoader(this.courseService.searchCourse(this.courseName))
          .subscribe((response: any) => {
            this.courses = response;
            this.updateCourseId();
          });
      else this.courses = [];
    });
  }

  updateCourseId() {
    this.courses.forEach((course) => {
      if (course.courseName === this.form.get('id')?.value) {
        this.inqueryForm.id = course.id;
        return;
      }
    });
  }

  getCourses(name: any) {
    this.subject.next(name.data);
  }

  get controls() {
    return this.form.controls;
  }

  scrolltop(id: any) {
    let el = document.getElementById(id);
    el?.scrollIntoView();
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid || this.inqueryForm.id == undefined) {
      return;
    }
    this.inqueryForm.name = this.form.controls['name'].value;
    this.inqueryForm.mobileNumber = this.form.controls['mobileNumber'].value;
    this.loader
      .showLoader(this.courseService.contactUs(this.inqueryForm))
      .subscribe(
        (res) => {
          this.form.reset();
          this.submitted = false;
          this.alertService.successAlert('Inquiry sent to Nrich Learning!');
        },
        (err) => {
          this.alertService.errorAlert('Error while submitting inquiry!');
        }
      );
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
}