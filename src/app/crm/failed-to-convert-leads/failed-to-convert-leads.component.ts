import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, debounceTime, map, of } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { InstituteLeadsVO } from '../../model/InstituteLeadsVO';
import { CRMService } from '../../services/CRM/crm.service';
import { SwalAlertService } from '../../services/alert/swal-alert.service';

@Component({
  selector: 'app-failed-to-convert-leads',
   
  templateUrl: './failed-to-convert-leads.component.html',
  styleUrl: './failed-to-convert-leads.component.scss'
})
export class FailedToConvertLeadsComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  subject = new Subject<string>();
  searchParam: string = '';
  totalCount!: number;
  instituteLeads: InstituteLeadsVO[] = [];
  typeOfShorting: boolean = true;
  selectedStatus: string = 'Failed';
  selectedSubStatus: string = 'Incomplete';
  type:string=''
  constructor(
    public dialog: MatDialog,
    private loader: LoaderService,
    private crmService: CRMService,
    private alertService: SwalAlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh(this.selectedStatus, this.page);
    this.applyFilter();
  }

  refresh(status: string, page: number) {
    this.loader
      .showLoader(
        this.crmService.getInstituteLeads(
          page,
          this.size,
          status,
          this.selectedSubStatus,
          '',
          this.searchParam
        )
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

  editLead(leadId: number) {
    this.router.navigate(['/crm/editLead'], {
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
                  '',
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        res.subscribe((data: any) => {
          this.instituteLeads = data.instituteLeads;
          this.totalCount = data.totalCount;
        });
      });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
