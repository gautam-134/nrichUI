import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { LoaderService } from '../../loader.service';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { InquiryForm } from '../../model/InquiryFormVO';
import { CourseService } from '../../services/course/course.service';
const DEFAULT_DURATION = 500;
@Component({
  selector: 'app-contact-nrich',
   
  templateUrl: './contact-nrich.component.html',
  styleUrl: './contact-nrich.component.scss',
  animations: [
    trigger('collapse', [
      state('false', style({ height: '0' })),
      state('true', style({ height: AUTO_STYLE })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
    ]),
  ],
})
export class ContactNrichComponent implements OnInit {
  enquiry!: FormGroup;
  panelOpenState = false;
  isSubmit: boolean = false;
  selectedValue: string = 'ContactUs';
  inqueryForm: InquiryForm = new InquiryForm();
  metatags: string[] = [
    'wise online teaching app',
    'teachers academy app',
    'teach english online from home',
    'best application to learn english',
    'online learning application',
    'online school',
    'online learning platforms',
    'teach for india',
    'how much does online teachers earn?',
    'teach online and earn money in india quora?',
    'how to make online teaching effective?',
  ];
  metadescription: string[] = [
    'NRICH is an online community of students and tutors who grow',
    'learn & earn together',
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    private titleService: Title,
    private meta: Meta,
    private alertService: SwalAlertService,
    private loaderService: LoaderService
  ) {}
  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }
  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }

  ngOnInit(): void {
    this.initForm();
    this.titleService.setTitle(
      'Connecting Online Teaching with Digital Age Technology'
    );
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription.toString(),
    });
  }
  initForm() {
    this.enquiry = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      mobileNumber: ['', [Validators.required]],
      message: ['', Validators.required],
    });
  }
  get controls() {
    return this.enquiry.controls;
  }

  scrolltop(id: any) {
    let el = document.getElementById(id);
    el?.scrollIntoView();
  }

  submit() {
    if (this.enquiry.invalid) {
      this.isSubmit = true;
      return;
    }
    this.inqueryForm.queryFrom='Nrich Contact Us';
    this.inqueryForm.name = this.enquiry.controls['name'].value;
    this.inqueryForm.mobileNumber = this.enquiry.controls['mobileNumber'].value;
    this.inqueryForm.message=this.enquiry.controls['message'].value;
    this.inqueryForm.email=this.enquiry.controls['email'].value;
   
    this.loaderService
      .showLoader(this.courseService.contactUs(this.inqueryForm))
      .subscribe(
        (res) => {
          this.enquiry.get('id')?.setValue('');
          this.enquiry.get('name')?.setValue('');
          this.enquiry.get('mobileNumber')?.setValue('');
          this.enquiry.get('email')?.setValue('');
          this.enquiry.get('message')?.setValue('');
          this.enquiry.reset();
          this.isSubmit = false;
          this.alertService.successAlert('Inquiry sent to Nrich Learning!');
        },
        (err) => {
          this.alertService.errorAlert('Error while submitting inquiry!');
        }
      );
  }
  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description");
    this.titleService.setTitle('Nrich Learning');
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

  faq: any[] = [
    {
      qus: 'I have Sign-up related issues.',
      ans: 'Yes, You can enroll for more than one course as long as you want to learn and explore.',
      expand: false,
    },
    {
      qus: 'I have Payment related issues?',
      ans: 'We have the most efficient teachers, who have a unique methodology of teaching which helps you learn without confusion or any doubts and understand the topics precisely.',
      expand: false,
    },
    {
      qus: 'How can i get a demo of your product?',
      ans: 'Yes, You could request the teacher for the recorded session of the same.',
      expand: false,
    },
    {
      qus: 'I have trouble accessing my portal',
      ans: 'We have the state of the art feature in our application, where the teachers assist the students concerning their doubts in group or one to one sessions. Be it anytime, the teachers make sure that your doubts are cleared in no time.',
      expand: false,
    },
    {
      qus: 'What are the other communication Channels you have?',
      ans: 'Yes, Our teachers will certainly assist you in a one on one mentoring session in a breakout room which is an art feature in our application.',
      expand: false,
    },
  ];
}