import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassVO } from 'src/app/model/classVO';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/Classes/class.service';

@Component({
  selector: 'app-student-all-classes',
  standalone: true,
  imports: [],
  templateUrl: './student-all-classes.component.html',
  styleUrl: './student-all-classes.component.scss'
})
export class StudentAllClassesComponent implements OnInit {
  // @Input() liveClasses!: ClassVO[];
  // @Input() futureClasses!: ClassVO[];
  page: number = 0;
  size: number = 5;
  FuturePage: number = 0;
  FutureSize: number = 5;
  liveClassesVO!: ClassVO[];
  futureClassesVO!: ClassVO[];
  batchId!: number;
  recordedClassesVO!: ClassVO[];
  totalCount!: number;
  FutureTotalCount!: number;
  instituteId: any;
  moduleRole: any;
  typeOfShorting: boolean = true;
  type: any;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    this.fetchLiveClasses();
    this.fetchFutureClasses(this.FuturePage);
    this.refresh(this.page);
    this.moduleRole = AuthService.getModulePrefix;
  }

  refresh(page: number) {
    this.classService
      .fetchRecordedClasses(this.batchId, this.size, page, this.instituteId)
      .subscribe((res) => {
        this.recordedClassesVO = res?.classes;
        this.totalCount = res?.total_count;
      });
  }

  fetchLiveClasses() {
    this.classService
      .fetchLiveClassesOfBatch(
        this.batchId,
        this.size,
        this.page,
        this.instituteId
      )
      .subscribe((res: any) => {
        this.liveClassesVO = res?.LiveClassesList;
      });
  }

  fetchFutureClasses(FuturePage: number) {
    this.classService
      .fetchFutureClassesOfBatch(
        this.batchId,
        this.FutureSize,
        FuturePage,
        this.instituteId
      )
      .subscribe((res: any) => {
        this.futureClassesVO = res?.FutureClassesList;
        this.FutureTotalCount = res?.total_count;
      });
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

  redirectToZoom(classScheduleId: number) {
    this.classService.redirectToZoom(classScheduleId);
  }

  joinClass(idClassSchedule: any) {
      this.redirectToZoom(idClassSchedule);
  }

  showDetails(id: any) {
    this.router.navigate([
      AuthService.getModulePrefix + '/class-details/' + id,
    ]);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}

