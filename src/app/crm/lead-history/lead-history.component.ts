import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../loader.service';
import { crmLeadComments, CrmLeadTrackerVO } from '../../model/CrmLeadTrackerVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CRMService } from '../../services/CRM/crm.service';

@Component({
  selector: 'app-lead-history',
   
  templateUrl: './lead-history.component.html',
  styleUrl: './lead-history.component.scss'
})
export class LeadHistoryComponent implements OnInit {
  leadId!: number;
  leadTracker: CrmLeadTrackerVO[] = [];
  openCommentFeild: boolean = false;
  crmCommentVO!: crmLeadComments;
  currentOpenCommentBox: any;
  page: number = 0;
  size: number = 3;
  totalLeadTrackers: number = 0;
  @ViewChild('inputComment') inputComment!: ElementRef;
  disableSendButton: boolean = false;
  @ViewChild('myDiv')
  myDiv!: ElementRef;
  constructor(private crmService: CRMService, private activatedRoute: ActivatedRoute, private loaderService: LoaderService, private alertService: SwalAlertService) { }

  ngOnInit(): void {
    this.leadId = this.activatedRoute.snapshot.queryParams['leadId'];
    this.fetchLeadHistory(this.page, false);

  }
  fetchLeadHistory(page: number, flag: boolean) {
    this.crmService.fetchHistoryOfLead(this.leadId, page, this.size).subscribe({
      next: (res: any) => {
      
        if (flag == true) {
          this.leadTracker = this.leadTracker.concat(res.leadHistory);
        } else {
          this.leadTracker = res.leadHistory;
        }
        this.totalLeadTrackers = res.totalCount;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(error.error.message);
      }
    })
  }

  sendComment(leadTrackerId: any, message: string) {
    if (message.trim() == '') {
      return;
    }
    this.crmCommentVO = {
      comment: message,
      leadTrackerId: leadTrackerId,
    }
    this.loaderService.showLoader(this.crmService.addCommentToLead(this.crmCommentVO)).subscribe({
      next: (res: any) => {
        this.inputComment.nativeElement.value = '';
        this.fetchLeadTrackerComments(leadTrackerId);
      }, error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(error.error.message);
      }
    })

  }

  fetchLeadTrackerComments(leadTrackerId: any){
    this.crmService.fetchLeadTrackerComments(leadTrackerId).subscribe({
      next: (res: any) => {
        this.leadTracker.forEach((leadTrackerVO:CrmLeadTrackerVO) => {
          if (leadTrackerVO.id == leadTrackerId) leadTrackerVO.crmLeadComments=res;
          this.inputComment.nativeElement.value = '';
        });
      }, error: (error: HttpErrorResponse) => {
      }
    })


  }

  showCommentBox(recordId: any) {
    this.currentOpenCommentBox = recordId;
    this.openCommentFeild = true;
    let ele = document.getElementById(recordId);
     ele?.scrollIntoView({behavior:"smooth" , block: 'end', inline: 'nearest'});
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop+20 >=
      event.target.scrollHeight
    ) {

      if (this.leadTracker.length != this.totalLeadTrackers) {
       
        this.page += 1;
        this.fetchLeadHistory(this.page, true);
      }
    }
  }
  emptyTextCheck(event: any, value: any) {
    if (event.which === 32 && !value.length)
      event.preventDefault();
    if (value) {
      this.disableSendButton = true;
    } else {
      this.disableSendButton = false;
    }
  }
}
