import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-parent',
   
  templateUrl: './dashboard-parent.component.html',
  styleUrl: './dashboard-parent.component.scss'
})
export class DashboardParentComponent implements OnInit {
  role!: string;
  constructor() {}

  ngOnInit(): void {
    this.role = AuthService.getRoleType;
  }
}
