import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { LoaderService } from 'src/app/loader.service';
import { Country } from 'src/app/model/Country';
import { CrmFormFieldsVO } from 'src/app/model/CrmFormFieldsVO';
import { CrmStatus, CrmSubStatus } from 'src/app/model/CrmStatusAndSubStatus';
import { InstituteLeadsVO } from 'src/app/model/InstituteLeadsVO';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { States } from 'src/app/model/States';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CourseService } from 'src/app/services/course/course.service';
import { CRMService } from 'src/app/services/CRM/crm.service';

@Component({
  selector: 'app-edit-lead',
  standalone: true,
  imports: [],
  templateUrl: './edit-lead.component.html',
  styleUrl: './edit-lead.component.scss'
})
export class EditLeadComponent implements OnInit {
  leadForm!: FormGroup;
  isSubmit: boolean = false;
  submitted: boolean = false;
  countryList: Country[] = [];
  stateList: States[] = [];
  formFields!: CrmFormFieldsVO[];
  instituteLeads: InstituteLeadsVO = new InstituteLeadsVO();
  leadId!: number;
  crmStatus: CrmStatus[] = [];
  crmSubStatus: CrmSubStatus[] = [];
  pricingPlans: PricingPlanVO[] = [];
  courseList!: MobileCourseVO[];
  now: any;
  constructor(
    private commonService: CommonService,
    private crmService: CRMService,
    private loader: LoaderService,
    private location: Location,
    private alertService: SwalAlertService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:MM');
    this.leadId = this.activatedRoute.snapshot.queryParams['leadId'];
    this.getFormFieldsAndData();
    this.fetchCountriesAndStates();
    this.fetchInstituteCoursesList();
  }

  fetchCountriesAndStates() {
    this.commonService.fetchCountries().subscribe({
      next: (data: any) => {
        this.countryList = data;
      },
    });

    this.commonService.fetchStates().subscribe({
      next: (data: any) => {
        this.stateList = data;
      },
    });
  }

  fetchInstituteCoursesList() {
    this.crmService.fetchInsituteCourses().subscribe({
      next: (data: any) => {
        this.courseList = data;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  getFormFieldsAndData() {
    this.loader
      .showLoader(this.crmService.fetchLeadData(this.leadId))
      .subscribe({
        next: (data) => {
          this.instituteLeads = data;
          this.loader
            .showLoader(this.crmService.getFormFieldsAndData(this.leadId))
            .subscribe({
              next: (data: CrmFormFieldsVO[]) => {
                this.formFields = data;
                this.loader
                  .showLoader(this.crmService.fetchStatusAndSubStatus())
                  .subscribe({
                    next: (data) => {
                      this.crmStatus = data;
                      if (this.instituteLeads.status) {
                        const index = this.crmStatus.findIndex(
                          (status) =>
                            status.status == this.instituteLeads.status
                        );
                        this.crmSubStatus = this.crmStatus[index].crmSubStatus;
                      }
                      this.createLeadForm();
                    },
                    error: (error: HttpErrorResponse) => {
                      this.alertService.errorAlert(
                        'Error while fetching status and sub-status'
                      );
                    },
                  });
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert(
                  'Error while fetching form fields'
                );
              },
            });
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching data');
        },
      });
  }
  onSelectionChange(event: any) {
    if (event == false) {
      this.fetchPricingPlans();
    }
  }
  fetchPricingPlans() {
    if (this.leadForm.get('courseId')?.value) {
      this.loader
        .showLoader(
          this.courseService.fetchPricingPlan(
            this.leadForm.get('courseId')?.value
          )
        )
        .subscribe({
          next: (data: any[]) => {
            this.pricingPlans = data;
          },
          error: (error: HttpErrorResponse) => {},
        });
    }
  }
  createLeadForm() {
    this.leadForm = this.fb.group({
      name: [this.instituteLeads.name, Validators.required],
      mobileNumber: [this.instituteLeads.mobileNumber, Validators.required],
      organisation: [this.instituteLeads.organisation, Validators.required],
      role: [this.instituteLeads.role, Validators.required],
      email: [
        this.instituteLeads.email,
        [Validators.email, Validators.required],
      ],
      source: [this.instituteLeads.source],
      country: [this.instituteLeads.country, Validators.required],
      state: [this.instituteLeads.state, Validators.required],
      city: [this.instituteLeads.city, Validators.required],
      courseId: [this.instituteLeads.courseId],
      pricingPlanId: [this.instituteLeads.pricingPlanId],
      status: [this.instituteLeads.status, Validators.required],
      subStatus: [this.instituteLeads.subStatus],
      notes: [this.instituteLeads.notes],
      followUpDate: [
        this.instituteLeads.followUpDate
          ? moment(this.instituteLeads.followUpDate)
              .utc()
              .format('yyyy-MM-DDTHH:mm:ss')
          : null,
      ],
      leadFormFields: this.createFormFields(),
    });
    this.fetchPricingPlans();
  }

  createFormFields() {
    const formGroup = new FormGroup({});
    if (this.formFields) {
      this.formFields.forEach((field) => {
        formGroup.addControl(
          field.leadFieldDataVO.id.toString(),
          field.required
            ? new FormControl(
                field.leadFieldDataVO.value ? field.leadFieldDataVO.value : '',
                Validators.required
              )
            : new FormControl(
                field.leadFieldDataVO.value ? field.leadFieldDataVO.value : ''
              )
        );
      });
    }
    return formGroup;
  }

  statusChange(event: any) {
    this.leadForm.get('subStatus')?.setValue(null);
    const selectedStatus = event.target.value;
    const index = this.crmStatus.findIndex(status => status.status === selectedStatus);
    if (index !== -1) {
      this.crmSubStatus = this.crmStatus[index].crmSubStatus;
 
      if (selectedStatus === 'Pending' || this.crmSubStatus.length === 0) {
        // Remove the 'Validators.required' validator if status is 'Pending' or subStatus list is empty
        this.leadForm.get('subStatus')?.clearValidators();
      } else {
        // Add 'Validators.required' validator for other statuses with non-empty subStatus lists
        this.leadForm.get('subStatus')?.setValidators(Validators.required);
      }
  
      // Update the validity of the 'subStatus' field based on the validator changes
      this.leadForm.get('subStatus')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.leadForm.get('followUpDate')?.value) {
      const currentDateTime = new Date();
      const followUpDateTimeObj = new Date(
        this.leadForm.get('followUpDate')?.value
      );

      if (followUpDateTimeObj <= currentDateTime) {
        this.alertService.errorAlert(
          'Follow-up date and time should be greater than the current time.'
        );
        return;
      }
    }
    if (this.leadForm.invalid) {
      return;
    }
    this.instituteLeads = this.leadForm.value;
    this.instituteLeads.id = this.leadId;
    this.instituteLeads.instituteId = +AuthService.getInstituteId;
    this.loader
      .showLoader(this.crmService.editLead(this.instituteLeads))
      .subscribe({
        next: (data) => {
          this.alertService.successAlert('Lead updated successfully');
          this.location.back();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while updating lead');
        },
      });
  }

  get controls() {
    return this.leadForm.controls;
  }

  get groupControls() {
    return (this.leadForm.get('leadFormFields') as FormGroup).controls;
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

  goBack() {
    this.location.back();
  }
}
