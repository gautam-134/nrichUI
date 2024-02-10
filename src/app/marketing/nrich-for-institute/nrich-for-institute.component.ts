import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription/subscription.service';

@Component({
  selector: 'app-nrich-for-institute',
   
  templateUrl: './nrich-for-institute.component.html',
  styleUrl: './nrich-for-institute.component.scss'
})
export class NrichForInstituteComponent implements OnInit {
  isLogin: boolean = false;
  Annualplans: any[] = [];
  selectedValue: string = 'Institute';
  youTubeLink: string = 'https://www.youtube.com/watch?v=_VRkGiwaFak';
  metatags: string[] = [
    'online training',
    'online learning',
    'institute',
    'institutes',
    'institute in india',
    'institutes in india',
    'top institutes in india',
    'top 10 institutes in india',
    'education',
    'education marketing',
    'online education marketing',
    'online education',
    'Teaching institutes in India',
    'Best teaching institutes in Delhi',
    'CBSE schools in Delhi',
  ];
  metadescription: string =
    'Our online video teaching tools are designed to help you deliver high quality, cost-effective online courses.';
  constructor(
    private titleService: Title,
    private meta: Meta,
    public authService: AuthService,
    private router: Router,
    private subscriptionService: SubscriptionService
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
      'Unleash the technology to improve your institutes profitability'
    );
    this.setMetaTags({
      name: 'tags',
      content: this.metatags.toString(),
    });
    this.setMetaTags({
      name: 'description',
      content: this.metadescription,
    });
    this.isLogin = this.authService.isLoggin();
    this.subscriptionService.getSubscriptionplan().subscribe((data: any) => {
      this.Annualplans = data.teacherPricingPlans;
    });
  }

  private removeTitleAndMetaTags() {
    this.meta.removeTag("name='tags'");
    this.meta.removeTag("name='description");
    this.titleService.setTitle('Nrich Learning');
  }

  onlyNumeric(event: any) {
    const keyCode = event.keyCode;
    if (
      (keyCode >= 48 && keyCode <= 57) ||
      keyCode === 8 ||
      keyCode === 46 ||
      (keyCode >= 37 && keyCode <= 40) ||
      (keyCode >= 96 && keyCode <= 105)
    )
      return true;
    return false;
  }

  buyPlan(id: number) {
    if (this.isLogin) {
      this.router.navigate(['/checkout'], {
        queryParams: { id: id, type: 'pricingplan' },
      });
      return;
    }
    this.router.navigate(['/login']);
  }
}
