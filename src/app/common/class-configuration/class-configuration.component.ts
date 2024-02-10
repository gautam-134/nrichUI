import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject, Subscription } from 'rxjs';
import { LoaderService } from '../../loader.service';
import { MappingType } from '../../model/MappingType';
import { MyplanDetails } from '../../model/MyPlanDetails';
import {
  ClassConfiguration,
  ClassScheduleList,
  ScheduleClass,
} from '../../model/schedule-class-list.model';
import { SupportDetails } from '../../model/SupportDetails';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { InstituteService } from '../../services/institute/institute.service';
import { MyplanService } from '../../services/myplan.service';
import { SupportService } from '../../services/Support/support.service';
import Swal from 'sweetalert2';

import { ClassMappingPageComponent } from '../class-mapping-page/class-mapping-page.component';
import { CreateEditClassConfigurationComponent } from '../create-edit-class-configuration/create-edit-class-configuration.component';
import { EditClassConfigurationComponent } from './edit-class-configuration/edit-class-configuration.component';

@Component({
  selector: 'app-class-configuration',
   
  templateUrl: './class-configuration.component.html',
  styleUrl: './class-configuration.component.scss'
})
export class ClassConfigurationComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  result: ClassScheduleList[] = [];
  classConfiguration: ClassConfiguration[] = [];
  selectedIntitute!: any;
  ScheduleClass!: ScheduleClass;
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  userId: any;
  typeOfShorting: boolean = true;
  type: any;
  supportDetails!: SupportDetails[];
  myPlanDetailsSubscription$!: Subscription;
  isZoomAllowed!: boolean | undefined;
  constructor(
    private dialog: MatDialog,
    private instituteService: InstituteService,
    private loader: LoaderService,
    private router: Router,
    private alertService: SwalAlertService,
    private supportService: SupportService,
    private planDetailsService: MyplanService
  ) {}
  ngOnDestroy(): void {
    if (this.myPlanDetailsSubscription$)
      this.myPlanDetailsSubscription$.unsubscribe();
  }
  ngOnInit(): void {
    this.refresh(this.page);
    this.supportDetails = this.supportService.classCreationSupport();
    this.applyFilter();
    this.subscribeToMyPlanDetails()
  }

  subscribeToMyPlanDetails() {
    this.myPlanDetailsSubscription$ =
      this.planDetailsService.myPlanDetails$.subscribe(
        (data: MyplanDetails | undefined) => {
          this.isZoomAllowed = data?.isZoomAllowed;
        }
      );
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.getClassConfigurations(
          JSON.parse(localStorage.getItem('auth') as string).selectedInstitute,
          this.size,
          page,
          this.searchParam
        )
      )
      .subscribe((res: any) => {
        this.classConfiguration = res.body.classConfigurations;
        this.totalCount = res?.body.total_count;
      });
  }

  addClassConfiguration() {
    let dialogRef = this.dialog.open(CreateEditClassConfigurationComponent, {
      width: '100%',
      height: '99%',
      disableClose: true,
      data: {
        scheduleDTO: this.ScheduleClass,
        isEdit: false,
        from: true,
        isZoom:this.isZoomAllowed
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res) => {
      if (res) {
        this.refresh(this.page);
        dialogRef.close();
      }
    });
  }

  EditClassConfiguration(element: any) {
    let dialogRef = this.dialog.open(EditClassConfigurationComponent, {
      width: '800px',
      maxHeight: '900px',
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
    this.dialog.open(ClassMappingPageComponent, {
      data: {
        id: id,
        mappingType: MappingType.CLASS_CONFIGURATION,
      },
      width: '100%',
      height: '99%',
    });
  }

  onDelete(element: any, id: number) {
    element.classConfigId = id;

    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Future Classes of this configuration ?</p>',
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
    }).then((result: { isConfirmed: any; isDenied: any }) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.instituteService.deleteFutureClasses(id))
          .subscribe(
            (data: any) => {
              this.alertService.successAlert(
                data.message +
                  '<br> Note:Live classes and completed classes can not be deleted in the current configuration.'
              );
              this.refresh(this.page);
            },
            (error: any) => {
              this.alertService.errorAlert(error.error.message);
            }
          );
      } else if (result.isDenied) {
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
                this.instituteService.getClassConfigurations(
                  JSON.parse(localStorage.getItem('auth') as string)
                    .selectedInstitute,
                  this.size,
                  this.page,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.classConfiguration = value?.body.classConfigurations;
          this.totalCount = value?.body.total_count;
        });
      });
  }

  seeClasses(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/schedule-list'], {
      queryParams: { id: id },
    });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }


  
}
