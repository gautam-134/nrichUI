import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, map, of } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { PrerecordedModuleVO } from 'src/app/model/PrerecordedModels';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';
import { MappingPageComponent } from '../mapping-page/mapping-page.component';
import { MappingType } from 'src/app/model/MappingType';

@Component({
  selector: 'app-prerecorded-modules',
  standalone: true,
  imports: [],
  templateUrl: './prerecorded-modules.component.html',
  styleUrl: './prerecorded-modules.component.scss'
})
export class PrerecordedModulesComponent implements OnInit {
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  prerecordedModules: PrerecordedModuleVO[] = [];

  subject = new Subject<string>();
  result$!: Observable<any>;
  typeOfShorting: boolean = true;
  type: any;

  constructor(
    private prerecordedModuleService: PreRecordedModuleService,
    private loader: LoaderService,
    private router: Router,
    private alertService: SwalAlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.prerecordedModuleService.fetchPrerecordedModules(
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe((res: any) => {
        this.prerecordedModules = res.body.prerecordedModules;
        this.totalCount = res?.body.totalCount;
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

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.prerecordedModuleService.fetchPrerecordedModules(
                  this.page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.prerecordedModules = value.body.prerecordedModules;
          this.totalCount = value?.body.totalCount;
        });
      });
  }

  mapToBatch(id: number) {
    this.dialog.open(MappingPageComponent, {
      data: {
        id: id,
        mappingType: MappingType.PRERECORDED,
      },
      width: '100%',
      height: '99%',
    });
  }

  editModule(id: number) {
    this.router.navigate([`/${AuthService.getModulePrefix}/create-modules`], {
      queryParams: { id: id },
    });
  }

  deleteModule(id: number) {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this module?',
        'Yes, Delete'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.prerecordedModuleService.deleteModule(id))
            .subscribe({
              next: (response: any) => {
                this.alertService.successAlert(response.message);
                this.refresh(0);
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting module!');
              },
            });
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
}