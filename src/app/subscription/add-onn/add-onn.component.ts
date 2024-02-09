import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, debounceTime, map, of } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { addOnPlan } from 'src/app/model/addOn.model';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { AddEditAddonnsComponent } from './add-edit-addonns/add-edit-addonns.component';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';

@Component({
  selector: 'app-add-onn',
  standalone: true,
  imports: [],
  templateUrl: './add-onn.component.html',
  styleUrl: './add-onn.component.scss'
})
export class AddOnnComponent implements OnInit {
  addonslist: addOnPlan[] = [];
  open!: number;
  typeOfShorting: boolean = true;
  type: any;
  totalCount: any;
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  subject = new Subject<string>();
  result$!: Observable<any>;
  sacCodes: number[] = [];
  constructor(
    private subscription: SubscriptionService,
    public dialog: MatDialog,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.getaddOnns(this.page);
    this.applyFilter();
    this.fetchSacCodes();
  }
  getaddOnns(page: number) {
    this.loader
      .showLoader(
        this.subscription.getAddOnPlansList(page, this.size, this.searchParam)
      )
      .subscribe((data: any) => {
        this.addonslist = data.body.addOnList;
        this.totalCount = data.body.total_count;
      });
  }
  addons() {
    const dialogRef = this.dialog.open(AddEditAddonnsComponent, {
      disableClose: true,
      data: { isEdit: false, sacCodes: this.sacCodes },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getaddOnns(this.page);
    });
  }

  changePage(page: number) {
    this.page = page;
    this.getaddOnns(this.page);
  }

  changeSize(event: number) {
    this.size = event;
    this.getaddOnns(0);
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.getaddOnns(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }
  editPlan(row: addOnPlan) {
    this.dialog
      .open(AddEditAddonnsComponent, {
        disableClose: true,
        data: {
          row: row,
          isEdit: true,
          sacCodes: this.sacCodes,
        },
      })
      .componentInstance.isSuccess.subscribe((data: boolean) => {
        if (data) {
          this.getaddOnns(this.page);
        }
      });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
                this.subscription.getAddOnPlansList(
                  this.page,
                  this.size,
                  this.searchParam
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.addonslist = value.body.addOnList;
          this.totalCount = value.body.total_count;
        });
      });
  }
  fetchSacCodes() {
    this.loader.showLoader(this.subscription.fetchSacCodes()).subscribe({
      next: (data: ApiResponse) => {
        this.sacCodes = data.body;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert(error.error.message);
      },
    });
  }
}
