import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';

import { NotifiedInstitutesVO } from 'src/app/model/Notification';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-notified-institutes',
  standalone: true,
  imports: [],
  templateUrl: './notified-institutes.component.html',
  styleUrl: './notified-institutes.component.scss'
})
export class NotifiedInstitutesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  notificationId!: number;
  instituteList: NotifiedInstitutesVO[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('instituteSearch') instituteSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notificationId = this.route.snapshot.queryParams['id'];
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
      .showLoader(
        this.notificationService.getNotifiedInstitutes(
          this.notificationId,
          page,
          this.size
        )
      )
      .subscribe({
        next: (data) => {
          this.instituteList = data.instituteList;
          this.totalCount = data.totalCount;
        },
        error: (err) => {},
      });
  }

  search() {
    this.searchSubscription = fromEvent(
      this.instituteSearch.nativeElement,
      'keyup'
    )
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.notificationService.getNotifiedInstitutes(
              this.notificationId,
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.instituteList = data.instituteList;
            this.totalCount = data.totalCount;
          });
      });
  }
}
