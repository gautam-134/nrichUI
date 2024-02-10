import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nrich-meet',
   
  templateUrl: './nrich-meet.component.html',
  styleUrl: './nrich-meet.component.scss'
})
export class NrichMeetComponent implements OnInit {
  selectedValue: string = 'Meet';
  metatags: string[] = [
    'online class etiquette',
    'online class around the world',
    'online classes types',
    'course era free classes',
    'online class app',
    'free English courses near me',
    'online course for beginners',
    'what are online learning strategies?',
    'What are online learning plaltforms?',
    'are online classes beneficial for students',
    'are online classes helpful',
  ];
  metadescription: string[] = [
    'Learning made powerful with amazing features at amazing prize with our new All in 1 Teaching app',
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
      'NRICH Live - Stream your classes to student’s home'
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
}
