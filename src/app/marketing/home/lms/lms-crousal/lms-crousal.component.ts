import { Component, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-lms-crousal',
  standalone: true,
  imports: [],
  templateUrl: './lms-crousal.component.html',
  styleUrl: './lms-crousal.component.scss'
})
export class LmsCrousalComponent implements OnInit {

  slides = [
    {
      img: '../../../../assets/lms/slide_1.svg',
      title: 'One Class Multiple Batches ',
      description:
        'Teaching large students has never been easy. NRICH lets you create multiple batches with different time slots allowing you to enroll more students without incurring costs.',
      subTitle: 'Learning Management System',
    },
    {
      img: '../../../../../assets/lms/slide_2.svg',
      title: '1  Click Scheduler',
      description:
        'Create classes by number of classes or by end date.The Smart Scheduler automates the process, alerts you when a class begins and ends, and sends reminders to students ',
      subTitle: 'Learning Management System',
    },
    {
      img: '../../../../../assets/lms/slide_3.svg',
      title: 'Assign home works & Grades',
      description:
        'Study materials, assignments and tasks, help you to keep your students focused on their studies. Allow them to complete their homework from Web login or Mobile app',
      subTitle: 'Learning Management System',
    },
  ];

  firstSlides = [
    '../../../assets/images-marketing/1st-Img.png',
    '../../../../../assets/lms/Course Creation.svg',
    '../../../../../assets/lms/User List.svg',
  ];

  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;

  constructor() {}

  ngOnInit(): void {}

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
