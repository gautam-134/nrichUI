import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { MappingPageComponent } from '../../common/mapping-page/mapping-page.component';
import { LoaderService } from '../../loader.service';

import { assignmentVO } from '../../model/assignmentVO';
import { MappingType } from '../../model/MappingType';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AssignmentService } from '../../services/assignment/assignment.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-assignment',
   
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent implements OnInit {
  assignments!: assignmentVO[];
  searchParam: string = '';
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  subject = new Subject<string>();
  result$!: Observable<any>;

  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private dialog: MatDialog,
    private assignmentService: AssignmentService,
    private loader: LoaderService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.getAssignments(this.page);
    this.applyFilter();
  }
  getAssignments(page:number) {
    this.loader
      .showLoader(
        this.assignmentService.getAssignments(
          this.size,
          page,
          this.searchParam
        )
      )
      .subscribe((res: any) => {
        this.assignments = res.body.assignmentVO;
        this.totalCount = res.body.total_count;
      });
  }
  addassignment() {
    var instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    let dialogRef = this.dialog.open(AddAssignmentComponent, {
      height: '90%',
      width: '70%',
      data: {
        isEdit: false,
        instituteId: instituteId,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        this.getAssignments(0);
        dialogRef.close();
      }
    });
  }

  editAssignment(element: assignmentVO) {
    var instituteId = JSON.parse(
      localStorage.getItem('auth') as string
    ).selectedInstitute;
    let dialogRef = this.dialog.open(AddAssignmentComponent, {
      height: '90%',
      width: '70%',
      data: {
        body: element,
        isEdit: true,
        instituteId: instituteId,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        this.getAssignments(0);
        dialogRef.close();
      }
    });
  }
  assignmentSubmitBy(element: assignmentVO) {
    this.router.navigate([
      AuthService.getModulePrefix + '/submit-by',
      element.id,
    ]);
  }
  search(evt: any) {
    if (evt.target.value == '') {
      this.getAssignments(0);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  assignmentMapping(id: number) {
    this.dialog.open(MappingPageComponent, {
      data: {
        id: id,
        mappingType: MappingType.ASSIGNMENT,
      },
      width: '100%',
      height: '99%',
    });
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.assignmentService.getAssignments(
                  this.size,
                  this.page,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.assignments = value?.body.assignmentVO;
          this.totalCount = value?.body.total_count;
        });
      });
  }

  changeSize(size: number) {
    this.size = size;
    this.page=0;
    this.getAssignments(this.page);
  }

  pageChange(page: number) {
    this.page = page;
    this.getAssignments(this.page);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  deleteAssignment(assignmentId: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        `Do you want to delete the assignment ?` +
        '</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: `Delete Assignment'}`,
      confirmButtonColor: '#FF635F',
      confirmButtonText: `Delete Assignment`,
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.assignmentService.deleteAssignment(assignmentId))
          .subscribe({
            next: (data: any) => {
              this.alertService.successAlert(data?.message);
              this.getAssignments(this.page);
            },
            error: (error: HttpErrorResponse) => {
              this.alertService.errorAlert(error.error.message);
            },
          });
      }
    });
  }

  downloadAssignmentReport(assignmentId: any) {
    this.loader
      .showLoader(this.assignmentService.downloadAssignmentReport(assignmentId))
      .subscribe({
        next: (data: any) => {
          const blob = new Blob([data], { type: data.type });
          saveAs(blob,"assignment.xlsx")
        },
        error: (error: any) => {
          this.alertService.errorAlert(error);
        },
      });
  }
}