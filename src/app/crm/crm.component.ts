import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crm',
   
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss'
})
export class CrmComponent implements OnInit {
  @Output('desktopHamburgerClick')
  desktopHamburgerClick: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  opensidebar!: any;
  scrHeight!: number;
  removecss!: boolean;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getScreenSize();
    const url = localStorage.getItem('redirectRoute');
    if (url) {
      this.router.navigate([url]);
      localStorage.removeItem('redirectRoute');
    }
  }
  toggleDesktopSidebarOpen(value: Boolean) {
    this.opensidebar = value;
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;

    if (window.innerWidth <= 900) {
      this.removecss = true;
    } else {
      this.removecss = false;
    }
  }
}
