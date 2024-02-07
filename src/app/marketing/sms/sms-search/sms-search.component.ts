import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject, Subscription } from 'rxjs';
import { searchResult } from 'src/app/model/Search';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-sms-search',
  standalone: true,
  imports: [],
  templateUrl: './sms-search.component.html',
  styleUrl: './sms-search.component.scss'
})
export class SmsSearchComponent implements OnInit {
  searchRes!: searchResult;
  subject = new Subject();
  result$!: Observable<any>;
  searchedText!: string;
  subscription!: Subscription;

  constructor(private router: Router, private commonService: CommonService) {}

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