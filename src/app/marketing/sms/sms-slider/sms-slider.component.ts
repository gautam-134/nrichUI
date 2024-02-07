import { Component, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-sms-slider',
  standalone: true,
  imports: [],
  templateUrl: './sms-slider.component.html',
  styleUrl: './sms-slider.component.scss'
})
export class SmsSliderComponent implements OnInit {
  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  slides = [
    {
      img: '../../../../assets/images-marketing/Group 39250(0).svg',
      title: 'Teach Online Live',
      description:
        'Teach Recorded Sessions; Interact; Conduct exams; all from your own personalized website and app. All these at a cost less than your internet bill',
      subTitle: 'Learning Management System',
    },
    {
      img: '../../../../assets/images-marketing/Group 39250(1).svg',
      title: 'Batches with Multi Pricing Plans',
      description:
        'Teach Recorded Sessions; Interact; Conduct exams; all from your own personalized website and app. All these at a cost less than your internet bill',
      subTitle: 'Learning Management System',
    },
    {
      img: '../../../../assets/images-marketing/Group 39250(2).svg',
      title: 'User Management',
      description:
        'Teach Recorded Sessions; Interact; Conduct exams; all from your own personalized website and app. All these at a cost less than your internet bill',
      subTitle: 'Learning Management System',
    },
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,

    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
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
}