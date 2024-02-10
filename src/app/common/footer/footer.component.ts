import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
   
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  subDomainInstitute: number = 1;
  subDomainInstituteName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.subDomainInstitute.subscribe({
      next: (instituteId: number) => {
        this.subDomainInstitute = instituteId;
      },
    });

    this.authService.subDomainInstituteName.subscribe({
      next: (instituteName: string) => {
        this.subDomainInstituteName = instituteName;
      },
    });
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
}
