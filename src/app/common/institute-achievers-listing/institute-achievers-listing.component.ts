import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { ExpertVO } from 'src/app/model/ExpertVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-institute-achievers-listing',
  standalone: true,
  imports: [],
  templateUrl: './institute-achievers-listing.component.html',
  styleUrl: './institute-achievers-listing.component.scss'
})
export class InstituteAchieversListingComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  experts: ExpertVO[] = [];
  page: number = 0;
  size: number = 5;
  totalCount: number = 0;
  typeOfShorting: boolean = true;
  type: any;
  @ViewChild('achieverSearch') notificationSearch!: ElementRef;
  searchSubscription!: Subscription;
  roleType!: string;

  constructor(
    private loader: LoaderService,
    private commonService: CommonService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.roleType = AuthService.getRoleType;
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.search();
  }

  refresh(page: number) {
    this.loader
      .showLoader(this.commonService.getInstituteAchievers(page, this.size))
      .subscribe({
        next: (data) => {
          this.experts = data.expertsList;
          this.totalCount = data.totalCount;
        },
        error: (err) => {},
      });
  }

  search() {
    this.searchSubscription = fromEvent(
      this.notificationSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.commonService.getInstituteAchievers(
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.experts = data.expertsList;
            this.totalCount = data.totalCount;
          });
      });
  }

  pageChange(event: any) {
    this.refresh(event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  editAchiever(element: any) {
    this.router.navigate([`${AuthService.getModulePrefix}/add-achiever`], {
      queryParams: { id: element.idExpert },
    });
  }

  deleteAchiever(id: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Achiever?</p>',
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
        this.loader.showLoader(this.commonService.deleteAchiever(id)).subscribe(
          (res) => {
            this.alertService.successAlert('Deleted');
            this.refresh(this.page);
          },
          (err) => {
            this.alertService.errorAlert(err.error.message);
          }
        );
      } else if (result.isDenied) {
        this.alertService.okErrorAlert('Achiever not deleted');
      }
    });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  addAchiever() {
    this.router.navigate([`${AuthService.getModulePrefix}/add-achiever`]);
  }

  updateFeatured(id: any) {
    this.loader
      .showLoader(this.commonService.updateAchieverFeature(id))
      .subscribe();
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.commonService.updateAchieverDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {},
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
