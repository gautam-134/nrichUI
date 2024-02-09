import { Component, OnInit } from '@angular/core';
import { SocialApiService } from '../social-api.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { UpcomingBirthdayVO } from 'src/app/model/UpComingBirthdayVO';

@Component({
  selector: 'app-upcoming-birthday',
  standalone: true,
  imports: [],
  templateUrl: './upcoming-birthday.component.html',
  styleUrl: './upcoming-birthday.component.scss'
})
export class UpcomingBirthdayComponent implements OnInit {
  page: number = 0;
  size: number = 3;
  totalUpcomingBirthdays: number = 0;
  upcomingBirthdaysList: UpcomingBirthdayVO[] = [];
  constructor(private socialConnectService: SocialApiService) {}

  ngOnInit(): void {
    this.fetchUpcomingBirthdays(this.page,false);
  }
  fetchUpcomingBirthdays(page: number,flag: boolean) {
    this.socialConnectService
      .fetchUpcomingBirthdays(page, this.size)
      .subscribe({
        next: (data: ApiResponse) => {
          if (flag == true) {
            this.upcomingBirthdaysList = this.upcomingBirthdaysList.concat(
              data.body?.birthdayList);
          } else {
            this.upcomingBirthdaysList = data.body?.birthdayList;
          }
          this.totalUpcomingBirthdays = data.body?.totalBirthdayCount;
        },
      });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/profile.png';
  }

  onScroll(event: any) {
    const element = event.target as HTMLElement;
    const scrollPosition = element.scrollHeight - element.scrollTop;
    const divHeight = element.clientHeight;
    if (scrollPosition === divHeight) {
      if (this.upcomingBirthdaysList.length != this.totalUpcomingBirthdays) {
        this.page += 1;
        this.fetchUpcomingBirthdays(this.page, true);
      }
    }
  }
}
