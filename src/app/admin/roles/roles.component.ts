import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InstituteRoles } from 'src/app/enums/InstituteRoles';
import { LoaderService } from 'src/app/loader.service';
import { Roles } from 'src/app/model/Roles';
import { SupportDetails } from 'src/app/model/SupportDetails';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { SupportService } from 'src/app/services/Support/support.service';
import { AddEditRolesComponent } from '../add-edit-roles/add-edit-roles.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  roles: Roles[] = [];
  typeOfShorting: boolean = true;
  type: any;
  supportDetails!: SupportDetails[];
  constructor(
    public dialog: MatDialog,
    private role: RolesService,
    private router: Router,
    private loader: LoaderService,
    private supportService: SupportService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.supportDetails = this.supportService.roleSupport();
  }

  refresh() {
    this.loader.showLoader(this.role.fetchRolesOfInstitute()).subscribe({
      next: (data: any) => {
        this.roles = data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Something went wrong!');
      },
    });
  }
  addRole(role?: Roles): void {
    const dialogRef = this.dialog.open(AddEditRolesComponent, {
      data: {
        role: role ? role : new Roles(),
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe(
      (data: Roles | number) => {
        if (typeof data != 'number' && data != undefined) {
          const index = this.roles.findIndex(
            (value: Roles) => value.id == data?.id
          );
          if (index != -1) {
            this.roles[index] = data;
            return;
          }
          this.roles.unshift(data);
          return;
        }
        if (typeof data == 'number') {
          this.roles.splice(
            this.roles.findIndex((role: Roles) => data == role.id),
            1
          );
        }
      }
    );
  }

  checkEditAccess(element: Roles): boolean {
    return (element.roleName === InstituteRoles.SuperAdmin &&
      element.roleType === InstituteRoles.SuperAdmin) ||
      (element.roleName === InstituteRoles.Admin &&
        element.roleType === InstituteRoles.Admin) ||
      (element.roleName === InstituteRoles.Teacher &&
        element.roleType === InstituteRoles.Teacher) ||
      (element.roleName === InstituteRoles.Student &&
        element.roleType === InstituteRoles.Student) ||
      (element.roleName === InstituteRoles.InstituteAdmin &&
        element.roleType === InstituteRoles.InstituteAdmin)
      ? false
      : true;
  }
  screenmapping(element: Roles) {
    this.router.navigate([AuthService.getModulePrefix + '/screen-mapping'], {
      queryParams: { id: element.id },
    });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
