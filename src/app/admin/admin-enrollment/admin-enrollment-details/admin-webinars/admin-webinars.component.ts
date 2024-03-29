import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../../../loader.service';
import { ClassVO } from '../../../../model/classVO';
import { ClassService } from '../../../../services/Classes/class.service';

@Component({
  selector: 'app-admin-webinars',
   
  templateUrl: './admin-webinars.component.html',
  styleUrl: './admin-webinars.component.scss'
})
export class AdminWebinarsComponent implements OnInit {
  liveClasses!: ClassVO[];
  futureClasses!: ClassVO[];
  batchId!: number;
  totalCount!: number;
  totalCountOfFuture!: number;
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;
  instituteId: any;

  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    this.fetchLiveWebinars();
    this.fetchFutureWebinars(this.page);
    this.applyFilter();
  }
  fetchLiveWebinars() {
    this.classService
      .fetchAllLiveWebinars(
        this.size,
        this.page,
        this.searchParam,
        this.instituteId
      )
      .subscribe((res: any) => {
        this.liveClasses = res.liveWebinarsList;
        this.totalCount = res.total_count;
      });
  }

  fetchFutureWebinars(page: number) {
    this.classService
      .fetchAllFutureWebinars(
        this.size,
        page,
        this.searchParam,
        this.instituteId
      )
      .subscribe((res: any) => {
        this.futureClasses = res.futureWebinarsList;
        this.totalCountOfFuture = res.total_count;
      });
  }

  redirectToZoom(classScheduleId: number) {
    this.classService.redirectToZoom(classScheduleId);
  }
  joinClass(idClassSchedule: number) {
    this.redirectToZoom(idClassSchedule);
    return;
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.fetchFutureWebinars(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  changeFutureClassesPage(page: number) {
    this.page = page;
    this.fetchFutureWebinars(this.page);
  }

  changeFutureClassesSize(event: number) {
    this.size = event;
    this.fetchFutureWebinars(0);
  }
  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.classService.fetchAllFutureWebinars(
                  this.size,
                  this.page,
                  this.searchParam,
                  this.instituteId
                )
              )
            : of([])
        )
      )
      .subscribe((res) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.futureClasses = value?.futureWebinarsList;
        });
      });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
