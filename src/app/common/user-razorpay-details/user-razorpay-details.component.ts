import { Component, OnInit } from '@angular/core';

class RazorpayDetails {
  id!: number;
  razorPayKeyId!: string;
  razorPaySecret!: string;
  instituteId!: number;
}

@Component({
  selector: 'app-user-razorpay-details',
   
  templateUrl: './user-razorpay-details.component.html',
  styleUrl: './user-razorpay-details.component.scss'
})
export class UserRazorpayDetailsComponent implements OnInit {
  razorpaydetails = new RazorpayDetails();
  constructor() {}

  ngOnInit(): void {}
}
