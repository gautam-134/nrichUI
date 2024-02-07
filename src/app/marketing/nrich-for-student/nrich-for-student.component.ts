import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-nrich-for-student',
  standalone: true,
  imports: [],
  templateUrl: './nrich-for-student.component.html',
  styleUrl: './nrich-for-student.component.scss'
})
export class NrichForStudentComponent implements OnInit,OnDestroy {
  metadescription:string="Discover how to improve your learning outcomes in three easy steps from Nrich learning marketplace";
  metatags:string[]=["education directory", "education product list", "directory of education", "course era free classes","free English courses near me", "online course for beginners", "what are online learning strategies?", "What are online learning plaltforms?", "How to become a learning hero?" ];
  constructor(private titleService:Title,private meta: Meta) {}
  private setMetaTags(metaObj: { name: string; content: string }) {
    this.meta.addTag(metaObj);
  }

  ngOnDestroy(): void {
    this.removeTitleAndMetaTags();
    localStorage.setItem('scrollPosition', document.documentElement.scrollTop.toString())
  }



  ngOnInit(): void {
    const position=localStorage.getItem('scrollPosition')
    if(position){
      window.scrollTo(0,+position)
      localStorage.removeItem('scrollPosition')
    }
    this.titleService.setTitle("NRICH Learning Marketplace Connecting Teachers & Students"); 
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
}
