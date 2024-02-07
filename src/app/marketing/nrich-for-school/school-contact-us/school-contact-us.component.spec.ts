import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolContactUsComponent } from './school-contact-us.component';

describe('SchoolContactUsComponent', () => {
  let component: SchoolContactUsComponent;
  let fixture: ComponentFixture<SchoolContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolContactUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
