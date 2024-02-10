import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';
// import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../loader.service';
import { ApiResponse } from '../../model/ApiResponse';
import { PostVO } from '../../model/PostVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { InstituteService } from '../../services/institute/institute.service';
import { UserProfile } from '../create-profile/create-profile.component';
import { SocialApiService } from '../services/social-api.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BlogImageCropperComponent } from '../../common/blog-listing/blog-image-cropper/blog-image-cropper.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-post',
   
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit, OnDestroy {
  @Input() userProfile!: UserProfile;
  postId: number | undefined;
  isSubmit: boolean = false;
  postForm!: FormGroup;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  filesList: File[] = [];
  linksList: string[] = [];
  vacentSpace: number = 0;
  linkInput: boolean = false;
  linkError: boolean = false;
  // selectedFiles: FileWithPreview[] = [];
  addedFilesSize: number = 0;
  mediaToDelete: string[] = [];
  postVO: PostVO = new PostVO();
  visible: string = 'friends';
  type: string = 'POST';
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('openModal') openModal!: ElementRef;
  @Output() refreshNewsfeed = new EventEmitter<boolean>();
  postIdSubscription!: Subscription;
  filesBase64: string[] = [];

  constructor(
    private fb: FormBuilder,
    private instituteService: InstituteService,
    private loader: LoaderService,
    private socialService: SocialApiService,
    private alertService: SwalAlertService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnDestroy(): void {
    if (this.postIdSubscription) this.postIdSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.createPostForm();
    if (+AuthService.getInstituteId != 1) {
      this.fetchVacentSpace();
    }
    this.editPost();
  }

  editPost() {
    this.postIdSubscription = this.socialService.postId.subscribe({
      next: (response: any) => {
        this.postId = response;
        if (this.postId) {
          this.loader
            .showLoader(this.socialService.fetchPost(this.postId))
            .subscribe({
              next: (response: ApiResponse) => {
                this.postVO = response.body as PostVO;
                this.addedFilesSize = this.postVO.postMediaVOs.length;
                this.createPostForm();
                this.openModal.nativeElement.click();
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert(
                  'Error while fetching post details'
                );
              },
            });
        }
      },
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }

  createPostForm() {
    this.postForm = this.fb.group({
      postText: [this.postVO.postText],
      visibility: [
        this.postVO.visibility ? this.postVO.visibility : 'friends',
        Validators.required,
      ],
      type: [this.postVO.type ? this.postVO.type : 'POST', Validators.required],
    });
  }

  onEmojiSelection($event: any) {
    var text = this.postForm.get('postText')?.value;
    if (!text) text = '';
    text = text + ' ' + $event;
    this.postForm.get('postText')?.setValue(text);
  }

  deletePostMedia(mediaId: number) {
    this.mediaToDelete.push(mediaId.toString());
    const index = this.postVO.postMediaVOs.findIndex(
      (media) => media.id == mediaId
    );
    this.postVO.postMediaVOs.splice(index, 1);
    this.addedFilesSize -= 1;
  }

  onSubmit() {
    this.isSubmit = true;
    if (
      !this.postForm.get('postText')?.value &&
      this.filesList.length == 0 &&
      this.linksList.length == 0
    ) {
      return;
    }
    this.postVO = this.postForm.value;
    if (this.postId) {
      this.postVO.id = this.postId;
    }
    this.loader
      .showLoader(
        this.socialService.addPost(
          this.postVO,
          this.filesList,
          this.linksList,
          this.mediaToDelete
        )
      )
      .subscribe({
        next: (response: ApiResponse) => {
          this.closeModal.nativeElement.click();
          this.resetPostForm();
          this.refreshNewsfeed.emit(true);
          this.socialService.refreshProfile.next(true);
          this.showSnackbarBottomPosition(
            this.postId ? 'Post updated successfully!' : undefined
          );
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while adding post');
        },
      });
  }

  resetPostForm() {
    this.postForm.reset();
    this.postVO = new PostVO();
    this.postForm.patchValue({
      visibility: 'friends',
    });
    this.postForm.patchValue({
      type: 'POST',
    });
    this.isSubmit = false;
    this.linksList = [];
    this.filesList = [];
    this.filesBase64 = [];
    this.mediaToDelete = [];
  }

  removeImageFromList(index: number) {
    this.filesBase64.splice(index, 1);
    this.filesList.splice(index, 1);
  }

  removeLinkFromList(linkToRemove: string) {
    const index = this.linksList.findIndex((link) => link == linkToRemove);
    if (index != -1) {
      this.linksList.splice(index, 1);
    }
  }

  fetchVacentSpace() {
    this.instituteService.fetchVacentSpace().subscribe({
      next: (data: ApiResponse) => {
        this.vacentSpace = data.body;
      },
    });
  }

  changeVisibility(visibility: string) {
    this.visible = visibility;
    this.postForm.patchValue({
      visibility: visibility,
    });
  }

  changeType(type: string) {
    this.type = type;
    this.postForm.patchValue({
      type: type,
    });
  }

  addLink(link: string) {
    this.linkError = false;
    const pattern =
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = link.match(pattern);
    if (match) {
      this.linksList.push(link.replace('/watch?v=', '/embed/'));
      this.linkInput = false;
    } else {
      this.linkError = true;
    }
  }

  displayLinkInput() {
    if (
      (this.filesList.length < 3 ||
        this.linksList.length < 3 ||
        this.addedFilesSize < 3) &&
      this.filesList.length + this.linksList.length + this.addedFilesSize < 3
    ) {
      this.linkInput = true;
    } else {
      this.alertService.okErrorAlert(
        'You are not allowed to pick more than 3 media'
      );
    }
  }

  onFilesSelected(event: any): void {
    let file: File = event.target.files[0];

    let filesSize = 0;

    if (!file.name.includes('.jfif')) {
      if (file.size > 5242880) {
        this.alertService.errorAlert(
          'Image size should not be greater than 5 Mb'
        );
        this.fileSelect.nativeElement.value = '';
        this.filesList = [];
        filesSize = 0;
        return;
      } else {
        if (
          (this.filesList.length < 3 ||
            this.linksList.length < 3 ||
            this.addedFilesSize < 3) &&
          this.filesList.length + this.linksList.length + this.addedFilesSize <
            3
        ) {
          filesSize += file.size;

          const dialogRef = this.dialog.open(BlogImageCropperComponent, {
            data: {
              imageFile: file,
              isConvertbase64ToFile: true,
              widthRatio: this.filesList.length > 1 ? 1 : 2,
              heightRatio: 1,
            },
          });
          dialogRef.componentInstance.convertBase64ToFile.subscribe(
            (obj: { file: File; base64: string }) => {
              this.filesList.push(obj.file);
              this.filesBase64.push(obj.base64);
            }
          );
          dialogRef.componentInstance.cropedImageEvent.subscribe(
            (base64) => {}
          );
        } else {
          this.alertService.okErrorAlert(
            'You are not allowed to pick more than 3 media'
          );
        }
      }
    } else {
      this.alertService.okErrorAlert('.jfif file format is Not Allowed.');
      this.fileSelect.nativeElement.value = '';
      this.filesList = [];
      filesSize = 0;
      return;
    }

    if (+AuthService.getInstituteId != 1) {
      if (filesSize > this.vacentSpace) {
        this.alertService.okErrorAlert('Not enough space.');
        this.fileSelect.nativeElement.value = '';
        this.filesList = [];
        filesSize = 0;
      }
    }
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

  get controls() {
    return this.postForm.controls;
  }
}