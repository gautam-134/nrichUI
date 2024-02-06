import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-mobile-social-slider',
  templateUrl: './mobile-social-slider.component.html',
  styleUrls: ['./mobile-social-slider.component.scss'],
})
export class MobileSocialSliderComponent implements OnInit {
  @ViewChild('slickModal', { static: false })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;
  @Input('selectedValue') selectedValue!:string;

  constructor() {}

  ngOnInit(): void {}
  teacherSlides = [
    {
      img: 'assets/images-marketing/Rectangle_1.svg',
      alt: 'Online commerce,analytics',
      subTitle: 'Dashboard',
      description:
        'Take control of your teaching experience with our revolutionary Dashboard that gives you a single-view of your entire teaching journey. Get detailed insights on student enrollments, upcoming classes, past performance and assignments handed out - all from the same place.',
      title: 'My Performance',
    },
    {
      img: 'assets/images-marketing/Rectangle_2.svg',
      alt: 'Online commerce,sell online',
      subTitle: 'Course Listing',
      description:
        'Create courses in your LMS and publish them in NRICH Marketplace. Students enroll  for the classes directly from the Marketplace',
      title: 'Publish your skills',
    },
    {
      img: 'assets/images-marketing/Rectangle_3.svg',
      alt: 'Online teacher profile,webapp',
      subTitle: 'Teacher Profile',
      description:
        'Create your profile in just a minute and be Visible at NRICH Marketplace. With NRICH LEARNING take your teaching career to the next level.',
      title: 'Improve Visibility',
    },
  ];

  studentSlide = [
    {
      img: 'assets/images-marketing/Rectangle_4.svg',
      alt: '',
      subTitle: 'Scheduler',
      description:
      'Get organized and stay on top of your classes. Our streamlined calendar view helps you see all your upcoming classes in one place. Get notified with reminders and alerts for any changes or updates in your schedule, so you never miss a class again. ',
      title: 'Track your classes',
    },
    {
      img: 'assets/images-marketing/Rectangle_5.svg',
      alt: '',
      subTitle: 'Marketplace',
      description:
      "Easily find the best courses & institutes to meet your needs, with just a few clicks. You can even take a free demo class before you enroll, so you know you're making the right choice. Get started with NRICH today and take the fast-track to career success",
      title: 'Search  your course',
    },
    {
      img: 'assets/images-marketing/Rectangle_6.svg',
      alt: '',
      subTitle: 'Assignments',
      description:
      "Freedom to attend online classes or learn from recorded sessions anytime, anywhere. With our interactive and engaging course materials, you'll be able to complete your lesson plans at your own pace. Unlock the full potential of your learning journey with NRICH.",
      title: 'Learning Outcomes',
    },
  ];

  schoolSlide = [
    {
      img: 'assets/images-marketing/Rectangle_7.svg',
      alt: '',
      subTitle: 'News Feed',
      description:
      'Who is on top of the conversation? Get STAR ratings every time you answer questions or solve the user problems. The more the ratings, the more your ranking increase and become a leader quickly.  ',
      title: 'SOCIAL CONNECT',
    },
    {
      img: 'assets/images-marketing/Rectangle_3.svg',
      alt: '',
      subTitle: 'Events & Tickets',
      description:
      "Excite your followers & community with Events, Promos and Online Webinars through the Events Section. Promote your Program to targeted audience without spending high advertising costs and complex infrastructure. Stream your events across the globe ",
      title: 'Commerce',
    },
    {
      img: 'assets/images-marketing/Rectangle_9.svg',
      alt: '',
      subTitle: 'Build your Net Worth',
      description:
      "Use your Social Connect Profile to connect to Peers, Academicians and Students from around the world. Build your network to collaborate and solve student’s doubts. Offer your expertise for projects and mentoring student community across world.",
      title: 'Nrich MEET',
    },
  ];

  slideConfigTeacher = {
    slidesToShow: 1,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    dots: false,
    arrows: false,
  };

  slideConfigStudent = {
    slidesToShow: 1,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    dots: false,
    arrows: false,
  };

  slideConfigSchool = {
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
}
