import { Component, OnInit } from '@angular/core';
import { SocialApiService } from '../services/social-api.service';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { PostVO } from 'src/app/model/PostVO';
import { TimeService } from '../services/time.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss'
})
export class StoriesComponent implements OnInit {
  eventPage: number = 0;
  eventSize: number = 5;
  events: PostVO[] = [];

  constructor(
    private socialService: SocialApiService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    public timeService: TimeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.refreshEvents();
  }

  refresh() {
    this.loader
      .showLoader(this.socialService.getEvents(this.eventPage, this.eventSize))
      .subscribe({
        next: (response: ApiResponse) => {
          this.events = response.body.posts as PostVO[];
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching events');
        },
      });
  }

  viewEvents() {
    this.router.navigateByUrl(
      `/${AuthService.getModulePrefix}/social-connect/events`
    );
  }

  viewEvent(id: number) {
    this.router.navigateByUrl(
      `/${AuthService.getModulePrefix}/social-connect/events/${id}`
    );
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }

  refreshEvents() {
    this.socialService.refreshEvents.subscribe({
      next: (response: any) => {
        this.refresh();
      },
    });
  }
}