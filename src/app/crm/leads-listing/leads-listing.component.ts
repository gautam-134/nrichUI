import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { InstituteLeadsVO } from '../../model/InstituteLeadsVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { CRMService } from '../../services/CRM/crm.service';
import { AssignLeadComponent } from '../assign-lead/assign-lead.component';
import { CrmStatus, CrmSubStatus } from '../../model/CrmStatusAndSubStatus';
import { FacebookLeadsComponent } from '../facebook-leads/facebook-leads.component';
import { SelectionModel } from '@angular/cdk/collections';
import { UserV2VO } from '../../model/UserV2VO';

@Component({
  selector: 'app-leads-listing',
   
  templateUrl: './leads-listing.component.html',
  styleUrl: './leads-listing.component.scss'
})
export class LeadsListingComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  subject = new Subject<string>();
  searchParam: string = '';
  totalCount!: number;
  instituteLeads: InstituteLeadsVO[] = [];
  typeOfShorting: boolean = true;
  leadtype = '';
  result$!: Observable<any>;
  roleType!: string;
  selectedLeads: InstituteLeadsVO[] = [];
  selectedStatus: string = '';
  assignedTo:string='';
  selectedSubStatus: string = '';
  crmStatus: CrmStatus[] = [];
  showDropDown: boolean = false;
  selection = new SelectionModel<InstituteLeadsVO>(true, []);
  crmSubStatus: CrmSubStatus[] = [];
  type: string = '';
  selectAll = false;
  users!: UserV2VO[];
  leadIds: number[] = [];
  @ViewChild('dropdown')
  dropdown!: ElementRef;
  constructor(
    public dialog: MatDialog,
    private loader: LoaderService,
    private crmService: CRMService,
    private alertService: SwalAlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchStatusAndSubStatus();
    if (this.route.snapshot.queryParams?.['type']) {
      this.leadtype = this.route.snapshot.queryParams?.['type'];
      this.selectStatusAndSubstatusAccordingToSearch();
    }
    this.roleType = AuthService.getRoleType;
    this.refresh(this.selectedStatus, this.page);
    this.fetchAllTeachersAndAdminsOfInstitute();
    this.applyFilter();
  }

  fetchAllTeachersAndAdminsOfInstitute() {
    this.crmService.fetchAllTeachersAndAdminsOfInstitute().subscribe((res: any) => {
      this.users = res;
    })
  }


  @HostListener('document:click', ['$event'])
  closeDropDown(event: MouseEvent) {
    if (this.showDropDown && !this.dropdown?.nativeElement.contains(event.target)) {
      this.showDropDown = false;
    }
  }
  selectStatusAndSubstatusAccordingToSearch() {
    if (this.leadtype == 'newLeads') {
      this.selectedStatus = 'Pending';
    } else if (this.leadtype == 'closedLeads') {
      this.selectedStatus = 'Closed';
      this.selectedSubStatus = 'Loss';
    } else if (this.leadtype == 'convertedLeads') {
      this.selectedStatus = 'Closed';
      this.selectedSubStatus = 'Won';
    } else if (this.leadtype == 'prospectiveLeads') {
      this.selectedStatus = 'Open';
      this.selectedSubStatus = 'Hot Lead,Let us Know,Inprogress';
    }
  }

  statusChange(event: any) {
    const index = this.crmStatus.findIndex((status) => status.status == event);
    this.crmSubStatus = this.crmStatus[index]?.crmSubStatus;
  }
  assignLead(lead: InstituteLeadsVO) {
    this.selectedLeads = [];
    this.instituteLeads?.forEach((value: InstituteLeadsVO) => {
      value.selected = false;
    });
    this.selectedLeads.push(lead);
    let dialogRef = this.dialog.open(AssignLeadComponent, {
      width: '50%',
      data: {
        selectedLeads: this.selectedLeads,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.event == 'refresh') {
        this.refresh(this.selectedStatus, this.page);
      }
      this.selectedLeads = [];
    });
  }

  openDropDown(event: MouseEvent) {
    this.showDropDown = !this.showDropDown;
    event.stopPropagation();
  }
  onAssignToChange(event: any){
    this.assignedTo = event.target.value;
     this.refresh(this.selectedStatus, this.page);
  }
  onStatusChange(event: any) {
    this.leadtype = '';
    this.router.navigate([], {
      queryParams: { type: '' },
      queryParamsHandling: 'merge',
    });
    this.selectedSubStatus = '';
    this.selectedStatus = event.target.value;
    if (this.selectedStatus == '') {
      this.crmSubStatus = [];
    }
    this.page = 0;
    const index = this.crmStatus.findIndex(
      (status) => status.status == this.selectedStatus
    );
    if (this.selectedStatus) {
      this.crmSubStatus = this.crmStatus[index].crmSubStatus;
    }
    this.refresh(this.selectedStatus, this.page);
  }
  onSubStatusChange(event: any) {
    this.leadtype = '';
    this.router.navigate([], {
      queryParams: { type: '' },
      queryParamsHandling: 'merge',
    });
    this.selectedSubStatus = event.target.value;
    this.refresh(this.selectedStatus, this.page);
  }

  addLead(){
  this.router.navigate([], {
    queryParams: { type: '' },
    queryParamsHandling: 'merge',
  });
  this.router.navigate(['/crm/addLead']);
}
addField(){
  this.router.navigate([], {
    queryParams: { type: '' },
    queryParamsHandling: 'merge',
  });
  this.router.navigate(['/crm/addField']);
}
  refresh(status: string, page: number) {
    this.loader
      .showLoader(
        this.crmService.getInstituteLeads(
          page,
          this.size,
          status,
          this.selectedSubStatus,
          this.leadtype,
          this.assignedTo,
          this.searchParam
         
        )
      )
      .subscribe({
        next: (data) => {
          this.instituteLeads = data.instituteLeads;
          this.totalCount = data.totalCount;
          this.selectAll = false;
          this.leadIds = [];
          this.selectedLeads = [];
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching leads');
        },
      });
    this.selectedLeads = [];
  }

  editLead(leadId: number) {
    this.router.navigate([], {
      queryParams: { type: '' },
      queryParamsHandling: 'merge',
    });
    this.router.navigate(['/crm/editLead'], {
      queryParams: { leadId: leadId },
    });
  }

  viewLeadHistory(leadId: number) {
    this.router.navigate([], {
      queryParams: { type: '' },
      queryParamsHandling: 'merge',
    });
    this.router.navigate(['/crm/leadHistory'], {
      queryParams: { leadId: leadId },
    });
  }

  pageChange(event: any) {
    this.refresh(this.selectedStatus, event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(this.selectedStatus, 0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.selectedStatus, this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.instituteLeads.forEach((row) => {
      row.selected = this.selectAll;
      if (row.selected == true) {
        this.selectedLeads.push(row);
      } else {
        const index = this.selectedLeads.findIndex((c) => c.id == row.id);
        if (index > -1) {
          this.selectedLeads[index].selected = false;
          this.selectedLeads.splice(index, 1);
        }
      }
    });
  }

  toggleRowSelection(row: InstituteLeadsVO) {
    row.selected = !row.selected;
    if (row.selected) {
      this.selectedLeads.push(row);
    } else {
      const index = this.selectedLeads.findIndex((c) => c.id === row.id);
      if (index > -1) {
        this.selectedLeads.splice(index, 1);
      }
    }
  }

  assignAllLeads() {
    let dialogRef = this.dialog.open(AssignLeadComponent, {
      width: '50%',
      data: {
        selectedLeads: this.selectedLeads,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.refresh(this.selectedStatus, this.page);
        dialogRef.close();
      }
    });
  }
  fetchStatusAndSubStatus() {
    this.loader
      .showLoader(this.crmService.fetchStatusAndSubStatus())
      .subscribe({
        next: (data) => {
          this.crmStatus = data;
          if (this.selectedStatus) this.statusChange(this.selectedStatus);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            'Error while fetching status and sub-status'
          );
        },
      });
  }
  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.crmService.getInstituteLeads(
                  this.page,
                  this.size,
                  this.selectedStatus,
                  this.selectedSubStatus,
                  this.leadtype,
                  this.assignedTo,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((data: any) => {
          this.instituteLeads = data.instituteLeads;
          this.totalCount = data.totalCount;
        });
      });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  openFacebookDialog() {
    this.router.navigate([], {
      queryParams: { type: '' },
      queryParamsHandling: 'merge',
    });
    const dialog = this.dialog.open(FacebookLeadsComponent, {
      panelClass: 'facebook-popup',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.event == 'refresh') {
        this.refresh(this.selectedStatus, this.page);
        this.selectedLeads = [];
      }
    });
  }

  deleteAllLeads() {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete these Leads?',
        'Yes, Delete'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          this.selectedLeads?.forEach((value: InstituteLeadsVO) => {
            this.leadIds.push(value.id);
          });
          this.loader
            .showLoader(this.crmService.deleteLeads(this.leadIds))
            .subscribe({
              next: (response: any) => {
                this.alertService.successAlert(response.message);
                this.selectAll = false;
                this.leadIds = [];
                this.selectedLeads = [];
                this.refresh(this.selectedStatus, this.page);
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting Leads!');
                this.leadIds = [];
              },
            });
        }
      });
  }

  deleteLead(lead: InstituteLeadsVO) {
    this.selectedLeads = [];
    this.leadIds = [];
    this.selectAll = false;
    this.instituteLeads?.forEach((value: InstituteLeadsVO) => {
      value.selected = false;
    });
    this.leadIds.push(lead.id);
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this Lead?',
        'Yes, Delete'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.crmService.deleteLeads(this.leadIds))
            .subscribe({
              next: (response: any) => {
                this.alertService.successAlert(response.message);
                this.selectAll = false;
                this.leadIds = [];
                this.selectedLeads = [];
                this.refresh(this.selectedStatus, this.page);
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting lead!');
                this.leadIds = [];
              },
            });
        }
      });
  }
}