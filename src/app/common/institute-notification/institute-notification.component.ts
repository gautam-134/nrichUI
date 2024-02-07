import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { NotificationVO } from 'src/app/model/Notification';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-institute-notification',
  standalone: true,
  imports: [],
  templateUrl: './institute-notification.component.html',
  styleUrl: './institute-notification.component.scss'
})
export class InstituteNotificationComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  notifications: NotificationVO[] = [];
  page: number = 0;
  size: number = 5;
  totalCount: number = 0;
  typeOfShorting: boolean = true;
  type: any;
  @ViewChild('notificationSearch') notificationSearch!: ElementRef;
  searchSubscription!: Subscription;

  constructor(
    private loader: LoaderService,
    private notificationService: NotificationService,
    private router: Router,
    private alertService: SwalAlertService
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

  editNotification(element: any) {
    this.router.navigate(
      [`${AuthService.getModulePrefix}/create-notification`],
      {
        queryParams: { id: element.id },
      }
    );
  }

  deleteNotification(id: any) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Notification?</p>',
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
          .showLoader(this.notificationService.deleteNotification(id))
          .subscribe(
            (res) => {
              this.alertService.successAlert('Deleted');
              this.refresh(this.page);
            },
            (err) => {
              this.alertService.errorAlert(err.error.message);
            }
          );
      } else if (result.isDenied) {
        this.alertService.okErrorAlert('Notification not deleted');
      }
    });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
