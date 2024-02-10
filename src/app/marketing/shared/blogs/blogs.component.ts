import { Component, OnInit } from '@angular/core';
import { BlogsVO } from '../../../model/BlogsVO';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  searchParam: string = '';
  blogsList:BlogsVO[]=[];
  constructor(private commonService:CommonService) { }

  ngOnInit(): void {
    this.commonService.fetchBlogsList(this.page, this.size).subscribe((res:any)=>{
     this.blogsList = res.blogsList;
        this.totalCount = res.totalCount;
    })

  }

}
