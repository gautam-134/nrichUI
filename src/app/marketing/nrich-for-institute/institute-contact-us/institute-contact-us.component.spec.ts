import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteContactUsComponent } from './institute-contact-us.component';

describe('InstituteContactUsComponent', () => {
  let component: InstituteContactUsComponent;
  let fixture: ComponentFixture<InstituteContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteContactUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
