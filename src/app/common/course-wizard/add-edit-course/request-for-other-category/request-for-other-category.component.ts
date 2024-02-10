import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../../loader.service';
import { CategoryRequestVO } from '../../../../model/CategoryRequestVO';
import { SwalAlertService } from '../../../../services/alert/swal-alert.service';
import { CategoryService } from '../../../../services/category/category.service';

@Component({
  selector: 'app-request-for-other-category',
   
  templateUrl: './request-for-other-category.component.html',
  styleUrl: './request-for-other-category.component.scss'
})
export class RequestForOtherCategoryComponent implements OnInit {
  uploadSuccess = new EventEmitter<{
    categoryRequestId: number;
    courseId: number;
  }>();
  CategoryRequestForm!: FormGroup;
  isSubmit: boolean = false;
  disableField: boolean = false;
  categoryRequestVO: CategoryRequestVO = new CategoryRequestVO();
  constructor(
    private loader: LoaderService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private alertService: SwalAlertService,
    private dialogRef: MatDialogRef<RequestForOtherCategoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      courseId: number;
      element: CategoryRequestVO;
    }
  ) {}

  ngOnInit(): void {
    if (this.data.element) {
      this.categoryRequestVO = this.data.element;
      this.categoryRequestVO.courseId=this.data.courseId;
    }
    this.createForm();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  createForm() {
    this.CategoryRequestForm = this.fb.group({
      id: [this.categoryRequestVO?.id],
      categoryName: [this.categoryRequestVO?.categoryName, Validators.required],
      subCategoryName: [
        this.categoryRequestVO?.subCategoryName,
        Validators.required,
      ],
      subSubCategoryName: [
        this.categoryRequestVO?.subSubCategoryName,
        Validators.required,
      ],
      courseId: [
        this.categoryRequestVO?.courseId
          ? this.categoryRequestVO?.courseId
          : null,
      ],
    });
  }
  get controls() {
    return this.CategoryRequestForm.controls;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.CategoryRequestForm.invalid) {
      return;
    }
    this.categoryRequestVO.id = this.CategoryRequestForm.controls['id'].value;
    this.categoryRequestVO.categoryName =
      this.CategoryRequestForm.controls['categoryName'].value;
    this.categoryRequestVO.subCategoryName =
      this.CategoryRequestForm.controls['subCategoryName'].value;
    this.categoryRequestVO.subSubCategoryName =
      this.CategoryRequestForm.controls['subSubCategoryName'].value;
    this.categoryRequestVO.courseId =
      this.CategoryRequestForm.controls['courseId'].value;
    this.loader
      .showLoader(
        this.categoryService.requestForOtherCategory(this.categoryRequestVO)
      )
      .subscribe(
        (res: any) => {
          if (this.categoryRequestVO.id) {
            this.alertService.successAlert(
              'New category details has been successfully modified!'
            );
          } else {
            this.alertService.successAlert(
              "Your request for new category has been submitted successfully!"
            );
          }
          this.uploadSuccess.emit({
            categoryRequestId: res.data.categoryRequest.id,
            courseId: res.data.categoryRequest.courseId,
          });
          this.categoryRequestVO = new CategoryRequestVO();
          this.isSubmit = false;
          this.createForm();
        },
        (err) => {
          this.alertService.errorAlert(err.error.message);
        }
      );
  }
}
