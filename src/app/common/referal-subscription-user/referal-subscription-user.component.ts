import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-referal-subscription-user',
  standalone: true,
  imports: [],
  templateUrl: './referal-subscription-user.component.html',
  styleUrl: './referal-subscription-user.component.scss'
})
export class ReferalSubscriptionUserComponent implements OnInit {

  user!: any [];
  couponcode: any;
  link!: string;

  constructor(    private subscriptionService: SubscriptionService,) { }

  ngOnInit(): void {
    this.subscriptionService.getcurrentplan().subscribe((data: any) => {
     
      this.user = data.body.users.users.reverse();;
      this.couponcode = data.body.code;
      // this.link =
      //   environment.signupRoute + '/signup?code=' + this.couponcode;
    
    
    });
  }
  showMessage() {
    Swal.fire("","Referal Code Copied successfully!","success")
  }

}
