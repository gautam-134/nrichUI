import { Component, OnInit, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
// import { InstituteService } from '../../services/institute/institute.service';

@Component({
  selector: 'app-about-us',
   
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  youTubeLink: string =
    'https://www.youtube.com/watch?v=drfLozcNxCo';
  institutes: any[] = [];
  metatags: string[] = [
    'do online classes have lectures',
    'does online class is effective',
    'online classes for kids',
    'online classes for students',
    'advantages of online classes',
    'top institutes in india',
    'are online classes effective',
    'education',
    'education marketing',
    'online education marketing',
    'online education',
    'can online classes replace offline classes',
    'challenges in an online class',
    'can online classes be a substitute for offline classes',
    'are online classes effective',
  ];
  metadescription: string[] = [
    ' NRICH Learning delivers excellence in education technology.',
    'Helping educators & learners connected.',
  ];
  constructor(
    // private instituteService: InstituteService,
    private titleService: Title,
    private meta: Meta
  ) {}

  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }
  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }
  ngOnInit(): void {
    this.youTubeLink =
      this.youTubeLink.replace(
        '/watch?v=',
        '/embed/'
      ) as string;

    this.titleService.setTitle(
      'Enrich Learning makes education simpler and powerful'
    );
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription.toString(),
    });
    // this.instituteService.fetchActiveInstitution().subscribe(
    //   (res: any) => {
    //     this.institutes = res.data.activeInstitution;
    //     if (this.institutes.length > 6) {
    //       this.institutes = this.institutes.slice(0, 6);
    //     }
    //   },
    //   (error) => {}
    // );
  }

  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description");
    this.titleService.setTitle('Nrich Learning');
  }

  slides = [
  
    {
      img: '../assets/img/Chanakya.jpg',
      testimonial: "Nrich Learning's LMS and Marketplace have been game-changers for us and our educators. Effective and user-friendly. Definitely, a valuable asset for everyone!",
      author: "Chanakya IAS Academy"
    },
    {
      img: '../assets/img/cloudsi.jpg',
      testimonial: "Nrich Learning's LMS and CRM have been incredibly helpful to us. Highly effective, user-friendly, and a tremendous help to our educators. Their CRM software really simplifies tasks and lead management.",
      author: "Cloud Sai"
    },
    {
      img: '../assets/img/danik.jpg',
      testimonial: "Nrich Learning's LMS and White-labeled App have transformed our education. These are highly effective, user-friendly, and invaluable for our educators and students. We recommend it for anyone who is starting their own online school.",
      author: "Dainik School"
    },
    {
      img: '../assets/img/safari.png',
      testimonial: "Nrich Learning's LMS and CRM are incredibly effective and user-friendly. They've streamlined our operations seamlessly. Highly recommended!",
      author: "Safari"
    },
    {
      img: '../assets/img/gd.jpeg',
      testimonial: "We've experienced remarkable efficiency with Nrich Learning's LMS. It's incredibly user-friendly, making learning a breeze. Highly recommended!",
      author: "GD Campus"
    }
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

  beforeChange(_e: any) {}
  next() {
    this.slickModal.slickNext();
  }
  prev() {
    this.slickModal.slickPrev();
  }
}
