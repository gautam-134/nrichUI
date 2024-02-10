import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-nrich-legal-contact',
   
  templateUrl: './nrich-legal-contact.component.html',
  styleUrl: './nrich-legal-contact.component.scss'
})
export class NrichLegalContactComponent implements OnInit {
  active: number = 1;
  type: string | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      if (this.type === 'privacy-policy') {
        this.active = 1; // Set active to 1 for Privacy Policy
      } else if (this.type === 'terms-and-conditions') {
        this.active = 2; // Set active to 2 for Terms and Conditions
      }else if(this.type === 'refund-policy'){
        this.active = 4; // Set active to 2 for Terms and Conditions

      }
    });
  }


}
