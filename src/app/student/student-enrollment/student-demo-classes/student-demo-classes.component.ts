import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { ClassVO } from '../../../model/classVO';
import { ClassService } from '../../../services/Classes/class.service';

@Component({
  selector: 'app-student-demo-classes',
   
  templateUrl: './student-demo-classes.component.html',
  styleUrl: './student-demo-classes.component.scss'
})
export class StudentDemoClassesComponent implements OnInit {

  liveClasses: ClassVO[]=[];
  futureClasses: ClassVO[]=[];
  batchId!: number;
  totalCount!:number;
  totalCountOfFuture!:number;
  page: number = 0;
  size: number = 10;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;
  instituteId: any;
 
      typeOfShorting:boolean=true;
    type: any;
  constructor( private route: ActivatedRoute,
    private classService: ClassService,private loader:LoaderService) { }

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.instituteId=JSON.parse(localStorage.getItem('auth') as string).selectedInstitute;
    this.fetchLiveDemoClasses();
    this.fetchFutureDemoClasses(this.page);
    this.applyFilter();
  }
  fetchLiveDemoClasses() {
    this.classService.fetchStudentLiveDemoClasses(this.size,
      this.page,
      this.searchParam,this.instituteId).subscribe((res: any) => {
      this.liveClasses = res?.liveDemoClassList;
      this.totalCount = res?.total_count;
    });
  }

  fetchFutureDemoClasses(page:any){
    this.classService.fetchStudentFutureDemoClasses( this.size,
      page,
      this.searchParam,this.instituteId).subscribe((res:any) => {
      this.futureClasses = res?.futureDemoClassesList;
      this.totalCountOfFuture = res?.total_count;
    });

  }

  joinClass(idClassSchedule: number) {
    this.classService.redirectToZoom(idClassSchedule)
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.fetchFutureDemoClasses(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

 
  changeFutureClassesPage(page: number) {
    this.page = page;
    this.fetchFutureDemoClasses(this.page);
  }

  changeFutureClassesSize(event: number) {
    this.size = event;
    this.fetchFutureDemoClasses(0);
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
              this.classService.fetchStudentFutureDemoClasses(this.size,
                this.page,
                this.searchParam,this.instituteId)
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.futureClasses = value?.futureDemoClassesList;
        });
      });
  }

  short(type:any){
    this.typeOfShorting=!this.typeOfShorting
    this.type = type;
  
  }
}
