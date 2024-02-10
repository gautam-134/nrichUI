import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { addOnPlan } from '../../model/addOn.model';
import { FAQ } from '../../model/Subscription';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription/subscription.service';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss'],
})
export class SubscriptionPlanComponent implements OnInit, OnDestroy {
  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;
  @ViewChild('myDiv') myDiv!: ElementRef;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;
  isLogin: boolean = false;
  monthlyplans: any[] = [];
  Annualplans: any[] = [];
  Faqlist!: FAQ[];
  addOns: addOnPlan[] = [];
  bucketName!: string;
  selectedValue: string = 'Subscription';
  metatags: string[] = [
    'free course list',
    'teach and mint in web',
    'online teaching',
    'teach online and earn',
    'teach classes online',
    'online school',
    'online learning platforms',
    'teach for india ',
    'how much does online teachers earn?',
    'teach online and earn money in india quora?',
    ' how to make online teaching effective?',
  ];
  metadescription: string =
    'At NRICH, we believe that teachers should be empowered to create and share their best online teaching materials';
  constructor(
    public dialog: MatDialog,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private meta: Meta
  ) {}

  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }

  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }
  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description");
    this.titleService.setTitle('Nrich Learning');
  }

  handlePlanScroll() {
    const position = localStorage.getItem('scrollPosition');
    if (position) {
      window.scrollTo(0, +position);
      localStorage.removeItem('scrollPosition');
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'NRICH Learning takes your teaching to global audience'
    );
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription,
    });
    // this.bucketName=AuthService.getBucketName
    this.isLogin = this.authService.isLoggin();
    this.handlePlanScroll();
    const body = document.getElementsByTagName('body')[0];
    body.style.removeProperty('background-image');
    this.subscriptionService.getSubscriptionplan().subscribe((data: any) => {
      this.Annualplans = data.teacherPricingPlans;
    });
    this.subscriptionService.getSubscriptionfaq().subscribe((data: any) => {
      this.Faqlist = data.FAQ;
    });
    // this.subscriptionService.getAddons().subscribe((data: addOnPlan[]) => {
    //   this.addOns = data;
    // });
  }

  firstSlides = [
    { img: '../../../assets/images-marketing/Course.svg', alt: 'whiteboard' },
    {
      img: '../../../assets/images-marketing/1st-Img.png',
      alt: 'social profile',
    },
    {
      img: '../../../assets/images-marketing/2nd-Img.png',
      alt: 'social connect',
    },
    {
      img: '../../../assets/images-marketing/3rd-Img.png',
      alt: 'online dashboard',
    },
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
  next() {
    this.slickModal.slickNext();
  }
  prev() {
    this.slickModal.slickPrev();
  }

  // purchase(id: number, price: number, type: string) {
  //   if (!this.authService.isLoggin()) {
  //     localStorage.setItem('redirectRoute', this.router.url);
  //     localStorage.setItem(
  //       'scrollPosition',
  //       document.documentElement.scrollTop.toString()
  //     );
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  //   if (type == 'pricingplan') {
  //     this.router.navigate(['/checkout'], {
  //       queryParams: { id: id, price: price, type: type },
  //     });
  //   }
  // }

  buyPlan(id: number) {
    if (this.isLogin) {
      this.router.navigate(['/checkout'], {
        queryParams: { id: id, type: 'pricingplan' },
      });
      return;
    }
    this.router.navigate(['/login']);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  scrollNow(el: EventTarget) {
    // el.scrollIntoView({ behavior: 'smooth' });
  }
  scrollToMyDiv() {
    this.myDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
