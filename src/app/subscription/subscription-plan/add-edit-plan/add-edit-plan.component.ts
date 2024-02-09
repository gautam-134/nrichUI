import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { discountPriceValidation } from 'src/app/common/validators/common.validators';
import { LoaderService } from 'src/app/loader.service';
import {
  SubscriptionPricingPlans,
  SubscriptionPricingPlansFeatures,
} from 'src/app/model/subscriptionplan.model';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';

@Component({
  selector: 'app-add-edit-plan',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-plan.component.html',
  styleUrl: './add-edit-plan.component.scss'
})
export class AddEditPlanComponent implements OnInit {
  createPlanForm!: FormGroup;
  features!: FormArray;
  submitted: boolean = false;
  minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  // isSubmit: boolean = false;
  constructor(
    private planService: SubscriptionService,
    private fb: FormBuilder,
    private loader: LoaderService,
    public dialogRef: MatDialogRef<AddEditPlanComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      row: SubscriptionPricingPlans;
      isEdit: boolean;
      sacCodes: number[];
    },
    private datePipe: DatePipe,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    if (this.data.isEdit == true) {
      this.createPlanForm = this.fb.group(
        {
          id: [this.data.row?.id],
          pricingPlanName: [
            this.data.row?.pricingPlanName,
            Validators.required,
          ],
          frequency: [this.data.row?.frequency, Validators.required],
          noOfDays: [
            this.data.row.noOfDays,
            [Validators.required, Validators.min(0)],
          ],
          price: [
            this.data.row?.price,
            [Validators.required, Validators.min(0)],
          ],
          type: [this.data.row?.type, Validators.required],
          discountPrice: [this.data.row?.discountPrice],
          allowedStudents: [
            this.data.row?.allowedStudents,
            [Validators.required, Validators.min(0)],
          ],
          allowedStorage: [
            this.data.row?.allowedStorage,
            [Validators.required, Validators.min(0)],
          ],
          allowedTeachers: [
            this.data.row?.allowedTeachers,
            [Validators.required, Validators.min(0)],
          ],
          allowedConcurrentClasses: [
            this.data.row?.allowedConcurrentClasses,
            [Validators.required, Validators.min(0)],
          ],
          displayOrder: [
            this.data.row?.displayOrder,
            [Validators.required, Validators.min(0)],
          ],
          // active: [this.data.row?.active, Validators.required],
          startDate: [
            this.data.row.startDate.toString().split('T')[0],
            Validators.required,
          ],
          endDate: [
            this.data.row?.endDate.toString().split('T')[0],
            Validators.required,
          ],
          zoomAllowed: [this.data.row?.zoomAllowed, Validators.required],
          sac: [this.data.row?.sac, Validators.required],
          features: new FormArray(
            this.data.row.features.map(
              (value: SubscriptionPricingPlansFeatures) => {
                return this.updateItem(value);
              }
            )
          ),
        },
        { validator: discountPriceValidation }
      );
    } else {
      this.createPlanForm = this.fb.group(
        {
          pricingPlanName: ['', Validators.required],
          frequency: ['', Validators.required],
          price: ['', [Validators.required, Validators.min(0)]],
          type: ['', Validators.required],
          noOfDays: ['', Validators.required],
          discountPrice: [''],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          allowedStudents: ['', [Validators.required, Validators.min(0)]],
          allowedStorage: ['', Validators.required, Validators.min(0)],
          allowedTeachers: ['', Validators.required, Validators.min(0)],
          allowedConcurrentClasses: [
            '',
            Validators.required,
            Validators.min(0),
          ],
          displayOrder: ['', Validators.required, Validators.min(0)],
          zoomAllowed: ['', Validators.required],
          features: new FormArray([this.createItem()]),
          sac: [this.data.row?.sac, Validators.required],
        },
        { validator: discountPriceValidation }
      );
    }
  }

  createItem(): FormGroup {
    return this.fb.group({
      featureDescription: ['', Validators.required],
      displayOrder: ['', [Validators.required, Validators.min(0)]],
    });
  }

  updateFeatures(module: SubscriptionPricingPlansFeatures[]): void {
    this.features = this.createPlanForm.get('features') as FormArray;
    module.forEach((value: SubscriptionPricingPlansFeatures) => {
      this.features.push(this.updateItem(value));
    });
  }

  updateItem(module: SubscriptionPricingPlansFeatures): FormGroup {
    return this.fb.group({
      featureDescription: [module.featureDescription, Validators.required],
      displayOrder: [module.displayOrder, Validators.required],
      id: [module.id],
    });
  }

  addFeatures(): void {
    this.features = this.createPlanForm.get('features') as FormArray;
    this.features.push(this.createItem());
  }
  get form() {
    return this.createPlanForm.controls;
  }
  getControls() {
    return (this.createPlanForm.get('features') as FormArray).controls;
  }

  close() {
    this.dialogRef.close();
  }

  delete(index: number) {
    (this.createPlanForm.get('features') as FormArray).removeAt(index);
  }

  createPlan() {
    this.submitted = true;
    if (this.createPlanForm.invalid) {
      return;
    } else if (this.data.isEdit !== true) {
      if (
        this.createPlanForm.value.startDate >= this.createPlanForm.value.endDate
      ) {
        this.alertService.errorAlert('Start Date must be less then End Date');
      } else {
        this.loader
          .showLoader(this.planService.addPlan(this.createPlanForm.value))
          .subscribe(
            (data) => {
              this.close();
              this.alertService.successAlert('Plan created successfully');
            },
            (error: any) => {
              this.loader.loadingOff();
              this.alertService.errorAlert(error.error.message);
            }
          );
      }
    } else {
      this.loader
        .showLoader(this.planService.addPlan(this.createPlanForm.value))
        .subscribe(
          (data) => {
            this.close();
            this.alertService.successAlert('Plan created successfully');
          },
          (error: any) => {
            this.alertService.errorAlert(error.error.message);
          }
        );
    }
  }
}
