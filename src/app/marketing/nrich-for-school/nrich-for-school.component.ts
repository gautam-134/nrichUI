import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';


@Component({
  selector: 'app-nrich-for-school',
  standalone: true,
  imports: [],
  templateUrl: './nrich-for-school.component.html',
  styleUrl: './nrich-for-school.component.scss'
})
export class NrichForSchoolComponent implements OnInit {



  @ViewChild('slickModal', { static: false })
  slickModal!: SlickCarouselComponent;
  @ViewChild('myDiv') myDiv!: ElementRef;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;
  selectedValue:string="School";
  isLogin: boolean = false;
  Annualplans: any[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.isLogin = this.authService.isLoggin();
    this.subscriptionService.getSubscriptionplan().subscribe((data: any) => {
      this.Annualplans = data.teacherPricingPlans;
    });
  }
  slides = [
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-2.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-2.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
  ];
  slideConfig = {
    slidesToShow: 1,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    dots: false,
    arrows: false,




  };
  slickInit(_e: any) {}

  breakpoint(_e: any) {}

  afterChange(_e: any) {
    this.lazyLoading = false;
  }

  beforeChange(_e: any) {}
  next() {
    this.slickModal.slickNext();
  }
  prev() {
    this.slickModal.slickPrev();
  }

  buyPlan(id: number) {
    if (this.isLogin) {
      this.router.navigate(['/checkout'], {
        queryParams: { id: id, type: 'pricingplan' },
      });
      return;
    }
    this.router.navigate(['/login']);
  }
  scrollToMyDiv(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

