import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ExpertVO } from 'src/app/model/ExpertVO';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-achievers-slider',
  templateUrl: './achievers-slider.component.html',
  styleUrls: ['./achievers-slider.component.scss'],
})
export class AchieversSliderComponent implements OnInit {
  // achievers: any = [];
  expertsList: ExpertVO[] = [];

  @ViewChild('slickModal', { static: true })
  slickModal!: SlickCarouselComponent;

  constructor(private commonService: CommonService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    this.commonService.fetchExperts(this.id).subscribe((res: any) => {
      this.expertsList = res.body;
      // this.expertsList.slice(0,2)
    });
  }
  id(id: any) {
    throw new Error('Method not implemented.');
  }

  slides = [{ img: '../assets/img/v-1.png' }];
  slideConfig = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    swipe: true,
    arrows: false,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  // addSlide() {
  //   this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  // }

  // removeSlide() {
  //   this.slides.length = this.slides.length - 1;
  // }

  slickInit(_e: any) {}

  breakpoint(_e: any) {}

  afterChange(_e: any) {}

  beforeChange(_e: any) {}
  next() {
    this.slickModal.slickNext();
  }
  prev() {
    this.slickModal.slickPrev();
  }
}
