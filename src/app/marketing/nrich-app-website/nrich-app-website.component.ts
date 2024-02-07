import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nrich-app-website',
  standalone: true,
  imports: [],
  templateUrl: './nrich-app-website.component.html',
  styleUrl: './nrich-app-website.component.scss'
})
export class NrichAppWebsiteComponent implements OnInit {
  selectedValue: string = 'NrichWebsite';
  @Output('scrolltocontact')
  scrolltocontact: EventEmitter<HTMLElement> = new EventEmitter<HTMLElement>();
  metatags: string[] = [
    'learning app',
    'education app',
    'learning platform',
    'online teaching',
    'educational apps',
    'educational content',
    'whitelabel apps',
    'mobile apps',
    'online teaching',
    'edu apps',
    'mobile learning',
    'how to build my own digital campus?',
    'How to build my first mobile app?',
    'I want zoom licensees for free',
  ];
  metadescription: string[] = [
    'Transform the way you teach online with NRICH.',
    'Teaching Online made Exciting & Simple.',
  ];
  imgpaths: { id: string; path: string }[] = [
    { id: 'tab1', path: '../assets/images-marketing/badges.svg' },
    { id: 'tab2', path: '../assets/images-marketing/chat.svg' },
    { id: 'tab3', path: '../assets/images-marketing/courses.svg' },
    { id: 'tab4', path: '../assets/images-marketing/dashboard.svg' },
    { id: 'tab5', path: '../assets/images-marketing/events.svg' },
    { id: 'tab6', path: '../assets/images-marketing/Meeting Screen.svg' },
    { id: 'tab7', path: '../assets/images-marketing/newsFeed.svg' },
    { id: 'tab8', path: '../assets/images-marketing/pricing.svg' },
    { id: 'tab9', path: '../assets/images-marketing/user management.svg' },
  ];
  constructor(
    private titleService: Title,
    private meta: Meta,
    public authService: AuthService
  ) {}
  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }
  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
  }
  ngOnInit(): void {
    this.titleService.setTitle(
      'Increase your Online Reputation with NRICH white label mobile app'
    );
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription.toString(),
    });
  }

  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description");
    this.titleService.setTitle('Nrich Learning');
  }
  scroll(id:any){
    this.scrolltocontact.emit(id);
  }
}
