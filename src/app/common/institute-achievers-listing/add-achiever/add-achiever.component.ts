import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { ExpertVO } from '../../../model/ExpertVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common/common.service';
import { PreviewComponent } from '../../file-management/preview/preview.component';

@Component({
  selector: 'app-add-achiever',
   
  templateUrl: './add-achiever.component.html',
  styleUrl: './add-achiever.component.scss'
})
export class AddAchieverComponent implements OnInit {
  AchieverForm!: FormGroup;
  submitted: boolean = false;
  expertVO: ExpertVO = new ExpertVO();
  achieverDetails = new ExpertVO();
  file!: File;
  id: number;
  instituteId: any;
  @ViewChild('fileSelect')
  fileSelect!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {
    this.id = +this.route.snapshot.queryParams?.['id'];
  }

  ngOnInit(): void {
    this.instituteId = AuthService.getInstituteId;
    this.initializeForm();
    if (this.id) {
      this.loader
        .showLoader(this.commonService.getAchieverDetails(this.id))
        .subscribe((data: any) => {
          this.achieverDetails = data.body;
          this.initializeForm();
        });
    }
  }

  initializeForm() {
    this.AchieverForm = this.fb.group({
      idExpert: [
        this.achieverDetails.idExpert ? this.achieverDetails.idExpert : null,
      ],
      name: [this.achieverDetails.name, Validators.required],
      description: [this.achieverDetails.description, Validators.required],
      profileImage: [this.achieverDetails.profileImage],
      displayOrder: [this.achieverDetails.displayOrder, Validators.required],
      instituteId: [
        this.achieverDetails.instituteId
          ? this.achieverDetails.instituteId
          : this.instituteId,
      ],
      isFeatured: [
        this.achieverDetails.isFeatured
          ? this.achieverDetails.isFeatured
          : false,
      ],
    });
  }

  get form() {
    return this.AchieverForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.AchieverForm.valid && (this.file || this.achieverDetails.profileImage)) {
      this.expertVO.idExpert = this.AchieverForm.controls['idExpert'].value;
      this.expertVO.name = this.AchieverForm.controls['name'].value;
      this.expertVO.description =
        this.AchieverForm.controls['description'].value;
      this.expertVO.displayOrder =
        this.AchieverForm.controls['displayOrder'].value;
      this.expertVO.instituteId =
        this.AchieverForm.controls['instituteId'].value;
      this.expertVO.isFeatured = this.AchieverForm.controls['isFeatured'].value;
      if (!this.file) {
        this.expertVO.profileImage = this.achieverDetails.profileImage;
      }
      this.loader
        .showLoader(this.commonService.createAchiever(this.expertVO, this.file))
        .subscribe(
          (res: any) => {
            this.alertService.successAlert('Achiever Created SuccessFully');
            this.router.navigate([
              `${AuthService.getModulePrefix}/achievers-listing`,
            ]);
          },
          (err: HttpErrorResponse) => {
            this.alertService.errorAlert(err.error.message);
          }
        );
    }
  }

  onFileChange($event: any) {
    let file = $event.target.files[0];
    if (this.isFileImage(file)) {
      if (file.size > 1048576) {
        this.alertService.errorAlert(
          'Image must be less than 1 MB'
        );
        this.fileSelect.nativeElement.value = '';
        return;
      }
      this.file = file;
    } else {
      this.fileSelect.nativeElement.value = '';
      this.alertService.errorAlert('Please select image.');
      return;
    }
  }

  isFileImage(file: any) {
    const acceptedImageTypes = [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
    ];
    return file && acceptedImageTypes.includes(file['type']);
  }

  cancel() {
    this.router.navigate([`${AuthService.getModulePrefix}/achievers-listing`]);
  }

  documentPreview(file: any) {
    let filePath;
    if (file == null) {
      filePath = this.achieverDetails.profileImagePath;
      this.preview(filePath, false);
    } else {
      filePath = file;
    }
    if (typeof file != 'string') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        filePath = reader.result as string;
        this.preview(filePath, file.type == 'application/pdf' ? true : false);
      };
    } else {
      this.preview(file, file.includes('.pdf') ? true : false);
    }
  }

  preview(path: string, isPdf: boolean) {
    const dialogRef = this.dialog.open(PreviewComponent, {
      maxWidth: '800px',
      data: {
        path: path,
        type: 'image',
      },
      hasBackdrop: true,
      panelClass: ['animate__animated', 'animate__backInDown'],
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
