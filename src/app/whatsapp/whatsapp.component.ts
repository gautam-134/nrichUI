import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../model/ApiResponse';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'app-whatsapp',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.scss'
})
export class WhatsappComponent implements OnInit {
  activeNumber!: number;
  constructor(private service: NotificationService) {}

  ngOnInit(): void {
    this.service.getWhatsAppActiveNumber().subscribe({
      next: (data: ApiResponse) => {
        this.activeNumber = data.body.activeNumber;
      },
      error: (error: any) => {},
    });
  }
}
