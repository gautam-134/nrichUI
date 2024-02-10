import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { assignmentVO } from '../../model/assignmentVO';
import { ClassVO } from '../../model/classVO';

@Component({
  selector: 'app-student-dashboard-info',
   
  templateUrl: './student-dashboard-info.component.html',
  styleUrl: './student-dashboard-info.component.scss'
})
export class StudentDashboardInfoComponent implements OnInit {
  courseId!: number;
  batchId!: number;
  totalCount!: number;
  FutureTotalCount!: number;
  page: number = 0;
  size: number = 5;
  Livepage: number = 0;
  Livesize: number = 5;
  searchParam: string = '';
  subject = new Subject();
  result$!: Observable<any>;
  assignments!: assignmentVO[];
  liveClassesVO!: ClassVO[];
  futureClassesVO!: ClassVO[];
  recordedClassesVO!: ClassVO[];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
  }
}

