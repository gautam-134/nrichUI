import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRazorpayDetailsComponent } from './user-razorpay-details.component';

describe('UserRazorpayDetailsComponent', () => {
  let component: UserRazorpayDetailsComponent;
  let fixture: ComponentFixture<UserRazorpayDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRazorpayDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRazorpayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
