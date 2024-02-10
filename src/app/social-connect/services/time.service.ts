import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  calculateDaysAgo(createdDate: Date): number {
    let providedDate = new Date(createdDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - providedDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference == -1 ? 1 : daysDifference;
  }

  calculateHoursAgo(createdDate: Date): number {
    let providedDate = new Date(createdDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - providedDate.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    return hoursDifference;
  }

  calculateMinutesAgo(createdDate: Date): number {
    let providedDate = new Date(createdDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - providedDate.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return minutesDifference;
  }
}
