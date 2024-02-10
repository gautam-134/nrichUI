import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituteRoles } from '../../../enums/InstituteRoles';
import { LoaderService } from '../../../loader.service';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-signup-check',
   
  templateUrl: './new-signup-check.component.html',
  styleUrl: './new-signup-check.component.scss'
})
export class NewSignupCheckComponent implements OnInit {
  role: string = '';
  class1: string = 'non-active';
  class2: string = 'non-active';
  referralCode!: string | null;
  btnDisable: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.referralCode = this.activatedRoute.snapshot.paramMap.get('code');
  }

  @HostListener('window:beforeunload')
  beforeunload() {
    localStorage.removeItem('auth');
  }

  setActiveClass(val: number) {
    if (val == 1) {
      this.class1 = 'active';
      this.class2 = 'non-active';
    } else {
      this.class2 = 'active';
      this.class1 = 'non-active';
    }
  }

  checkRole() {
    if (this.role == 'student') {
      this.assignStudentRole();
      return;
    }
    if (this.role == 'admin') {
      this.assignAdminRole();
      return;
    }
  }

  assignStudentRole() {
    this.loader.loadingOn();
    this.btnDisable = true;
    if (!JSON.parse(localStorage.getItem('auth') || '{}').isProfileCompleted) {
      this.authService.assignStudentRole().subscribe(
        (res) => {
          this.loader.loadingOff();
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          var role = {
            authority: InstituteRoles.Student,
            roleType: InstituteRoles.Student,
          };
          auth.role = role;
          auth.selectedInstitute = 1;
          localStorage.setItem('auth', JSON.stringify(auth));
          this.router.navigateByUrl('/profile/student');
        },
        (err) => {
          this.loader.loadingOff();
          this.btnDisable = false;
          this.alertService.errorAlert('Something went wrong!');
        }
      );
    }
  }

  assignAdminRole() {
    this.loader.loadingOn();
    this.btnDisable = true;
    if (!JSON.parse(localStorage.getItem('auth') || '{}').isProfileCompleted) {
      this.authService.assignAdminRole().subscribe(
        (res) => {
          this.loader.loadingOff();
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          var role = {
            authority: InstituteRoles.InstituteAdmin,
            roleType: InstituteRoles.InstituteAdmin,
          };
          auth.role = role;
          auth.selectedInstitute = res;
          localStorage.setItem('auth', JSON.stringify(auth));
          if (this.referralCode) {
            this.router.navigateByUrl(
              `/profile/admin/${this.referralCode}`
            );
          } else {
            this.router.navigateByUrl('/profile/admin');
          }
        },
        (err) => {
          this.btnDisable = false;
          this.loader.loadingOff();
          this.alertService.errorAlert('Something went wrong!');
        }
      );
    }
  }
}
