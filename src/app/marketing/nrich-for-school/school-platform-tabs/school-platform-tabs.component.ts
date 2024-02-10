import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-school-platform-tabs',
   
  templateUrl: './school-platform-tabs.component.html',
  styleUrl: './school-platform-tabs.component.scss'
})
export class SchoolPlatformTabsComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  dashboardRedirect() {
    if (this.authService.isLoggin())
      this.router.navigateByUrl(`${AuthService.getModulePrefix}/dashboard`);
    else this.router.navigateByUrl('/');
  }

  courseRedirect() {
    this.router.navigate(['/course-list'], {
      queryParams: { search: 'allCourses' },
    });
  }
}
