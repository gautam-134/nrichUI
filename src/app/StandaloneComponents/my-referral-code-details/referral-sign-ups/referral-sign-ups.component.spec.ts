import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralSignUpsComponent } from './referral-sign-ups.component';

describe('ReferralSignUpsComponent', () => {
  let component: ReferralSignUpsComponent;
  let fixture: ComponentFixture<ReferralSignUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralSignUpsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReferralSignUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
