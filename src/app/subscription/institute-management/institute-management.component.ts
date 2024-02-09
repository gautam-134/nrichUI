import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, debounceTime, map, of } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { InsitutionVO } from 'src/app/model/InstitutionVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { InstituteService } from 'src/app/services/institute/institute.service';

@Component({
  selector: 'app-institute-management',
  standalone: true,
  imports: [],
  templateUrl: './institute-management.component.html',
  styleUrl: './institute-management.component.scss'
})
export class InstituteManagementComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount!: number;
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;
  insituteList!: InsitutionVO[];

  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private instituteService: InstituteService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter(this.page);
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.fetchAllInstituteList(
          this.size,
          page,
          this.searchParam
        )
      )
      .subscribe((res: any) => {
        this.insituteList = res.InstituteList;
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

  applyFilter(page: any) {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.instituteService.fetchAllInstituteList(
                  this.size,
                  page,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.insituteList = value.InstituteList;
          this.totalCount = value.total_count;
        });
      });
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.instituteService.updateDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {
          // this.displayOrder.nativeElement.focusout();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal server error');
        },
      });
  }

  featured(element: any, event: any) {
    this.instituteService.updateInstituteFeaturedFlag(element.id).subscribe({
      next: (data: any) => {},
      error: (error: HttpErrorResponse) => {
        element.featured = !event.target.checked;
        this.alertService.errorAlert('Something went wrong!');
      },
    });
  }

  short(type: any, event?: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  submitOfflinePayment(instituteId: any,name: string) {
    this.router.navigate(['/master/submit-offline-payment-details'], {
      queryParams: { id: instituteId, instituteName: name },
    });
  }

  changeInstituteAdmin(instituteId: any,name: string) {
    this.router.navigate(['/master/change-institute-admin'], {
      queryParams: { id: instituteId, instituteName: name},
    });
  }
}

