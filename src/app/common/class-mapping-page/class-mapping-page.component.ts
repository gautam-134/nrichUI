import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstituteRoles } from 'src/app/enums/InstituteRoles';
import { LoaderService } from 'src/app/loader.service';
import { BatchMapping, CourseBatchMapVO } from 'src/app/model/CourseBatchMapVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-mapping-page',
  standalone: true,
  imports: [],
  templateUrl: './class-mapping-page.component.html',
  styleUrl: './class-mapping-page.component.scss'
})
export class ClassMappingPageComponent implements OnInit {
  courses: CourseBatchMapVO[] = [];
  filteredCourses: CourseBatchMapVO[] = [];
  batches: BatchMapping[] = [];
  batchIds: number[] = [];
  teachers: CourseBatchMapVO[] = [];
  mapping: string = '';
  teacher: CourseBatchMapVO[] = [];
  uploadSuccess = new EventEmitter<boolean>();
  flag: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number; mappingType: string },
    private commonService: CommonService,
    private loader: LoaderService,
    private _snackBar: MatSnackBar,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.mapping = this.data.mappingType;
    this.loader
      .showLoader(
        this.commonService.getBatchMapping(this.data.id, this.data.mappingType)
      )
      .subscribe({
        next: (data: CourseBatchMapVO[]) => {
          this.courses = data;
          this.filteredCourses = data;
          this.addToSelectedBatchIds();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching list');
        },
      });
  }

  addToSelectedBatchIds() {
    this.courses.forEach((course) => {
      course.batches.forEach((batch) => {
        if (batch.selected) {
          this.batchIds.push(batch.id);
        }
      });
    });
    if (this.batchIds.length > 0) {
      this.findTeachers();
    }
  }

  courseSelectUpdate(event: any, id: number) {
    const index = this.filteredCourses.findIndex((course) => course.id == id);
    if (index != -1) {
      this.filteredCourses[index].selected = event.target.checked;
    }
  }

  removeSelectedBatches(course: CourseBatchMapVO, event: any) {
    if (!event.target.checked) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to unselect this course and its selected batches & teacher!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          let callApi = false;
          course.batches.map((batch) => {
            if (batch.selected) {
              callApi = true;
              batch.selected = false;
            }
          });
          if (callApi) {
            this.removeBatchMapping(course);
          }
        } else {
          const index = this.filteredCourses.findIndex(
            (c) => c.id == course.id
          );
          if (index != -1) {
            this.filteredCourses[index].selected = true;
          }
        }
      });
    }
  }

  removeBatchMapping(course: CourseBatchMapVO) {
    this.loader
      .showLoader(
        this.commonService.saveBatchMapping(
          this.data.mappingType,
          this.data.id,
          [course],
          null
        )
      )
      .subscribe({
        next: (res: any) => {
          this.teachers = [];
          course.batches.forEach((batch) => {
            this.batchIds.splice(
              this.batchIds.findIndex((i) => i == batch.id),
              1
            );
          });
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  saveMapping(teacherId: number, event:any) {
    this.loader
      .showLoader(
        this.commonService.saveBatchMapping(
          this.data.mappingType,
          this.data.id,
          this.courses,
          teacherId
        )
      )
      .subscribe({
        next: (data) => {
          if (this.flag) this.openSnackBar();
          this.uploadSuccess.emit(true);
          this.courses.forEach((course) => {
            if (course.selected) {
              course.batches.forEach((batch) => {
                if (batch.selected) {
                  batch.preSelected = true;
                }
              });
            }
          });
        },
        error: (error:HttpErrorResponse) => {
          this.alertService.errorAlert(error?.error?.errorMessage);
          event.target.checked=false;
        },
      });
  }

  removeSelectedTeacher() {
    this.teachers.forEach((teacher) => {
      teacher.selected = false;
    });
  }

  saveBatchMapping(event: any, course: CourseBatchMapVO, id: number) {
    const index = course.batches.findIndex((batch) => batch.id == id);

    if (event.target.checked) {
      course.batches[index].selected = event.target.checked;
      this.batchIds.push(id);
      this.findTeachers();
      this.removeSelectedTeacher();
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to unselect this batch and its selected teacher!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          course.batches[index].selected = event.target.checked;
          this.batchIds.splice(
            this.batchIds.findIndex((i) => i == id),
            1
          );
          this.teachers = [];
        } else {
          event.target.checked = true;
        }
      });
    }
  }

  findTeachers() {
    this.loader
      .showLoader(
        this.commonService.fetchTeachers(
          this.data.id,
          this.data.mappingType,
          this.batchIds
        )
      )
      .subscribe({
        next: (response: CourseBatchMapVO[]) => {
          this.teachers = response;
          this.filterTeacher();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching teachers');
        },
      });
  }

  filterTeacher() {
    if (AuthService.getRoleType == InstituteRoles.Teacher) {
      this.teacher = this.teachers.filter(
        (teacher) => teacher.id == AuthService.getUserId
      );
      // this.saveMapping(this.teacher[0].id);
      this.flag = false;
      this.teachers = this.teacher;
    }
  }

  searchCourse(event: any) {
    this.filteredCourses = this.courses.filter(
      (newMapMaterial: CourseBatchMapVO) => {
        if (
          newMapMaterial.name
            .toLocaleLowerCase()
            .includes(event.target.value.toLocaleLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      }
    );
  }

  openSnackBar() {
    this._snackBar.open('Mapping created successfully!', '', {
      duration: 2000,
    });
  }
}

