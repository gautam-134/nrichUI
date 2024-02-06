import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionContactUsComponent } from './subscription-contact-us.component';

describe('SubscriptionContactUsComponent', () => {
  let component: SubscriptionContactUsComponent;
  let fixture: ComponentFixture<SubscriptionContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionContactUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
