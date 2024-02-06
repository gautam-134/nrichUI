import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingPlansComponent } from './marketing-plans.component';

describe('MarketingPlansComponent', () => {
  let component: MarketingPlansComponent;
  let fixture: ComponentFixture<MarketingPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingPlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketingPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
