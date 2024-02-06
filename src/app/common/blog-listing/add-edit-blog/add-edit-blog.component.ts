import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LoaderService } from 'src/app/loader.service';
import { BlogsVO } from 'src/app/model/BlogsVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { PreviewComponent } from '../../file-management/preview/preview.component';
import { BlogImageCropperComponent } from '../blog-image-cropper/blog-image-cropper.component';

@Component({
  selector: 'app-add-edit-blog',
  standalone: true,
  imports: [],
  templateUrl: './add-edit-blog.component.html',
  styleUrl: './add-edit-blog.component.scss'
})
export class AddEditBlogComponent implements OnInit {
  BlogForm!: FormGroup;
  submitted: boolean = false;
  blogVO: BlogsVO = new BlogsVO();
  blogDetails = new BlogsVO();
  file!: File;
  id!: number;
  idInstitution: any;
  @ViewChild('fileSelect')
  fileSelect!: ElementRef;
  isImageCroped: boolean = false;
  htmlContent!: '';
  imageSrc!: any;
  imageName!: string;
  imageFormat!: string;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  userId!: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private commonService: CommonService,
    private alertService: SwalAlertService,
    private dialog: MatDialog
  ) {
    this.id = +this.route.snapshot.queryParams?.['id'];
  }

  ngOnInit(): void {
    this.idInstitution = AuthService.getInstituteId;
    this.userId = AuthService.getUserId;
    this.initializeForm();
    if (this.id) {
      this.loader
        .showLoader(this.commonService.fetchBlogDetails(this.id))
        .subscribe((data: any) => {
          this.blogDetails = data.body;
          this.initializeForm();
        });
    }
  }

  initializeForm() {
    this.BlogForm = this.fb.group({
      idBlog: [this.blogDetails.idBlog ? this.blogDetails.idBlog : null],
      subject: [this.blogDetails.subject, Validators.required],
      description: [this.blogDetails.description, Validators.required],
      image: [this.blogDetails.image],
      displayOrder: [this.blogDetails.displayOrder],
      idInstitution: [
        this.blogDetails.idInstitution
          ? this.blogDetails.idInstitution
          : this.idInstitution,
      ],
      isFeatured: [
        this.blogDetails.isFeatured ? this.blogDetails.isFeatured : false,
      ],
      idUser: [this.blogDetails.idUser ? this.blogDetails.idUser : this.userId],
      instituteIsFeatured: [this.blogDetails.instituteIsFeatured],
      instituteDisplayOrder: [this.blogDetails.instituteDisplayOrder],
    });
    this.imageSrc = this.blogDetails.coverImagePath;
  }

  get form() {
    return this.BlogForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.BlogForm.valid && this.imageSrc) {
      this.blogVO.idBlog = this.BlogForm.controls['idBlog'].value;
      this.blogVO.subject = this.BlogForm.controls['subject'].value;
      this.blogVO.description = this.BlogForm.controls['description'].value;
      this.blogVO.displayOrder = this.BlogForm.controls['displayOrder'].value;
      this.blogVO.idInstitution = this.BlogForm.controls['idInstitution'].value;
      this.blogVO.isFeatured = this.BlogForm.controls['isFeatured'].value;
      this.blogVO.idUser = this.BlogForm.controls['idUser'].value;
      this.blogVO.instituteIsFeatured =
        this.BlogForm.controls['instituteIsFeatured'].value;
      this.blogVO.instituteDisplayOrder =
        this.BlogForm.controls['instituteDisplayOrder'].value;
      if (!this.file) {
        this.blogVO.image = this.blogDetails.image;
      }
      if (this.isImageCroped == true) {
        this.convertBase64ToFile();
      }
      this.loader
        .showLoader(this.commonService.createBlog(this.blogVO, this.file))
        .subscribe(
          (res: any) => {
            this.alertService.successAlert('Blog Created SuccessFully');
            this.router.navigate([
              `${AuthService.getModulePrefix}/blog-listing`,
            ]);
          },
          (err: HttpErrorResponse) => {
            this.alertService.errorAlert(err.error.message);
          }
        );
    }
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

  onFileChange($event: any) {
    let file = $event.target.files[0];
    if (this.isFileImage(file)) {
      this.imageName = file.name;
      this.imageFormat = file.type;
      this.openDialog(file);
    } else {
      this.fileSelect.nativeElement.value = '';
      this.alertService.errorAlert('Please select image');
      return;
    }
  }

  openDialog(imageFile: any) {
    let dialogRef = this.dialog.open(BlogImageCropperComponent, {
      data: {
        imageFile: imageFile,
      },
    });
    dialogRef.componentInstance.cropedImageEvent.subscribe((image: string) => {
      this.imageSrc = image;
      this.isImageCroped = true;
    });
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
    this.router.navigate([`${AuthService.getModulePrefix}/blog-listing`]);
  }

  documentPreview(file: any) {
    let filePath;
    if (file == null) {
      filePath = this.blogDetails.image;
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
}

