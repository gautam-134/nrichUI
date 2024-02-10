import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../loader.service';
import { addOnPlan, addOnPlanFeatures } from '../../../model/addOn.model';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { AddEditCouponComponent } from '../../coupon-code/add-edit-coupon/add-edit-coupon.component';
import { discountPriceValidation } from '../../../common/validators/common.validators';

@Component({
  selector: 'app-add-edit-addonns',
   
  templateUrl: './add-edit-addonns.component.html',
  styleUrl: './add-edit-addonns.component.scss'
})
export class AddEditAddonnsComponent implements OnInit {
  addonForm!: FormGroup;
  now: any;
  features!: FormArray;
  submitted: boolean = false;
  isSuccess = new EventEmitter<boolean>();
  constructor(
    private planService: SubscriptionService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private dialogRef: MatDialogRef<AddEditCouponComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { row: addOnPlan; isEdit: boolean; sacCodes: number[] }
  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.data.isEdit == true) {
      this.addonForm = this.fb.group({
        id: [this.data.row?.id],
        addOnPlanName: [this.data.row?.addOnPlanName, Validators.required],
        price: [this.data.row?.price, Validators.required],
        discountPrice: [this.data.row?.discountPrice],
        allowedStudents: [this.data.row?.allowedStudents],
        allowedStorage: [this.data.row?.allowedStorage],
        allowedTeachers: [this.data.row?.allowedTeachers],
        startDate: [
          this.data.row?.startDate.split('T')[0],
          Validators.required,
        ],
        endDate: [this.data.row?.endDate.split('T')[0], Validators.required],
        allowedConcurrentClasses: [this.data.row?.allowedConcurrentClasses],
        displayOrder: [this.data.row?.displayOrder, Validators.required],
        zoomAllowed: [this.data.row?.zoomAllowed],
        noOfDays: [this.data.row?.noOfDays, Validators.required],
        sac: [this.data.row?.sac, Validators.required],
        features: new FormArray(
          this.data.row.features.map((value: addOnPlanFeatures) => {
            return this.updateItem(value);
          })
        ),
      } ,{ validator: discountPriceValidation });
    } else {
      this.addonForm = this.fb.group({
        addOnPlanName: ['', Validators.required],
        price: ['', Validators.required],
        discountPrice: [''],
        allowedStudents: [''],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        allowedStorage: [''],
        allowedTeachers: [''],
        allowedConcurrentClasses: [''],
        displayOrder: ['', Validators.required],
        zoomAllowed: [''],
        noOfDays: ['', Validators.required],
        sac: ['', Validators.required],
        features: new FormArray([this.createItem()]),
      },{ validator: discountPriceValidation });
    }
  }

  createItem(): FormGroup {
    return this.fb.group({
      featureDescription: ['', Validators.required],
      displayOrder: ['', Validators.required],
    });
  }

  updateFeatures(module: addOnPlanFeatures[]): void {
    this.features = this.addonForm.get('features') as FormArray;
    module.forEach((value: addOnPlanFeatures) => {
      this.features.push(this.updateItem(value));
    });
  }

  updateItem(module: addOnPlanFeatures): FormGroup {
    return this.fb.group({
      featureDescription: [module.featureDescription, Validators.required],
      displayOrder: [module.displayOrder, Validators.required],
      id: [module.id],
    });
  }

  addFeatures(): void {
    this.features = this.addonForm.get('features') as FormArray;
    this.features.push(this.createItem());
  }
  get form() {
    return this.addonForm.controls;
  }
  getControls() {
    return (this.addonForm.get('features') as FormArray).controls;
  }
  close() {
    this.dialogRef.close();
  }

  delete(index: number) {
    (this.addonForm.get('features') as FormArray).removeAt(index);
  }

  createPlan() {
    if (this.addonForm.invalid) {
      this.submitted = true;
    } else if (
      this.addonForm.get('allowedStudents')?.value == '' &&
      this.addonForm.get('allowedStorage')?.value == '' &&
      this.addonForm.get('allowedTeachers')?.value == '' &&
      this.addonForm.get('allowedConcurrentClasses')?.value == '' &&
      (this.addonForm.get('zoomAllowed')?.value == 'false' ||
        this.addonForm.get('zoomAllowed')?.value == '')
    ) {
      this.alertService.errorAlert(
        'Atleast one parameter should not be empty from Allowed Student,Allowed Teacher,Allowed Storage,Zoom SDK,Allowed conncurrent classes.'
      );
    } else {
      if (this.data.isEdit !== true) {
        if (this.addonForm.value.startDate >= this.addonForm.value.endDate) {
          this.alertService.errorAlert('Start Date must be less then End Date');
        } else {
          this.loader
            .showLoader(this.planService.addAddon(this.addonForm.value))
            .subscribe(
              (data: any) => {
                this.isSuccess.emit(true);
                this.dialogRef.close();
                this.alertService.successAlert('Addonn created successfully');
              },
              (error: any) => {
                this.alertService.errorAlert('Something went wrong!');
              }
            );
        }
      } else {
        this.loader
          .showLoader(this.planService.addAddon(this.addonForm.value))
          .subscribe(
            (data: any) => {
              this.isSuccess.emit(true);
              this.dialogRef.close();
              this.alertService.successAlert('Addonn created successfully');
            },
            (error: any) => {
              this.alertService.errorAlert('Something went wrong!');
            }
          );
      }
    }
  }
}
