import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoaderService } from 'src/app/loader.service';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CourseWizardService } from 'src/app/services/course/course-wizard.service';
import { PricingPlanService } from 'src/app/services/pricing-plan.service';

@Component({
  selector: 'app-add-edit-pricingplan',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-pricingplan.component.html',
  styleUrl: './add-edit-pricingplan.component.scss'
})
export class AddEditPricingplanComponent implements OnInit, OnDestroy {
  pricingPlanVO!: PricingPlanVO;
  pricingPlanForm!: FormGroup;
  isSubmit: boolean = false;
  priceError: boolean = false;
  constructor(
    private courseWizard: CourseWizardService,
    private pricingPlanService: PricingPlanService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    this.courseWizard.planSubject$.next(true);
  }

  ngOnInit(): void {
    this.createForm();
    this.courseWizard.planSubject$.subscribe(
      (data: PricingPlanVO | boolean) => {
        if (typeof data != 'boolean') {
          this.pricingPlanVO = data;
        }
        this.createForm();
      }
    );
  }

  createForm() {
    this.pricingPlanForm = this.fb.group({
      idPricingPlan: [this.pricingPlanVO?.idPricingPlan],
      idCourse: [
        this.pricingPlanVO?.idCourse
          ? this.pricingPlanVO?.idCourse
          : this.courseWizard.getCourse?.id,
        Validators.required,
      ],
      pricingPlanName: [
        this.pricingPlanVO?.pricingPlanName,
        [Validators.required, this.validateCharctersInput],
      ],
      price: [this.pricingPlanVO?.price, Validators.required],
      discountPrice: [this.pricingPlanVO?.discountPrice],
      discountOfferName: [this.pricingPlanVO?.discountOfferName],
      planLabel: [this.pricingPlanVO?.planLabel, Validators.required],
      isPlanActive:[this.pricingPlanVO?.isPlanActive] 
    });
  }

  onSubmit() {
    this.priceError = false;
    this.isSubmit = true;

    if (this.pricingPlanForm.invalid) {
      return;
    }
    this.pricingPlanVO = this.pricingPlanForm.value;
    if(this.pricingPlanForm.get('discountPrice')?.value ==''){
     this.pricingPlanVO.discountPrice = null as unknown as number;
    }
    if (+this.pricingPlanVO.price < +this.pricingPlanVO.discountPrice) {
      this.priceError = true;
      return;
    }
    this.loader
      .showLoader(this.pricingPlanService.savePricingPlan(this.pricingPlanVO))
      .subscribe({
        next: (data: PricingPlanVO) => {
          if (this.pricingPlanVO.idPricingPlan) {
            this.alertService.successAlert(
              "Yay, you're ready to make some money with your LMS You've got this one covered, don't you worry about a thing and just enjoy being a teacher."
            );
            this.courseWizard.updatePricingPlan(data);
          } else {
            this.alertService.successAlert(
              "Yay, you're ready to make some money with your LMS You've got this one covered, don't you worry about a thing and just enjoy being a teacher."
            );
            this.courseWizard.addPricingPlan(data);
          }
          this.courseWizard.planSubject$.next(true);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 25) {
      return { validateCharctersInput: true };
    }
    return null;
  }

  showPlanList() {
    this.courseWizard.planSubject$.next(true);
  }

  get getControls() {
    return this.pricingPlanForm.controls;
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

