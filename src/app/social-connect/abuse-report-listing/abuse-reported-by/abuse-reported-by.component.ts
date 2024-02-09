import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { SocialApiService } from '../../social-api.service';
import { ReportAbuseVO } from 'src/app/model/ReportAbuseVO';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-abuse-reported-by',
  standalone: true,
  imports: [],
  templateUrl: './abuse-reported-by.component.html',
  styleUrl: './abuse-reported-by.component.scss'
})
export class AbuseReportedByComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount: number = 0;
  typeOfShorting: boolean = true;
  type: any;
  abuseReportVO: ReportAbuseVO[]=[];
  postId!: number;
  constructor(  private socialConnectService: SocialApiService,
    private loader: LoaderService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.postId = +this.route.snapshot.queryParams?.['postId'];
    this.fetchAbusedReportedPostRecord(this.page);
  }
  fetchAbusedReportedPostRecord(page:number) {
    this.loader.showLoader(this.socialConnectService.fetchAllAbusedReportsOfPost(this.postId,page, this.size)).subscribe({
      next: (data: ApiResponse) => {
        this.abuseReportVO = data.body?.abuseReports;
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

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  openProfile(id:number){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/profile`], {
      queryParams: { id: id },
    });
  }

  viewPost(){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/view-post`], {
      queryParams: { postId: this.postId },
    });
  }

}
