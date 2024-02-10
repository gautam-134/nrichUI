import { Component, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime, map, of } from 'rxjs';
import { SocialApiService } from '../services/social-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { Inject } from '@angular/core';
@Component({
  selector: 'app-global-search',
   
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent implements OnInit {
  profiles: GlobalSearchVO[] = [];
  subject = new Subject<string>();
  searchParam: string = '';
  result$!: Observable<any>;

  constructor(
    private socialService: SocialApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applyFilter();
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.profiles = [];
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(500),
        map((searchText: string) =>
          searchText !== ''
            ? this.socialService.getUsersGlobally(this.searchParam)
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.profiles = value?.body;
        });
      });
  }

  goToProfile(profileId: number) {
    this.router.navigate(
      [`${AuthService.getModulePrefix}/social-connect/profile`],
      {
        queryParams: { id: profileId },
      }
    );
  }

  goToNewsFeed(){
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/newsfeed`,
    ]);
  }

  myProfile() {
    this.router.navigate([
      `/${AuthService.getModulePrefix}/social-connect/profile`,
    ]);
  }
}

export class GlobalSearchVO {
  id!: number;
  name!: string;
  profileImage!: string;
}
