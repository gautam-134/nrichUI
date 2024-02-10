import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../loader.service';
import { Roles } from '../../model/Roles';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { RolesService } from '../../services/roles/roles.service';
import Swal from 'sweetalert2';
import { RolesComponent } from '../roles/roles.component';

@Component({
  selector: 'app-add-edit-roles',
  templateUrl: './add-edit-roles.component.html',
  styleUrl: './add-edit-roles.component.scss'
})
export class AddEditRolesComponent implements OnInit {
  role: Roles = new Roles();
  isRoleNameEmpty: boolean = false;
  isRoleTypeEmpty: boolean = false;
  submitted: boolean = false;
  uploadSuccess = new EventEmitter<number | Roles>();
  initialValueOfRoleName!: string;
  initialValueOfRoleType!: string;
  constructor(
    private dialogRef: MatDialogRef<RolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Roles },
    private roleService: RolesService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.initialValueOfRoleName = this.data.role.roleName;
  }

  submit() {
    this.submitted = true;
    if (this.data.role.roleName == '') {
      this.isRoleNameEmpty = true;
      return;
    }
    this.loader.showLoader(this.roleService.addRole(this.data.role)).subscribe({
      next: (data: Roles) => {
        this.uploadSuccess.emit(data);
        this.dialogRef.close();
      },
      error: (data: HttpErrorResponse) => {
        this.uploadSuccess.emit(undefined);
        this.alertService.errorAlert(
          data.error.body ? data.error.body : 'Internal Server Error'
        );
      },
    });
  }
  cancel() {
    this.uploadSuccess.emit(undefined);
    this.data.role.roleName = this.initialValueOfRoleName;
    this.dialogRef.close();
  }

  showWarning() {
    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete this role? </p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Continue',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  async delete(id: number) {
    await this.showWarning().then((value: boolean) => {
      if (value) {
        this.loader.showLoader(this.roleService.delete(id)).subscribe({
          next: (data: any) => {
            this.uploadSuccess.emit(id);
            this.dialogRef.close();
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert(error.error.message);
          },
        });
      }
    });
  }
}

