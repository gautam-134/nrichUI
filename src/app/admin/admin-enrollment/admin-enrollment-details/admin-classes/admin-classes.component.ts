import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassVO } from '../../../../model/classVO';
import { AuthService } from '../../../../services/auth.service';
import { ClassService } from '../../../../services/Classes/class.service';
import { WatsappService } from '../../../../services/watsApp/watsapp.service';

@Component({
  selector: 'app-admin-classes',
   
  templateUrl: './admin-classes.component.html',
  styleUrl: './admin-classes.component.scss'
})
export class AdminClassesComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  FuturePage: number = 0;
  FutureSize: number = 5;
  liveClassesVO!: ClassVO[];
  futureClassesVO!: ClassVO[];
  FutureTotalCount!: number;
  batchId!: number;
  recordedClassesVO!: ClassVO[];
  totalCount!: number;
  instituteId: any;

      typeOfShorting:boolean=true;
    type: any;
  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router,
    private whatsapp: WatsappService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    this.refresh(this.page);
    this.fetchLiveClasses(this.page);
    this.fetchFutureClasses(this.FuturePage);
  }

  refresh(page: number) {
    this.classService
      .fetchRecordedClasses(
        this.batchId,
        this.size,
        page,
        this.instituteId
      )
      .subscribe((res: { classes: ClassVO[]; total_count: number }) => {
        this.recordedClassesVO = res.classes;
        this.totalCount = res.total_count;
      });
  }

  fetchLiveClasses(page: number) {
    this.classService
      .fetchLiveClassesOfBatch(
        this.batchId,
        this.size,
        page,
        this.instituteId
      )
      .subscribe((res: any) => {
        this.liveClassesVO = res.LiveClassesList;
      });
  }

  fetchFutureClasses(page: number) {
    this.classService
      .fetchFutureClassesOfBatch(
        this.batchId,
        this.FutureSize,
        page,
        this.instituteId
      )
      .subscribe((res: any) => {
        this.futureClassesVO = res.FutureClassesList;
        this.FutureTotalCount = res.total_count;
      });
  }

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

  joinClass(idClassSchedule: number) {
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

  showDetails(id:any){
    this.router.navigate([AuthService.getModulePrefix+"/class-details/",id]);
  }
  short(type:any){
    this.typeOfShorting=!this.typeOfShorting
    this.type = type;
  
  }
}

