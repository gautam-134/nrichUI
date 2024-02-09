import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/loader.service';
import { FAQVo } from 'src/app/model/Faq';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import Swal from 'sweetalert2';
import { AddFaqsComponent } from '../add-faqs/add-faqs.component';

@Component({
  selector: 'app-faq-listing',
  standalone: true,
  imports: [],
  templateUrl: './faq-listing.component.html',
  styleUrl: './faq-listing.component.scss'
})
export class FaqListingComponent implements OnInit {
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  typeOfShorting: boolean = true;
  type: any;
  FaqList!: FAQVo[];
  selectedValue: string = 'Subscription';
  constructor(
    private subscriptionService: SubscriptionService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.selectedValue, this.page);
  }

  refresh(slectedValue: any, page: number) {
    this.loader
      .showLoader(
        this.subscriptionService.fetchFaqList(page, this.size, slectedValue)
      )
      .subscribe((res: any) => {
        this.FaqList = res.faqList;
        this.totalCount = res.totalCount;
      });
  }
  addFaq() {
    let dialogRef = this.dialog.open(AddFaqsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        isEdit: false,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any[]) => {
      if (res) {
        this.loader
          .showLoader(this.subscriptionService.getSubscriptionfaq())
          .subscribe((res: any) => {
            this.FaqList = res;
            this.refresh(this.selectedValue, 0);
          });

        dialogRef.close();
      }
    });
  }

  fetchFaq(a: any, b: number) {}

  pageChange(event: any) {
    this.refresh(this.selectedValue, event);
  }

  changeSize(event: any) {
    this.size = event;
    this.refresh(this.selectedValue, 0);
  }

  onValueChange(event: any) {
    this.selectedValue = event.target.value;
    this.page = 0;
    this.refresh(this.selectedValue, this.page);
  }

  editFaq(element: FAQVo) {
    let dialogRef = this.dialog.open(AddFaqsComponent, {
      autoFocus: false,
      disableClose: true,
      data: {
        body: element,
        isEdit: true,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any[]) => {
      if (res) {
        this.loader
          .showLoader(this.subscriptionService.getSubscriptionfaq())
          .subscribe((res: any) => {
            this.FaqList = res;
            this.refresh(this.selectedValue, 0);
          });

        dialogRef.close();
      }
    });
  }

  delete(id: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Faq?</p>',
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
          .showLoader(this.subscriptionService.deleteFaq(id))
          .subscribe(
            (res) => {
              this.alertService.successAlert('Deleted');
              this.refresh(this.selectedValue, this.page);
            },
            (err) => {
              this.alertService.errorAlert(err.error.message);
            }
          );
      } else if (result.isDenied) {
        this.alertService.errorAlert('Faq not deleted');
      }
    });
  }

  changeDisplayOrder(displayOrder: string, elementId: number) {
    this.loader
      .showLoader(
        this.subscriptionService.updateDisplayOrder(displayOrder, elementId)
      )
      .subscribe({
        next: (data: any) => {},
        error: (error: any) => {
          this.alertService.errorAlert('Internal Server Error');
        },
      });
  }

  short(type: any) {
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
}