import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nrich-social-connect',
   
  templateUrl: './nrich-social-connect.component.html',
  styleUrl: './nrich-social-connect.component.scss'
})
export class NrichSocialConnectComponent implements OnInit {
  selectedValue: string = 'Social';
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
