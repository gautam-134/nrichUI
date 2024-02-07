import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from 'src/app/loader.service';
import { CrmLeadTrackerVO } from 'src/app/model/CrmLeadTrackerVO';
import { InstituteLeadsVO } from 'src/app/model/InstituteLeadsVO';
import { UserV2VO } from 'src/app/model/UserV2VO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CRMService } from 'src/app/services/CRM/crm.service';

@Component({
  selector: 'app-assign-lead',
  standalone: true,
  imports: [],
  templateUrl: './assign-lead.component.html',
  styleUrl: './assign-lead.component.scss'
})
export class AssignLeadComponent implements OnInit {
  assignLeadForm!: FormGroup;
  isSubmit: boolean = false;
  assigneeList: string[] = [];
  crmLeadTrackerVO!: CrmLeadTrackerVO;
  users!: UserV2VO[];
  leadIds: number[] = [];
  assignedUser: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { selectedLeads: InstituteLeadsVO[] },private dialogRef: MatDialogRef<AssignLeadComponent>,private crmService: CRMService, private fb: FormBuilder, private loaderService: LoaderService, private alertService: SwalAlertService) { }

  ngOnInit(): void {
    if (this.data.selectedLeads) {
      this.data?.selectedLeads?.forEach((value: InstituteLeadsVO) => {
        this.leadIds.push(value.id);
      });
    }
    this.fetchAllTeachersAndAdminsOfInstitute();
    this.initform();
  }


  fetchAllTeachersAndAdminsOfInstitute() {
    this.crmService.fetchAllTeachersAndAdminsOfInstitute().subscribe((res: any) => {
      this.users = res;
      if (this.data.selectedLeads.length == 1) {
        this.crmService.fetchAssignedUserofLead(this.data.selectedLeads[0].id).subscribe((res: any) => {
          this.assignedUser = res;
          this.initform();
        })
      }
      this.initform();
    })
  }

  initform() {
    this.assignLeadForm = this.fb.group({
      assignedTo: [this.assignedUser, Validators.required],
      assignedBy: [],
      comment: ['', Validators.required],
    });

  }
  onSubmit() {
    if (this.assignLeadForm.invalid) {
      this.isSubmit = true;
      return;
    }
    this.crmLeadTrackerVO = {
      leadIds: this.leadIds,
      assignedBy: this.assignLeadForm.get('assignedBy')?.value,
      assignedTo: this.assignLeadForm.get('assignedTo')?.value,
      comment: this.assignLeadForm.get('comment')?.value,
    }
    this.loaderService.showLoader(
      this.crmService.assignLead(this.crmLeadTrackerVO)).subscribe({
        next: (res: any) => {
          const msg=this.data.selectedLeads.length>1 ? 'Leads are assigned successfully!' : 'Leads is assigned successfully!'
          this.alertService.okErrorAlert(msg)
          this.dialogRef.close({event:'refresh'})
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
          this.dialogRef.close({event:'cancel'})
        },
      });
  }

  get controls() {
    return this.assignLeadForm.controls;
  }
  close(){
    this.dialogRef.close({event:'cancel'})
  }
}
