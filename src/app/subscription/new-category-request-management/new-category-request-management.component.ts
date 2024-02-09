import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { RequestForOtherCategoryComponent } from 'src/app/common/course-wizard/add-edit-course/request-for-other-category/request-for-other-category.component';
import { LoaderService } from 'src/app/loader.service';
import { CategoryRequestVO } from 'src/app/model/CategoryRequestVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { CategoryService } from 'src/app/services/category/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-category-request-management',
  standalone: true,
  imports: [],
  templateUrl: './new-category-request-management.component.html',
  styleUrl: './new-category-request-management.component.scss'
})
export class NewCategoryRequestManagementComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  categoryRequestList!: CategoryRequestVO[];
  typeOfShorting: boolean = true;
  type: any;
  requestType:string='Requested';
  constructor(
    private categoryService: CategoryService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.categoryService.fetchAllCategoryRequests(
          this.size,
          page,
          this.searchParam,
          this.requestType
        )
      )
      .subscribe((res: any) => {
        this.categoryRequestList = res.categoryRequests;
        this.totalCount = res.total_count;
      });
  }

  changePage(page: number) {
    this.page = page;
    this.refresh(this.page);
  }

  changeSize(event: number) {
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

  short(type: any, event?: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  applyFilter(page: any) {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.categoryService.fetchAllCategoryRequests(
                  this.size,
                  page,
                  this.searchParam,
                  this.requestType
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.categoryRequestList = value.categoryRequests;
          this.totalCount = value.total_count;
        });
      });
  }
  onValueChange(event: any) {
    this.requestType = event.target.value;
    this.page = 0;
    this.refresh(this.page);
  }
  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  edit(courseCategoryVO: CategoryRequestVO) {
    let dialogRef = this.dialog.open(RequestForOtherCategoryComponent, {
      width: '700px',
      maxHeight: '800px',
      disableClose: true,
      data: {
        element: courseCategoryVO,
      },
    });
    dialogRef.componentInstance.uploadSuccess.subscribe((res: any) => {
      if (res) {
        dialogRef.close();
      }
    });
  }

  acceptReject(categoryRequest: CategoryRequestVO) {
    Swal.fire({
      title:
        'Are you sure you want to accept the request for category creation??',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Accept',
      denyButtonText: 'Reject',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        categoryRequest.status = 'Accepted';
        this.loader
          .showLoader(
            this.categoryService.categoryRequestApproval(categoryRequest)
          )
          .subscribe(
            (data: any) => {
              this.alertService.successAlert(
                'New Category has been added into the master data and mapped to the requested course !'
              );
              this.refresh(this.page);
            },
            (error) => {
              this.alertService.errorAlert('Something went wrong!');
            }
          );
      } else if (result.isDenied) {
        categoryRequest.status = 'Rejected';
        this.loader
          .showLoader(
            this.categoryService.categoryRequestApproval(categoryRequest)
          )
          .subscribe(
            (data: any) => {
              this.alertService.successAlert(
                'Requested Category request has been marked as rejected !'
              );
              this.refresh(this.page);
            },
            (error) => {
              this.alertService.errorAlert('Something went wrong!');
            }
          );
      }
    });
  }
}
