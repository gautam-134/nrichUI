import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpProfileComponent } from './sign-up-profile.component';

describe('SignUpProfileComponent', () => {
  let component: SignUpProfileComponent;
  let fixture: ComponentFixture<SignUpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignUpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
