import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../loader.service';
import { PostCommentsVO, PostVO } from '../../model/PostVO';
import { ApiResponse } from '../../model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { TimeService } from '../services/time.service';
import { AuthService } from '../../services/auth.service';
import { SocialApiService } from '../services/social-api.service';
import { Location } from '@angular/common';
import { TakeActionOnReportedPostComponent } from './take-action-on-reported-post/take-action-on-reported-post.component';
import { MatDialog } from '@angular/material/dialog';
// import { Inject } from '@angular/core';
@Component({
  selector: 'app-view-post',
   
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss'
})
export class ViewPostComponent implements OnInit {
  post: PostVO = new PostVO();
  postId: string | null | undefined;
  userProfileId!: number;
  roleType!: string;
  comment: string = '';
  isFullScreen: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private socialService: SocialApiService,
    private alertService: SwalAlertService,
    public timeService: TimeService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.queryParams?.['postId'];
    if (this.postId) {
      this.userProfileId = +AuthService.getUserProfileId;
      this.roleType = AuthService.getRoleType;
      this.loader
        .showLoader(this.socialService.fetchPost(+this.postId))
        .subscribe({
          next: (response: ApiResponse) => {
            this.post = response.body as PostVO;
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert('Error while fetching post details');
          },
        });
    }
  }

  likePost(postId: number) {
    this.socialService.likePost(postId).subscribe({
      next: (response: ApiResponse) => {
        if (this.post.likedByYou) {
          this.post.likesCount = this.post.likesCount - 1;
        } else {
          this.post.likesCount = this.post.likesCount + 1;
        }
        this.post.likedByYou = !this.post.likedByYou;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  commentOnPost(postId: number) {
    if (this.comment != '') {
      this.socialService.commentPost(postId, this.comment).subscribe({
        next: (response: ApiResponse) => {
          this.post.postCommentsVOs.unshift(response.body as PostCommentsVO);
          this.cdr.detectChanges();
          this.comment = '';
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while commenting on post');
        },
      });
      this.cdr.detectChanges();
    }
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
                const commentIndex = this.post.postCommentsVOs.findIndex(
                  (comment) => comment.id == commentId
                );
                if (commentIndex != -1) {
                  this.post.postCommentsVOs.splice(commentIndex, 1);
                  this.cdr.detectChanges();
                  this.alertService.successAlert(response.message);
                }
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting comment');
              },
            });
          this.cdr.detectChanges();
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
                this.alertService.successAlert(response.message);
                this.location.back();
              },
              error: (HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting post');
              },
            });
        }
      });
  }

  takeActionAfterReport(postId:any){
    let dialogRef = this.dialog.open(TakeActionOnReportedPostComponent, {
   width: '520px',
    height: '475px',
      data: {
        postId: postId,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        // this.fetchStickyNotes(0, false);
        dialogRef.close();
      }
    });
  }

  openProfile(id:number){
    this.router.navigate([`${AuthService.getModulePrefix}/social-connect/profile`], {
      queryParams: { id: id },
    });
  }

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