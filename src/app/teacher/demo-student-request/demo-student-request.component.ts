import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { DemoClassRequest } from '../../model/demoClassRequest';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { InstituteService } from '../../services/institute/institute.service';

@Component({
  selector: 'app-demo-student-request',
   
  templateUrl: './demo-student-request.component.html',
  styleUrl: './demo-student-request.component.scss'
})
export class DemoStudentRequestComponent implements OnInit {
  demoClassRequests: DemoClassRequest[] = [];
  selection = new SelectionModel<DemoClassRequest>(true, []);
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  subject = new Subject();
  result$!: Observable<any>;
  requestCount: number = 0;

  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page:number) {
    this.loader
      .showLoader(
        this.instituteService.fetchDemoClassRequests(
          JSON.parse(localStorage.getItem('auth') as string).user_id,
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe(
        (data: any) => {
          this.demoClassRequests = data.body.requestList;
          this.requestCount = data.body.requestCount;
        },
        (error: any) => {}
      );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.demoClassRequests.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.demoClassRequests.forEach((row: DemoClassRequest) =>
          this.selection.select(row)
        );
  }
  checkboxLabel(row?: DemoClassRequest, i?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      i + 1
    }`;
  }
  accept() {
    this.loader
      .showLoader(
        this.instituteService.changeDemoClassRequest({
          status: 'accepted',
          ids: this.selection.selected.map((obj: DemoClassRequest) => {
            return obj.id;
          }),
        })
      )
      .subscribe(
        (data: any) => {
          this.refresh(this.page);
          this.selection.clear();
          this.alertService.successAlert('Request status changed successfully');
        },
        (error: any) => {
          this.alertService.errorAlert('Something went wrong!');
          this.selection.clear();
        }
      );
  }
  reject() {
    this.loader
      .showLoader(
        this.instituteService.changeDemoClassRequest({
          status: 'rejected',
          ids: this.selection.selected.map((obj: DemoClassRequest) => {
            return obj.id;
          }),
        })
      )
      .subscribe(
        (data: any) => {
          this.refresh(this.page);
          this.selection.clear();
          this.alertService.successAlert('Request status changed successfully');
        },
        (error: any) => {
          this.alertService.errorAlert('Something went wrong!');
          this.selection.clear();
        }
      );
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== ''
            ? this.loader
            .showLoader(this.instituteService.fetchDemoClassRequests(
                JSON.parse(localStorage.getItem('auth') as string).user_id,
                this.page,
                this.size,
                this.searchParam
              ))
            : of([])
        )
      )
      .subscribe((response) => {
        this.result$ = response;
        this.result$.subscribe((data) => {
          this.demoClassRequests = data.body.requestList;
          this.requestCount = data.body.requestCount;
        });
      });
  }

  onTableDataChange() {
    this.page = this.page + 1;
    this.refresh(this.page);
  }
  previous() {
    this.page = this.page - 1;
    this.refresh(this.page);
  }
  onChange() {
    this.size;
    this.refresh(this.page);
  }

  pageChange(event: any) {
    this.page=event;
    this.refresh(this.page);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

}

