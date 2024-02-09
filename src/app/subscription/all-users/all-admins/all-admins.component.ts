import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { AllUsers } from 'src/app/model/AllUsers';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-all-admins',
  standalone: true,
  imports: [],
  templateUrl: './all-admins.component.html',
  styleUrl: './all-admins.component.scss'
})
export class AllAdminsComponent implements OnInit, AfterViewInit, OnDestroy {
  admins: AllUsers[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('adminSearch') adminSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private masterService: MasterService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
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
      .showLoader(this.masterService.getAllAdmins(page, this.size))
      .subscribe((data: any) => {
        this.admins = data.admins;
        this.totalCount = data.totalCount;
      });
  }

  search() {
    this.searchSubscription = fromEvent(this.adminSearch.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.masterService.getAllAdmins(0, this.size, data.target.value)
          )
          .subscribe((data: any) => {
            this.admins = data.admins;
            this.totalCount = data.totalCount;
          });
      });
  }

  viewDetails(id: number) {
    this.router.navigate([`/${AuthService.getModulePrefix}/admin-details`], {
      queryParams: { id: id },
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }
}
