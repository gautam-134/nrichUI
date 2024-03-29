import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription, debounceTime, map, of } from 'rxjs';
import { searchResult } from '../../../../model/Search';
import { CommonService } from '../../../../services/common/common.service';

@Component({
  selector: 'app-lms-sign-up',
   
  templateUrl: './lms-sign-up.component.html',
  styleUrl: './lms-sign-up.component.scss'
})
export class LmsSignUpComponent implements OnInit {

  searchRes!: searchResult;
  subject = new Subject();
  result$!: Observable<any>;
  searchedText!: string;
  subscription!: Subscription;

  constructor(public commonService: CommonService, private router: Router) {}
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.ngInIt();
  }

  ngInIt() {
    this.subscription = this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== '' ? this.commonService.search(searchText) : of([])
        )
      )
      .subscribe((response) => {
        this.result$ = response;
        this.result$.subscribe((value: searchResult) => {
          this.searchRes = value;
        });
      });
  }

  search(evt: any) {
    this.searchedText = evt.target.value;
    if (this.searchedText.length >= 3) {
      this.subject.next(this.searchedText);
    }
  }

  redirect(type: string, id: number, name?: string) {
    switch (type) {
      case 'courses':
        this.router.navigateByUrl(`/course-info?id=${id}`);
        break;

      case 'institutions':
        this.router.navigateByUrl(
          `/institute-info?id=${id}&name=${name}`
        );
        break;

      case 'teachers':
        this.router.navigateByUrl(
          `/teacher-profile?id=${id}&name=${name}`
        );
        break;
    }
  }
}