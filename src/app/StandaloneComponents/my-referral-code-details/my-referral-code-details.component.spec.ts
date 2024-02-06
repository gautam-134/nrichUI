import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReferralCodeDetailsComponent } from './my-referral-code-details.component';

describe('MyReferralCodeDetailsComponent', () => {
  let component: MyReferralCodeDetailsComponent;
  let fixture: ComponentFixture<MyReferralCodeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReferralCodeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyReferralCodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
