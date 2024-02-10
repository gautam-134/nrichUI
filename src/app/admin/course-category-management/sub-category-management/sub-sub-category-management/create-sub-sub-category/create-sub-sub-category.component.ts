import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PreviewComponent } from '../../../../../common/file-management/preview/preview.component';
import { LoaderService } from '../../../../../loader.service';
import { CourseCategoryVO } from '../../../../../model/categories.model';
import { SwalAlertService } from '../../../../../services/alert/swal-alert.service';
import { CategoryService } from '../../../../../services/category/category.service';

@Component({
  selector: 'app-create-sub-sub-category',
   
  templateUrl: './create-sub-sub-category.component.html',
  styleUrl: './create-sub-sub-category.component.scss'
})
export class CreateSubSubCategoryComponent implements OnInit {
  form!: FormGroup;
  isSubmit: boolean = false;
  hasError: boolean = false;
  bsInlineValue = new Date();
  file!: File;
  progressValue: any;
  uploadSuccess = new EventEmitter<boolean>();
  @ViewChild('fileSelect')
  fileSelect!: ElementRef;
  courseCategoryVO!: CourseCategoryVO;

  constructor(
    private categoryService: CategoryService,
    private loader: LoaderService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private alertService: SwalAlertService,
    public dialogRef: MatDialogRef<CreateSubSubCategoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      isEdit: boolean;
      categoryName: string;
      categoryDescription: string;
      idCourseCategory: number;
      categoryImage: string;
      displayOrder: string;
      subCategoryId: number;
      subsubCategoryId: number;
      isPrivate: boolean;
      isFeatured: boolean;
      categoryImagePath: string;
    }
  ) {}

  ngOnInit(): void {
    if (this.data.isEdit) {
      this.initFormEdit();
      return;
    }
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      categoryName: ['', Validators.required],
      categoryDescription: ['', Validators.required],
      displayOrder: ['', Validators.required],
    });
  }
  initFormEdit() {
    this.form = this.fb.group({
      categoryName: [this.data.categoryName, Validators.required],
      categoryDescription: [this.data.categoryDescription, Validators.required],
      displayOrder: [this.data.displayOrder, Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.createCategory();
  }

  onEdit() {
    this.courseCategoryVO = this.form.value;
    this.courseCategoryVO.subCategoryId = this.data.subCategoryId;
    this.courseCategoryVO.subsubCategoryId = this.data.subsubCategoryId;
    this.courseCategoryVO.categoryImage = this.data.categoryImage;
    this.courseCategoryVO.isFeatured = this.data.isFeatured;
    this.loader
      .showLoader(
        this.categoryService.createSubSubCourseCategory(
          this.courseCategoryVO,
          this.file
        )
      )
      .subscribe(
        (res) => {
          this.alertService.successAlert(
            'Course Category Created Successfully!'
          );
          this.uploadSuccess.emit(true);
        },
        (error: any) => {
          this.alertService.errorAlert(error.error.message);
        }
      );
  }

  createCategory() {
    this.courseCategoryVO = this.form.value;
    this.courseCategoryVO.subCategoryId = this.data.subCategoryId;
    this.courseCategoryVO.idCourseCategory = this.data.idCourseCategory;
    this.loader
      .showLoader(
        this.categoryService.createSubSubCourseCategory(
          this.courseCategoryVO,
          this.file
        )
      )
      .subscribe(
        (res) => {
          this.alertService.successAlert(
            'Course Category Created Successfully!'
          );
          this.uploadSuccess.emit(true);
        },
        (error: any) => {
          this.alertService.errorAlert(error.error.message);
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

  onFileChange($event: any) {
    this.file = new File([], '', undefined);
    let file = $event.target.files[0];
    if (this.isFileImage(file)) {
      this.file = file;
    } else {
      this.fileSelect.nativeElement.value = '';
      this.alertService.errorAlert(
        'Please select image or change material type'
      );
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

  documentPreview(file: any) {
    let filePath;
    if (!file) {
      filePath = this.data.categoryImagePath;
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

