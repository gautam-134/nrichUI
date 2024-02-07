import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStaticContentComponent } from './student-static-content.component';

describe('StudentStaticContentComponent', () => {
  let component: StudentStaticContentComponent;
  let fixture: ComponentFixture<StudentStaticContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentStaticContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentStaticContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
