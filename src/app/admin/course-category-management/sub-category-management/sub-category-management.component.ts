import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { CourseCategoryVO } from '../../../model/categories.model';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { CategoryService } from '../../../services/category/category.service';
import Swal from 'sweetalert2';
import { CreateSubCategoryComponent } from './create-sub-category/create-sub-category.component';

@Component({
  selector: 'app-sub-category-management',
   
  templateUrl: './sub-category-management.component.html',
  styleUrl: './sub-category-management.component.scss'
})
export class SubCategoryManagementComponent implements OnInit {
  CourseCategoryVO: CourseCategoryVO[] = [];
  categoryId!: number;
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;

  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private loader: LoaderService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private alertService: SwalAlertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.queryParams['id'];
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    this.categoryService
      .getSubCategories(this.categoryId, page, this.size, this.searchParam)
      .subscribe((res: any) => {
        this.CourseCategoryVO = res.body.SubCourseCategories;
        this.totalCount = res?.body.total_count;
      });
  }

  pageChange(event: any) {
    this.refresh(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  addCategory() {
    let dialogRef = this.dialog.open(CreateSubCategoryComponent, {
      width: '800px',
      maxHeight: '900px',
      disableClose: true,
      data: {
        isEdit: false,
        idCourseCategory: this.categoryId,
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res: any) => {
      if (res) {
        this.refresh(this.page);
        dialogRef.close();
      }
    });
  }
  editCategory(element: CourseCategoryVO) {
    let dialogRef = this.dialog.open(CreateSubCategoryComponent, {
      width: '800px',
      maxHeight: '900px',
      disableClose: true,
      data: {
        isEdit: true,
        categoryName: element.categoryName,
        categoryDescription: element.categoryDescription,
        idCourseCategory: this.categoryId,
        subCategoryId: element.subCategoryId,
        categoryImage: element.categoryImage,
        category: this.categoryId,
        displayOrder: element.displayOrder,
        isFeatured: element.isFeatured,
        isPrivate: element.isPrivate,
        categoryImagePath: element.categoryImagePath,
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res: any) => {
      if (res) {
        this.refresh(this.page);
        dialogRef.close();
      }
    });
  }

  delete(id: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Category?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader
          .showLoader(this.categoryService.deleteSubCategory(id, 'SubCategory'))
          .subscribe(
            (res) => {
              this.alertService.successAlert('Category Deleted');
              this.refresh(this.page);
            },
            (err) => {
              this.alertService.errorAlert(err.error.message);
            }
          );
      } else if (result.isDenied) {
        this.alertService.okErrorAlert('Category not deleted');
      }
    });
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.categoryService.getSubCategories(
                  this.categoryId,
                  this.page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.CourseCategoryVO = value?.body.SubCourseCategories;
          this.totalCount = value?.body.total_count;
        });
      });
  }

  updateFeatured(idCourseCategory: any) {
    this.loader
      .showLoader(
        this.categoryService.updateFetatureCategory(
          idCourseCategory,
          'SUBCATEGORY'
        )
      )
      .subscribe();
  }

  updatePrivate(idCourseCategory: any) {
    this.loader
      .showLoader(
        this.categoryService.updatePrivate(idCourseCategory, 'SUBCATEGORY')
      )
      .subscribe();
  }
  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
