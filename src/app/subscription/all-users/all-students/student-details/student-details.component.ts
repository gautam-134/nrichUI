import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { AllUsers } from 'src/app/model/AllUsers';
import { MasterService } from 'src/app/services/master/master.service';

import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss'
})
export class StudentDetailsComponent implements OnInit {
  studentId!: number;
  details: AllUsers[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('studentSearch') studentSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private masterService: MasterService,
    private loader: LoaderService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.studentId = this.activatedRoute.snapshot.queryParams['id'];
    this.refresh(this.page);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.search();
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.masterService.getStudentDetails(this.studentId, page, this.size)
      )
      .subscribe({
        next: (data) => {
          this.details = data.studentDetails;
          this.totalCount = data.totalCount;
        },
      });
  }

  search() {
    this.searchSubscription = fromEvent(
      this.studentSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.masterService.getStudentDetails(
              this.studentId,
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.details = data.studentDetails;
            this.totalCount = data.totalCount;
          });
      });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  goBack() {
    this.location.back();
  }
}
