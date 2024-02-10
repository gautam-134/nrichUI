import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
   
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  slideConfig = { slidesToShow: 4, slidesToScroll: 4 };
  @Output('scrolltocontactus')
  scrolltocontactus: EventEmitter<any> = new EventEmitter<any>();
  selectedValue:string="Home";
  metatags:string[]=["compare teachers","find a teacher","best teacher", "teacher reviews", "teacher ranking", "top teachers","google free courses","best English speaking course online", "ecourses" ," study online","can online classes replace offline classes?", "are online classes good or bad?","are online classes beneficial for students?" ];
  metadescription:string="Learn at your own pace, wherever you are. Get expert support and a free trial to see how it works.";
  constructor(private titleService:Title,private meta: Meta) { }
  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }
  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }
  ngOnInit(): void {
    this.titleService.setTitle("NRICH Learning takes your teaching to global audience"); 
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription,
    });
  }

  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description");
    this.titleService.setTitle('Nrich Learning');
  }
  slides = [
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-2.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
    { img: '../assets/img/v-1.png' },
  ];
  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e: any) { }

  breakpoint(e: any) { }

  afterChange(e: any) { }

  beforeChange(e: any) { }
  scrolltop(id: any) {
    this.scrolltocontactus.emit(id);
    let el = document.getElementById(id);
    el?.scrollIntoView();
  }
}
