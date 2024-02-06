import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LoaderService } from 'src/app/loader.service';
import { MappingType } from 'src/app/model/MappingType';
import { SupportDetails } from 'src/app/model/SupportDetails';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { SupportService } from 'src/app/services/Support/support.service';
import { ImageCropDialogComponent } from '../image-crop-dialog/image-crop-dialog.component';
import { MappingPageComponent } from '../mapping-page/mapping-page.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  isSubmit: boolean = false;
  userFormVO: UserFormVO = new UserFormVO();
  disableField: boolean = false;
  userId: string = '';
  imageSrc!: string;
  file!: File;
  roles: string[] = [];
  result$!: Observable<any>;
  imageName!: string;
  imageFormat!: string;
  supportDetails!: SupportDetails[];

  @ViewChild('fileSelect') fileSelect!: ElementRef;
  cropedFile!: any;
  image!: File;
  isImageCroped: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private instituteService: InstituteService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private _location: Location,
    private supportService: SupportService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getRoles();
    this.refresh();
    this.supportDetails = this.supportService.addUserSupport();
  }
  refresh() {
    this.userId = this.route.snapshot.queryParams['id'];
    if (this.userId) {
      this.loader
        .showLoader(this.authService.getUserProfile(this.userId))
        .subscribe(
          (res: any) => {
            this.userFormVO.name = res.name;
            this.userFormVO.email = res.email;
            this.userFormVO.mobileNumber = res.mobileNumber;
            this.userFormVO.role = res.role;
            this.userFormVO.gender = res.gender;
            this.imageSrc = res.userImagePath;
            this.disableField = true;
            if (this.userFormVO.role.includes('Student')) {
              this.userForm.get('role')?.disable();
            }
            this.createForm();
          },
          (err: any) => {
            this.alertService.errorAlert('Error while fetching user details');
          }
        );
    }
  }
  createForm() {
    this.userForm = this.fb.group({
      name: [this.userFormVO?.name, Validators.required],
      email: [this.userFormVO?.email, [Validators.required, Validators.email]],
      mobileNumber: [
        this.userFormVO?.mobileNumber,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      gender: [this.userFormVO?.gender, Validators.required],
      role: [this.userFormVO?.role, Validators.required],
    });
  }

  getRoles() {
    this.instituteService
      .fetchInstituteRoles(AuthService.getInstituteId)
      .subscribe(
        (res: any) => {
          this.roles = res;
        },
        (err: any) => {
          this.alertService.errorAlert('Error while fetching roles');
        }
      );
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }

    this.userFormVO = this.userForm.value;
    if (this.isImageCroped == true) {
      this.convertBase64ToFile();
    }
    this.userFormVO.instituteId = AuthService.getInstituteId;
    this.loader
      .showLoader(this.authService.addUser(this.userFormVO, this.file))
      .subscribe({
        next: (res: any) => {
          if (
            this.userFormVO.role == 'Student' ||
            this.userFormVO.role == 'Teacher'
          ) {
            this.alertService
              .buttonSuccessAlert(
                'User created. You can also return to adding another user by clicking the Cancel icon of the screen or Continue mapping the User to a Batch ( if it is already created).',
                'Map To Batch'
              )
              .then((result) => {
                if (result.isConfirmed) {
                  const dialog = this.dialog.open(MappingPageComponent, {
                    data: {
                      id: res?.body.teacherId
                        ? res?.body.teacherId
                        : res?.body.userId,
                      mappingType: res?.body.teacherId
                        ? MappingType.TEACHER
                        : MappingType.STUDENT,
                    },
                    width: '100%',
                    height: '99%',
                  });
                  dialog.afterClosed().subscribe((data: any) => {
                    this._location.back();
                  });
                } else {
                  this._location.back();
                }
                this.userFormVO = new UserFormVO();
              });
          } else {
            this.alertService
              .successAlert(
                'User created. You can also return to adding another user by clicking the OK icon of the screen.'
              )
              .then(() => {
                this.router.navigateByUrl(
                  `${AuthService.getModulePrefix}/users`
                );
              });
          }
        },
        error: (err: any) => {
          this.alertService.errorAlert(err.error.message);
        },
      });
  }

  update() {
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userFormVO = this.userForm.value;
    this.userFormVO.id = this.userId;
    if (this.isImageCroped == true) {
      this.convertBase64ToFile();
    }
    this.userFormVO.instituteId = AuthService.getInstituteId;
    this.loader
      .showLoader(this.authService.editUser(this.userFormVO, this.file))
      .subscribe(
        (res: any) => {
          console.log(res)
          if (
            this.userFormVO.role == 'Student' ||
            this.userFormVO.role == 'Teacher'
          ) {
            this.alertService
              .buttonSuccessAlert('User Updated Successfully!', 'Map To Batch')
              .then((result) => {
                if (result.isConfirmed) {
                  const dialog = this.dialog.open(MappingPageComponent, {
                    data: {
                      id: res?.teacherId ? res?.teacherId : res?.userId,
                      mappingType: res?.teacherId
                        ? MappingType.TEACHER
                        : MappingType.STUDENT,
                    },
                    width: '100%',
                    height: '99%',
                  });
                  dialog.afterClosed().subscribe((data: any) => {
                    this._location.back();
                  });
                } else {
                  this.router.navigateByUrl( `${AuthService.getModulePrefix}/users`);
                }
              });
          } else {
            this.alertService
              .successAlert('User Updated Successfully!')
              .then(() => {
                this.router.navigateByUrl(
                  `${AuthService.getModulePrefix}/users`
                );
              });
          }
        },
        (err: any) => {
          if (err.status == 403) {
            this.alertService.errorAlert('Remove mapping & try again');
          } else {
            this.alertService.errorAlert('Error while updating user');
          }
        }
      );
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        this.imageName = file.name;
        this.imageFormat = file.type;
        this.openDialog(file);
      }
    } else {
      this.fileSelect.nativeElement.value = '';
      return;
    }
  }

  isFileImage(file: any) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  get controls() {
    return this.userForm.controls;
  }

  onlyNumeric(event: any) {
    const keyCode = event.keyCode;
    if (
      (keyCode >= 48 && keyCode <= 57) ||
      keyCode === 8 ||
      keyCode === 46 ||
      (keyCode >= 37 && keyCode <= 40) ||
      (keyCode >= 96 && keyCode <= 105)
    )
      return true;
    return false;
  }

  goBack() {
    this._location.back();
  }

  openDialog(imageFile: any) {
    let dialogRef = this.dialog.open(ImageCropDialogComponent, {
      data: {
        imageFile: imageFile,
      },
    });
    dialogRef.componentInstance.cropedImageEvent.subscribe((image: string) => {
      this.imageSrc = image;
      this.isImageCroped = true;
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  convertBase64ToFile() {
    const arr = this.imageSrc.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file = new File([u8arr], this.imageName, { type: this.imageFormat });
  }
}

export class UserFormVO {
  id!: string;
  name!: string;
  email!: string;
  mobileNumber!: string;
  gender!: string;
  role!: string;
  instituteId!: string;
  teacherId!: string;
  disabled!: boolean;
  registrationDate!: Date;
  registrationUser!: number;
  registrationMode!: string;
  privateTeacher!: boolean;
  displayOrder!: number;
}