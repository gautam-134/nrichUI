import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { SubscriptionPlanVO } from 'src/app/model/SubscriptionPlanVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';

@Component({
  selector: 'app-edit-current-plan',
  standalone: true,
  imports: [],
  templateUrl: './edit-current-plan.component.html',
  styleUrl: './edit-current-plan.component.scss'
})
export class EditCurrentPlanComponent implements OnInit {
  planId!: number;
  details: SubscriptionPlanVO = new SubscriptionPlanVO();
  form!: FormGroup;
  isSubmit: boolean = false;
  now: any;

  err1: boolean = false;
  err2: boolean = false;
  err3: boolean = false;
  err4: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private subscriptionService: SubscriptionService,
    private location: Location,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.planId = this.route.snapshot.queryParams['id'];
    this.refresh();
    this.getPlanDetails(this.planId);
  }

  refresh() {
    this.form = this.fb.group({
      id: [this.planId, Validators.required],
      planName: [this.details.planName, Validators.required],
      actualEndDate: [this.details.actualEndDate, Validators.required],
      allowedConcurrentClasses: [
        this.details.allowedConcurrentClasses,
        Validators.required,
      ],
      allowedStorage: [this.details.allowedStorage, Validators.required],
      allowedStudents: [this.details.allowedStudents, Validators.required],
      allowedTeachers: [this.details.allowedTeachers, Validators.required],
      zoomAllowed: [this.details.zoomAllowed],
    });
  }

  getPlanDetails(id: number) {
    this.loader
      .showLoader(this.subscriptionService.getPlanDetails(id))
      .subscribe({
        next: (data) => {
          this.details = data;
          const datePipe = new DatePipe('en-Us');
          this.now = datePipe.transform(
            new Date(this.details.actualEndDate.toString()),
            'yyyy-MM-ddThh:mm'
          );
          this.details.actualEndDate = this.now;
          this.refresh();
        },
        error: (error) => {
          this.alertService.errorAlert('Error while fetching plan details');
        },
      });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) return;
    if (this.err1 || this.err2 || this.err3 || this.err4) return;
    this.loader
      .showLoader(
        this.subscriptionService.saveSubscriptionPlan(this.form.value)
      )
      .subscribe({
        next: (data) => {
          this.alertService
            .successAlert('Subscription updated successfully!')
            .then((success) => {
              this.location.back();
            });
        },
        error: (error) => {
          this.alertService.errorAlert(
            'Error while updating subscription details'
          );
        },
      });
  }

  checkInputs(event: any, type: number) {
    const val = event.target.value;
    type == 1
      ? (this.err1 = val < this.details.allowedConcurrentClasses)
      : type == 2
      ? (this.err2 = val < this.details.allowedStorage)
      : type == 3
      ? (this.err3 = val < this.details.allowedStudents)
      : (this.err4 = val < this.details.allowedTeachers);
  }

  get controls() {
    return this.form.controls;
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

  back() {
    this.location.back();
  }
}