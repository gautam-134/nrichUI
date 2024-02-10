import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';


@Component({
  selector: 'app-team-slider',
   
  templateUrl: './team-slider.component.html',
  styleUrl: './team-slider.component.scss'
})
export class TeamSliderComponent implements OnInit {
  // @Input('reviewAndRatings') reviewAndRatings: CourseReviewsAndRatingsVO[] = [];
  @Input('reviewFrom') reviewFrom: string = '';

  @ViewChild('slickModal', { static: false })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;
  startIndex = 0;
  endIndex = 2;
  index = 0;

  constructor() {}

  ngOnInit(): void {}

  members = [
    [
      {
        img: '../assets/images-marketing/Ashutosh.svg',
        alt:'Ashutosh Garg',
        role: 'Co-Founder & Director',
        name: 'Ashutosh Garg',
        info: 'Strategizing and Deriving the business tech with the master plan to the next level.',
      },
      {
        img: '../assets/images-marketing/Aayush.svg',
        alt:'Aayush Garg',
        role: 'Co-Founder & Director',
        name: 'Aayush Garg',
        info: ' Directing  the team by channelising their skills to the right direction for personal & professional growth.',
      },
      {
        img: '../assets/images-marketing/robin.svg',
        alt:'Robin Reji',
        role: 'Brand Communication Manager',
        name: 'Robin Reji',
        info: 'Emphasising on Building Nrich Learning as a Brand and Supporting the Management with the right key.',
      },
    ],
    [
      {
        img: '../assets/images-marketing/Priyanka.svg',
        alt:'Priyanka Sharma',
        role: 'IT Support Manager',
        name: 'Priyanka Sharma',
        info: 'Modifying a catchy user experience and unturing stone for any malady.',
      },
      {
        img: '../assets/images-marketing/Sandeep.svg',
        alt:'Sandeep Bhatt',
        role: 'Senior Sales Manager',
        name: 'Sandeep Bhatt',
        info: 'Winning the each translation of Nrich Learning is in vein and leading the players with a blueprint.',
      },
      {
        img: '../assets/images-marketing/Jagdeep.svg',
        alt:'Jagdeep Sharma',
        role: 'Digital Marketer Manager',
        name: 'Jagdeep Sharma',
        info: 'Decoding and analysing the audience of Nrich Learning for higher ROI.',
      },
    ],
    [
      {
        img: '../assets/images-marketing/Ankith.svg',
        alt:'Ankith Kashyap',
        role: 'UI & Graphic Designer',
        name: 'Ankith Kashyap',
        info: 'Drawing the Canvas of Nrich Learning with C2(Colour & Creatives)',
      },
      {
        img: '../assets/images-marketing/Namita.svg',
        alt:'Namita Bhatt',
        role: 'Content writer',
        name: 'Namita Bhatt',
        info: 'Elating the team and end user with the creative writeups.',
      },
      {
        img: '../assets/images-marketing/Ashish.svg',
        alt:'Aashish Mohan',
        role: 'Business Development Manager',
        name: 'Aashish Mohan',
        info: 'Itinerating to surge the Nrich Learning Users and Audience to the next level.',
      },
    ],
    [
      {
        img: '../assets/images-marketing/shivani.svg',
        alt:'Shivani Jain',
        role: 'Business Development Manager',
        name: 'Shivani Jain',
        info: 'Helping Nrich Learning to grow its number of users by converting the leads to business.',
      },
      {
        img: '../assets/images-marketing/Gaurav.svg',
        alt: 'Gourav Sharma',
        role: 'Backend Developer',
        name: 'Gourav Sharma',
        info: 'Building and maintaining the algorithm, database, storage and UI from the backend of the website.',
      },
      {
        img: '../assets/images-marketing/kajal.svg',
        alt:'Kajal',
        role: 'Human Resources',
        name: 'Kajal',
        info: 'Treating, Motivating and Engaging the Nrich Learning Workforce with the right Strategy.',
      },
    ],
    [
      {
        img: '../assets/images-marketing/ajay.svg',
        alt:'Ajay Shahi',
        role: 'IT Support',
        name: 'Ajay Shahi',
        info: 'Delivering and satisfying the workforce needs in IT Support.',
      },
      {
        img: '../assets/images-marketing/trideep.svg',
        alt:'Trideep Shah',
        role: 'Accounts',
        name: 'Trideep Shah',
        info: 'Counting, Reconciling and redefining the numbers with care.',
      },
      {
        img: '../assets/images-marketing/Bharat.svg',
        alt:'Bharat Sharma',
        role: 'Accounts',
        name: 'Bharat Sharma',
        info: 'Accounting the numbers in the Books of Nrich Learning.',
      },
    ],
    [
      {
        img: '../assets/images-marketing/Harjas.svg',
        alt:'Harjas',
        role: 'SUPPORT Executive',
        name: 'Harjas',
        info: 'Converting the generated leads into a successful business.',
      },
      {
        img: '../assets/images-marketing/Pooja.svg',
        alt:'Pooja',
        role: 'web developer',
        name: 'Pooja',
        info: 'Converting the generated leads into a successful business.',
      },
      {
        img: '../assets/images-marketing/Harmandeep.svg',
        alt:'Harmandeep',
        role: 'SUPPORT Executive',
        name: 'Harmandeep',
        info: 'Converting the generated leads into a successful business.',
      },
    ],
  ];

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
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    vertical: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
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

