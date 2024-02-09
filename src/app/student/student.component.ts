import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent implements OnInit {
  @Output('desktopHamburgerClick')
  desktopHamburgerClick: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  opensidebar!: any;
  scrHeight!: number;
  removecss!: boolean;
  constructor() {}

  ngOnInit(): void {
    this.getScreenSize();
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

