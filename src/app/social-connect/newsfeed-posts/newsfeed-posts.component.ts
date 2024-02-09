import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { PostCommentsVO, PostVO } from 'src/app/model/PostVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocialApiService } from '../services/social-api.service';
import { TimeService } from '../services/time.service';
import { ReportAbuseOnPostComponent } from './report-abuse-on-post/report-abuse-on-post.component';

@Component({
  selector: 'app-newsfeed-posts',
  standalone: true,
  imports: [],
  templateUrl: './newsfeed-posts.component.html',
  styleUrl: './newsfeed-posts.component.scss'
})
export class NewsfeedPostsComponent implements OnInit, OnChanges {
  @Input() posts: PostVO[] = [];
  @Input() postsCount!: number;
  userProfileId!: number;
  roleType!: string;
  isEditEnabled: boolean = true;
  @Output() refreshNewsfeed = new EventEmitter<boolean>();
  showButton: boolean = false;
  hoverId: number | undefined;
  isFullScreen: boolean = false;
  constructor(
    private socialService: SocialApiService,
    public timeService: TimeService,
    private alertService: SwalAlertService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userProfileId = +AuthService.getUserProfileId;
    this.roleType = AuthService.getRoleType;
    if (this.router.url.includes('/events')) {
      this.isEditEnabled = false;
    }
  }

  ngOnChanges() {}

  editPost(postId: number) {
    this.socialService.postId.next(postId);
  }

  likePost(postId: number) {
    this.socialService.likePost(postId).subscribe({
      next: (response: ApiResponse) => {
        const index = this.posts.findIndex((post) => post.id == postId);
        if (index != -1) {
          if (this.posts[index].likedByYou) {
            this.posts[index].likesCount = this.posts[index].likesCount - 1;
          } else {
            this.posts[index].likesCount = this.posts[index].likesCount + 1;
          }
          this.posts[index].likedByYou = !this.posts[index].likedByYou;
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.showSnackbarBottomPosition(error.error.message);
        } else {
          this.alertService.errorAlert('Error while liking the post');
        }
      },
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }

  commentOnPost(postId: number, commentVal: string) {
    // let commentVal = this.commentInput.nativeElement.value;
    if (commentVal) {
      this.socialService.commentPost(postId, commentVal).subscribe({
        next: (response: ApiResponse) => {
          const index = this.posts.findIndex((post) => post.id == postId);
          if (index != -1) {
            this.posts[index].postCommentsVOs.unshift(
              response.body as PostCommentsVO
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 404) {
            this.showSnackbarBottomPosition(error.error.message);
          } else {
            this.alertService.errorAlert('Error while commenting on post');
          }
        },
      });
    }
  }

  onKeyDown(event: any, postId: number, commentValue: string) {
    this.commentOnPost(postId, commentValue);
  }

  deleteComment(post: PostVO, commentId: number) {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this comment',
        'Yes, Delete'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.socialService.deleteComment(commentId))
            .subscribe({
              next: (response: ApiResponse) => {
                const postIndex = this.posts.findIndex((p) => p.id == post.id);
                if (postIndex != -1) {
                  const commentIndex = this.posts[
                    postIndex
                  ].postCommentsVOs.findIndex(
                    (comment) => comment.id == commentId
                  );
                  if (commentIndex != -1) {
                    this.posts[postIndex].postCommentsVOs.splice(
                      commentIndex,
                      1
                    );
                    this.showSnackbarBottomPosition(response.message);
                  }
                }
              },
              error: (error: HttpErrorResponse) => {
                if (error.status == 404) {
                  this.showSnackbarBottomPosition(error.error.message);
                } else {
                  this.alertService.errorAlert('Error while deleting comment');
                }
              },
            });
        }
      });
  }

  deletePost(postId: number) {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this post',
        'Yes, Delete'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.socialService.deletePost(postId))
            .subscribe({
              next: (response: ApiResponse) => {
                const index = this.posts.findIndex(
                  (post) => (post.id = postId)
                );
                if (index != -1) {
                  this.posts.splice(index, 1);
                  this.refreshNewsfeed.emit(true);
                  this.socialService.refreshProfile.next(true);
                  this.showSnackbarBottomPosition(response.message);
                }
              },
              error: (error: HttpErrorResponse) => {
                if (error.status == 404) {
                  this.showSnackbarBottomPosition(error.error.message);
                } else {
                  this.alertService.errorAlert('Error while deleting post');
                }
              },
            });
        }
      });
  }

  openReportDialog(postId: any) {
    let dialogRef = this.dialog.open(ReportAbuseOnPostComponent, {
      width: '400px',
      height: '490px',
      data: {
        postId: postId,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        dialogRef.close();
      }
    });
  }

  showSnackbarBottomPosition(content?: string) {
    if (content) {
      let sb = this.snackBar.open(content, 'OK', {
        duration: 1500,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
      sb.onAction().subscribe(() => {
        sb.dismiss();
      });
    }
  }

  openProfile(id:number){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/profile`], {
      queryParams: { id: id },
    });
  }

  // openSliderForImage(post: any, index: number) {
  //   const imageMedia = post.postMediaVOs.filter((media: any) => media.mediaType === 'Image');
  //   const imageNames = imageMedia.map((media: any) => media.mediaName);
  
  //   this.dialog.open(SliderComponent, {
  //     data: {
  //       media: imageNames,
  //       initialIndex: index
  //     },
  //   });
  // }

  showVideoInFullScreen(id: string) {
    const fullScreenElemmentContainer = document.getElementById(id);
    if (this.isFullScreen) {
      document.exitFullscreen();
      return;
    }
    if (fullScreenElemmentContainer?.requestFullscreen) {
      fullScreenElemmentContainer?.requestFullscreen();
    }
  }
  
}