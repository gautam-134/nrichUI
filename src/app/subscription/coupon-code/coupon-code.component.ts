import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Observable, debounceTime, of, map } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { CouponList } from 'src/app/model/coupon.model';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { AddEditCouponComponent } from './add-edit-coupon/add-edit-coupon.component';

@Component({
  selector: 'app-coupon-code',
  standalone: true,
  imports: [],
  templateUrl: './coupon-code.component.html',
  styleUrl: './coupon-code.component.scss'
})
export class CouponCodeComponent implements OnInit {
  couponlist: CouponList[] = [];

  typeOfShorting:boolean=true;
  type: any;
  totalCount: any;
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;

  constructor(public dialog: MatDialog, private subscriptionservices: SubscriptionService, private router: Router,private loader:LoaderService) { }

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }
  addcoupen() {
    const dialogRef = this.dialog.open(AddEditCouponComponent, {
      data: {
        isEdit: false
      }

    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refresh(this.page);
    });


  }
  refresh(page:number) {
    this.loader.showLoader(this.subscriptionservices.getcoupens(page,this.size,this.searchParam)).subscribe((res) => {
      this.couponlist = res.body.coupenCodeDetails;
        this.totalCount = res.body.total_count;
    });

  }
  edit(element: any) {
    const dialogRef = this.dialog.open(AddEditCouponComponent, {
      data: {
        Body: element,
        isEdit: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refresh(this.page);
    });
  }
  view(id: any) {
    this.router.navigate(['/master/coupon-details'], {
      queryParams: { id: id, },
    });

  }

  short(type:any){
    this.typeOfShorting=!this.typeOfShorting
    this.type = type;
  
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

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
              this.subscriptionservices.getcoupens(
                this.page,this.size,this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res:any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.couponlist = value.body.coupenCodeDetails;
          this.totalCount = value.body.total_count;
        });
      });
  }
}
