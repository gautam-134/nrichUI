import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { CrmStatus, CrmSubStatus } from '../../model/CrmStatusAndSubStatus';
import { InstituteLeadsVO } from '../../model/InstituteLeadsVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CRMService } from '../../services/CRM/crm.service';

@Component({
  selector: 'app-follow-up-listing',
   
  templateUrl: './follow-up-listing.component.html',
  styleUrl: './follow-up-listing.component.scss'
})
export class FollowUpListingComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  subject = new Subject<string>();
  searchParam: string = '';
  totalCount!: number;
  typeOfShorting: boolean = true;
  type: any;
  result$!: Observable<any>;
  instituteLeads: InstituteLeadsVO[] = [];
  filterType: string="";
  selectedStatus: string = '';
  selectedSubStatus: string = '';
  crmStatus: CrmStatus[] = [];
  crmSubStatus: CrmSubStatus[] = [];
  constructor(private crmService: CRMService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private router:Router) { }

  ngOnInit(): void {
    this.fetchStatusAndSubStatus();
    this.fetchFollowUpLeads(this.page);
    this.applyFilter();
  }
  fetchFollowUpLeads(page: number) {
    this.loader
      .showLoader(
        this.crmService.getInstituteFollowUpLeads(page, this.size, this.selectedStatus,
          this.selectedSubStatus,this.filterType,this.searchParam)
      )
      .subscribe({
        next: (data) => {
          this.instituteLeads = data.instituteLeads;
          this.totalCount = data.totalCount;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching leads');
        },
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

  statusChange(event: any) {
    const index = this.crmStatus.findIndex((status) => status.status == event);
    this.crmSubStatus = this.crmStatus[index]?.crmSubStatus;
  }
  search(evt: any) {
    if (evt.target.value == '') {
      this.fetchFollowUpLeads(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.crmService.getInstituteFollowUpLeads(
                  this.page,
                  this.size,this.selectedStatus,
                  this.selectedSubStatus,
                  this.filterType,
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

  pageChange(event: any) {
    this.fetchFollowUpLeads(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.fetchFollowUpLeads(0);
  }

  onFilterChange(event:any){
    this.filterType = event.target.value;
    this.fetchFollowUpLeads(0);

  }

  onStatusChange(event: any) {
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
    this.fetchFollowUpLeads(this.page);
  }

  onSubStatusChange(event: any) {
    this.selectedSubStatus = event.target.value;
    this.fetchFollowUpLeads(this.page);
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
}