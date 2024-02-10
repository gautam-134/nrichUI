import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-marketing-header',
  templateUrl: './marketing-header.component.html',
  styleUrls: ['./marketing-header.component.scss'],
})
export class MarketingHeaderComponent implements OnInit {
  ishovered: boolean = false;
  isLogin: boolean = false;
  role!: any;
  instituteImageSrc: string = 'assets/svg/logo.svg';
  subDomainInstitute: number = 1;

  constructor(
    public authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngOnInit(): void {
    this.authService.subDomainInstitute.subscribe((res) => {
      this.subDomainInstitute = res;
    });
    this.isLogin = this.authService.isLoggin();
    this.authService.marketingHeaderLogo.subscribe({
      next: (logo: string) => {
        this.instituteImageSrc = logo;
      }
    })
    this.clearStorageWhenInstIdNull();
    this.role = JSON.parse(
      localStorage.getItem('auth') as string
    )?.role?.roleType;
    this.checkStudent();
  }

  checkStudent() {
    if (this.role == 'Student' && +AuthService.getInstituteId == 1) {
      return false;
    }
    return true;
  }

  clearStorageWhenInstIdNull() {
    if (localStorage.getItem('auth')) {
      if (AuthService.getInstituteId == undefined) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    }
  }
  openDashboard() {
    // if (this.subDomainInstitute === 1) {
    //   this.router.navigateByUrl('/');
    // } else {
    //   this.router.navigate([`/institute-info`], {
    //     queryParams: { id: this.subDomainInstitute },
    //   });
    // }
    this.router.navigate([`${AuthService.getModulePrefix}/enrollments`]);
  }

  navigateToInstitute() {
    if (this.subDomainInstitute === 1) {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigate([`/institute-info`], {
        queryParams: { id: this.subDomainInstitute },
      });
    }
  }

  logout() {
    this.loader.loadingOn();
    this.authService.logout().subscribe({
      next: (data: any) => {
        this.authService.loggedInSubject.next(false);
        localStorage.clear();
        this.loader.loadingOff();
        this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.loader.loadingOff();
        this.alertService.errorAlert(error.error.message);
      },
    });
    // this.router.navigate(['/']);
  }
}
