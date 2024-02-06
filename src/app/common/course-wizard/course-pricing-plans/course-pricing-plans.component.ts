import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CourseWizardService } from 'src/app/services/course/course-wizard.service';
import { PricingPlanService } from 'src/app/services/pricing-plan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-pricing-plans',
  standalone: true,
  imports: [],
  templateUrl: './course-pricing-plans.component.html',
  styleUrl: './course-pricing-plans.component.scss'
})
export class CoursePricingPlansComponent implements OnInit {
  pricingPlans: PricingPlanVO[] = [];
  constructor(
    private loader: LoaderService,
    private courseWizardService: CourseWizardService,
    private planService: PricingPlanService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.pricingPlans = this.courseWizardService.getPricingPlans;
  }

  showPlanForm() {
    this.courseWizardService.planSubject$.next(false);
  }

  editPlanForm(plan: PricingPlanVO) {
    this.courseWizardService.planSubject$.next(plan);
  }

  next() {
    this.courseWizardService.nextFromTab(3);
  }

  updateActiveFlag(element: PricingPlanVO, event: any) {
    this.loader
      .showLoader(this.planService.updatePlanActiveFlag(element.idPricingPlan))
      .subscribe({
        next: (data: any) => {},
        error: (error: HttpErrorResponse) => {
          element.isPlanActive = (!event.target.checked).toString();
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  showWarning() {
    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete this plan?</p>',
      html: 'All mappings will be deleted',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  async delete(id: number, index: number) {
    await this.showWarning().then((value: boolean) => {
      if (value) {
        this.planService.delete(id).subscribe({
          next: (data: any) => {
            this.courseWizardService.deletePricingPlan(index);
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert('Something went wrong!');
          },
        });
      }
    });
  }
}
