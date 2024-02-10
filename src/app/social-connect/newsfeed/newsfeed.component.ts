import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../loader.service';
import { ApiResponse } from '../../model/ApiResponse';
import { PostVO } from '../../model/PostVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { UserProfile } from '../create-profile/create-profile.component';
import { SocialApiService } from '../services/social-api.service';
// import { Inject } from '@angular/core';
@Component({
  selector: 'app-newsfeed',
   
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.scss'
})
export class NewsfeedComponent implements OnInit {
  page: number = 0;
  size: number = 10;
  posts: PostVO[] = [];
  userProfile = new UserProfile();
  postId!: number;
  postsCount: number = 0;
  newPostCount: number = 0;

  constructor(
    private socialService: SocialApiService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getNewsFeed(this.page, this.size);
    this.socialService.fetchProfile().subscribe({
      next: (response: ApiResponse) => {
        this.userProfile = response.body;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  getNewsFeed(page: number, size: number) {
    this.loader
      .showLoader(this.socialService.fetchNewsfeed(page, size))
      .subscribe({
        next: (response: ApiResponse) => {
          this.posts = response.body.posts as PostVO[];
          this.postsCount = response.body.postsCount;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching newsfeed');
        },
      });
  }

  refreshNewsfeed($event: any) {
    this.page = 0;
    this.socialService.refreshEvents.next(true);
    this.getNewsFeed(this.page, this.size);
  }

  refreshPostCount(event: any) {
    this.postsCount -= 1;
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
      this.postsCount > this.posts.length
    ) {
      this.page = this.page + 1;
      this.socialService.fetchNewsfeed(this.page, this.size).subscribe({
        next: (response: ApiResponse) => {
          this.posts.push(...(response.body.posts as PostVO[]));
          this.newPostCount = response.body.postsCount - this.postsCount;
          if (this.newPostCount > 0) {
            this.showSnackbarTopPosition(
              `${this.newPostCount} new ${
                this.newPostCount == 1 ? 'post' : 'posts'
              }`
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching newsfeed');
        },
      });
    }
  }

  showSnackbarTopPosition(content: string) {
    let sb = this.snackBar.open(content, 'Refresh', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
      this.page = 0;
      this.getNewsFeed(this.page, this.size);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}