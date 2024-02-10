import {
  Component, OnInit
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { CommonModule } from '@angular/common';
import { BlogsVO } from '../../../model/BlogsVO';
import { CommonService } from '../../../services/common/common.service';
import { RouterModule } from '@angular/router';
import { CommonModule2 } from "../../../common/common.module";
import { TeacherRegistrationComponent } from '../../../marketing/shared/teacher-registration/teacher-registration.component';

@Component({
    selector: 'app-blog-info',
    standalone: true,
    templateUrl: './blog-info.component.html',
    styleUrl: './blog-info.component.scss',
    imports: [CommonModule, RouterModule, CommonModule2, TeacherRegistrationComponent]
})
export class BlogInfoComponent implements OnInit {
  Id: any;
  blogDetails!: BlogsVO;
  blogsList: BlogsVO[] = [];
  instituteId: any;
  page: number = 0;
  size: number = 9;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  isSearch: boolean = false;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private Loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.Id = params['id'];
      this.instituteId = params['instituteId'];
      this.Loader.showLoader(
        this.commonService.fetchBlogDetails(this.Id)
      ).subscribe((res: any) => {
        this.blogDetails = res.body;
        if (!this.instituteId) {
          this.refresh(this.page);
        } else {
          this.fetchInstituteBlogs(this.page);
        }
      });
    });
  }

  refresh(page: number) {
    this.Loader.showLoader(
    this.commonService
      .fetchBlogsList(page, this.size, this.searchParam))
      .subscribe((res: any) => {
        res.blogsList.forEach((value: BlogsVO, index: any) => {
          if (value.idBlog == this.blogDetails.idBlog)
            res.blogsList.splice(index, 1);
        });
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
  fetchInstituteBlogs(page: number) {
    this.Loader.showLoader(
    this.commonService
      .fetchInstituteBlogs(page, this.size, this.instituteId, this.searchParam))
      .subscribe((res: any) => {
        res.blogsList.forEach((value: BlogsVO, index: any) => {
          if (value.idBlog == this.blogDetails.idBlog)
            res.blogsList.splice(index, 1);
            this.page=0;
        });
        this.blogsList = res.blogsList;
        this.totalCount = res.totalCount;
      });
  }
}