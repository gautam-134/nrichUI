import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../loader.service';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { InstituteService } from '../../services/institute/institute.service';
import { UserFormVO } from '../add-user/add-user.component';

@Component({
  selector: 'app-add-teacher',
   
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss'
})
export class AddTeacherComponent implements OnInit {
  userForm!: FormGroup;
  isSubmit: boolean = false;
  userFormVO: UserFormVO = new UserFormVO();
  disableField: boolean = false;
  userId: string = '';
  imageSrc!: any;
  file!: File;
  roles: string[] = [];
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  claseDialogEnable: boolean = false;
  uploadSuccess = new EventEmitter<{
    id: number;
    name: string;
    image: string;
  }>();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fromBatch: boolean;
    },
    private fb: FormBuilder,
    private authService: AuthService,
    private instituteService: InstituteService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getRoles();
  }

  createForm() {
    this.userForm = this.fb.group({
      name: [this.userFormVO?.name, Validators.required],
      email: [
        this.userFormVO?.email,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      mobileNumber: [
        this.userFormVO?.mobileNumber,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      role: [this.userFormVO?.role],
    });
  }
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  getRoles() {
    this.instituteService
      .fetchInstituteRoles(AuthService.getInstituteId)
      .subscribe(
        (res: string[]) => {
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
    this.userFormVO.instituteId = AuthService.getInstituteId;
    this.userFormVO.role = 'Teacher';

    this.loader
      .showLoader(this.authService.addUser(this.userFormVO, this.file))
      .subscribe(
        (res: any) => {
          this.alertService.successAlert('Teacher created.');
          this.uploadSuccess.emit({
            id: res.body.teacherId,
            name: this.userFormVO.name,
            image: res.image,
          });
          this.userFormVO = new UserFormVO();
          this.isSubmit = false;
          this.createForm();
        },
        (err) => {
          this.alertService.errorAlert(err.error.message);
        }
      );
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (this.isFileImage(file)) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.imageSrc = event?.target?.result;
        };
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
}
