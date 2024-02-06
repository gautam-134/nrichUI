import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { CourseCategoryVO } from 'src/app/model/categories.model';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CategoryService } from 'src/app/services/category/category.service';
import Swal from 'sweetalert2';
import { CreateCategoryComponent } from './create-category/create-category.component';

@Component({
  selector: 'app-course-category-management',
  standalone: true,
  imports: [],
  templateUrl: './course-category-management.component.html',
  styleUrl: './course-category-management.component.scss'
})
export class CourseCategoryManagementComponent implements OnInit {
  CourseCategoryVO: CourseCategoryVO[] = [];
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    this.categoryService
      .fetchCategoryList(page, this.size, this.searchParam)
      .subscribe((res: any) => {
        this.CourseCategoryVO = res.body.FeaturedCourseCategories;
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
    let dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '800px',
      maxHeight: '900px',
      disableClose: true,
      data: {
        isEdit: false,
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
    let dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '800px',
      maxHeight: '900px',
      disableClose: true,
      data: {
        isEdit: true,
        categoryName: element.categoryName,
        categoryDescription: element.categoryDescription,
        idCourseCategory: element.idCourseCategory,
        categoryImage: element.categoryImage,
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
          .showLoader(this.categoryService.deleteCategory(id))
          .subscribe(
            (res) => {
              this.alertService.successAlert('Deleted');
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

  updateFeatured(idCourseCategory: any) {
    this.loader
      .showLoader(
        this.categoryService.updateFetatureCategory(
          idCourseCategory,
          'CATEGORY'
        )
      )
      .subscribe();
  }

  updatePrivate(idCourseCategory: any) {
    this.loader
      .showLoader(
        this.categoryService.updatePrivate(idCourseCategory, 'CATEGORY')
      )
      .subscribe();
  }

  viewSubCategoryListing(categoryId: number) {
    this.router.navigate(['/master/sub-category-management'], {
      queryParams: { id: categoryId },
    });
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.categoryService.fetchCategoryList(
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
          this.CourseCategoryVO = value?.body.FeaturedCourseCategories;
          this.totalCount = value?.body.total_count;
        });
      });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
