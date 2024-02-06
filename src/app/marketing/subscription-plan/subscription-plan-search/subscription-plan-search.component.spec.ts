import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanSearchComponent } from './subscription-plan-search.component';

describe('SubscriptionPlanSearchComponent', () => {
  let component: SubscriptionPlanSearchComponent;
  let fixture: ComponentFixture<SubscriptionPlanSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionPlanSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
