import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marketing-footer',
  templateUrl: './marketing-footer.component.html',
  styleUrls: ['./marketing-footer.component.scss'],
})
export class MarketingFooterComponent implements OnInit {
  isLogin: boolean = false;
  instituteId: number = 1;
  subDomainInstituteName: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.subDomainInstitute.subscribe({
      next: (res: number) => {
        this.instituteId = res;
      },
    });
    this.isLogin = this.authService.isLoggin();
    this.authService.subDomainInstituteName.subscribe({
      next: (instituteName: string) => {
        this.subDomainInstituteName = instituteName;
      },
    });
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  commingSoon() {
    Swal.fire({
      position: 'top-end',
      title: 'Coming Soon !',
      showConfirmButton: false,
      timer: 1500,
      width: 300,
    });
  }
}
