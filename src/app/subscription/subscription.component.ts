import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  @Output('desktopHamburgerClick')
  desktopHamburgerClick: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  opensidebar!: any;
  scrHeight!: number;
  removecss!: boolean;
  constructor(private router: Router) { }
  ngOnDestroy(): void {
  }

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

