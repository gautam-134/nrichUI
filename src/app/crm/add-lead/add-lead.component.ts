import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoaderService } from 'src/app/loader.service';
import { Country } from 'src/app/model/Country';
import { CrmFormFieldsVO } from 'src/app/model/CrmFormFieldsVO';
import { CrmStatus, CrmSubStatus } from 'src/app/model/CrmStatusAndSubStatus';
import { InstituteLeadsVO } from 'src/app/model/InstituteLeadsVO';
import { LeadFieldDataVO } from 'src/app/model/LeadFieldDataVO';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { PricingPlanVO } from 'src/app/model/PricingPlanVO';
import { States } from 'src/app/model/States';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CourseService } from 'src/app/services/course/course.service';
import { CRMService } from 'src/app/services/CRM/crm.service';

@Component({
  selector: 'app-add-lead',
  standalone: true,
  imports: [],
  templateUrl: './add-lead.component.html',
  styleUrl: './add-lead.component.scss'
})
export class AddLeadComponent implements OnInit {
  leadForm!: FormGroup;
  submitted: boolean = false;
  formFields!: CrmFormFieldsVO[];
  countryList: Country[] = [];
  stateList: States[] = [];
  instituteLeads: InstituteLeadsVO = new InstituteLeadsVO();
  leadFieldData!: LeadFieldDataVO[];
  crmStatus: CrmStatus[] = [];
  crmSubStatus: CrmSubStatus[] = [];
  courseList!: MobileCourseVO[];
  pricingPlans: PricingPlanVO[] = [];
  now: any;
  constructor(
    private crmService: CRMService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private courseService: CourseService,
   private location:Location

  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:MM');
    this.getFormFields();
    this.fetchCountriesAndStates();
    this.fetchStatusAndSubStatus();
    this.fetchInstituteCoursesList();
  }

  fetchCountriesAndStates() {
    this.commonService.fetchCountries().subscribe({
      next: (data: any) => {
        this.countryList = data;
      },
    });
  }

  onCountryChange(event: any) {
    // fetch the list of states based on the selected country using a service or API
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
  getFormFields() {
    this.loader.showLoader(this.crmService.getFormFields()).subscribe({
      next: (data: CrmFormFieldsVO[]) => {
        this.formFields = data;
        this.createLeadForm();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error while fetching form fields');
      },
    });
  }

  fetchStatusAndSubStatus() {
    this.loader
      .showLoader(this.crmService.fetchStatusAndSubStatus())
      .subscribe({
        next: (data) => {
          this.crmStatus = data;
          this.statusChange('Pending');
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            'Error while fetching status and sub-status'
          );
        },
      });
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
      status: ['Pending', Validators.required],
      subStatus: [this.instituteLeads.subStatus],
      notes: [this.instituteLeads.notes],
      followUpDate: [this.instituteLeads.followUpDate],
      leadFormFields: this.createFormFields(),
    });
  }

  createFormFields() {
    const formGroup = new FormGroup({});
    this.formFields.forEach((field) => {
      formGroup.addControl(
        field.id.toString(),
        field.required
          ? new FormControl('', Validators.required)
          : new FormControl('')
      );
    });
    return formGroup;
  }

  onSubmit() {
    if(this.leadForm.get('followUpDate')?.value){
      const currentDateTime = new Date();
      const followUpDateTimeObj = new Date(this.leadForm.get('followUpDate')?.value);
    
      if (followUpDateTimeObj <= currentDateTime) {
        this.alertService.errorAlert("Follow-up date and time should be greater than the current time.");
        return;
      }
      
    }
    this.submitted = true;
    if (this.leadForm.invalid) {
      return;
    }
    

    this.instituteLeads = this.leadForm.value;
    this.instituteLeads.instituteId = +AuthService.getInstituteId;

    this.loader
      .showLoader(this.crmService.addLead(this.instituteLeads))
      .subscribe({
        next: (data) => {
          this.alertService.successAlert('Lead added successfully');
          this.location.back();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while added lead');
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

  onSelectionChange(event: any) {
    if (event == false) {
      this.fetchPricingPlans();
      // this.searchCategories.nativeElement.value = '';
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

  
}
