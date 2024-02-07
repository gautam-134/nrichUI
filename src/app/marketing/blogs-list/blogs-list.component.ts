import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { BlogsVO } from 'src/app/model/BlogsVO';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [],
  templateUrl: './blogs-list.component.html',
  styleUrl: './blogs-list.component.scss'
})
export class BlogsListComponent implements OnInit {
  blogsList:BlogsVO[]=[];
  id!: Params;
  page: number = 0;
  size: number = 10;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  instituteId: any;
  constructor(private commonService:CommonService,private route: ActivatedRoute,private Loader:LoaderService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['instituteId']) {
        // this.id = params['id'];
        this.instituteId = params['instituteId'];
      }
      if (!this.instituteId) {
        this.refresh(this.page);
      } else {
        this.fetchInstituteBlogs(this.page);
      }
    });
     this.fetchInstituteBlogs(this.page);
  }
  refresh(page: number) {
    this.Loader.showLoader(
    this.commonService
      .fetchBlogsList(page, this.size, this.searchParam))
      .subscribe((res: any) => {
        this.blogsList = res.blogsList;
        this.totalCount = res.totalCount;
      });
  }

  nextPage($event: any, el: HTMLElement) {
    this.page = $event;
    if (this.instituteId) {
      this.fetchInstituteBlogs(this.page);
      return;
    } else {
      this.refresh(this.page);
    }
    el.scrollIntoView();
  }

  fetchInstituteBlogs(page:number){
    this.Loader.showLoader(
    this.commonService.fetchInstituteBlogs(page,this.size,this.instituteId,this.searchParam)).subscribe((res:any)=>{
    this.blogsList=res.blogsList;
    this.totalCount = res.totalCount;
     })
  }
}
