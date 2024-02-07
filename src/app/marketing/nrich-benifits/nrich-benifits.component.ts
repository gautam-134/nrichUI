import { Component, OnInit, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { InsitutionVO } from 'src/app/model/InstitutionVO';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';

@Component({
  selector: 'app-nrich-benifits',
  standalone: true,
  imports: [],
  templateUrl: './nrich-benifits.component.html',
  styleUrl: './nrich-benifits.component.scss'
})
export class NrichBenifitsComponent implements OnInit {
  @ViewChild('slickModal', { static: false })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;
  insituteList!: InsitutionVO[];
  selectedValue: string = 'Benefits';
  metadescription: string =
    'NRICH partnership is the largest Teacher-Student community assisted by our powerful technology platform';
  metatags: string[] = [
    'become an online tutor',
    'become a teacher online',
    'become an online teacher',
    'best online course platforms',
    'best course platform',
    'best teaching courses',
    'online school',
    'online learning platforms',
    'teach for india',
    'how much does online teachers earn?',
    'teach online and earn money in india quora?',
    'how to make online teaching effective?',
  ];
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
  constructor(
    private instituteService: InstituteService,
    private titleService: Title,
    private meta: Meta,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      'Enrich the Learning & Teaching community with Global Standards'
    );
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription,
    });
    this.instituteService.fetchAllActiveInstitution().subscribe(
      (res: any) => {
        this.insituteList = res.body.InstituteList;
      },
      (error) => {}
    );
  }
  slides = [
    { img: '../../../assets/images-marketing/134-celebration-solid 1.svg' },
    { img: '../assets/images-marketing/teach-online.svg' },
  ];

  slideConfig = {
    slidesToShow: 1,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    dots: false,
    arrows: false,

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