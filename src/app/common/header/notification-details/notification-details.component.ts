import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  imports: [],
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.scss'
})
export class NotificationDetailsComponent implements OnInit {
  title!: string;
  notification!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string }
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.notification = this.data.text;
  }
}
