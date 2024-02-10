import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-on-boarding-page',
   
  templateUrl: './on-boarding-page.component.html',
  styleUrl: './on-boarding-page.component.scss'
})
export class OnBoardingPageComponent implements OnInit {
  name!: string;
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.name = AuthService.getUserFirstName;
    // var auth = JSON.parse(localStorage.getItem('auth') as string);
    // this.authService.getUserProfile('').subscribe({
    //   next: (data) => {
    //     this.name = data.name ? data.name : auth.mobile_number;
    //     this.authService.nameSubject.next(
    //       data.name ? data.name : auth.mobile_number
    //     );
    //   },
    //   error: (error) => {},
    // });
  }
  goToDashboard() {
    this.router.navigate([AuthService.getModulePrefix + '/dashboard']);
  }
  goToInstitute() {
    const element = document.getElementById('instituteManager');
    const isExpand = element?.getAttribute('aria-expanded');
    if (isExpand == 'false') {
      this.router.navigate([AuthService.getModulePrefix + '/institutes']);
      element?.click();
      return;
    }
    this.router.navigate([AuthService.getModulePrefix + '/institutes']);
  }

  goToLearningManager() {
    const element = document.getElementById('learningManager');
    const isExpand = element?.getAttribute('aria-expanded');
    if (isExpand == 'false') {
      this.router.navigate([AuthService.getModulePrefix + '/courses']);
      element?.click();
      return;
    }
    this.router.navigate([AuthService.getModulePrefix + '/courses']);
  }
  support() {
    this.router.navigate([AuthService.getModulePrefix + '/support']);
  }
}
