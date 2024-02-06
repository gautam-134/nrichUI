import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePricingPlansComponent } from './course-pricing-plans.component';

describe('CoursePricingPlansComponent', () => {
  let component: CoursePricingPlansComponent;
  let fixture: ComponentFixture<CoursePricingPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePricingPlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursePricingPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
