import { Component, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { InsitutionVO } from 'src/app/model/InstitutionVO';
import { InstituteService } from 'src/app/services/institute/institute.service';

@Component({
  selector: 'app-institutes',
  standalone: true,
  imports: [],
  templateUrl: './institutes.component.html',
  styleUrl: './institutes.component.scss'
})
export class InstitutesComponent implements OnInit {
  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;
  scrHeight: any;
  scrWidth: any;
  lazyLoading: boolean = true;
  flipCard: boolean = false;

  institutes: any;
  insituteList!: InsitutionVO[];

  constructor(private instituteService: InstituteService) {}

  ngOnInit(): void {
    this.instituteService.fetchAllActiveInstitution().subscribe(
      (res: any) => {
        this.insituteList = res.body.InstituteList;
      },
      (error) => {}
    );
  }

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    draggable: true,
    placeholders: false,
    infinite: true,
    speed: 500,
    fade: true,
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
