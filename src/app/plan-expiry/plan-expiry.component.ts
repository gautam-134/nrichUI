import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../services/alert/swal-alert.service';

@Component({
  selector: 'app-plan-expiry',
  standalone: true,
  imports: [],
  templateUrl: './plan-expiry.component.html',
  styleUrl: './plan-expiry.component.scss'
})
export class PlanExpiryComponent implements OnInit {
  roleType!: string;

  constructor(public authService: AuthService,
    private router: Router,
    private loader: LoaderService,
    private alertService: SwalAlertService) {}

  ngOnInit(): void {
    this.roleType = AuthService.getRoleType;
  }

  navigateToPricingPlans() {
    this.router.navigate(['/pricing-for-learning-management-system']);
  }

  navigateToMarketing() {
    this.router.navigate(['/']);
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