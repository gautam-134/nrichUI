import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { MappingType } from '../../../model/MappingType';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { InstituteService } from '../../../services/institute/institute.service';
import { StudentService } from '../../../services/student/student.service';
import Swal from 'sweetalert2';
import { UserFormVO } from '../../add-user/add-user.component';
import { MappingPageComponent } from '../../mapping-page/mapping-page.component';

@Component({
  selector: 'app-student-listing',
   
  templateUrl: './student-listing.component.html',
  styleUrl: './student-listing.component.scss'
})
export class StudentListingComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalStudents = 0;
  subject = new Subject();
  result$!: Observable<any>;
  students: UserFormVO[] = [];
  searchParam: string = '';
  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private alertService: SwalAlertService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.fetchInstituteUsers(
          AuthService.getInstituteId,
          'Student',
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe(
        (res) => {
          this.students = res.users;
          this.totalStudents = res.totalCount;
        },
        (err) => {
          this.alertService.errorAlert('Error while fetching students list');
        }
      );
  }

  disableUser(element: any, event: any) {
    this.authService.disableUser(element.id).subscribe({
      next: (data: any) => {
        element.disabled = !element.disabled;
      },
      error: (error: HttpErrorResponse) => {
        element.featured = !event.target.checked;
        this.alertService.errorAlert('Something went wrong!');
      },
    });
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  mapStudent(userId: any) {
    this.dialog.open(MappingPageComponent, {
      data: {
        id: userId,
        mappingType: MappingType.STUDENT,
      },
      width: '100%',
      height: '99%',
    });
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== ''
            ? this.instituteService.fetchInstituteUsers(
                AuthService.getInstituteId,
                'Student',
                this.page,
                this.size,
                this.searchParam
              )
            : of([])
        )
      )
      .subscribe((response) => {
        this.result$ = response;
        this.result$.subscribe((value) => {
          this.students = value?.users;
          this.totalStudents = value.totalCount;
        });
      });
  }

  editDetails(id: number) {
    this.router.navigate([`${AuthService.getModulePrefix}/add-user`], {
      queryParams: { id: id },
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  deleteStudent(userId: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        `Do you want to delete the student ?` +
        '</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: `Delete Student'}`,
      confirmButtonColor: '#FF635F',
      confirmButtonText: `Delete Student`,
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.studentService.deleteStudent(userId))
          .subscribe({
            next: (data: any) => {
              this.alertService.successAlert(data?.message);
              this.refresh(this.page);
            },
            error: (error: HttpErrorResponse) => {
              this.alertService.errorAlert(error.error.message);
            },
          });
      }
    });
  }
}
