import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { PostVO } from 'src/app/model/PostVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile } from '../../create-profile/create-profile.component';
import { SocialApiService } from '../../services/social-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit {
  page: number = 0;
  size: number = 10;
  userProfile = new UserProfile();
  posts: PostVO[] = [];
  postsCount: number = 0;
  profileId: string | null | undefined;
  currentLoginProfileId!: string;
  roleType!: string;

  constructor(
    private socialService: SocialApiService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.profileId = this.route.snapshot.queryParams['id'];
    this.currentLoginProfileId = AuthService.getUserProfileId;
    this.roleType = AuthService.getRoleType;
    if (!this.profileId) {
      this.profileId = this.currentLoginProfileId;
    }
    if (+this.currentLoginProfileId == +this.profileId) {
      this.socialService.fetchProfile().subscribe({
        next: (response: ApiResponse) => {
          this.userProfile = response.body;
        },
        error: (error: HttpErrorResponse) => {},
      });
    }
    this.fetchProfilePosts(this.page, this.size);
  }

  fetchProfilePosts(page: number, size: number) {
    this.loader
      .showLoader(
        this.socialService.fetchProfilePosts(
          page,
          size,
          this.profileId ? +this.profileId : +this.currentLoginProfileId
        )
      )
      .subscribe({
        next: (response: ApiResponse) => {
          this.posts = response.body.posts as PostVO[];
          this.postsCount = response.body.postsCount;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching profile posts');
        },
      });
  }

  refreshProfile($event: any) {
    this.fetchProfilePosts(this.page, this.size);
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
      this.socialService
        .fetchProfilePosts(
          this.page,
          this.size,
          this.profileId ? +this.profileId : +this.currentLoginProfileId
        )
        .subscribe({
          next: (response: ApiResponse) => {
            this.posts.push(...(response.body.posts as PostVO[]));
            this.postsCount = response.body.postsCount;
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert('Error while fetching profile posts');
          },
        });
    }
  }
}
