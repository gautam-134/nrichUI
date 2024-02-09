import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { TeacherFullDetailsVO } from 'src/app/model/TeacherFullDetailsVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [],
  templateUrl: './teacher-management.component.html',
  styleUrl: './teacher-management.component.scss'
})
export class TeacherManagementComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  teacherList!: TeacherFullDetailsVO[];
  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private teacherService: TeacherService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.teacherService.fetchAllTeachersList(
          this.size,
          page,
          this.searchParam
        )
      )
      .subscribe((res: any) => {
        this.teacherList = res.TeacherList;
        this.totalCount = res.total_count;
      });
  }

  changePage(page: number) {
    this.page = page;
    this.refresh(this.page);
  }

  changeSize(event: number) {
    this.size = event;
    this.refresh(0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter(page: any) {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.teacherService.fetchAllTeachersList(
                  this.size,
                  page,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.teacherList = value.TeacherList;
          this.totalCount = value.total_count;
        });
      });
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.teacherService.updateDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {
          // this.displayOrder.nativeElement.focusout();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  featured(element: any, event: any) {
    this.teacherService
      .updateTeacherFeaturedFlag(element.id_teacher)
      .subscribe({
        next: (data: any) => {},
        error: (error: HttpErrorResponse) => {
          element.featured = !event.target.checked;
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  short(type: any, event?: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}export class TeacherManagementComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  teacherList!: TeacherFullDetailsVO[];
  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private teacherService: TeacherService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.teacherService.fetchAllTeachersList(
          this.size,
          page,
          this.searchParam
        )
      )
      .subscribe((res: any) => {
        this.teacherList = res.TeacherList;
        this.totalCount = res.total_count;
      });
  }

  changePage(page: number) {
    this.page = page;
    this.refresh(this.page);
  }

  changeSize(event: number) {
    this.size = event;
    this.refresh(0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter(page: any) {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.teacherService.fetchAllTeachersList(
                  this.size,
                  page,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.teacherList = value.TeacherList;
          this.totalCount = value.total_count;
        });
      });
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.teacherService.updateDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {
          // this.displayOrder.nativeElement.focusout();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  featured(element: any, event: any) {
    this.teacherService
      .updateTeacherFeaturedFlag(element.id_teacher)
      .subscribe({
        next: (data: any) => {},
        error: (error: HttpErrorResponse) => {
          element.featured = !event.target.checked;
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  short(type: any, event?: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
