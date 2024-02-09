import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { StudentService } from 'src/app/services/student/student.service';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit {
  searchParam: string = '';
  totalCount!: number;
  page: number = 0;
  size: number = 5;
  subject = new Subject<string>();
  result$!: Observable<any>;
  typeOfShorting: boolean = true;
  type: any;
  purchaseHistories: PurchaseHistory[] = [];

  constructor(
    private loader: LoaderService,
    private studentService: StudentService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.getPurchaseHistory(this.page);
  }

  getPurchaseHistory(page: number) {
    this.loader
      .showLoader(this.studentService.getPurchaseHistory(this.size, page))
      .subscribe((res: any) => {
        this.purchaseHistories = res.body.data as PurchaseHistory[];
        this.totalCount = res.body.totalCount;
      });
  }

  changeSize(size: number) {
    this.size = size;
    this.page = 0;
    this.getPurchaseHistory(this.page);
  }

  pageChange(page: number) {
    this.page = page;
    this.getPurchaseHistory(this.page);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  downloadInvoice(id: number) {
    this.loader
      .showLoader(this.studentService.downloadFile(id))
      .subscribe(
        (data: any) => {
          const blob = new Blob([data], { type: data.type });
          saveAs(blob, "invoice.pdf");
        },
        (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            error.error.messaage ? error.error.messaage : "Something went wrong !"
          );
        }
      );
  }
}

export class PurchaseHistory {
  id!: number;
  courseName!: string;
  purchaseDate!: Date;
  totalAmount!: number;
  amountPayed!: number;
  discount!: number;
}