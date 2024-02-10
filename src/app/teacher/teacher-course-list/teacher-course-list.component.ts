import { Component, OnInit } from '@angular/core';
import { InstituteService } from '../../services/institute/institute.service';

@Component({
  selector: 'app-teacher-course-list',
   
  templateUrl: './teacher-course-list.component.html',
  styleUrl: './teacher-course-list.component.scss'
})
export class TeacherCourseListComponent implements OnInit {
  res: any;
  typeOfShorting:boolean=true;
  type: any;
    constructor(private instituteService: InstituteService) { }
  
    ngOnInit(): void {
    this.instituteService.fetchCourseReqList()
      .subscribe((res:any) => {
        this.res = res;
      });
    }
  
    short(type:any){
      this.typeOfShorting=!this.typeOfShorting
      this.type = type;
    
    }
  
  }
