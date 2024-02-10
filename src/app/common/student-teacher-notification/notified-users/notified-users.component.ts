import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { LoaderService } from '../../../loader.service';

import { NotificationService } from '../../../services/notification/notification.service';
import { UserV2VO } from '../create-student-teacher-notification/create-student-teacher-notification.component';

@Component({
  selector: 'app-notified-users',
   
  templateUrl: './notified-users.component.html',
  styleUrl: './notified-users.component.scss'
})
export class NotifiedUsersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  notificationId!: number;
  usersList: UserV2VO[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  @ViewChild('userSearch') userSearch!: ElementRef;
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
        this.notificationService.getNotifiedUsers(
          this.notificationId,
          page,
          this.size
        )
      )
      .subscribe({
        next: (data) => {
          this.usersList = data.usersList;
          this.totalCount = data.totalCount;
        },
        error: (err) => {},
      });
  }

  search() {
    this.searchSubscription = fromEvent(this.userSearch.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.loader
          .showLoader(
            this.notificationService.getNotifiedUsers(
              this.notificationId,
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.usersList = data.userList;
            this.totalCount = data.totalCount;
          });
      });
  }
}