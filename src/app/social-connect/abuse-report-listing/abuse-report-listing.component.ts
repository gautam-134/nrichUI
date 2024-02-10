import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../loader.service';
import { SocialApiService } from '../social-api.service';
import { ApiResponse } from '../../model/ApiResponse';
import { PostReport } from '../../model/PostReportVO';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-abuse-report-listing',
   
  templateUrl: './abuse-report-listing.component.html',
  styleUrl: './abuse-report-listing.component.scss'
})
export class AbuseReportListingComponent implements OnInit {
  abuseReport: PostReport[]=[];
  page: number = 0;
  size: number = 5;
  totalCount: number = 0;
  typeOfShorting: boolean = true;
  type: any;
  reportsType:string="Pending";
  constructor(  private socialConnectService: SocialApiService,
    private loader: LoaderService,private router:Router) { }

  ngOnInit(): void {
    this.fetchAbusedReportedPostRecord(this.page);
  }
  fetchAbusedReportedPostRecord(page:number) {
    this.loader.showLoader(this.socialConnectService.fetchAbusedReportedPostRecord(page,this.size,this.reportsType)).subscribe({
      next: (data: ApiResponse) => {
        this.abuseReport = data.body?.abuseReports;
        this.totalCount = data.body?.abuseReportsCount;
      },
    });
  }
  changeSize(size: number) {
    this.size = size;
    this.page=0;
    this.fetchAbusedReportedPostRecord(this.page);
  }

  pageChange(page: number) {
    this.page = page;
    this.fetchAbusedReportedPostRecord(this.page);
  }

  switchTab(tab: string) {
    this.reportsType = (tab === "home") ? "Pending" : "";
    this.page = 0;
    this.size = 5;
    this.fetchAbusedReportedPostRecord(0);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  viewReportedBy(id:number){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/abused-reported-by`], {
      queryParams: { postId: id },
    });
  }

  viewPost(postId:number){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/view-post`], {
      queryParams: { postId: postId },
    });
  }

  openProfile(id:number){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/profile`], {
      queryParams: { id: id },
    });
  }
}