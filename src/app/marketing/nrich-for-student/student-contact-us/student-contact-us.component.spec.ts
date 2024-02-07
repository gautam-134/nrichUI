import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentContactUsComponent } from './student-contact-us.component';

describe('StudentContactUsComponent', () => {
  let component: StudentContactUsComponent;
  let fixture: ComponentFixture<StudentContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentContactUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
