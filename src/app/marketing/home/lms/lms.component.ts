import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-lms',
   
  templateUrl: './lms.component.html',
  styleUrl: './lms.component.scss'
})
export class LmsComponent implements AfterViewInit {
  @ViewChild('image') image!: ElementRef;
  @ViewChild('buttonrange') button!: ElementRef;
  @ViewChild('slider') slider!: ElementRef;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    slideTransition: 'linear',
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,
    navText: ['', ''],

    responsive: {
     
      0: {
        items: 1
      },
      900: {
        items: 2
      },
      1200: {
        items: 3
      }
     
    },
    nav: false
  }

  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    slideTransition: 'linear',
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,
    rtl: true,

    navText: ['', ''],
    
    responsive: {
      0: {
        items: 1
      },
      900: {
        items: 2
      },
      1200: {
        items: 3
      }
    },
    nav: false
  }

  customOptions3: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    slideTransition: 'linear',
    autoplayTimeout: 5000,
    autoplaySpeed: 1000,
    autoplayHoverPause: false,

    navText: ['', ''],
    
    responsive: {
      0: {
        items: 1
      },
      900: {
        items: 2
      },
      1200: {
        items: 3
      }
    },
    nav: false
  }
  
  constructor() {}
  ngAfterViewInit(): void {
    this.slider.nativeElement.addEventListener('input', (e: any) => {
      const sliderPos = e.target.value;
      this.image.nativeElement.style = 'width:' + sliderPos + '%';
      this.button.nativeElement.style = 'left:' + sliderPos + '%';
    });
  }
}
