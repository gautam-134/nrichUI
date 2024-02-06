import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSignupCheckComponent } from './new-signup-check.component';

describe('NewSignupCheckComponent', () => {
  let component: NewSignupCheckComponent;
  let fixture: ComponentFixture<NewSignupCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSignupCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSignupCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
