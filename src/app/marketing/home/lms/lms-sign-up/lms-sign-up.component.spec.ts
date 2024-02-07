import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsSignUpComponent } from './lms-sign-up.component';

describe('LmsSignUpComponent', () => {
  let component: LmsSignUpComponent;
  let fixture: ComponentFixture<LmsSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsSignUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LmsSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
