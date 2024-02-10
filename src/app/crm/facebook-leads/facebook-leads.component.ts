import {
  FacebookLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { CRMService } from '../../services/CRM/crm.service';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { FacebookLeadsService } from '../../services/facebook-leads.service';

@Component({
  selector: 'app-facebook-leads',
   
  templateUrl: './facebook-leads.component.html',
  styleUrl: './facebook-leads.component.scss'
})
export class FacebookLeadsComponent implements OnInit, OnDestroy {
  user!: FacebookUser;
  loading: boolean = false;
  subLoading: boolean = false;
  myPages: FacebookPages[] = [];
  adds: FacebookForm[] = [];
  leads: FacebookLeadData[] = [];
  formId: string | undefined;
  startDate: Date | undefined;
  endDate!: Date | undefined;
  response: { success: number; failed: number } | undefined;
  @ViewChild('searchPages') searchPages!: ElementRef;
  facebookLoginSubscription!: Subscription;
  constructor(
    private authService: SocialAuthService,
    private facebookService: FacebookLeadsService,
    private crmService: CRMService,
    private dialogRef: MatDialogRef<FacebookLeadsComponent>,
    private alertService:SwalAlertService
  ) {}
  ngOnDestroy(): void {
    if (this.facebookLoginSubscription)
      this.facebookLoginSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.facebookLoginSubscription = this.authService.authState.subscribe({
      next: (data: FacebookUser) => {
        this.loading = false;
        this.user = data;
        if (this.user) this.fetchMyPages();
      },
      error: (error: any) => {
        this.alertService.okErrorAlert("Something went wrong !!")
        this.loading = false;
      },
    });
  }

  signInWithFacebook() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID,{
      scope: 'email,pages_show_list,pages_read_engagement,pages_manage_ads,leads_retrieval'
    });
  }

  fetchMyPages(next?: string) {
    this.adds = [];
    this.subLoading = true;
    this.facebookService
      .fetchPages(this.user.id, this.user.authToken, next)
      .subscribe({
        next: (data: FacebookPagesResponse) => {
          this.myPages.push(...data.data);
          if (data.paging && data.paging.cursors && data.paging.cursors.after) {
            this.fetchMyPages(data.paging.cursors.after);
          }
          this.subLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert("Something went wrong while fetching pages !!")
          this.subLoading = false;
        },
      });
  }

  signOut(): void {
    this.authService.signOut();
  }

  fetchAds(event: any) {
    this.adds = [];
    this.fetchAdsForms(event?.value?.id, event?.value?.access_token);
    if (this.formId) this.formId = undefined;
    if (this.startDate) this.startDate = undefined;
    if (this.endDate) this.endDate = undefined;
    if (this.response) this.response = undefined;
  }

  fetchAdsForms(id: string, access_token: string, next?: string) {
    this.subLoading = true;
    this.facebookService.fetchForms(id, access_token, next).subscribe({
      next: (data: FacebookFormResponse) => {
        this.adds.push(...data.data);
        if (data.paging && data.paging && data.paging.next)
          this.fetchAllPaginatedAdds(data.paging.next);
        else this.subLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert("Something went wrong while fetching ads !!")
        this.subLoading = false;
      },
    });
  }

  fetchAllPaginatedAdds(url: string) {
    this.facebookService.fetchFormThroughUrl(url).subscribe({
      next: (data: FacebookFormResponse) => {
        this.adds.push(...data.data);
        if (data.paging && data.paging && data.paging.next)
          this.fetchAllPaginatedAdds(data.paging.next);
        else this.subLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert("Something went wrong while fetching ads !!")
        this.subLoading = false;
      },
    });
  }

  fetchLeads(event: any) {
    this.formId = event.value.id;
    if (this.startDate) this.startDate = undefined;
    if (this.endDate) this.endDate = undefined;
    if (this.response) this.response = undefined;
  }

  onDateSelection() {
    if (this.response) this.response = undefined;
    if (!this.endDate) return;
    this.subLoading = true;
    this.leads = [];
    this.facebookService
      .fetchLeads(
        this.user.authToken,
        this.formId,
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (data: FacebookLeadResponse) => {
          this.leads.push(...data.data);
          if (data.paging && data.paging.next)
            this.fetchAllPaginatedLeads(data.paging.next);
          else this.subLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert("Something went wrong while fetching leads !!")
          this.subLoading = false;
        },
      });
  }

  fetchAllPaginatedLeads(url: string) {
    this.facebookService.fetchAllPaginatedLeads(url).subscribe({
      next: (data: FacebookLeadResponse) => {
        this.leads.push(...data.data);
        if (data.paging && data.paging.next)
          this.fetchAllPaginatedLeads(data.paging.next);
        else this.subLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert("Something went wrong while fetching ads !!")
        this.subLoading = false;
      },
    });
  }

  importLeads() {
    this.response = undefined;
    this.subLoading = true;
    this.crmService.saveFacebookLeads(this.leads).subscribe({
      next: (data: ApiResponse) => {
        this.subLoading = false;
        this.response = data.body;
      },
      error: (error: HttpErrorResponse) => {
        this.subLoading = false;
        this.alertService.okErrorAlert(error.error.messsage)
      },
    });
  }

  closeDialog(){
    this.dialogRef.close({event:this.response && this.response.success!=0 ? 'refresh':'cancel'});
  }
}

export interface FacebookUser {
  authToken: string;
  email?: string;
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl?: string;
  provider: string;
  response: any;
}

export interface FacebookPages {
  access_token: string;
  id: string;
  name: string;
}

export interface FacebookPagesResponse {
  data: FacebookPages[];
  paging: Paging;
}

export interface Paging {
  cursors: {
    after: string;
    before: string;
  };
  next: string;
}

export interface FacebookForm {
  id: string;
  locale: string;
  name: string;
  status: string;
}

export interface FacebookFormResponse {
  data: FacebookForm[];
  paging: Paging;
}

export interface FacebookLeadData {
  created_time: Date;
  field_date: { name: string; values: string[] }[];
  id: string;
}

export interface FacebookLeadResponse {
  data: FacebookLeadData[];
  paging: Paging;
}
