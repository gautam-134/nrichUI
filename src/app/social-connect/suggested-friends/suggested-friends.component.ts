import { Component, HostListener, OnInit } from '@angular/core';
import { SocialApiService } from '../services/social-api.service';
import { ApiResponse } from '../../model/ApiResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../loader.service';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
// import { Inject } from '@angular/core';
@Component({
  selector: 'app-suggested-friends',
   
  templateUrl: './suggested-friends.component.html',
  styleUrl: './suggested-friends.component.scss'
})
export class SuggestedFriendsComponent implements OnInit {
  adminsList: SuggestedFriends = new SuggestedFriends();
  studentList: SuggestedFriends = new SuggestedFriends();
  teacherList: SuggestedFriends = new SuggestedFriends();
  adminPage: number = 0;
  adminTotalCount: number = 0;
  studentPage: number = 0;
  studentTotalCount: number = 0;
  teacherPage: number = 0;
  teacherTotalCount: number = 0;
  size = 6;
  showLoader: boolean = false;
  tab: string = 'admin';
  constructor(
    private socialApiService: SocialApiService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.fetchAdminFriends();
    this.fetchStudentFriends();
    this.fetchTeacherFriends();
  }

  tabChange(tab: string) {
    this.tab = tab;
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
      this.tab == 'admin' &&
      this.adminTotalCount != this.adminsList.friends.length
    ) {
      this.adminPage = this.adminPage + 1;
      this.fetchAdminFriends();
    } else if (
      scrollPosition + 1 >= maxScrollPosition &&
      this.tab == 'student' &&
      this.studentTotalCount != this.studentList.friends.length
    ) {
      this.studentPage = this.studentPage + 1;
      this.fetchStudentFriends();
    } else if (
      scrollPosition + 1 >= maxScrollPosition &&
      this.tab == 'teacher' &&
      this.teacherTotalCount != this.teacherList.friends.length
    ) {
      this.teacherPage = this.teacherPage + 1;
      this.fetchTeacherFriends();
    }
  }

  fetchAdminFriends() {
    this.showLoader = true;
    this.loader
      .showLoader(
        this.socialApiService.fetchSuggestedFriends(
          this.adminPage,
          this.size,
          'Admin'
        )
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.showLoader = false;
          this.adminTotalCount = data.body.count;
          if (data.body.friends.length != 0)
            this.adminsList.friends.push(...data.body.friends);
        },
        error: (error: HttpErrorResponse) => {
          this.showLoader = false;
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  fetchStudentFriends() {
    this.showLoader = true;
    this.loader
      .showLoader(
        this.socialApiService.fetchSuggestedFriends(
          this.studentPage,
          this.size,
          'Student'
        )
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.showLoader = false;
          this.studentTotalCount = data.body.count;
          if (data.body.friends.length != 0)
            this.studentList.friends.push(...data.body.friends);
        },
        error: (error: HttpErrorResponse) => {
          this.showLoader = false;
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  fetchTeacherFriends() {
    this.showLoader = true;
    this.loader
      .showLoader(
        this.socialApiService.fetchSuggestedFriends(
          this.teacherPage,
          this.size,
          'Teacher'
        )
      )
      .subscribe({
        next: (data: ApiResponse) => {
          this.showLoader = false;
          this.teacherTotalCount = data.body.count;
          if (data.body.friends.length != 0)
            this.teacherList.friends.push(...data.body.friends);
        },
        error: (error: HttpErrorResponse) => {
          this.showLoader = false;
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }
}

export class Friends {
  id!: number;
  profileImage!: string;
  coverImage!: string;
  name!: string;
  role!: string;
  status!: string;
  ago!: string;
}

export class SuggestedFriends {
  count!: number;
  friends: Friends[] = [];
}
