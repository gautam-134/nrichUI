import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { MobileCourseVO } from 'src/app/model/MobileCourseVO';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
  teacherCourses: MobileCourseVO[] = [];
  config!: number;
  pageNumber: number = 0;
  size: number = 8;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  instituteId: any;
  constructor(private teacherService: TeacherService,private loader: LoaderService) {}

  ngOnInit(): void {
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
   this.refresh(this.pageNumber);
   this.applyFilter();
  }

  refresh(page:any){
    this.loader
    .showLoader(
    this.teacherService.fetchTeacherCoursesWithPagination(this.instituteId,
      page,
      this.size,
      this.searchParam)).subscribe((data: any) => {
      this.teacherCourses = data.body.courses;
      this.config = data.body.total_count;
    });
  }
  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.pageNumber);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  nextPage($event: any) {
    this.pageNumber = $event;
    window.scrollTo(0, 0)
    this.refresh(this.pageNumber);
  }


  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
              this.teacherService.fetchTeacherCoursesWithPagination(
                  JSON.parse(localStorage.getItem('auth') as string)
                    .selectedInstitute,
                    this.pageNumber,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.teacherCourses = value.body.courses;
          this.config = value.body.total_count;
        });
      });
  }
  
}
