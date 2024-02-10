import {
  Component, Input,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../model/Menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
   
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  @Input() sidebaropen!: boolean;

  menu: Menu[] = [];
  open!: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  currentUrl: string = '';

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.getSideMenus();
  }

  getSideMenus() {
    this.authService
      .getUserMenuBar(
        JSON.parse(localStorage.getItem('auth') as string).selectedInstitute
      )
      .subscribe((res: any) => {
         this.menu = res;
  
      });
  }

  toggleMenu() {
    const element = document.getElementById('toggleMenu');
    if (element) element.click();
  }
}
