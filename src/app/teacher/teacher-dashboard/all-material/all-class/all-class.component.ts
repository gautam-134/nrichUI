import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassVO } from '../../../../model/classVO';
import { AuthService } from '../../../../services/auth.service';
import { ClassService } from '../../../../services/Classes/class.service';
import { WatsappService } from '../../../../services/watsApp/watsapp.service';

@Component({
  selector: 'app-all-class',
   
  templateUrl: './all-class.component.html',
  styleUrl: './all-class.component.scss'
})
export class AllClassComponent implements OnInit {
  @Input() liveClasses!: ClassVO[];
  @Input() futureClasses!: ClassVO[];
  instituteId: any;
  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router,
    private whatsapp: WatsappService,
    public authService: AuthService
  ) {}
  page: number = 0;
  size: number = 5;
  FuturePage: number = 0;
  FutureSize: number = 5;
  liveClassesVO!: ClassVO[];
  futureClassesVO!: ClassVO[];
  FutureTotalCount!:number;
  batchId!: number;
  recordedClassesVO!: ClassVO[];
  totalCount!: number;
  typeOfShorting:boolean=true;
  type: any;
  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.instituteId=JSON.parse(localStorage.getItem('auth') as string).selectedInstitute;
    this.refresh(this.page);
    this.fetchLiveClasses();
    this.fetchFutureClasses(this.FuturePage);
  }

  refresh(page:number) {
    this.classService
      .fetchRecordedClasses(this.batchId, this.size,page,this.instituteId)
      .subscribe((res) => {
        this.recordedClassesVO = res.classes;
        this.totalCount = res.total_count;
      });
  }
  
  fetchLiveClasses() {
    this.classService.fetchLiveClassesOfBatch(this.batchId,this.size,this.page,this.instituteId).subscribe((res:any) => {
      this.liveClassesVO = res.LiveClassesList;
      this.totalCount = res.total_count;
    });
  }

  fetchFutureClasses(FuturePage:number){  
     this.classService.fetchFutureClassesOfBatch(this.batchId,this.FutureSize,FuturePage,this.instituteId).subscribe((res: any) => {
    this.futureClassesVO = res.FutureClassesList;
    this.FutureTotalCount = res.total_count;
  });}


  redirectToBlueJeans(classScheduleId: number) {
    // const path: string = 'https://bluejeans.com/' + meetingId + '/' + passcode;
    // window.open(path, '_blank');
    this.whatsapp.changeButtonVisibility(false);
    this.router.navigate(['/meeting/join-meeting'], {
      queryParams: {
        classId: classScheduleId,
      },
    });
  }

  joinClass(idClassSchedule: any) {
    this.classService.redirectToZoom(idClassSchedule)
  }

  changeFutureClassesPage(page: number) {
    this.FuturePage = page;
    this.fetchFutureClasses(this.FuturePage);
  }

  changeFutureClassesSize(event: number) {
    this.FutureSize = event;
    this.fetchFutureClasses(0);
  }

  changeRecordedClassesPage(page: number) {
    this.page = page;
    this.refresh(this.page);
  }

  changeRecordedClassesSize(size: number) {
    this.size = size;
    this.refresh(0);
  }

  short(type:any){
    this.typeOfShorting=!this.typeOfShorting
    this.type = type;
  
  }
  
}
