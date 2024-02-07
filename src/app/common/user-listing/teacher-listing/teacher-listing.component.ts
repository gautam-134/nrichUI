import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { MappingType } from 'src/app/model/MappingType';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { UserFormVO } from '../../add-user/add-user.component';
import { MappingPageComponent } from '../../mapping-page/mapping-page.component';

@Component({
  selector: 'app-teacher-listing',
  standalone: true,
  imports: [],
  templateUrl: './teacher-listing.component.html',
  styleUrl: './teacher-listing.component.scss'
})
export class TeacherListingComponent implements OnInit {
  searchParam: string = '';
  instituteId!: number;
  page: number = 0;
  size: number = 5;
  totalTeachers = 0;
  subject = new Subject();
  result$!: Observable<any>;
  teachers: UserFormVO[] = [];
  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private dialog: MatDialog,
    private teacherService: TeacherService,
    private router: Router,
    private authService: AuthService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.fetchInstituteUsers(
          AuthService.getInstituteId,
          'Teacher',
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe(
        (res) => {
          this.teachers = res.users;
          this.totalTeachers = res.totalCount;
        },
        (err) => {
          this.alertService.errorAlert('Error while fetching teachers list');
        }
      );
  }

  editDetails(id: number) {
    this.router.navigate([`${AuthService.getModulePrefix}/add-user`], {
      queryParams: { id: id },
    });
  }

  changeDisplayOrder(displayOrder: string, teacherId: string) {
    this.loader
      .showLoader(
        this.teacherService.updateDisplayOrder(displayOrder, teacherId)
      )
      .subscribe({
        next: (res: any) => {},
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  mapTeacher(teacherId: any) {
    this.dialog.open(MappingPageComponent, {
      data: {
        id: teacherId,
        mappingType: MappingType.TEACHER,
      },
      width: '100%',
      height: '99%',
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== ''
            ? this.instituteService.fetchInstituteUsers(
                AuthService.getInstituteId,
                'Teacher',
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
          this.teachers = value?.users;
          this.totalTeachers = value?.totalCount;
        });
      });
  }

  changeVisibility(element: any, event: any) {
    this.instituteService.changeVisibility(element.teacherId).subscribe({
      next: (data: any) => {},
      error: (error: HttpErrorResponse) => {
        element.featured = !event.target.checked;
        this.alertService.errorAlert('Something went wrong!');
      },
    });
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

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
