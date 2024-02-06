import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-screen-mapping',
  standalone: true,
  imports: [],
  templateUrl: './screen-mapping.component.html',
  styleUrl: './screen-mapping.component.scss'
})
export class ScreenMappingComponent implements OnInit {
  screenNames: ModuleSectionVO[] = [];
  appScreenNames: ModuleSectionVO[] = [];
  screenMappingIds: number[] = [];
  appMappingIds: number[] = [];
  constructor(
    private roleService: RolesService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.loader
      .showLoader(
        this.roleService.fetchScreenMapping(
          this.activatedRoute.snapshot.queryParams['id']
        )
      )
      .subscribe({
        next: (data: any) => {
          this.screenNames = data.webScreens;
          this.appScreenNames = data.appScreens;
          this.appScreenNames.forEach((module: ModuleSectionVO) => {
            if (module.selected) this.appMappingIds.push(module.screenNameId);
          });
          this.screenNames.forEach((module: ModuleSectionVO) => {
            if (module.url != null && module.selected) {
              this.screenMappingIds.push(module.screenNameId);
            }
            module.subSections.forEach((subSection: ModuleSubSectionVO) => {
              if (subSection.selected) {
                this.screenMappingIds.push(subSection.screenNameId);
              }
            });
          });
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  addAppMappingIds(id: number) {
    if (this.appMappingIds.includes(id)) {
      this.appMappingIds.splice(
        this.appMappingIds.findIndex((value: number) => value === id),
        1
      );
      return;
    }
    this.appMappingIds.push(id);
  }

  addMappingIds(id: number) {
    if (this.screenMappingIds.includes(id)) {
      this.screenMappingIds.splice(
        this.screenMappingIds.findIndex((value: number) => value == id),
        1
      );
      return;
    }
    this.screenMappingIds.push(id);
  }

  submit() {
    this.loader
      .showLoader(
        this.roleService.saveScreenMapping(
          this.activatedRoute.snapshot.queryParams['id'],
          this.screenMappingIds,
          this.appMappingIds
        )
      )
      .subscribe({
        next: (data: any) => {
          window.location.reload();
        },
        error: (error: any) => {
          this.alertService.errorAlert(error.error.errorMessage);
        },
      });
  }

  back() {
    this.location.back();
  }
}

export class ModuleSectionVO {
  screenNameId!: number;
  name!: string;
  url!: string;
  subSections!: ModuleSubSectionVO[];
  selected!: boolean;
}
export class ModuleSubSectionVO {
  screenNameId!: number;
  name!: string;
  url!: string;
  sectionName!: string;
  selected!: boolean;
}
