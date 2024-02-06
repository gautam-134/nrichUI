import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRewardsComponent } from './referral-rewards.component';

describe('ReferralRewardsComponent', () => {
  let component: ReferralRewardsComponent;
  let fixture: ComponentFixture<ReferralRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralRewardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReferralRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
