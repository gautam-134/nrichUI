import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { AllUsers } from '../../../model/AllUsers';
import { AuthService } from '../../../services/auth.service';
import { MasterService } from '../../../services/master/master.service';

@Component({
  selector: 'app-all-students',
   
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.scss'
})
export class AllStudentsComponent implements OnInit, AfterViewInit, OnDestroy {
  students: AllUsers[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('studentSearch') studentSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private masterService: MasterService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      .showLoader(this.masterService.getAllStudents(page, this.size))
      .subscribe((data: any) => {
        this.students = data.students;
        this.totalCount = data.totalCount;
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
            this.masterService.getAllStudents(0, this.size, data.target.value)
          )
          .subscribe((data: any) => {
            this.students = data.students;
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

  enrolledCourses(id: number) {
    this.router.navigate([`/${AuthService.getModulePrefix}/student-details`], {
      queryParams: { id: id },
    });
  }
}