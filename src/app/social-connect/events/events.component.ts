import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { PostVO } from 'src/app/model/PostVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { SocialApiService } from '../services/social-api.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  page: number = 0;
  size: number = 10;
  events: PostVO[] = [];
  eventsCount!: number;

  constructor(
    private socialService: SocialApiService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) this.getEvent(id);
    else this.getEvents(this.page, this.size);
  }

  getEvent(id: number) {
    this.loader.showLoader(this.socialService.getEvent(id)).subscribe({
      next: (response: ApiResponse) => {
        this.events = response.body.posts as PostVO[];
        this.eventsCount = response.body.postsCount;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(error.error.message);
      },
    });
  }

  getEvents(page: number, size: number) {
    this.loader.showLoader(this.socialService.getEvents(page, size)).subscribe({
      next: (response: ApiResponse) => {
        this.events = response.body.posts as PostVO[];
        this.eventsCount = response.body.postsCount;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error while fetching profile posts');
      },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    const maxScrollPosition = documentHeight - windowHeight;
    if (
      scrollPosition + 1 >= maxScrollPosition &&
      this.eventsCount > this.events.length
    ) {
      this.page = this.page + 1;
      this.socialService.getEvents(this.page, this.size).subscribe({
        next: (response: ApiResponse) => {
          this.events.push(...(response.body.posts as PostVO[]));
          this.eventsCount = response.body.postsCount;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching events');
        },
      });
    }
  }
}