import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.scss'
})
export class PlanDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {}) { }

  ngOnInit(): void {
  }

}
