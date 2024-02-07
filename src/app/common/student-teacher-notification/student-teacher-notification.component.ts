import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { NotificationVO } from 'src/app/model/Notification';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-student-teacher-notification',
  standalone: true,
  imports: [],
  templateUrl: './student-teacher-notification.component.html',
  styleUrl: './student-teacher-notification.component.scss'
})
export class StudentTeacherNotificationComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  notifications: NotificationVO[] = [];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;
  typeOfShorting: boolean = true;
  type: any;
  @ViewChild('notificationSearch') notificationSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private loader: LoaderService,
    private notificationService: NotificationService
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
      .showLoader(
        this.notificationService.getInstituteNotifications(page, this.size)
      )
      .subscribe({
        next: (data) => {
          this.notifications = data.notificationList;
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
            this.notificationService.getInstituteNotifications(
              0,
              this.size,
              data.target.value
            )
          )
          .subscribe((data: any) => {
            this.notifications = data.notificationList;
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

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
