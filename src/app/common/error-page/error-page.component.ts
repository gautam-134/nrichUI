import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent implements OnInit {
  subDomainInstitute: number = 1;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.subDomainInstitute.subscribe((res) => {
      this.subDomainInstitute = res;
    });
  }

  backToLocation() {
    if (this.subDomainInstitute === 1) {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigate([`/institute-info`], {
        queryParams: { id: this.subDomainInstitute },
      });
    }
  }
}
