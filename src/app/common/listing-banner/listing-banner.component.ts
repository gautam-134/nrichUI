import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listing-banner',
  standalone: true,
  imports: [],
  templateUrl: './listing-banner.component.html',
  styleUrl: './listing-banner.component.scss'
})
export class ListingBannerComponent implements OnInit {
  isLogin: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLogin = this.authService.isLoggin();
  }

  onSignup() {
    if (!this.isLogin) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([`/${AuthService.getModulePrefix}/dashboard`]);
  }
}

