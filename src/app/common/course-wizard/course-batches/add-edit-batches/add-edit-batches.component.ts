import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTeacherComponent } from 'src/app/common/add-teacher/add-teacher.component';
import { LoaderService } from 'src/app/loader.service';
import { BatchVO } from 'src/app/model/BatchVO';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { BatchService } from 'src/app/services/batch.service';
import { CourseWizardService } from 'src/app/services/course/course-wizard.service';


@Component({
  selector: 'app-add-edit-batches',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-batches.component.html',
  styleUrl: './add-edit-batches.component.scss'
})
export class AddEditBatchesComponent implements OnInit {
  pricingPlans: PricingPlanVO[] = [];
  now: any;
  isSubmit: boolean = false;
  teachers: { id: number; name: string; image: string; userId: number }[] = [];
  batchForm!: FormGroup;
  batchVO!: BatchVO;
  roleType: any;
  disableTeacherField: boolean = true;
  userId: any;
  @ViewChild('startDate') startDate!: ElementRef;
  @ViewChild('endDate') endDate!: ElementRef;
  constructor(
    private courseWizard: CourseWizardService,
    private fb: FormBuilder,
    private batchService: BatchService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.roleType = JSON.parse(
      localStorage.getItem('auth') as string
    ).role.roleType;

    this.userId = JSON.parse(localStorage.getItem('auth') as string).user_id;

    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.pricingPlans = this.courseWizard.getPricingPlans;
    if (this.roleType == 'Teacher') {
      this.teachers = this.courseWizard.getTeachers.filter(
        (s) => s.userId === this.userId
      );
    } else {
      this.teachers = this.courseWizard.getTeachers;
    }

    this.courseWizard.batchSubject$.subscribe((data: BatchVO | boolean) => {
      if (typeof data != 'boolean') {
        this.batchVO = data;
      }
      this.createAndUpdateForm();
    });
  }

  get getControls() {
    return this.batchForm.controls;
  }

  createAndUpdateForm() {
    this.batchForm = this.fb.group({
      idBatch: [this.batchVO?.idBatch],
      idPricingPlan: [this.batchVO?.idPricingPlan, Validators.required],
      batchName: [
        this.batchVO?.batchName,
        [Validators.required, this.validateCharctersInput],
      ],
      maxNoOfEnrollments: [
        this.batchVO?.maxNoOfEnrollments,
        [Validators.required, this.validateDigitInput],
      ],
      startDate: [
        this.batchVO?.startDate.toString().split('T')[0],
        Validators.required,
      ],
      endDate: [
        this.batchVO?.endDate.toString().split('T')[0],
        Validators.required,
      ],
      teacherIds: [this.batchVO?.teacherIds],
      batchCode: [this.batchVO?.batchCode],
      disabled: [this.batchVO?.disabled],
    });
  }

  cancel() {
    this.courseWizard.batchSubject$.next(true);
  }

  submit() {
    this.isSubmit = true;
    if (this.batchForm.invalid) {
      return;
    }
    if(this.batchForm.get('maxNoOfEnrollments')?.value==0){
      return;
    }
    this.batchVO = this.batchForm.value;
    this.loader
      .showLoader(this.batchService.createBatch(this.batchVO))
      .subscribe({
        next: (data: BatchVO) => {
          this.batchVO.idBatch
            ? this.courseWizard.editBatch(data)
            : this.courseWizard.addBatch(data);
          this.courseWizard.batchSubject$.next(true);
          this.alertService.successAlert('Batch Saved successfully !');
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error?.error?.message);
        },
      });
  }
  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 32) {
      return { validateCharctersInput: true };
    }
    return null;
  }

  validateDigitInput(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.length > 4) {
      return { validateDigitInput: true };
    }
    return null;
  }
  openAddTeacherDialog() {
    let dialogRef = this.dialog.open(AddTeacherComponent, {
      width: '700px',
      maxHeight: '800px',
      disableClose: true,
      data: {
        fromBatch: true,
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe(
      (res: { id: number; name: string; image: string; userId: number }) => {
        if (res) {
          this.teachers.unshift(res);
          dialogRef.close();
        }
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

  isNumberKey(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  showPicker(isStartDateClick:boolean){
    if(isStartDateClick) this.startDate.nativeElement.showPicker()
    else this.endDate.nativeElement.showPicker()

  }
}