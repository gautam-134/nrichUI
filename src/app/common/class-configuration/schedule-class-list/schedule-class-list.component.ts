import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { MappingType } from 'src/app/model/MappingType';
import { ScheduleClassVO } from 'src/app/model/schedule-class-list.model';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import Swal from 'sweetalert2';
import { ClassMappingPageComponent } from '../../class-mapping-page/class-mapping-page.component';
import { CreateEditClassConfigurationComponent } from '../../create-edit-class-configuration/create-edit-class-configuration.component';
import { AddClassInConfigurationComponent } from '../add-class-in-configuration/add-class-in-configuration.component';

@Component({
  selector: 'app-schedule-class-list',
  standalone: true,
  imports: [],
  templateUrl: './schedule-class-list.component.html',
  styleUrl: './schedule-class-list.component.scss'
})
export class ScheduleClassListComponent implements OnInit {
  classScheduledList: ScheduleClassVO[] = [];
  today: Date = new Date();
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  disabledOnAllClasses: boolean = true;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  role: any;
  typeOfShorting: boolean = true;
  type: any;
   now: any;
  constructor(
    private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private instituteService: InstituteService,
    private dialog: MatDialog,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.activatedRoute.snapshot.queryParams['id'] != null) {
      this.disabledOnAllClasses = false;
    }
    this.refresh(this.page);
    this.applyFilter();
  }
   refresh(page: number) {
    let loader$ = this.instituteService.fetchAllClassSchedule(
      JSON.parse(localStorage.getItem('auth') as string).selectedInstitute,
      JSON.parse(localStorage.getItem('auth') as string).user_id,
      this.activatedRoute.snapshot.queryParams['id'] == null
        ? null
        : this.activatedRoute.snapshot.queryParams['id'],
      this.size,
      page,
      this.searchParam
    );
    this.loader.loadingOn();
    this.loader.showLoader(loader$).subscribe(
      (res: any) => {
        this.classScheduledList = res.body.courseScheduleListVO;
        this.totalCount = res.body.total_count;

        this.loader.loadingOff();
      },
      (error: any) => {
        this.loader.loadingOff();
      }
    );
  }

  EditClassConfiguration(element: any) {
    let dialogRef = this.dialog.open(CreateEditClassConfigurationComponent, {
      width: '700px',
      maxHeight: '800px',
      disableClose: true,
      data: {
        scheduleDTO: element,
        isEdit: true,
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res) => {
      if (res) {
        this.refresh(this.page);
        dialogRef.close();
      }
    });
  }

  classMapping(id: number) {
    let dialogRef = this.dialog.open(ClassMappingPageComponent, {
      data: {
        id: id,
        mappingType: MappingType.CLASS_SCHEDULE,
      },
      width: '100%',
      height: '99%',
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res: any) => {
      if (res) {
        this.refresh(this.page);
      }
    });
  }

  delete(idAttach: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Class?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.instituteService.deleteClass(idAttach))
          .subscribe(
            (res) => {
              this.refresh(this.page);
              this.alertService.successAlert('Deleted');
            },
            (err) => {
              this.alertService.errorAlert(err.error.message);
            }
          );
      }
    });
  }

  cancel(idClassSchedule: number, active: boolean) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        `Do you want to ${active == true ? 'rescedule' : 'cancel'}  the Class` +
        '</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: `${active == true ? 'Rescedule' : 'Cancel Class'}`,
      confirmButtonColor: '#FF635F',
      confirmButtonText: `${active == true ? 'Rescedule' : 'Cancel Class'}`,
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const api$ = this.instituteService.cancelClasss(
          idClassSchedule,
          active
        );
        this.loader.showLoader(api$).subscribe(
          (data: any) => {
            this.refresh(this.page);
            this.alertService.successAlert(data.message);
          },
          (error: any) => {
            this.alertService.errorAlert(error?.error?.message);
          }
        );
      }
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
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

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.instituteService.fetchAllClassSchedule(
                  JSON.parse(localStorage.getItem('auth') as string)
                    .selectedInstitute,
                  JSON.parse(localStorage.getItem('auth') as string).user_id,
                  this.activatedRoute.snapshot.queryParams['id'] == null
                    ? null
                    : this.activatedRoute.snapshot.queryParams['id'],
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
          this.classScheduledList = value?.body.courseScheduleListVO;
          this.totalCount = value?.body.total_count;
        });
      });
  }

  backToLastPage() {
    this.router.navigate([AuthService.getModulePrefix + '/classes']);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  addClassInConfiguration() {
    let dialogRef = this.dialog.open(AddClassInConfigurationComponent, {
      width: '100%',
      height: '99%',
      disableClose: true,
      data: {
        classConfigId: this.activatedRoute.snapshot.queryParams['id'],
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res) => {
      if (res) {
        this.refresh(this.page);
        dialogRef.close();
      }
    });
  }
}
