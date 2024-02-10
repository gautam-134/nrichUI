import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-users',
   
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent implements OnInit {
  tab: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
