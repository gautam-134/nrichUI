import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../loader.service';
import { FaqComponent } from '../../marketing/shared/faq/faq.component';
import { FAQVo } from '../../model/Faq';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { SubscriptionService } from '../../services/subscription/subscription.service';

@Component({
  selector: 'app-add-faqs',
   
  templateUrl: './add-faqs.component.html',
  styleUrl: './add-faqs.component.scss'
})
export class AddFaqsComponent implements OnInit {
  FaqForm!: FormGroup;
  today: Date = new Date();
  refresh = new EventEmitter<boolean>();
  activeValue!: string;
  FaqVO: FAQVo = new FAQVo();
  submitted: boolean = false;
  instituteId: any;
  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    public dialogRef: MatDialogRef<FaqComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { body: FAQVo; isEdit: boolean }
  ) {}

  ngOnInit(): void {
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    if (this.data.isEdit) {
      this.FaqForm = this.fb.group({
        id: this.data.isEdit ? this.data.body.id : '',
        displayOrder: [this.data.body.displayOrder, Validators.required],
        question: [this.data.body.question, Validators.required],
        answer: [this.data.body.answer, Validators.required],
        active: [String(this.data.body.active), Validators.required],
        faqType: [this.data.body.faqType, Validators.required],
        idInstitution: [this.instituteId],
      });
      this.FaqForm.get('faqType')?.disable();
    } else {
      this.FaqForm = this.fb.group({
        displayOrder: ['', Validators.required],
        question: ['', Validators.required],
        answer: ['', Validators.required],
        active: ['true', Validators.required],
        faqType: ['', Validators.required],
        idInstitution: [this.instituteId],
      });
    }
  }

  get form() {
    return this.FaqForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.FaqForm.valid) {
      this.FaqVO.question = this.FaqForm.controls['question'].value;
      this.FaqVO.answer = this.FaqForm.controls['answer'].value;
      this.FaqVO.displayOrder = this.FaqForm.controls['displayOrder'].value;
      this.FaqVO.active = this.FaqForm.controls['active'].value;
      this.FaqVO.idInstitution = this.FaqForm.controls['idInstitution'].value;
      if (this.data.isEdit) {
        this.FaqVO.id = this.FaqForm.controls['id'].value;
        this.FaqVO.faqType = this.data.body.faqType;
      } else {
        this.FaqVO.faqType = this.FaqForm.controls['faqType'].value;
      }
      this.loader
        .showLoader(this.subscriptionService.createFaq(this.FaqVO))
        .subscribe(
          (res: any) => {
            this.alertService.successAlert(res.message);
            this.refresh.emit(true);
          },
          (err: HttpErrorResponse) => {
            this.alertService.errorAlert(err.error.message);
          }
        );
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