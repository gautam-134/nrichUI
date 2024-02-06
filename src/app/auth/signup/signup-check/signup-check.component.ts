import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstituteRoles } from 'src/app/enums/InstituteRoles';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup-check',
  standalone: true,
  imports: [],
  templateUrl: './signup-check.component.html',
  styleUrl: './signup-check.component.scss'
})
export class SignupCheckComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {}

  assignStudentRole() {
    this.loader.loadingOn();
    if (!JSON.parse(localStorage.getItem('auth') || '{}').isProfileCompleted) {
      this.authService.assignStudentRole().subscribe(
        (res) => {
          this.loader.loadingOff();
          var auth = JSON.parse(localStorage.getItem('auth') || '{}');
          var role = { authority: 'Student', roleType: InstituteRoles.Student };
          auth.role = role;
          auth.selectedInstitute = 1;
          localStorage.setItem('auth', JSON.stringify(auth));
          this.router.navigate(['/signup'], {
            queryParams: { type: 'student' },
          });
        },
        (err) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Something went wrong!');
        }
      );
    }
  }

  assignAdminRole() {
    this.loader.loadingOn();
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
          this.router.navigate(['/signup'], {
            queryParams: { type: 'admin' },
          });
        },
        (err) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Something went wrong!');
        }
      );
    }
  }
}